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
    ... 100 more items
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

# Error Handling

So we need some type of way of listening for errors, catching errors, handling errors, and node.js has some pretty good ways to do that. Depending on the type of code (sync, promise, async callback, async await, etc) Node allows us to handle our errors how we see fit.

## Process exiting

To understand the process of node.js. What that is and how that runs. So, when an exception is thrown in node.js or an error, the current process will exit with a code of one fact we might see like this.

```sh
> node errors.mjs
node:internal/process/esm_loader:94
    internalBinding('errors').triggerUncaughtException(
                              ^

[Error: ENOENT: no such file or directory, open '/Users/rezha/Documents/Course/template.html'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/rezha/Documents/Course/template.html'
}
```

When a exception is thrown in Node.js, the current process will exit with a code of `1`. This effectively errors out and stops your programing completely. You can manually do this with:

`process.exit(1)`

Although you shouldn't. This is low level and offers no chance to catch or handle an exception to decide on what to do.

## Async Errors

When dealing with callbacks that are used for async operations, the standard pattern is:

```js
fs.readFile(filePath, (error, result) => {
  if (error) {
    // do something
  } else {
    // yaaay
  }
})
```

```js
import { readFile } from 'fs';

readFile(new URL('./../template.html', import.meta.url), 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
  }else {
    console.log('no errors');
  }
});
```

```sh
> node errors.mjs
[Error: ENOENT: no such file or directory, open '/Users/rezha/Documents/Course/template.html'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/rezha/Documents/Course/template.html'
}
```

Callbacks accept the `(error, result)` argument signature where error could be `null` if there is no error.

For `promises`, you can continue to use the `.catch()` pattern. Nothing new to see here.

For `async / await` you should use `try / catch`.

```js
try {
  const result = await asyncAction()
} catch (e) {
  // handle error
}
```

## Sync Errors

For sync errors, `try / catch` works just fine, just like with async await.

```js
try {
  const result = syncAction()
} catch (e) {
  // handle error
}
```

## Catch All

Finally, if you just can't catch those pesky errors for any reason. Maybe some lib is throwing them and you can't catch them. You can use:

```js
process.on('uncaughtException', cb)
```

# Package
There are millions of node projects ready to be installed and consumed by your application. These projects are called packages. A package can have several modules and other packages. Node.js has built in support for these packages so you can take advantage of them at any time.

To convert our application into a package. We can use a CLI called `npm`. NPM is already installed when you install Node.js, run: `npm init`

```sh
> npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (node.js-intro) app
version: (1.0.0) 
description: 
entry point: (index.js) 
test command: 
git repository: (https://github.com/mwrezha/node.js-intro.git) 
keywords: 
author: 
license: (ISC) 
About to write to /Users/rezha/Documents/Course/node.js-intro/package.json:

{
  "name": "app",
  "version": "1.0.0",
  "description": "## For Windows",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/mwrezha/node.js-intro.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/mwrezha/node.js-intro/issues"
  },
  "homepage": "https://github.com/mwrezha/node.js-intro#readme"
}


Is this OK? (yes) yes

```

This will initialize the new package by walking you through some instructions. Once done, you will have a `package.json` file in the root of your document

Of course we can also do this by writing our own package.json without using the CLI that's really cool, but it's really better to use the npm CLI

There are some important NPM commands ones that you will use repeatedly.

- `npm install` - installs given module(s)
- `npm test` - runs the `test` script in package.json
- `npm uninstall` - will uninstall a give package

For more [several commands](https://docs.npmjs.com/cli/v6/commands)

## Finding and installing packages

Search for the package you need on google or go to the [npm site](https://www.npmjs.com/) and search for what you need

Once you click a package, you can see the documentation from the README.md and any links to Github or website. You can also see the author and the last time it was updated. All of this info is great to help with choosing a package to install. You never know what you're going to get. Once you know the package(s) you want to install. You can install as many packages with one command, you can do so with:

```sh
npm i package1 package2 package3 
```
Lets try with install eslint package
```sh
> npm i eslint

added 83 packages, and audited 84 packages in 17s

13 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

