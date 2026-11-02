// Facts about one video, as JSON on stdout, for the .mjs scripts (render, cover, package) that can't import the
// TypeScript registry themselves.
//
// usage: tsx scripts/info.ts <slug>
// -> {format, sandbox, cover, shorts: [{chapter, cover}], chapters: [{title, start}], estimated, duration}
import {FPS} from '../src/theme';
import {resolveTimeline} from '../src/timeline';
import {VIDEOS} from '../src/videos';

const entry = VIDEOS[process.argv[2] ?? ''];
if (!entry) {
  console.error(`"${process.argv[2]}" is not registered in src/videos/index.ts.`);
  process.exit(1);
}
const {spec, transcript} = entry;
console.log(
  JSON.stringify({
    format: spec.format ?? 'vertical',
    sandbox: !!spec.sandbox,
    cover: !!spec.cover,
    shorts: (spec.shorts ?? []).map((s) => ({chapter: s.chapter, cover: !!s.cover})),
    chapters: (transcript.chapters ?? []).map((c) => ({title: c.title, start: c.start})),
    estimated: !transcript.audio,
    duration: resolveTimeline(spec, transcript.words, FPS).durationInFrames / FPS,
  }),
);
