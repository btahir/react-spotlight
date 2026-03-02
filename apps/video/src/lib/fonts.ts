import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadInstrumentSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';

export const { fontFamily: fontDisplay } = loadInstrumentSerif('normal', {
  weights: ['400'],
  subsets: ['latin'],
});

export const { fontFamily: fontDisplayItalic } = loadInstrumentSerif('italic', {
  weights: ['400'],
  subsets: ['latin'],
});

export const { fontFamily: fontBody } = loadDMSans('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const { fontFamily: fontMono } = loadJetBrainsMono('normal', {
  weights: ['400', '500'],
  subsets: ['latin'],
});
