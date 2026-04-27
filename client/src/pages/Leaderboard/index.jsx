import { useAuth } from '../../context/AuthContext';
import LeaderboardUserView from './LeaderboardUserView';
import LeaderboardAdminView from './LeaderboardAdminView';

export default function Leaderboard() {
  const { hasCapability } = useAuth();
  
  if (hasCapability('view_admin_dashboard')) {
    return <LeaderboardAdminView />;
  }

  return <LeaderboardUserView />;
}
