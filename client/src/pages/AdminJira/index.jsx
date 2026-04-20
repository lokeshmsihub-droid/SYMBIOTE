import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

const defaultForm = {
  title: '',
  description: '',
  assigneeUserId: '',
  sprintId: '',
  priority: 'Medium',
  storyPoints: '3',
};

export default function AdminJira() {
  const [form, setForm] = useState(defaultForm);
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return form.title && form.assigneeUserId && form.sprintId && form.priority;
  }, [form]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/admin/tasks');
      setTasks(data || []);
    } catch (err) {
      setError(err?.data?.message || 'Failed to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        assigneeUserId: Number(form.assigneeUserId),
        sprintId: Number(form.sprintId),
        priority: form.priority,
        storyPoints: form.storyPoints ? Number(form.storyPoints) : null,
      };
      const { data } = await api.post('/admin/tasks', payload);
      setStatus(data.message || 'Task created');
      setForm(defaultForm);
      await fetchTasks();
    } catch (err) {
      setError(err?.data?.message || err?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Jira Admin Console</h1>
          <p className="text-gray-400 mt-2">Create tasks, sync to Jira, and monitor status in one place.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.4fr] gap-6">
        <section className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
          <h2 className="text-lg font-semibold text-white">Create Jira Task</h2>
          <p className="text-xs text-gray-500 mt-1">Fields map directly to Jira issue creation</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Title</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                value={form.title}
                onChange={onChange('title')}
                placeholder="Ship onboarding flow"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Description</label>
              <textarea
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                value={form.description}
                onChange={onChange('description')}
                placeholder="Describe the task details"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">Assignee (User ID)</label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  value={form.assigneeUserId}
                  onChange={onChange('assigneeUserId')}
                  placeholder="42"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">Sprint ID</label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  value={form.sprintId}
                  onChange={onChange('sprintId')}
                  placeholder="1001"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">Priority</label>
                <select
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  value={form.priority}
                  onChange={onChange('priority')}
                >
                  <option>Highest</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                  <option>Lowest</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">Story Points</label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none"
                  value={form.storyPoints}
                  onChange={onChange('storyPoints')}
                  placeholder="3"
                />
              </div>
            </div>

            {status && <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{status}</div>}
            {error && <div className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Jira Task'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Tracked Tasks</h2>
              <p className="text-xs text-gray-500 mt-1">Latest tasks created via SYMBIOTE</p>
            </div>
            <button
              onClick={fetchTasks}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:border-violet-400 hover:text-violet-300"
            >
              Refresh
            </button>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-white/5">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Issue</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Sprint</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-gray-500">No tasks yet</td>
                  </tr>
                )}
                {tasks.map((task) => (
                  <tr key={task.taskId} className="text-gray-200">
                    <td className="px-4 py-3 font-semibold text-violet-300">{task.jiraIssueKey}</td>
                    <td className="px-4 py-3">{task.title}</td>
                    <td className="px-4 py-3">#{task.userId}</td>
                    <td className="px-4 py-3">{task.sprintId}</td>
                    <td className={`px-4 py-3 ${task.status === 'JIRA_PARTIAL' ? 'text-amber-300' : 'text-emerald-300'}`}>{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
