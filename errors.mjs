import { readFile } from 'fs';

readFile(new URL('./../template.html', import.meta.url), 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
  }else {
    console.log('no errors');
  }
});

