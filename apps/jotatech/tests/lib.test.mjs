import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveVideo } from '../src/lib/video.ts';
import { parseMaterials, percent, slugify, timeAgo, initials } from '../src/lib/format.ts';

test('resolveVideo: YouTube watch, youtu.be e shorts viram embed', () => {
  const embed = 'https://www.youtube-nocookie.com/embed/abc123?rel=0&modestbranding=1';
  assert.deepEqual(resolveVideo('https://www.youtube.com/watch?v=abc123'), { kind: 'iframe', src: embed });
  assert.deepEqual(resolveVideo('https://youtu.be/abc123'), { kind: 'iframe', src: embed });
  assert.deepEqual(resolveVideo('https://youtube.com/shorts/abc123'), { kind: 'iframe', src: embed });
});

test('resolveVideo: Vimeo (inclusive não listado com hash)', () => {
  assert.equal(resolveVideo('https://vimeo.com/123456').src, 'https://player.vimeo.com/video/123456');
  assert.equal(resolveVideo('https://vimeo.com/123456/abcdef').src, 'https://player.vimeo.com/video/123456?h=abcdef');
});

test('resolveVideo: Google Drive, arquivo mp4, embed genérico e vazio', () => {
  assert.equal(resolveVideo('https://drive.google.com/file/d/XYZ/view').src, 'https://drive.google.com/file/d/XYZ/preview');
  assert.deepEqual(resolveVideo('https://x.supabase.co/storage/v1/object/public/media/a.mp4'), {
    kind: 'file',
    src: 'https://x.supabase.co/storage/v1/object/public/media/a.mp4',
  });
  assert.equal(resolveVideo('https://player-vz-1.tv.pandavideo.com.br/embed/?v=1').kind, 'iframe');
  assert.deepEqual(resolveVideo(''), { kind: 'none' });
  assert.deepEqual(resolveVideo('não é link'), { kind: 'none' });
});

test('parseMaterials: aceita "Nome | link" e link puro, ignora inválidos', () => {
  assert.deepEqual(parseMaterials('Prompt | https://a.com\nhttps://b.com\nlixo\n\n'), [
    { label: 'Prompt', url: 'https://a.com' },
    { label: 'https://b.com', url: 'https://b.com' },
  ]);
});

test('slugify remove acentos e símbolos', () => {
  assert.equal(slugify('Hospedagem Grátis: GitHub & Vercel!'), 'hospedagem-gratis-github-vercel');
});

test('percent, initials e timeAgo', () => {
  assert.equal(percent(1, 3), 33);
  assert.equal(percent(0, 0), 0);
  assert.equal(initials('Ana Maria Souza'), 'AS');
  const now = new Date('2026-09-25T12:00:00Z');
  assert.equal(timeAgo('2026-09-25T11:55:00Z', now), 'há 5 min');
  assert.equal(timeAgo('2026-09-24T12:00:00Z', now), 'há 1 dia');
});
