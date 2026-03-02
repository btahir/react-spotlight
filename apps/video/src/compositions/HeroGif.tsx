import type React from 'react';
import { AbsoluteFill } from 'remotion';
import { AppWindow } from '../components/AppWindow';
import { ContinuousSpotlight } from '../components/ContinuousSpotlight';
import type { SpotlightStep } from '../components/ContinuousSpotlight';
import { MockDashboard } from '../components/MockDashboard';
import { theme } from '../lib/theme';

/**
 * Hero GIF for the README.
 * 800x500, 30fps, ~4 seconds (120 frames).
 * Shows spotlight sweeping across 3 dashboard targets with smooth morph transitions.
 */

const WINDOW_W = 640;
const WINDOW_H = 400;
const CONTENT_H = WINDOW_H - 36;

// Layout reference (content area = 640×364):
// Sidebar: 180px wide. Nav items start at y≈49, each ~33px, gap 2.
//   Dashboard: y 49–82, Projects: y 84–117, Messages: y 119–152
// Main content starts at x=181. Header: 48px. Content padding: 20px.
//   Stats row: (201, 69) → 419px wide, ~73px tall
//   Action buttons: (201, 158) → ~122px wide, ~32px tall
const steps: SpotlightStep[] = [
  {
    target: { x: 0, y: 82, width: 180, height: 36 },
    tooltip: { x: 190, y: 78, title: 'Navigation', content: 'Browse and manage your projects from the sidebar.' },
    from: 10,
    to: 42,
  },
  {
    target: { x: 200, y: 68, width: 421, height: 75 },
    tooltip: { x: 220, y: 150, title: 'Metrics at a glance', content: 'Track your key metrics in real time with live-updating cards.' },
    from: 46,
    to: 80,
  },
  {
    target: { x: 200, y: 156, width: 124, height: 34 },
    tooltip: { x: 334, y: 152, title: 'Quick actions', content: 'Create new projects, import data, or invite teammates.' },
    from: 84,
    to: 118,
  },
];

export const HeroGif: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AppWindow title="My App — Dashboard" width={WINDOW_W} height={WINDOW_H}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MockDashboard />
          <ContinuousSpotlight
            steps={steps}
            containerWidth={WINDOW_W}
            containerHeight={CONTENT_H}
          />
        </div>
      </AppWindow>
    </AbsoluteFill>
  );
};
