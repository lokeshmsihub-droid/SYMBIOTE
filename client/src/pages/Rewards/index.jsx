import { useAuth } from '../../context/AuthContext';
import RewardsUserView from './RewardsUserView';
import RewardsAdminView from './RewardsAdminView';

export default function Rewards() {
  const { hasCapability } = useAuth();
  
  if (hasCapability('manage_rewards')) {
    return <RewardsAdminView />;
  }

  return <RewardsUserView />;
}
