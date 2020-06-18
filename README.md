# Sol

A set of tools rotating around a common goal.
To make those boring daily routines a breaze.

Or on other words:
It is a JavaScript shell for people too lazy to learn a real shell. 😂

## Usage

Start the sol shell. It is based on the [Node.js REPL](https://nodejs.org/api/repl.html), so all features like history and autocomplete are available.

### Storage

To interact with files on your devices, you can start with one of the following functions:

```js
file('package.json'); // References a single file 'package.json' in the working directory
files('**/*.ts'); // References all TypeScript files in the working directory
dir('src'); // References a single directory 'src' in the working directory
dirs('*'); // References all sub directories in the working directory
glob('*'); // References all items in the working directory
```

## Development

### Install

To get started simply run `npm install`.

### Building

The project can be updated using `npm run build` (or `npm run build:watch`).
