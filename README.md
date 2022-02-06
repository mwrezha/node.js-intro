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
```
> node index.js
process {
  version: 'v17.4.0',
  versions: {
    node: '17.4.0',
    v8: '9.6.180.15-node.13',

    ....

```

Depending on what version on Node.js you're running, there are so many more globals. Not as many as the Browser, but enough that you'll probably never use many of them. Check them out [here](https://nodejs.org/api/globals.html).
