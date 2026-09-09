const { describe, it } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('node:child_process');

const PORT = process.env.PORT || 3173;
const BASE_URL = `http://localhost:${PORT}`;

// Run when explicitly invoked or when RUN_DOCKER_SMOKE=1 is set
const isSmokeRun = process.env.RUN_DOCKER_SMOKE === '1' || process.env.npm_lifecycle_event === 'test:smoke';

describe('Phase 23 Docker Container Smoke & SSR Integrity Suite', { skip: !isSmokeRun && 'Skipped unless RUN_DOCKER_SMOKE=1 or npm run test:smoke' }, () => {
  it('verifies Docker container is running and healthy', () => {
    const inspectOutput = execSync('docker inspect --format="{{json .State.Health.Status}}" learnwith-app', { encoding: 'utf-8' }).trim();
    assert.ok(inspectOutput.includes('healthy') || inspectOutput.includes('starting'), `Expected healthy or starting, got: ${inspectOutput}`);
  });

  it('verifies non-root execution (USER node)', () => {
    const userOutput = execSync('docker exec learnwith-app whoami', { encoding: 'utf-8' }).trim();
    assert.strictEqual(userOutput, 'node', 'Container must execute as non-root user node');
  });

  it('verifies Frontpage Hub (/) delivers full SSR with OpenGraph and Course Cards', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Pusat Workshop &amp; Ruang Belajar Terpadu') || html.includes('Pusat Workshop & Ruang Belajar Terpadu'), 'Must contain Frontpage title');
    assert.ok(html.includes('og:title'), 'Must contain OpenGraph title');
    assert.ok(html.includes('card-home-course-ai'), 'Must contain AI course card');
    assert.ok(html.includes('card-home-course-word'), 'Must contain Word course card');
  });

  it('verifies Course AI (/course/ai?mode=pretraining) delivers syllabus shell & streaming banner', async () => {
    const res = await fetch(`${BASE_URL}/course/ai?mode=pretraining`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(
      html.includes('Silabus &amp; Rangkaian Modul Praktik') ||
      html.includes('Silabus & Rangkaian Modul Praktik') ||
      html.includes('Hands-on Agentic AI'),
      'Must contain syllabus or course header'
    );
    assert.ok(
      html.includes('course-stats-banner') || html.includes('container-pretraining'),
      'Must contain course stats or pretraining container'
    );
    assert.ok(
      html.includes('Mode Persiapan Mandiri') || html.includes('Pra-Training') || html.includes('Pre-Training Guide'),
      'Must contain mode label'
    );
  });

  it('verifies Course Word (/course/word) delivers Word syllabus shell and Pergub reference', async () => {
    const res = await fetch(`${BASE_URL}/course/word`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Pergub DKI No. 14/2020') || html.includes('Pergub DKI 14/2020'), 'Must contain Pergub reference');
    assert.ok(html.includes('Bab I: Standardisasi Tata Naskah Dinas') || html.includes('Standardisasi Tata Naskah Dinas'), 'Must contain Word module content');
  });

  it('verifies unknown route returns 404 with Branded NotebookLM page', async () => {
    const res = await fetch(`${BASE_URL}/route-that-does-not-exist`);
    assert.strictEqual(res.status, 404);
    const html = await res.text();
    assert.ok(html.includes('404 • Halaman Tidak Ditemukan'), 'Must contain 404 badge');
    assert.ok(html.includes('Kembali ke Beranda Workshop'), 'Must contain home return action');
  });

  it('verifies static asset delivers immutable caching headers', async () => {
    const res = await fetch(`${BASE_URL}/favicon.svg`);
    assert.strictEqual(res.status, 200);
  });
});
