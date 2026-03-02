import type React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { smoothEntry, tooltipSpring } from '../lib/animations';
import { fontBody } from '../lib/fonts';
import { theme } from '../lib/theme';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TooltipData {
  x: number;
  y: number;
  title: string;
  content: string;
}

export interface SpotlightStep {
  target: Rect;
  tooltip: TooltipData;
  /** Absolute frame this step starts */
  from: number;
  /** Absolute frame this step ends */
  to: number;
}

interface ContinuousSpotlightProps {
  steps: SpotlightStep[];
  containerWidth: number;
  containerHeight: number;
  padding?: number;
  radius?: number;
  overlayOpacity?: number;
  tooltipWidth?: number;
  /** Frames to morph between step targets */
  morphFrames?: number;
}

function lerpRect(a: Rect, b: Rect, t: number): Rect {
  return {
    x: interpolate(t, [0, 1], [a.x, b.x]),
    y: interpolate(t, [0, 1], [a.y, b.y]),
    width: interpolate(t, [0, 1], [a.width, b.width]),
    height: interpolate(t, [0, 1], [a.height, b.height]),
  };
}

export const ContinuousSpotlight: React.FC<ContinuousSpotlightProps> = ({
  steps,
  containerWidth,
  containerHeight,
  padding = 6,
  radius = 8,
  overlayOpacity = 0.75,
  tooltipWidth = 240,
  morphFrames = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (steps.length === 0) return null;

  const firstStart = steps[0].from;
  const lastEnd = steps[steps.length - 1].to;

  // Not yet started or already done
  if (frame < firstStart || frame >= lastEnd) return null;

  // ─── Determine current spotlight target rect ──────────────────────────

  // Entry animation: overlay fades in on first step
  const entryProgress = spring({
    frame: frame - firstStart,
    fps,
    config: smoothEntry,
    durationInFrames: 15,
  });

  // Find which step or gap we're in
  let currentTarget: Rect | null = null;
  let activeStepIndex = -1;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (frame >= step.from && frame < step.to) {
      currentTarget = step.target;
      activeStepIndex = i;
      break;
    }
  }

  // Check if we're in a gap between steps — morph from prev to next
  if (currentTarget === null) {
    for (let i = 0; i < steps.length - 1; i++) {
      const prev = steps[i];
      const next = steps[i + 1];
      if (frame >= prev.to && frame < next.from) {
        const gapDuration = next.from - prev.to;
        const t = Math.min((frame - prev.to) / Math.max(gapDuration, 1), 1);
        // Ease the interpolation
        const eased = t * t * (3 - 2 * t); // smoothstep
        currentTarget = lerpRect(prev.target, next.target, eased);
        activeStepIndex = -1; // in gap, no tooltip
        break;
      }
    }
  }

  if (currentTarget === null) return null;

  // If we're in the first few frames of a step (not the first step), morph from previous
  if (activeStepIndex > 0) {
    const step = steps[activeStepIndex];
    const prev = steps[activeStepIndex - 1];
    const framesIntoStep = frame - step.from;
    const gapDuration = step.from - prev.to;
    const totalMorphFrames = gapDuration + Math.min(morphFrames, 8);

    if (framesIntoStep < morphFrames) {
      const morphProgress = (gapDuration + framesIntoStep) / totalMorphFrames;
      const eased = morphProgress * morphProgress * (3 - 2 * morphProgress);
      currentTarget = lerpRect(prev.target, step.target, Math.min(eased, 1));
    }
  }

  // For the very first step, animate from fullscreen to target
  if (activeStepIndex === 0) {
    const fullscreen: Rect = { x: 0, y: 0, width: containerWidth, height: containerHeight };
    currentTarget = lerpRect(fullscreen, steps[0].target, entryProgress);
  }

  // ─── Render overlay clip-path ─────────────────────────────────────────

  const x = currentTarget.x - padding;
  const y = currentTarget.y - padding;
  const w = currentTarget.width + padding * 2;
  const h = currentTarget.height + padding * 2;
  const r = radius;

  const clipPath = `polygon(
    0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%,
    ${x}px ${y + r}px,
    ${x + r}px ${y}px,
    ${x + w - r}px ${y}px,
    ${x + w}px ${y + r}px,
    ${x + w}px ${y + h - r}px,
    ${x + w - r}px ${y + h}px,
    ${x + r}px ${y + h}px,
    ${x}px ${y + h - r}px,
    ${x}px ${y + r}px
  )`;

  // Fade overlay in on first appearance
  const overlayFade = interpolate(entryProgress, [0, 1], [0, overlayOpacity]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(0, 0, 0, ${overlayFade})`,
          clipPath,
        }}
      />

      {/* Tooltips with cross-fade */}
      {steps.map((step, i) => (
        <StepTooltip
          key={i}
          step={step}
          index={i}
          totalSteps={steps.length}
          frame={frame}
          fps={fps}
          width={tooltipWidth}
        />
      ))}
    </div>
  );
};

// ─── Tooltip with entry + exit animation ──────────────────────────────────────

const StepTooltip: React.FC<{
  step: SpotlightStep;
  index: number;
  totalSteps: number;
  frame: number;
  fps: number;
  width: number;
}> = ({ step, index, totalSteps, frame, fps, width }) => {
  const FADE_IN_FRAMES = 12;
  const FADE_OUT_FRAMES = 8;

  // Only render near this step's time range (with a little buffer for fade-out)
  if (frame < step.from || frame >= step.to + 2) return null;

  // Entry: fade + slide up + scale
  const entryDelay = 4; // tooltip appears slightly after spotlight lands
  const entryProgress = spring({
    frame: Math.max(0, frame - step.from - entryDelay),
    fps,
    config: tooltipSpring,
    durationInFrames: FADE_IN_FRAMES,
  });

  // Exit: fade out near end of step
  const exitStart = step.to - FADE_OUT_FRAMES;
  let exitProgress = 1;
  if (frame >= exitStart) {
    exitProgress = interpolate(frame, [exitStart, step.to], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  const opacity = entryProgress * exitProgress;
  const translateY = interpolate(entryProgress, [0, 1], [10, 0]);
  const scale = interpolate(entryProgress, [0, 1], [0.95, 1]);

  if (opacity < 0.01) return null;

  const progressFraction = (index + 1) / totalSteps;

  return (
    <div
      style={{
        position: 'absolute',
        left: step.tooltip.x,
        top: step.tooltip.y,
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
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: theme.textPrimary,
            marginBottom: 6,
          }}
        >
          {step.tooltip.title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: theme.textSecondary,
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          {step.tooltip.content}
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
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: theme.textSecondary }}>
            {index + 1} of {totalSteps}
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
            {index + 1 === totalSteps ? 'Done' : 'Next'}
          </div>
        </div>
      </div>
    </div>
  );
};
