import type { SpringConfig } from 'remotion';

export const smoothEntry: SpringConfig = {
  damping: 15,
  stiffness: 120,
  mass: 0.8,
  overshootClamping: false,
};

export const snappyEntry: SpringConfig = {
  damping: 20,
  stiffness: 200,
  mass: 0.6,
  overshootClamping: true,
};

export const gentleBounce: SpringConfig = {
  damping: 10,
  stiffness: 100,
  mass: 1,
  overshootClamping: false,
};

export const tooltipSpring: SpringConfig = {
  damping: 14,
  stiffness: 150,
  mass: 0.7,
  overshootClamping: false,
};
