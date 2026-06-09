import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [analyticsRes, usersRes] = await Promise.all([
          axios.get('https://mental-health-prediction-f4md.onrender.com/api/admin/analytics', { headers }),
          axios.get('https://mental-health-prediction-f4md.onrender.com/api/admin/users', { headers })
        ]);
        
        setAnalytics(analyticsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Admin fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://mental-health-prediction-f4md.onrender.com/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      
      {analytics && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-surface p-6 rounded-xl border border-white/10 text-center">
            <h3 className="text-gray-400">Total Users</h3>
            <p className="text-3xl font-bold text-primary">{analytics.total_users}</p>
          </div>
          <div className="bg-surface p-6 rounded-xl border border-white/10 text-center">
            <h3 className="text-gray-400">Total Predictions</h3>
            <p className="text-3xl font-bold text-secondary">{analytics.total_predictions}</p>
          </div>
          <div className="bg-surface p-6 rounded-xl border border-white/10 text-center col-span-2 flex justify-around">
            {Object.entries(analytics.severity_distribution).map(([label, count]) => (
              <div key={label}>
                <h3 className="text-sm text-gray-400">{label}</h3>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Admin</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition">
                <td className="p-4">{user.id}</td>
                <td className="p-4">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.is_admin ? 'Yes' : 'No'}</td>
                <td className="p-4">
                  {!user.is_admin && (
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
