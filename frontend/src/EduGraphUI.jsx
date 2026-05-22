import React, { useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import axios from 'axios';

const EduGraphUI = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ position: '', company: '' });
  const [searchTopic, setSearchTopic] = useState('');
  const [topicResult, setTopicResult] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchGraphData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/graph');
      setGraphData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/sso', { sso_id: "2406487001" });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchTopic = async () => {
    if (!searchTopic.trim()) return;
    setIsSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/graph/topic/${encodeURIComponent(searchTopic)}`
      );
      setTopicResult(response.data.data || []);
    } catch (error) {
      console.error(error);
      setTopicResult([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleHighlightPath = async () => {
    if (!selectedNode || selectedNode.label !== 'Career') return;
    try {
      const response = await axios.get(`http://localhost:3000/api/graph/career-path/${selectedNode.name}`);
      const pathData = response.data.data;
      const nodesToHighlight = new Set();
      nodesToHighlight.add(selectedNode.id);
      graphData.nodes.forEach(node => {
        const match = pathData.find(p => p.courseName === node.name || p.skillName === node.name);
        if (match) nodesToHighlight.add(node.id);
      });
      setHighlightNodes(nodesToHighlight);
    } catch (error) {
      console.error(error);
    }
  };

  const getNodeColor = (node) => {
    if (highlightNodes.size > 0 && !highlightNodes.has(node.id)) return '#2c2f33';
    switch (node.label) {
      case 'Career':  return '#FF49B5';
      case 'Skill':   return '#34D399';
      case 'Course':  return '#60A5FA';
      case 'User':    return '#FBBF24';
      case 'Faculty': return '#FACC15';
      case 'Company': return '#A78BFA';
      default:        return '#94A3B8';
    }
  };

  const totalNodes = graphData.nodes.length;
  const totalLinks = graphData.links.length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">

      {/* ── Header ── */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 py-6 bg-slate-900/95 border-b border-slate-800 shadow-xl shadow-slate-950/30 backdrop-blur">
        <div>
          <div className="text-3xl font-bold tracking-tight text-pink-400">EduGraph</div>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            Visualize course, skill, career, and alumni relationships with an interactive graph. Click any node to explore details and career paths.
          </p>
        </div>

        <nav className="flex items-center gap-3">
          {!user ? (
            <button
              onClick={handleLogin}
              className="inline-flex items-center justify-center rounded-full bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-500"
            >
              Login SSO UI
            </button>
          ) : (
            <div className="rounded-3xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-sm text-slate-200 shadow-sm">
              <div className="font-semibold text-slate-100">SSO Terautentikasi</div>
              <div className="text-slate-400">{user.name} • {user.sso_id}</div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex flex-1 overflow-hidden">

        {/* ── Graph Canvas ── */}
        <section className="relative flex-1 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.18),_transparent_28%)] pointer-events-none" />

          {/* Graph metrics + legend */}
          <div className="absolute top-5 left-5 z-20 flex flex-col gap-3">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-200 shadow-xl shadow-slate-950/40 backdrop-blur">
              <div className="font-semibold text-white">Graph metrics</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-950/95 p-3 text-center">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Nodes</div>
                  <div className="mt-2 text-2xl font-bold text-pink-400">{totalNodes}</div>
                </div>
                <div className="rounded-2xl bg-slate-950/95 p-3 text-center">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Links</div>
                  <div className="mt-2 text-2xl font-bold text-sky-400">{totalLinks}</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-4 text-sm text-slate-200 shadow-xl shadow-slate-950/40 backdrop-blur w-72">
              <div className="font-semibold text-white mb-3">Legend</div>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-pink-400" /> Career</div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Course</div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Skill</div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> User / Faculty</div>
              </div>
            </div>
          </div>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/90 px-6">
              <div className="rounded-3xl border border-slate-700 bg-slate-900/95 px-6 py-8 text-center shadow-2xl shadow-slate-950/40 backdrop-blur">
                <div className="text-sm uppercase tracking-[0.28em] text-slate-500">Memuat data graf</div>
                <div className="mt-4 text-3xl font-semibold text-white">Mohon tunggu...</div>
                <div className="mt-2 text-slate-400">Mengambil node dan relasi dari backend.</div>
              </div>
            </div>
          )}

          <ForceGraph2D
            graphData={graphData}
            backgroundColor="transparent"
            nodeRelSize={7}
            linkWidth={1.4}
            linkDirectionalParticles={1}
            linkDirectionalParticleWidth={1.6}
            linkColor={() => '#475569'}
            nodeColor={getNodeColor}
            onNodeClick={(node) => {
              setSelectedNode(node);
              setHighlightNodes(new Set());
            }}
            nodeLabel="name"
          />
        </section>

        {/* ── Sidebar ── */}
        <aside className="w-96 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto flex flex-col space-y-6">

          {/* Entity detail */}
          <div>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-3">Detail Entitas</h2>
            {selectedNode ? (
              <div className="space-y-4">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm font-bold text-pink-400">{selectedNode.label}</div>
                  <div className="text-lg font-medium text-white">{selectedNode.name}</div>
                </div>
                {selectedNode.label === 'Career' && (
                  <button
                    onClick={handleHighlightPath}
                    className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-sm font-semibold transition-colors"
                  >
                    Lihat Jalur Lengkap
                  </button>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-sm text-center py-4">
                Pilih node untuk melihat detail.
              </div>
            )}
          </div>

          {/* ── Topic Explorer ── */}
          <div className="border-t border-gray-700 pt-4">
            <h2 className="text-xl font-bold mb-1">Jelajahi Topik</h2>
            <p className="text-xs text-slate-400 mb-4">
              Masukkan topik atau skill — lihat mata kuliah, mentor, dan karir terkait (1–2 hop).
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g. Machine Learning, UI/UX..."
                className="flex-1 p-2 bg-gray-900 border border-gray-600 rounded text-sm focus:outline-none focus:border-pink-500"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchTopic()}
              />
              <button
                onClick={handleSearchTopic}
                disabled={isSearching}
                className="bg-pink-600 hover:bg-pink-500 disabled:opacity-50 px-4 py-2 rounded text-sm font-semibold transition-colors"
              >
                {isSearching ? '...' : 'Cari'}
              </button>
            </div>

            {/* Results */}
            {topicResult && topicResult.length === 0 && (
              <div className="text-slate-500 text-sm text-center py-4">
                Topik tidak ditemukan di graph.
              </div>
            )}

            {topicResult && topicResult.map((item, i) => (
              <div key={i} className="space-y-3 mb-4">

                {/* Skill anchor */}
                <div className="bg-emerald-900/40 border border-emerald-700 rounded-lg p-3">
                  <div className="text-xs uppercase tracking-widest text-emerald-400 mb-1">Skill</div>
                  <div className="font-bold text-white">{item.skill.name}</div>
                  {item.skill.category && (
                    <div className="text-xs text-slate-400 mt-0.5">Kategori: {item.skill.category}</div>
                  )}
                </div>

                {/* Courses */}
                {item.courses.length > 0 && (
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <div className="text-xs uppercase tracking-widest text-sky-400 mb-2">Mata Kuliah</div>
                    <div className="space-y-1.5">
                      {item.courses.map((c, j) => (
                        <div key={j} className="text-sm flex items-baseline gap-2">
                          <span className="font-medium text-white">{c.name}</span>
                          {c.code && <span className="text-slate-500 text-xs">{c.code}</span>}
                          {c.semester && <span className="text-slate-500 text-xs">Sem {c.semester}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mentors */}
                {item.mentors.length > 0 && (
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <div className="text-xs uppercase tracking-widest text-amber-400 mb-2">Mentor / Dosen</div>
                    <div className="space-y-2">
                      {item.mentors.map((m, j) => (
                        <div key={j} className="text-sm">
                          <div className="font-medium text-white">{m.name}</div>
                          <div className="text-xs text-slate-400">{m.connection}</div>
                          {m.research_interest && (
                            <div className="text-xs text-slate-500">Riset: {m.research_interest}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Careers */}
                {item.careers.length > 0 && (
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <div className="text-xs uppercase tracking-widest text-pink-400 mb-2">Karir Terkait</div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.careers.map((ca, j) => (
                        <span
                          key={j}
                          className="text-xs bg-pink-900/50 border border-pink-800 text-pink-300 px-2 py-0.5 rounded-full"
                        >
                          {ca.position}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

        </aside>
      </main>
    </div>
  );
};

export default EduGraphUI;