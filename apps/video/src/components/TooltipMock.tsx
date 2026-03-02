import type React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { tooltipSpring } from '../lib/animations';
import { fontBody } from '../lib/fonts';
import { theme } from '../lib/theme';

interface TooltipMockProps {
  title: string;
  content: string;
  x: number;
  y: number;
  startFrame?: number;
  step?: number;
  totalSteps?: number;
  /** Width of tooltip */
  width?: number;
}

export const TooltipMock: React.FC<TooltipMockProps> = ({
  title,
  content,
  x,
  y,
  startFrame = 0,
  step = 1,
  totalSteps = 3,
  width = 280,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - startFrame,
    fps,
    config: tooltipSpring,
    durationInFrames: 18,
  });

  const opacity = interpolate(entryProgress, [0, 1], [0, 1]);
  const translateY = interpolate(entryProgress, [0, 1], [8, 0]);
  const scale = interpolate(entryProgress, [0, 1], [0.96, 1]);

  const progressFraction = step / totalSteps;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        fontFamily: fontBody,
      }}
    >
      <div
        style={{
          background: theme.surface,
          borderRadius: 12,
          padding: 20,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${theme.amberDim}`,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: theme.textPrimary,
            marginBottom: 6,
          }}
        >
          {title}
        </div>

        {/* Content */}
        <div
          style={{
            fontSize: 13,
            color: theme.textSecondary,
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          {content}
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 3,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.08)',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 2,
              background: theme.amber,
              width: `${progressFraction * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: theme.textSecondary }}>
            {step} of {totalSteps}
          </span>
          <div
            style={{
              background: theme.amber,
              color: theme.bg,
              fontSize: 12,
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 6,
            }}
          >
            {step === totalSteps ? 'Done' : 'Next'}
          </div>
        </div>
      </div>
    </div>
  );
};
