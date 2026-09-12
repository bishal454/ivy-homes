import { mkdir, readFile, writeFile } from 'node:fs/promises';

const env = Object.fromEntries(
  (await readFile('.env', 'utf8'))
    .split(/\r?\n/)
    .filter((line) => line.includes('='))
    .map((line) => {
      const separator = line.indexOf('=');
      return [line.slice(0, separator), line.slice(separator + 1).replace(/^"|"$/g, '')];
    }),
);

const baseUrl = env.VITE_IVY_API_BASE_URL;
const apiKey = env.VITE_IVY_API_KEY;
const password = env.VITE_IVY_DEMO_PASSWORD;

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'X-API-Key': apiKey, ...(options.headers ?? {}) },
  });
  if (!response.ok) throw new Error(`${path}: ${response.status} ${await response.text()}`);
  return response.json();
}

const login = await request('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'demo1@ivy.homes', password }),
});
const auth = { Authorization: `Bearer ${login.access_token}` };

async function getAll(path) {
  const first = await request(`${path}?limit=200&offset=0`, { headers: auth });
  const records = [...first.results];
  let offset = first.offset + first.count;
  let page = first;
  while (page.has_more) {
    page = await request(`${path}?limit=200&offset=${offset}`, { headers: auth });
    records.push(...page.results);
    offset = page.offset + page.count;
  }
  return { metadata: { total: first.total, limit: first.limit, retrieved: records.length }, records };
}

await mkdir('data', { recursive: true });
for (const path of ['/v1/listings', '/v1/rentals', '/v1/projects']) {
  const result = await getAll(path);
  const name = path.split('/').at(-1);
  await writeFile(`data/${name}.json`, JSON.stringify(result, null, 2));
  console.log(`${name}: ${result.records.length} records`);
}
