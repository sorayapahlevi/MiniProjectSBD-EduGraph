import React, { useState, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import axios from 'axios';

const EduGraphUI = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ position: '', company: '' });

  const fetchGraphData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/graph');
      setGraphData(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/sso', { sso_id: "2406487001" });
      setUser(response.data);
    } catch (error) {}
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/alumni/update', {
        sso_id: user.sso_id,
        position: formData.position,
        company: formData.company
      });
      fetchGraphData();
      setFormData({ position: '', company: '' });
    } catch (error) {}
  };

  const getNodeColor = (label) => {
    switch(label) {
      case 'Career': return '#FF1493';
      case 'Skill': return '#00FA9A';
      case 'Course': return '#1E90FF';
      case 'User': return '#FFA500';
      case 'Company': return '#9370DB';
      default: return '#cccccc';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="text-2xl font-bold text-pink-500">EduGraph</div>
        <nav className="flex space-x-4">
          {!user ? (
            <button onClick={handleLogin} className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded font-semibold text-sm transition-colors">
              Login SSO UI
            </button>
          ) : (
            <div className="text-sm font-medium text-green-400 bg-gray-700 px-4 py-2 rounded">
              SSO Terautentikasi: {user.sso_id}
            </div>
          )}
        </nav>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <section className="flex-1 relative bg-black">
          {user && (
            <div className="absolute top-4 left-4 z-10 bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-xl w-80">
              <h3 className="text-sm font-semibold mb-3 text-gray-300">Update Profil Alumni</h3>
              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  type="text"
                  placeholder="Posisi Pekerjaan (Cth: Data Scientist)"
                  className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-sm focus:outline-none focus:border-pink-500"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Perusahaan Saat Ini"
                  className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-sm focus:outline-none focus:border-pink-500"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-sm font-semibold transition-colors">
                  Simpan & Perbarui Graf
                </button>
              </form>
            </div>
          )}

          <ForceGraph2D
            graphData={graphData}
            backgroundColor="#000000"
            nodeRelSize={6}
            linkColor={() => '#4b5563'}
            nodeColor={node => getNodeColor(node.label)}
            onNodeClick={(node) => setSelectedNode(node)}
            nodeLabel="name"
          />
        </section>

        <aside className="w-96 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-3">Detail Entitas</h2>
          {selectedNode ? (
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="text-sm font-bold text-pink-400">{selectedNode.label}</div>
                <div className="text-lg font-medium text-white">{selectedNode.name}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm text-center mt-10">
              Pilih node untuk melihat detail.
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};

export default EduGraphUI;