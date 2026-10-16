import {useThree} from '@react-three/fiber';
import {useEffect, useRef, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import {fontsReady} from '../../fonts';

let loaded = false;

/**
 * True once the fonts are loaded (inside a ThreeCanvas). The first frame waits for them
 * (delayRender), re-renders with `true` so canvas text gets drawn, redraws the canvas, and only
 * then releases the frame. After that, canvas text can be drawn synchronously every frame.
 */
export const useFontsLoaded = () => {
  const [ready, setReady] = useState(loaded);
  const advance = useThree((s) => s.advance);
  const hold = useRef<number | null>(null);
  useEffect(() => {
    if (loaded) return;
    hold.current = delayRender('fonts for canvas text');
    fontsReady().then(() => {
      loaded = true;
      setReady(true);
    });
  }, []);
  // runs after the render with `ready` committed (the text is drawn): redraw, then release
  useEffect(() => {
    if (!ready || hold.current === null) return;
    advance(performance.now());
    const h = hold.current;
    hold.current = null;
    continueRender(h);
  }, [ready, advance]);
  return ready;
};
