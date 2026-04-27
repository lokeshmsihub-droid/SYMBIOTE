import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Activity, AlertCircle, CheckCircle2, GitPullRequest, LayoutDashboard, Settings, UserPlus, Users, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminJira() {
  const [activeTab, setActiveTab] = useState('integration');

  // States
  const [status, setStatus] = useState({ loading: true, data: null });
  const [projects, setProjects] = useState({ loading: false, data: [] });
  const [users, setUsers] = useState({ loading: false, data: [] });

  // Form State
  const [form, setForm] = useState({ title: '', projectKey: '', assigneeId: '' });
  const [submitStatus, setSubmitStatus] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const [mappings, setMappings] = useState({ loading: false, data: [] });
  const [unmapped, setUnmapped] = useState({ loading: false, data: [] });
  const [selectedMappingUser, setSelectedMappingUser] = useState(null);
  const [manualMapping, setManualMapping] = useState({ userId: '', jiraAccountId: '', displayName: '' });

  const fetchStatus = async () => {
    const { success, data } = await api.get('/admin/jira/status');
    if (success) {
      setStatus({ loading: false, data });
    } else {
      setStatus({ loading: false, data: { connected: false } });
    }
  };

  const fetchMappings = async () => {
    setMappings(m => ({ ...m, loading: true }));
    const { success, data } = await api.get('/admin/mappings');
    setMappings({ loading: false, data: success ? data : [] });
  };

  const fetchUnmapped = async () => {
    setUnmapped(u => ({ ...u, loading: true }));
    const { success, data } = await api.get('/admin/mappings/unmapped');
    setUnmapped({ loading: false, data: success ? data : [] });
  };

  const onSaveMapping = async () => {
    const { success, error } = await api.post('/admin/mappings', manualMapping);
    if (success) {
      alert("Identity Resolved & Mapped Successfully!");
      fetchMappings();
      setSelectedMappingUser(null);
    } else {
      alert(error?.message || "Failed to execute mapping");
    }
  };

  const fetchProjects = async () => {
    setProjects(p => ({ ...p, loading: true }));
    const { success, data } = await api.get('/admin/jira/projects');
    setProjects({ loading: false, data: (success && Array.isArray(data)) ? data : [] });
  };

  const fetchUsers = async () => {
    setUsers(u => ({ ...u, loading: true }));
    const { success, data } = await api.get('/admin/jira/users');
    setUsers({ loading: false, data: (success && Array.isArray(data)) ? data : [] });
  };

  const onSubmitTask = async (e) => {
    e.preventDefault();
    setSubmitStatus('Submitting...');
    const { success, error } = await api.post('/admin/jira/tasks', {
      fields: {
        project: { key: form.projectKey },
        summary: form.title,
        description: "Gamified task via SYMBIOTE",
        issuetype: { name: "Task" },
        assignee: form.assigneeId ? { accountId: form.assigneeId } : null
      }
    });

    if (success) {
      setSubmitStatus('Task Created Successfully!');
      setForm({ title: '', projectKey: '', assigneeId: '' });
    } else {
      setSubmitStatus('Failed: ' + (error?.message || 'Check Jira permissions'));
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (activeTab === 'projects' && !projects.data.length && status.data?.connected) fetchProjects();
    if (activeTab === 'team' && status.data?.connected) {
      if (!mappings.data.length) fetchMappings();
      if (!users.data.length) fetchUsers();
      if (!unmapped.data.length) fetchUnmapped();
    }
  }, [activeTab, status.data]);

  const tabs = [
    { id: 'integration', label: 'Integration', icon: <Settings size={18} /> },
    { id: 'projects', label: 'Projects', icon: <LayoutDashboard size={18} /> },
    { id: 'team', label: 'Team Mapping', icon: <Users size={18} /> },
    { id: 'xp-rules', label: 'XP Rules', icon: <Activity size={18} /> },
    { id: 'tasks', label: 'Task Console', icon: <GitPullRequest size={18} /> }
  ];

  const [xpRules, setXpRules] = useState({ loading: false, data: [] });

  const fetchXpRules = async () => {
    setXpRules(r => ({ ...r, loading: true }));
    const { success, data } = await api.get('/admin/xp-rules');
    setXpRules({ loading: false, data: success ? data : [] });
  };

  const updateXpRule = async (id, points) => {
    const { success, error } = await api.put(`/admin/xp-rules/${id}`, { points: parseInt(points) });
    if (success) {
      fetchXpRules();
    } else {
      alert(error?.message || "Failed to update rule");
    }
  };

  useEffect(() => {
    if (activeTab === 'xp-rules' && !xpRules.data.length && status.data?.connected) fetchXpRules();
  }, [activeTab, status.data]);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          Jira Admin Console
          {status.data?.connected ? (
            <div className="flex gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 size={14} /> Connected
              </span>
              <span className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-full border border-blue-500/20 flex items-center gap-1.5 font-semibold">
                <Activity size={14} /> Webhook Healthy
              </span>
            </div>
          ) : !status.loading && (
            <span className="bg-rose-500/10 text-rose-400 text-xs px-2.5 py-1 rounded-full border border-rose-500/20 flex items-center gap-1.5 font-semibold">
              <AlertCircle size={14} /> Offline
            </span>
          )}
        </h1>
        <p className="text-gray-400 text-sm">Manage mapping between your Atlassian Jira workspace and SYMBIOTE Gamification Engine.</p>
      </div>

      <div className="flex border-b border-white/10 gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 ${activeTab === tab.id
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-4">
        {activeTab === 'integration' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4">Connection Details</h2>
              {status.loading ? (
                <div className="animate-pulse h-20 bg-white/5 rounded-xl"></div>
              ) : status.data?.connected ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Cloud Site URL</span>
                    <p className="text-white bg-black/40 px-3 py-2 rounded-lg border border-white/5 mt-1 font-mono text-sm">{status.data.siteUrl}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Expires At</span>
                    <p className="text-gray-300 bg-black/40 px-3 py-2 rounded-lg border border-white/5 mt-1 font-mono text-sm tracking-tight">{new Date(status.data.expiresAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-rose-500" size={32} />
                  </div>
                  <h3 className="text-white font-bold mb-1">OAuth Token Missing</h3>
                  <p className="text-gray-400 text-sm mb-6">Authenticate via Atlassian to grant access.</p>
                  <button 
                    onClick={async () => {
                      setIsConnecting(true);
                      try {
                        const { success, data, error } = await api.get('/jira/oauth/authorize-url');
                        if (success && data?.url) {
                          window.location.href = data.url;
                        } else {
                          alert(error?.message || 'Failed to generate Jira Auth URL');
                        }
                      } catch (err) {
                        alert('A platform error occurred. Check browser console.');
                      } finally {
                        setIsConnecting(false);
                      }
                    }}
                    disabled={isConnecting}
                    className={`bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-bold transition inline-block ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isConnecting ? 'Connecting...' : 'Connect to Jira'}
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f0f] to-violet-900/10 p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
                <Activity size={200} />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Gamification Engine</h2>
              <p className="text-gray-400 text-sm mb-6">The Webhook processor maps issue events automatically to SYMBIOTE User accounts to assign XP.</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 border border-white/10 rounded-xl p-4">
                  <div className="text-3xl font-black text-violet-400">0</div>
                  <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Events Today</div>
                </div>
                <div className="bg-black/50 border border-white/10 rounded-xl p-4">
                  <div className="text-3xl font-black text-emerald-400">Active</div>
                  <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Webhook Status</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Accessible Projects</h2>
                <p className="text-sm text-gray-400 mt-1">Projects the integration currently has read/write scope dynamically pulled from Jira.</p>
              </div>
              <div className="flex gap-2">
                 <button onClick={async () => {
                    alert("Starting paginated sync...");
                    // trigger sync via API
                 }} className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-xl text-sm font-semibold transition text-white">Full Sync</button>
                 <button onClick={fetchProjects} className="bg-black/40 hover:bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition text-white">Refresh List</button>
              </div>
            </div>
            {projects.loading ? (
              <div className="p-8 text-center text-gray-500">Loading Projects...</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-black/30 border-b border-white/5 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Key</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Name</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.data.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4">
                        <span className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded border border-violet-500/20 tracking-widest font-mono text-xs">{p.key}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-200 flex items-center gap-3">
                        {p.avatarUrls?.['24x24'] && <img src={p.avatarUrls['24x24']} alt="" className="rounded w-6 h-6 border border-white/10" />}
                        {p.name}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{p.projectTypeKey}</td>
                    </tr>
                  ))}
                  {projects.data.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500 text-sm">No projects found. Validate integration permissions.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Identity Resolution & Mapping</h2>
                  <p className="text-sm text-gray-400 mt-1">Explicitly link SYMBIOTE users to Jira Account IDs for reliable identity tracking.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={fetchMappings} className="bg-black/40 hover:bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition text-white flex items-center gap-2">
                    <Activity size={14} className="text-violet-400" /> Refresh Mappings
                  </button>
                </div>
              </div>
              {mappings.loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500 text-sm">Synchronizing identities...</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/30 border-b border-white/5 text-gray-500 uppercase text-[10px] tracking-widest">
                    <tr>
                      <th className="px-6 py-4 font-black">Symbiote User</th>
                      <th className="px-6 py-4 font-black">Jira Identity</th>
                      <th className="px-6 py-4 font-black">Resolution Type</th>
                      <th className="px-6 py-4 font-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {mappings.data.map((m, idx) => (
                      <motion.tr 
                        key={m.userId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-white/[0.02] transition group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">{m.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono">{m.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {m.source !== 'NONE' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-[10px] font-black italic border border-violet-500/20">J</div>
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-200">{m.displayName || 'Unknown Jira User'}</span>
                                <span className="text-[10px] font-mono text-gray-500 italic block truncate w-32">{m.jiraAccountId}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-600 italic text-xs">Unlinked</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {m.source === 'OAUTH' && <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-black uppercase tracking-wider">OAuth 2.0</span>}
                          {m.source === 'MANUAL' && <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20 font-black uppercase tracking-wider">Explicit Mapping</span>}
                          {m.source === 'NONE' && <span className="text-gray-600 text-[10px] font-black uppercase tracking-wider px-2">No Mapping</span>}
                        </td>
                        <td className="px-6 py-4">
                           <button 
                            onClick={() => setSelectedMappingUser(m)}
                            className="text-violet-400 hover:text-violet-300 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-violet-500/5 border border-violet-500/10 hover:border-violet-500/30 transition-all opacity-0 group-hover:opacity-100"
                           >
                            Configure
                           </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Activity size={160} />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <AlertCircle size={18} className="text-rose-500" /> Unmapped Activity
                  </h2>
                  <p className="text-gray-500 text-xs mb-6">Real-time webhook events received from Jira accounts that are not yet registered or mapped in SYMBIOTE.</p>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {unmapped.data.length === 0 ? (
                      <div className="py-8 text-center text-gray-700 italic text-sm">No unmapped activity detected.</div>
                    ) : unmapped.data.map((u, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:border-white/10 transition">
                         <div className="flex flex-col">
                            <span className="text-white text-xs font-mono font-bold truncate w-40">{u.jiraAccountId}</span>
                            <span className="text-[10px] text-gray-500">{new Date(u.createdAt).toLocaleTimeString()}</span>
                         </div>
                         <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Map Now</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f0f] to-violet-900/10 p-6 shadow-2xl">
                   <h2 className="text-lg font-bold text-white mb-4">Manual Mapping Portal</h2>
                   {selectedMappingUser ? (
                     <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                           <span className="text-[10px] text-gray-500 uppercase font-black">Target Symbiote User</span>
                           <div className="text-white font-bold text-lg">{selectedMappingUser.name}</div>
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-[10px] text-gray-500 uppercase font-black">Jira Account Connection</label>
                           <select 
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition-all font-medium appearance-none"
                            onChange={(e) => {
                                const jiraUser = users.data.find(u => u.accountId === e.target.value);
                                setManualMapping({
                                    userId: selectedMappingUser.userId,
                                    jiraAccountId: e.target.value,
                                    displayName: jiraUser?.displayName || ''
                                });
                            }}
                           >
                            <option value="">Select Jira Identity...</option>
                            {users.data.map(u => (
                                <option key={u.accountId} value={u.accountId} className="bg-[#0f0f0f]">
                                    {u.displayName} ({u.accountId.substring(0, 8)}...)
                                </option>
                            ))}
                           </select>
                        </div>

                        <button 
                          onClick={onSaveMapping}
                          disabled={!manualMapping.jiraAccountId}
                          className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900/20 disabled:text-gray-600 py-3 rounded-xl font-bold transition-all shadow-lg shadow-violet-600/20 mt-4 text-sm"
                        >
                          Execute Explicit Mapping
                        </button>
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-600">
                            <Users size={32} />
                        </div>
                        <p className="text-gray-500 text-sm max-w-[200px]">Select a user from the mapping list to configure their Jira identity.</p>
                     </div>
                   )}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'xp-rules' && (
          <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-xl overflow-hidden">
             <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">XP Intelligence Rules</h2>
                <p className="text-sm text-gray-400 mt-1">Configure how many XP points are awarded when an issue status changes in Jira.</p>
              </div>
              <button onClick={fetchXpRules} className="bg-black/40 hover:bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition text-white">Refresh Rules</button>
            </div>
            {xpRules.loading ? (
              <div className="p-8 text-center text-gray-500">Loading Rules...</div>
            ) : (
                <table className="w-full text-left text-sm">
                <thead className="bg-black/30 border-b border-white/5 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Jira Status</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">XP Reward</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {xpRules.data.map(r => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4 font-medium text-gray-200">
                        <span className="bg-black/40 border border-white/10 px-3 py-1 rounded-lg font-mono text-xs uppercase tracking-widest">{r.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <input 
                            type="number" 
                            defaultValue={r.points} 
                            onBlur={(e) => updateXpRule(r.id, e.target.value)}
                            className="bg-black/40 border border-white/10 text-violet-400 font-black px-3 py-1 rounded w-20 outline-none focus:border-violet-500 transition" 
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs italic">Auto-saves on blur</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-xl overflow-hidden p-6">
            <h2 className="text-lg font-bold text-white mb-6">Create Gamified Task in Jira</h2>
            <div className="max-w-2xl">
              <form className="space-y-4" onSubmit={onSubmitTask}>
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Summary / Title</label>
                  <input
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-2 text-white focus:border-violet-500 outline-none transition"
                    placeholder="Implement Authentication Flow"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Project Key</label>
                    <input
                      value={form.projectKey} onChange={e => setForm({ ...form, projectKey: e.target.value })}
                      required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-2 text-white focus:border-violet-500 outline-none transition font-mono tracking-wider uppercase text-sm"
                      placeholder="SYM"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Assignee (AccountId)</label>
                    <input
                      value={form.assigneeId} onChange={e => setForm({ ...form, assigneeId: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 mt-2 text-white focus:border-violet-500 outline-none transition font-mono text-sm"
                      placeholder="Optional: 712020:...."
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-6 rounded-xl transition">
                    Create Issue & Sync Webhook
                  </button>
                  {submitStatus && <span className="text-sm font-semibold text-violet-400 bg-violet-500/10 px-4 py-2 rounded-lg">{submitStatus}</span>}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
