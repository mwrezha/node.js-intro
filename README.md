# Installing Node.js

## For Windows

If you're running windows and not using WSL, I recommend you use the [official instlaller](https://nodejs.org/en/) from the Node.js site. Choose the latest LTS version.

## For everyone else

If you're not on windows or you are using WSL, I recommend using installing Node.js with [`nvm` (node version manager)](https://github.com/nvm-sh/nvm). NVM allows you to install many versions of Node.js at once and switch when you need. Also, NVM installs Node.js in a folder that will not have permission errors that you would otherwise run into with the official installer.

Once you have nvm installed, you need to install a Node version. You can download the latest LTS version with this command.

`nvm install --lts`

# Executing Node

Before we get into creating programs and apps with Node.js, let's get a feet wet with the Node.js [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop). Just type `node` in your terminal. This will create a Node.js environment where we can write and execute JavaScript. You'll see that all that JS knowledge you have learned carries over to Node.js!. Although, some things, specifically browser based API's probably won't work. Go ahead, try an `alert('hello world')` and see what happens. You'll get an error. Although the Node.js runtime uses JS as it's languge, none of the Browser based globals that you are familiar with actually exist in Node.js or they are pollyfilled to prevent runtime errors.

The Node REPL it nice, but you can't build an application with that. We need to be able write our code to a file and tell Node.js to execute that.
> Create a file called:`index.js`

In that file, write some JS. Try out `console.log('hello there')`. To execute this .js file in the Node.js runtime, we can use the `node` command with the file name as an argument.

```
> node index.js
hello there
```

Node.js comes with some practical globals for us to use in our applications.

- `global` Think of this as like `window` but for Node.js. DON'T ABUSE IT!
- `__dirname` This global is a `String` value that points the the directory name of the file it's used in.
- `__filename` Like `__dirname`, it too is relative to the file it's written in. A `String` value that points the the file name.
- `process` A swiss army knife global. An `Object` that contains all the context you need about the current program being executed. Things from env vars, to what machine you're on.
- `exports` `module` `require` These globals are used for creating and exposing modules throughout your app. We'll get to modules in a second

Try out, write console log on file `console.log(process)`.

```sh
> node index.js
process {
  version: 'v17.4.0',
  versions: {
    node: '17.4.0',
    v8: '9.6.180.15-node.13',

    ....

  }
}
```

Depending on what version on Node.js you're running, there are so many more globals. Not as many as the Browser, but enough that you'll probably never use many of them. Check them out [here](https://nodejs.org/api/globals.html).

# Modules

A module is a reusable chunk of code that has its own context. That way modules can't interfere with or polute the global scope.

## Two module types

By default, Node.js uses common js modules. With newer versions of Node.js we can now take advantage of ES6 modules. To opt into using this syntax, you can use the `.mjs` extension instead of `.js`. We'll be using the ES6 module syntax going forward as they are the standard now with browsers adding support now.

### Module syntax

CommonJS modules is what's been the standard for Node.js for quite some time, it's what ships with Node.js, it's the default module syntax for Node.js.

```js
// utils.js
const hello = () => {
  console.log('hello, this is modules');
};

module.exports = hello;
```

```js
// app.js
const hello = require('./utils'); 

hello();
```

```
> node app.js
hello, this is modules
```

But we're gonna use the newer one because that's the future of Node.js, it's the future of the browsers. How do we make it to JavaScript is truly universal across environments?

So with the latest module syntax that's been adopted by the JavaScript ecosystem for quite some time now? And that's gonna be called the ES modules or ECMAScript modules.

ECMAScript modules are [the official standard](https://tc39.es/ecma262/#sec-modules) format to package JavaScript code for reuse. Modules are defined using a variety of [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) statements.

The following example of an ES module export and import function:

```js
// utils.mjs
export const hello = () => {
  console.log('hello, this is modules');
};
```

```js
// app.mjs
import { hello } from "./utils.mjs";

hello();
```

```
> node app.mjs
hello, this is modules
```

### Internal Modules

Node.js comes with some great internal modules. You can think of them as like the phenonminal global APIs in the browser. Here are some of the most useful ones:

- `fs` - useful for interacting with the file system.
- `path` - lib to assit with manipulating file paths and all their nuiances.
- `child_process` - spawn subprocesses in the background.
- `http` - interact with OS level networking. Useful for creating servers.

You can read more about the module syntax on the [Node.js docs](https://nodejs.org/api/packages.html).

# File System

There is no good way to access the file system on a machine with JavaScript, this is due to security limitations in most browsers. With Node.js, one can create, edit, remotely, read, stream & more with files.

## Reading a file

Node.js ships with a powerful module, `fs` short for file system. There are many methods on the [fs module](https://nodejs.org/api/fs.html). To read a file, we'll use the `readFile` method.

Create a simple html file `template.html`.

```html
<!-- template.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>{title}</title>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <p>{body}</p>
</body>
</html>
```

This `html` file will be used as template and has placeholders that we will interpolate later when writing a file.

To read the file:

```js
// index.mjs
import { readFile } from 'fs/promises';

let template = await readFile(new URL('./template.html', import.meta.url), 'utf-8');
```

The `fs` module has import for promise based methods. We'll opt to use those as they have a cleaner API and using async + non-blocking methods are preferred. More on that later. Because we're using `.mjs` files, we don't have access to `__dirname` or `__filename` which is what is normally used in combination with the `path` module to form an appropiate file path for fs. So we have to use the `URL` global that takes a relative path and a base path and will create a URL object that is accepted by `readFile`. If you were to log `template`, you'd see that its just a string. as you wrote in `template.html`

## Write a file

Writing a file is similar to reading a file, except you need some content to place in the file. Let's interpolate the variables inside our template string and write the final html string back to disk.

```js
// index.mjs
import { readFile, writeFile } from 'fs/promises';

let template = await readFile(new URL('./template.html', import.meta.url), 'utf-8');

const data = {
  title: 'My Node.js',
  body: 'I wrote this file to disk using node'
};

for (const [key, val] of Object.entries(data)) {
  template = template.replace(`{${key}}`, val);
};

await writeFile(new URL('./index.html', import.meta.url), template);
```

You should now have a `index.html` file that is the same as the `template.html` file but with the title and body text substituted with the data object properties.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>My Node.js</title>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <p>I wrote this file to disk using node</p>
</body>
</html>
```
