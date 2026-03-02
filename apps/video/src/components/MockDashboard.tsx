import type React from 'react';
import { fontBody, fontMono } from '../lib/fonts';
import { theme } from '../lib/theme';

/**
 * A realistic-looking mock dashboard app for the spotlight to target.
 * Uses data-tour attributes so spotlight overlays can reference targets.
 */
export const MockDashboard: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      background: theme.bg,
      fontFamily: fontBody,
      color: theme.textPrimary,
    }}
  >
    {/* Sidebar */}
    <div
      style={{
        width: 180,
        borderRight: `1px solid ${theme.borderSubtle}`,
        padding: '16px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: theme.textPrimary }}>Acme Inc</span>
      </div>

      {/* Nav items */}
      {[
        { icon: '⌂', label: 'Dashboard', active: true },
        { icon: '☰', label: 'Projects', active: false, tourId: 'nav-item' },
        { icon: '✉', label: 'Messages', active: false },
        { icon: '⚙', label: 'Settings', active: false },
      ].map((item) => (
        <div
          key={item.label}
          data-mock={item.tourId}
          style={{
            padding: '8px 16px',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: item.active ? theme.textPrimary : theme.textSecondary,
            background: item.active ? 'rgba(255,255,255,0.04)' : 'transparent',
            borderLeft: item.active ? `2px solid ${theme.amber}` : '2px solid transparent',
          }}
        >
          <span style={{ fontSize: 14 }}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>

    {/* Main content */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          height: 48,
          borderBottom: `1px solid ${theme.borderSubtle}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600 }}>Dashboard</span>
        <div
          data-mock="search-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${theme.borderSubtle}`,
            borderRadius: 6,
            padding: '5px 12px',
            fontSize: 12,
            color: theme.textSecondary,
            fontFamily: fontMono,
          }}
        >
          Search...
          <span
            style={{
              fontSize: 10,
              padding: '1px 5px',
              borderRadius: 3,
              border: `1px solid ${theme.borderSubtle}`,
              color: theme.textSecondary,
            }}
          >
            ⌘K
          </span>
        </div>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: theme.amber,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: theme.bg,
          }}
        >
          B
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Total Users', value: '2,847', change: '+12%' },
            { label: 'Active Now', value: '184', change: '+3%' },
            { label: 'Revenue', value: '$12.4k', change: '+8%' },
          ].map((stat) => (
            <div
              key={stat.label}
              data-mock={stat.label === 'Total Users' ? 'stat-card' : undefined}
              style={{
                flex: 1,
                padding: '14px 16px',
                borderRadius: 8,
                border: `1px solid ${theme.borderSubtle}`,
                background: theme.surface,
              }}
            >
              <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 700 }}>{stat.value}</span>
                <span style={{ fontSize: 11, color: theme.green }}>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action button area */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            data-mock="action-button"
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              background: theme.amber,
              color: theme.bg,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            + New Project
          </div>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: `1px solid ${theme.borderSubtle}`,
              color: theme.textSecondary,
              fontSize: 13,
            }}
          >
            Import
          </div>
        </div>

        {/* Table area */}
        <div
          style={{
            flex: 1,
            borderRadius: 8,
            border: `1px solid ${theme.borderSubtle}`,
            overflow: 'hidden',
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: 'flex',
              padding: '10px 16px',
              borderBottom: `1px solid ${theme.borderSubtle}`,
              background: theme.surfaceOverlay,
              fontSize: 11,
              fontWeight: 500,
              color: theme.textSecondary,
              textTransform: 'uppercase' as const,
              letterSpacing: 0.5,
            }}
          >
            <span style={{ flex: 2 }}>Project</span>
            <span style={{ flex: 1 }}>Status</span>
            <span style={{ flex: 1 }}>Members</span>
            <span style={{ flex: 1 }}>Updated</span>
          </div>
          {/* Table rows */}
          {[
            { name: 'Website Redesign', status: 'Active', members: 5, date: 'Today' },
            { name: 'Mobile App v2', status: 'Review', members: 3, date: 'Yesterday' },
            { name: 'API Migration', status: 'Active', members: 8, date: '2 days ago' },
          ].map((row) => (
            <div
              key={row.name}
              style={{
                display: 'flex',
                padding: '10px 16px',
                borderBottom: `1px solid ${theme.borderSubtle}`,
                fontSize: 13,
                alignItems: 'center',
              }}
            >
              <span style={{ flex: 2, fontWeight: 500 }}>{row.name}</span>
              <span style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background:
                      row.status === 'Active' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                    color: row.status === 'Active' ? theme.green : theme.amber,
                  }}
                >
                  {row.status}
                </span>
              </span>
              <span style={{ flex: 1, color: theme.textSecondary }}>{row.members}</span>
              <span style={{ flex: 1, color: theme.textSecondary }}>{row.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
