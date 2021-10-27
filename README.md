# Welcome to Sol

![Teaser Image](docs/assets/hero.png)

**⚠️ Highly experimental, do not use on important files**

A set of tools rotating around a common goal:
To make those boring daily routines a breeze.

And most importantly: It is based on JavaScript.
So you don't need to learn a real shell™ or any fancy syntax.

It is quick and dirty, just like JS. But it also gets stuff done, just like JS.

In short:
It is a small, interactive **JavaScript shell**.

You can do this:

```js
// Get all TypeScript files in current directory (recursively)
> files('**/*.ts')

// Gather all import statements
> let imports = _.map(f => f.text.match(/(?<=^|\n)import[^;]+;/g) || []).flat()

// Open import list in editor
> imports.map(i => i.replace(/\r?\n/g, ' ')).join('\n').edit()

// Get updated imports (_ is the file opened in editor)
> _.text.trim().split('\n')

// Get import source using abstract syntax tree
> _.map(i => ast(i).program.body[0].source.value)
```

Or this:

```js
// Get todos
> const j = fetch('https://jsonplaceholder.typicode.com/todos').content

// Get all open ToDos
> const open = j.filter(todo => !todo.completed)

// Show all IDs of users with open ToDos using jsonata expression
> open.extract('userId').sort().unique

// Save open ToDos in CSV
> open.csv.saveAs('todos.csv')

// Open CSV file in editor
> _.edit()
```

## Install

To use Sol, you need to have NodeJS >= 12 installed globally.

To setup the shell, you need to run `npm install && npm run build` once.

Symlink the _bin/sol_ (or _bin/sol.js_) file to a location in your path.

## Usage

**Start** the sol shell using `sol` (best to use a dark terminal for it).

Most features of Sol are available as **global variables** (e.g. `play(...)` or `web.get(...)`).
You can use `.globals [filter]` to list and filter the available global functions.

Sol is heavily focused on **chaining things** together and tries to avoid back & forward jumps when writing commands. This is similar to what you know of pipes on many shells (e.g. `ls | grep '.json' | xargs cat`). Sol tries it make as easy as possible to write processing **pipelines**.

So to open a file, interpret as JSON and then extract something, you would use e.g. `file('package.json').json.transform('dependencies').keys`.

You can always **interrupt a pipeline** and execute the command. To resume start with `_` (e.g. `_.join(',')`).

The **final result** of a command / pipeline is printed on the shell (e.g. `['a', 'b'].join(', ')` will show `a, b`).

For longer pipelines it is best to also use **variables** like `let f = files('**/*.ts')` or `let f = _`. This ensures you wont loose a result when switching between pipelines.

Sol also **extends some core types** (like String) for convenience.

Other than NodeJS, Sol is mostly **synchronous**.
So even commands like `fetch(...)` are executed synchrously.

If you want to use a **Promise-based method**, you can make it synchronous by either using `awaitSync(someAsyncFn())` or by using the await helper method `someAsyncFn().await` available on Promises.

Sol is based on the [NodeJS REPL](https://nodejs.org/api/repl.html),
so all REPL features are available.

The most important ones are:

- You can access the **previous command result** using `_`
- It has a command **history** available (stored in _./.sol/history_)
  - You can **search** this history using Control + R (on MacOS)
- You can **autocomplete** using TAB
- To **exit** the shell either enter `.exit` or press Control + C twice

### Workspaces

Sol is based around the concept of **workspaces**.
By default a _.sol_ subdirectory in the current working directory is used as workspace.

This workspace contains a setup file (_.sol/setup.ts_) as well as workspace specific extensions (_.sol/extensions/_).

In addition to the workspace, there is also a global config directory in your home directory (_~/.sol_). This directory is intended for global things which are shared across workspaces.

### Play / Edit

To also allow the use of an **IDE** for composing Sol scripts, you can use the `play('somename')` command.

This opens a new or existing play file (located in your workspace directory) in your IDE.
In this file you can use the same globals you also use on the sell itself.

Whenever you **save** this file, Sol will **automatically execute** it.
Keep this in mind when using an editor with auto-save. Best to disable that feature for Sol.

Besides that you can also open a file for editing using the `edit('somefile')` command.
With that command the file will only be opened but not watched.

Edit is also often avaiable in wrappers (e.g. `file('somefile').edit()`).

By default play tries the _code_ command (typically VSCode) on the command line,
but you can also set the _SOL_EDITOR_ environment variable to another editor of your choice.

![Teaser Image](docs/assets/play.png)

### Extensions

Extensions are **additional features** that can be loaded into Sol.
In the end they are just **JavaScript files** which are directly loaded by Sol.

They are **enabled** using your workspace or user setup file.

**Important:** As all extensions have full access to the NodeJS environment,
be careful when using third-party extensions not provided by you or Sol.
So only load extensions which you fully trust. Treat them as you would NPM packages.

Every extension must contain a root **setup file** (e.g. _extensions/some-extension/setup.ts_),
which is called when the extension is loaded. In addition it also contains a **globals file**
(_extensions/some-extension/globals.ts_) that includes globals added by this extension.

To avoid integration / reload issues you should **not** add globals directly.

The **directory name** of the extension is also used as **extension name**.
It must be unique in the lookup chain, but you can reuse the same name in different workspaces.

Sol looks for extensions in the following locations:

- Workspace: _./.sol/extensions/_
- Home: _~/.sol/extensions/_

To load an extension, just add a `extension('your-extension', __dirname).load()` call to your setup file.
To quickly open the right setup file, you can use `workspace.setupFile.edit()`.

To create a new extension, you can use `workspaceExtension('your-extension').edit()` to create a new workspace extension
or `userExtension('your-extension').edit()` to create a new user level extension.

After the creation you still need to load the extension as described above.

## Development

### Install

To get started simply run `npm install`.

### Building

The project can be rebuilt using `npm run build` (or `npm run build:watch`).

You can also update it from within the Sol CLI using `.rebuild`.

To do a full update of Sol from GitHub, you can use `.update`.
