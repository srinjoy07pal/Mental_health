import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { ArrowLeft, Calendar, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend
);

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/predictions/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div></div>;

  if (history.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No Assessment History</h2>
        <p className="text-gray-400 mb-8">You haven't completed any assessments yet.</p>
        <Link to="/dashboard" className="text-primary hover:underline">Go to Dashboard</Link>
      </div>
    );
  }

  // Reverse history so oldest is first for the graph (x-axis left to right)
  const chronologicalHistory = [...history].reverse();

  const dates = chronologicalHistory.map(h => new Date(h.date).toLocaleDateString());

  const trendData = {
    labels: dates,
    datasets: [
      {
        label: 'Overall Score',
        data: chronologicalHistory.map(h => h.overall_score * 100),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4
      }
    ]
  };

  const comparisonData = {
    labels: dates,
    datasets: [
      {
        label: 'Anxiety',
        data: chronologicalHistory.map(h => h.anxiety_score * 100),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
      },
      {
        label: 'Stress',
        data: chronologicalHistory.map(h => h.stress_score * 100),
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
      },
      {
        label: 'Depression',
        data: chronologicalHistory.map(h => h.depression_score * 100),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: 'white' } } },
    scales: {
      x: { ticks: { color: 'rgba(255, 255, 255, 0.7)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { ticks: { color: 'rgba(255, 255, 255, 0.7)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' }, min: 0, max: 100 }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/dashboard" className="p-2 bg-surface border border-white/10 rounded-xl hover:bg-white/10 transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Assessment History</h1>
          <p className="text-gray-400 mt-1">Track your progress and compare past results.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-surface p-6 rounded-2xl border border-white/10 shadow-xl h-96">
          <h3 className="text-lg font-bold mb-4 flex items-center"><TrendingUp className="mr-2 text-primary h-5 w-5" /> Overall Progress Trend</h3>
          <div className="h-72">
            <Line data={trendData} options={options} />
          </div>
        </motion.div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-surface p-6 rounded-2xl border border-white/10 shadow-xl h-96">
          <h3 className="text-lg font-bold mb-4 flex items-center"><TrendingUp className="mr-2 text-accent h-5 w-5" /> Metric Comparison Over Time</h3>
          <div className="h-72">
            <Bar data={comparisonData} options={options} />
          </div>
        </motion.div>
      </div>

      <div className="bg-surface p-6 rounded-2xl border border-white/10 shadow-xl">
        <h3 className="text-xl font-bold mb-6">Past Reports</h3>
        <div className="space-y-4">
          {history.map((record, idx) => (
            <motion.div 
              key={record.id}
              initial={{opacity:0, x:-20}}
              animate={{opacity:1, x:0}}
              transition={{delay: idx * 0.05}}
              className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/10 transition"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary/20 p-3 rounded-xl">
                  <Calendar className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{new Date(record.date).toLocaleDateString()} at {new Date(record.date).toLocaleTimeString()}</h4>
                  <p className="text-sm text-gray-400">Status: <span className="font-medium text-white">{record.overall_status}</span></p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-xs text-gray-400 uppercase">Overall</div>
                  <div className="font-bold">{(record.overall_score * 100).toFixed(0)}%</div>
                </div>
                <div className="text-center hidden md:block">
                  <div className="text-xs text-gray-400 uppercase">Anxiety</div>
                  <div className="font-bold">{(record.anxiety_score * 100).toFixed(0)}%</div>
                </div>
                <div className="text-center hidden md:block">
                  <div className="text-xs text-gray-400 uppercase">Stress</div>
                  <div className="font-bold">{(record.stress_score * 100).toFixed(0)}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
