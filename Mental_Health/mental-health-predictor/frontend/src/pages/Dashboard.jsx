import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, RadialLinearScale, ArcElement, Filler
} from 'chart.js';
import { Activity, ClipboardList, Gamepad2, ArrowRight, RefreshCcw, FileText, Trash2, History } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler
);

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://mental-health-prediction-f4md.onrender.com/api/predictions/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      setError('Failed to fetch assessment history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://mental-health-prediction-f4md.onrender.com/api/predictions/generate', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHistory();
    } catch (err) {
      alert(err.response?.data?.detail || "Make sure you've completed the questionnaire and games.");
    }
  };

  const handleResetSession = async () => {
    if(!window.confirm("Are you sure you want to reset your current responses? You will need to retake the questionnaire and games.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://mental-health-prediction-f4md.onrender.com/api/predictions/reset', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/questionnaire');
    } catch (err) {
      alert("Failed to reset session.");
    }
  };

  if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div></div>;

  const latest = history[0];
  const previous = history[1];

  let report = null;
  if (latest && latest.report_json) {
    try {
      report = JSON.parse(latest.report_json);
    } catch(e) {}
  }

  const getColor = (severity) => {
    if(severity === 'Low') return '#10b981'; // green
    if(severity === 'Mild') return '#facc15'; // yellow
    if(severity === 'Moderate') return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getTailwindBg = (severity) => {
    if(severity === 'Low') return 'bg-green-500';
    if(severity === 'Mild') return 'bg-yellow-400';
    if(severity === 'Moderate') return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTailwindText = (severity) => {
    if(severity === 'Low') return 'text-green-500';
    if(severity === 'Mild') return 'text-yellow-400';
    if(severity === 'Moderate') return 'text-orange-500';
    return 'text-red-500';
  };

  const radarData = latest ? {
    labels: ['Anxiety', 'Depression', 'Stress', 'Tension'],
    datasets: [{
      label: 'Current Assessment',
      data: [latest.anxiety_score*100, latest.depression_score*100, latest.stress_score*100, latest.tension_score*100],
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      fill: true
    },
    ...(previous ? [{
      label: 'Previous Assessment',
      data: [previous.anxiety_score*100, previous.depression_score*100, previous.stress_score*100, previous.tension_score*100],
      backgroundColor: 'rgba(156, 163, 175, 0.2)',
      borderColor: 'rgba(156, 163, 175, 0.8)',
      borderWidth: 1,
      borderDash: [5, 5],
      fill: true
    }] : [])]
  } : null;

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: 'rgba(255, 255, 255, 0.7)' },
        ticks: { color: 'transparent', backdropColor: 'transparent' },
        min: 0,
        max: 100
      }
    },
    plugins: { legend: { labels: { color: 'white' } } },
    maintainAspectRatio: false
  };

  const doughnutData = latest ? {
    labels: ['Anxiety', 'Depression', 'Stress', 'Tension'],
    datasets: [{
      data: [latest.anxiety_score*100, latest.depression_score*100, latest.stress_score*100, latest.tension_score*100],
      backgroundColor: [
        getColor(report?.anxiety?.severity || 'Low'),
        getColor(report?.depression?.severity || 'Low'),
        getColor(report?.stress?.severity || 'Low'),
        getColor(report?.tension?.severity || 'Low'),
      ],
      borderWidth: 0
    }]
  } : null;

  const getOverallExplanation = (severity) => {
    if(severity === 'Low') return "Healthy: Your mental health indicators are within a normal, healthy range.";
    if(severity === 'Mild') return "Mild Concern: You have some slight indicators of mental strain. Regular self-care is recommended.";
    if(severity === 'Moderate') return "Moderate Concern: You are experiencing notable mental strain. Consider adopting stress management techniques or seeking professional advice.";
    return "High Risk: Your indicators suggest significant distress. We strongly recommend consulting a healthcare professional.";
  };

  const getImprovementMessage = () => {
    if (!latest || !previous) return null;
    const diff = previous.overall_score - latest.overall_score;
    if (diff > 0.05) {
      return (
        <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-start space-x-3">
          <Activity className="h-5 w-5 mt-0.5" />
          <div>
            <h4 className="font-semibold">Great Progress!</h4>
            <p className="text-sm">Your overall mental health score has improved by {(diff*100).toFixed(1)}% compared to your previous assessment.</p>
          </div>
        </div>
      );
    } else if (diff < -0.05) {
      return (
        <div className="bg-orange-500/20 border border-orange-500/30 text-orange-400 p-4 rounded-xl flex items-start space-x-3">
          <Activity className="h-5 w-5 mt-0.5" />
          <div>
            <h4 className="font-semibold">Gentle Reminder for Self-Care</h4>
            <p className="text-sm">Your stress levels seem a bit higher recently. Please take some time for yourself and practice self-care.</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mental Health Dashboard</h1>
          <p className="text-gray-400 mt-1">Review your latest mental health analysis report.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleGenerate} className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition">
            <FileText className="h-4 w-4" />
            <span>Generate New Report</span>
          </button>
          <button onClick={handleResetSession} className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition">
            <RefreshCcw className="h-4 w-4" />
            <span>Retake Assessment</span>
          </button>
          <Link to="/history" className="bg-surface border border-white/10 hover:bg-white/5 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition text-white">
            <History className="h-4 w-4 text-accent" />
            <span>View History</span>
          </Link>
        </div>
      </div>

      {!latest ? (
        <div className="bg-surface border border-white/10 rounded-2xl p-12 text-center">
          <h2 className="text-xl font-semibold mb-4">No data available yet</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Complete the questionnaire and play a few mini-games so we can analyze your mental well-being.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/questionnaire" className="bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-xl transition flex items-center space-x-2">
              <ClipboardList className="h-5 w-5" />
              <span>Take Questionnaire</span>
            </Link>
            <Link to="/games" className="bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-xl transition flex items-center space-x-2">
              <Gamepad2 className="h-5 w-5" />
              <span>Play Games</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {getImprovementMessage()}
          
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Overall Status Card */}
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-surface p-6 rounded-2xl border border-white/10 col-span-1 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
              <div>
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Overall Mental Status</h3>
                <div className={`text-4xl font-bold mt-2 ${getTailwindText(latest.overall_status)}`}>
                  {latest.overall_status}
                </div>
                <div className="text-6xl font-bold mt-4 text-white">
                  {(latest.overall_score * 100).toFixed(0)}<span className="text-2xl text-gray-500">%</span>
                </div>
                <p className="mt-6 text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  {getOverallExplanation(latest.overall_status)}
                </p>
              </div>
              <div className="mt-8">
                 <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{width: 0}}
                    animate={{width: `${latest.overall_score * 100}%`}}
                    transition={{duration: 1.5, ease: "easeOut"}}
                    className={`h-full ${getTailwindBg(latest.overall_status)}`}
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Charts Section */}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-surface p-6 rounded-2xl border border-white/10 col-span-2 shadow-xl">
               <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-6">Visual Analysis</h3>
               <div className="grid md:grid-cols-2 gap-8 items-center">
                 <div className="h-64 relative">
                   <Radar data={radarData} options={radarOptions} />
                 </div>
                 <div className="h-56 relative flex flex-col items-center justify-center">
                   <Doughnut data={doughnutData} options={{maintainAspectRatio: false, plugins: {legend: {position: 'right', labels: {color: 'white', padding: 20}}}}} />
                 </div>
               </div>
            </motion.div>
          </div>

          {/* Detailed Severity Analysis */}
          <div className="bg-surface p-6 rounded-2xl border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center"><Activity className="mr-2 text-primary" /> Detailed Severity Analysis</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {report && Object.entries(report).map(([key, data], idx) => (
                <motion.div 
                  key={key}
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.2 + idx * 0.1}}
                  className="bg-white/5 p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`absolute top-0 right-0 w-16 h-16 ${getTailwindBg(data.severity)} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform`}></div>
                  <h4 className="capitalize font-semibold text-lg text-gray-200">{key}</h4>
                  
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">{(data.score * 100).toFixed(0)}%</span>
                    <span className={`text-sm font-medium mb-1 px-2 py-0.5 rounded-full bg-opacity-20 ${getTailwindText(data.severity)} ${getTailwindBg(data.severity).replace('bg-', 'bg-').replace('500', '500/20')}`}>
                      {data.severity}
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{width: 0}}
                      animate={{width: `${data.score * 100}%`}}
                      transition={{duration: 1, delay: 0.5}}
                      className={`h-full ${getTailwindBg(data.severity)}`}
                    />
                  </div>

                  <p className="mt-4 text-xs text-gray-400 leading-relaxed min-h-[60px]">
                    {data.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;


