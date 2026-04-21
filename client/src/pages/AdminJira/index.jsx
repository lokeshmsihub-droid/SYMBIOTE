import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Activity, AlertCircle, CheckCircle2, GitPullRequest, LayoutDashboard, Settings, UserPlus, Users } from 'lucide-react';

export default function AdminJira() {
  const [activeTab, setActiveTab] = useState('integration');

  // States
  const [status, setStatus] = useState({ loading: true, data: null });
  const [projects, setProjects] = useState({ loading: false, data: [] });
  const [users, setUsers] = useState({ loading: false, data: [] });

  // Form State
  const [form, setForm] = useState({ title: '', projectKey: '', assigneeId: '' });
  const [submitStatus, setSubmitStatus] = useState('');

  const fetchStatus = async () => {
    try {
      const { data } = await api.get('/admin/jira/status');
      setStatus({ loading: false, data });
    } catch {
      setStatus({ loading: false, data: { connected: false } });
    }
  };

  const fetchProjects = async () => {
    setProjects(p => ({ ...p, loading: true }));
    try {
      const { data } = await api.get('/admin/jira/projects');
      setProjects({ loading: false, data: Array.isArray(data) ? data : [] });
    } catch {
      setProjects({ loading: false, data: [] });
    }
  };

  const fetchUsers = async () => {
    setUsers(u => ({ ...u, loading: true }));
    try {
      const { data } = await api.get('/admin/jira/users');
      setUsers({ loading: false, data: Array.isArray(data) ? data : [] });
    } catch {
      setUsers({ loading: false, data: [] });
    }
  };

  const onSubmitTask = async (e) => {
    e.preventDefault();
    try {
      setSubmitStatus('Submitting...');
      await api.post('/admin/jira/tasks', {
        fields: {
          project: { key: form.projectKey },
          summary: form.title,
          description: "Gamified task via SYMBIOTE",
          issuetype: { name: "Task" },
          assignee: form.assigneeId ? { accountId: form.assigneeId } : null
        }
      });
      setSubmitStatus('Task Created Successfully!');
      setForm({ title: '', projectKey: '', assigneeId: '' });
    } catch (err) {
      setSubmitStatus('Failed: ' + (err?.response?.data?.message || 'Check Jira permissions'));
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (activeTab === 'projects' && !projects.data.length && status.data?.connected) fetchProjects();
    if (activeTab === 'team' && !users.data.length && status.data?.connected) fetchUsers();
  }, [activeTab, status.data]);

  const tabs = [
    { id: 'integration', label: 'Integration', icon: <Settings size={18} /> },
    { id: 'projects', label: 'Projects', icon: <LayoutDashboard size={18} /> },
    { id: 'team', label: 'Team Mapping', icon: <Users size={18} /> },
    { id: 'tasks', label: 'Task Console', icon: <GitPullRequest size={18} /> }
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          Jira Admin Console
          {status.data?.connected ? (
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 size={14} /> Connected
            </span>
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
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Cloud ID</span>
                    <p className="text-gray-300 bg-black/40 px-3 py-2 rounded-lg border border-white/5 mt-1 font-mono text-sm tracking-tight">{status.data.cloudId}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-rose-500" size={32} />
                  </div>
                  <h3 className="text-white font-bold mb-1">OAuth Token Missing</h3>
                  <p className="text-gray-400 text-sm mb-6">Authenticate via Atlassian to grant access.</p>
                  <a href="http://localhost:8080/api/jira/oauth/start" className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-bold transition inline-block">
                    Connect to Jira
                  </a>
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
              <button onClick={fetchProjects} className="bg-black/40 hover:bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition text-white">Refresh Projects</button>
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
          <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Jira Users & Account Mapping</h2>
                <p className="text-sm text-gray-400 mt-1">Account IDs extracted directly from the Atlassian instance to assist in mapping SYMBIOTE gamification accounts.</p>
              </div>
              <button onClick={fetchUsers} className="bg-black/40 hover:bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition text-white">Refresh Users</button>
            </div>
            {users.loading ? (
              <div className="p-8 text-center text-gray-500">Loading Users...</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-black/30 border-b border-white/5 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">User</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Atlassian ID</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.data.map(u => (
                    <tr key={u.accountId} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4 font-medium text-gray-200 flex items-center gap-3">
                        {u.avatarUrls?.['32x32'] ? <img src={u.avatarUrls['32x32']} className="rounded-full w-8 h-8 ring-2 ring-white/10" /> : <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><UserPlus size={14} /></div>}
                        {u.displayName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-gray-400 bg-black/40 px-2 py-1 rounded inline-block border border-white/5">{u.accountId}</div>
                      </td>
                      <td className="px-6 py-4">
                        {u.accountType === 'app' ?
                          <span className="text-rose-400 text-xs font-semibold px-2 border border-rose-500/20 bg-rose-500/10 rounded-full py-0.5">App/Bot</span> :
                          <span className="text-blue-400 text-xs font-semibold px-2 border border-blue-500/20 bg-blue-500/10 rounded-full py-0.5">Jira User</span>
                        }
                      </td>
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
