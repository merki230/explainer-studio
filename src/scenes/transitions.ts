import {FADE} from '../theme';

/**
 * How one scene hands over to the next (style guide § 8).
 *  - 'dissolve': the next fades in over this one (12 frames). Old scenes, the time-passes beat, the loop.
 *  - 'continue': same slice, next idea: the camera keeps moving, no dissolve, no cut (no overlap).
 *  - 'glide': same slice, a new framing too far for 'continue': the new scene opens with an eased
 *    camera move (cubic in-out, `glide` seconds) from where the last scene ended (no overlap).
 *  - 'cut': a plain cut (no overlap). Rare.
 *  - 'slide': a new, unlinked slice slides in from below as this one leaves at the top (18 frames).
 *  - 'follow': the camera moves along the orange route to a linked slice (24 frames), the route
 *    crossing the seam.
 */
export type TransitionKind = 'dissolve' | 'continue' | 'glide' | 'cut' | 'slide' | 'follow';
export type FollowDirection = 'down' | 'up' | 'left' | 'right';
export type Transition = {kind: TransitionKind; frames: number; direction: FollowDirection; at: number};

export const TRANSITION_FRAMES: Record<TransitionKind, number> = {
  dissolve: FADE,
  continue: 0,
  glide: 0,
  cut: 0,
  slide: 18,
  follow: 24,
};

type SceneLike = {scene: string; props?: Record<string, unknown>};

/** Section scenes and the location each one is by default (§ 8: moving between them slides or follows). */
const SECTION_DEFAULT_LOCATION: Record<string, string> = {
  'section-room': 'living-room',
  'section-lab': 'lab',
  'phone-cutaway': 'phone-cutaway',
  'wheel-slice': 'wheel',
  'car-slice': 'car',
  'tower-slice': 'tower',
  'hotel-lobby': 'hotel',
  'street-slice': 'street',
  'highway-slice': 'highway',
  'musical-road': 'musical-road',
};

/** The transition into `cur` from `prev` (its `transition` prop, or the 'auto' rules). */
export const transitionInto = (prev: SceneLike, cur: SceneLike): Transition => {
  const p = cur.props ?? {};
  const follow = (p.follow ?? undefined) as {direction?: FollowDirection; at?: number} | undefined;
  const asked = (p.transition as TransitionKind | 'auto' | undefined) ?? 'auto';
  let kind: TransitionKind;
  if (asked !== 'auto') kind = asked;
  else if (!(cur.scene in SECTION_DEFAULT_LOCATION) || !(prev.scene in SECTION_DEFAULT_LOCATION)) kind = 'dissolve';
  else {
    const loc = (s: SceneLike) => (s.props?.location as string | undefined) ?? SECTION_DEFAULT_LOCATION[s.scene];
    const mood = (s: SceneLike) => (s.props?.mood as string | undefined) ?? 'day';
    // a scene that opens in another mood (`moodFrom`, the time-passes blend) continues from it
    const opening = (s: SceneLike) => (s.props?.moodFrom as string | undefined) ?? mood(s);
    if (loc(prev) === loc(cur)) kind = mood(prev) === opening(cur) ? 'continue' : 'dissolve';
    else kind = follow ? 'follow' : 'slide';
  }
  return {
    kind,
    frames: TRANSITION_FRAMES[kind],
    direction: follow?.direction ?? (kind === 'slide' ? 'up' : 'down'),
    at: follow?.at ?? 0.3,
  };
};
