import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', text: 'Welcome back, SriVishnu S' },
  { path: '/goals', text: 'Goals & Work' },
  { path: '/leaderboard', text: 'Your Intelligence Insights' },
  { path: '/achievements', text: 'Mastery & Achievements' },
  { path: '/rewards', text: 'Rewards Store' },
  { path: '/wallet', text: 'Digital Wallet & Assets' },
  { path: '/community', text: 'Community Hub' },
  { path: '/analytics', text: 'Advanced Analytics' },
  { path: '/accountability', text: 'Accountability Center' },
  { path: '/wellness', text: 'Wellness & Analytics' },
  { path: '/challenges', text: 'Challenges' },
  { path: '/streaks', text: 'Streak Dashboard' },
  { path: '/mentorship', text: 'Mentorship Network' },
  { path: '/mystery', text: 'Mystery & Loot' },
  { path: '/story', text: 'Your Narrative Journey' },
  { path: '/gamer-types', text: 'Gamer Types' },
  { path: '/sergeants', text: "Sergeant's Corner" },
  { path: '/admin/jira', text: 'Jira Admin Console' },
  { path: '/spine', text: 'SPINE Wellbeing' },
  { path: '/ai-coach', text: 'AI Coach' },
];

test.describe('App route coverage', () => {
  for (const { path, text } of routes) {
    test(`renders ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByText(text, { exact: false })).toBeVisible();
    });
  }
});
