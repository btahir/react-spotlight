import type React from 'react';
import { useCurrentFrame } from 'remotion';
import { fontMono } from '../lib/fonts';
import { theme } from '../lib/theme';

interface TypeWriterProps {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  prefix?: string;
  color?: string;
  fontSize?: number;
  showCursor?: boolean;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  startFrame = 0,
  charsPerFrame = 0.8,
  prefix = '$ ',
  color = theme.textPrimary,
  fontSize = 14,
  showCursor = true,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.min(Math.floor(elapsed * charsPerFrame), text.length);
  const cursorVisible = showCursor && Math.floor(frame / 15) % 2 === 0;
  const done = visibleChars >= text.length;

  const visibleText = text.slice(0, visibleChars);
  const lines = visibleText.split('\n');

  return (
    <pre
      style={{
        fontFamily: fontMono,
        fontSize,
        lineHeight: 1.6,
        margin: 0,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {prefix && (
        <span style={{ color: theme.textSecondary }}>{prefix}</span>
      )}
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 && '\n'}
          <span style={{ color }}>{line}</span>
        </span>
      ))}
      {(!done || cursorVisible) && (
        <span
          style={{
            display: 'inline-block',
            width: fontSize * 0.55,
            height: fontSize * 1.2,
            background: theme.amber,
            marginLeft: 1,
            verticalAlign: 'text-bottom',
            opacity: cursorVisible ? 0.9 : 0,
          }}
        />
      )}
    </pre>
  );
};
