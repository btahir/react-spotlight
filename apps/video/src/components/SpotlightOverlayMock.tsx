import type React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { smoothEntry } from '../lib/animations';

interface SpotlightOverlayMockProps {
  /** Target rect: { x, y, width, height } relative to the container */
  target: { x: number; y: number; width: number; height: number };
  /** Container dimensions */
  containerWidth: number;
  containerHeight: number;
  /** Padding around the spotlight cutout */
  padding?: number;
  /** Border radius of the cutout */
  radius?: number;
  /** Start frame for the animation */
  startFrame?: number;
  /** Overlay opacity */
  overlayOpacity?: number;
}

export const SpotlightOverlayMock: React.FC<SpotlightOverlayMockProps> = ({
  target,
  containerWidth,
  containerHeight,
  padding = 8,
  radius = 8,
  startFrame = 0,
  overlayOpacity = 0.75,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: smoothEntry,
    durationInFrames: 20,
  });

  const x = target.x - padding;
  const y = target.y - padding;
  const w = target.width + padding * 2;
  const h = target.height + padding * 2;
  const r = radius;

  // Animate from a large rect (covering everything) to the target
  const animX = interpolate(progress, [0, 1], [0, x]);
  const animY = interpolate(progress, [0, 1], [0, y]);
  const animW = interpolate(progress, [0, 1], [containerWidth, w]);
  const animH = interpolate(progress, [0, 1], [containerHeight, h]);

  const clipPath = `polygon(
    0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%,
    ${animX}px ${animY + r}px,
    ${animX + r}px ${animY}px,
    ${animX + animW - r}px ${animY}px,
    ${animX + animW}px ${animY + r}px,
    ${animX + animW}px ${animY + animH - r}px,
    ${animX + animW - r}px ${animY + animH}px,
    ${animX + r}px ${animY + animH}px,
    ${animX}px ${animY + animH - r}px,
    ${animX}px ${animY + r}px
  )`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `rgba(0, 0, 0, ${overlayOpacity})`,
        clipPath,
        pointerEvents: 'none',
      }}
    />
  );
};
