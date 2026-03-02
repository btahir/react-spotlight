import type React from 'react';
import { theme } from '../lib/theme';

interface AppWindowProps {
  title?: string;
  width?: number;
  height?: number;
  children: React.ReactNode;
}

export const AppWindow: React.FC<AppWindowProps> = ({
  title = 'My App',
  width = 640,
  height = 400,
  children,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 12,
      overflow: 'hidden',
      border: `1px solid ${theme.borderSubtle}`,
      background: theme.surface,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px ${theme.borderSubtle}`,
    }}
  >
    {/* Title bar */}
    <div
      style={{
        height: 36,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 8,
        borderBottom: `1px solid ${theme.borderSubtle}`,
        background: theme.surfaceOverlay,
        flexShrink: 0,
      }}
    >
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: theme.trafficRed }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: theme.trafficYellow }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: theme.trafficGreen }} />
      <span
        style={{
          marginLeft: 8,
          fontSize: 11,
          color: theme.textSecondary,
          fontWeight: 500,
        }}
      >
        {title}
      </span>
    </div>

    {/* Content */}
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  </div>
);
