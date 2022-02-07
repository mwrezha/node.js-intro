import { readFile, writeFile } from 'fs/promises';

console.log(import.meta.url);

let template = await readFile(new URL('./template.html', import.meta.url), 'utf-8');
console.log(template);

const data = {
  title: 'My Node.js',
  body: 'I wrote this file to disk using node'
};

for (const [key, val] of Object.entries(data)) {
  template = template.replace(`{${key}}`, val);
};

await writeFile(new URL('./index.html', import.meta.url), template);
console.log(template);
