import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import Rewards from './pages/Rewards';
import Wallet from './pages/Wallet';
import Community from './pages/Community';
import Analytics from './pages/Analytics';
import Accountability from './pages/Accountability';
import Wellness from './pages/Wellness';
import Challenges from './pages/Challenges';
import Streaks from './pages/Streaks';
import Mentorship from './pages/Mentorship';
import Mystery from './pages/Mystery';
import Story from './pages/Story';
import Sergeants from './pages/Sergeants';
import AdminJira from './pages/AdminJira';

const ComingSoon = ({ label }) => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="text-center">
      <div className="text-5xl mb-4">🚀</div>
      <h2 className="text-2xl font-black text-zinc-800 mb-2">{label}</h2>
      <p className="text-zinc-500">This feature is coming soon. Stay tuned!</p>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="goals" element={<Goals />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="community" element={<Community />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="accountability" element={<Accountability />} />
        <Route path="wellness" element={<Wellness />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="streaks" element={<Streaks />} />
        <Route path="mentorship" element={<Mentorship />} />
        <Route path="mystery" element={<Mystery />} />
        <Route path="story" element={<Story />} />
        <Route path="gamer-types" element={<ComingSoon label="Gamer Types" />} />
        <Route path="sergeants" element={<Sergeants />} />
        <Route path="admin/jira" element={<AdminJira />} />
        <Route path="spine" element={<ComingSoon label="SPINE Wellbeing" />} />
        <Route path="ai-coach" element={<ComingSoon label="AI Coach" />} />
        <Route path="*" element={<ComingSoon label="Coming Soon" />} />
      </Route>
    </Routes>
  );
}

export default App;
