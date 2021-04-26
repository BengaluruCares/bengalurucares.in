# Structure

All source files should reside under `/src` directory

We want things to be as static as possible, unless there is
a growing demand for dynamic data.

All required data should be either of formats:
- `*.json`
- `.md` / `.mdx`

and should reside under `/data` direcrory.

`/data` directory consists of JSON files, either
subdivided into sections, with `metadata.json` file,
which will help our program to fetch details in async
in order.

For example, all `Wards` related data for any region should
reside under:

```sh
/data
└── wards
   ├── 001.json
   └── metadata.json
```

Format of `metadata.json` is predefined and thus creating any
new data section, run: `./scripts/create wards`

# Tech Stack

## TLDR; Required command line tools

- [nodejs](https://nodejs.org/)
  - Required for transpilation and stuff.
- [yarn](https://yarnpkg.com/)

This project is using [vitejs](https://vitejs.dev) for
transpilation of our `ReactJS` project.

We support `Typescript` and `Javascript` contributions alike.
To use plain Javascript, create `.jsx?` files, else `.tsx?`
files.

This project supports Plain `CSS` and some `PostCSS` modules.
Support for `SASS` or `LESS` pre-processors is not appreciated,
as they are slow and adds an overhead. `CSS` has reached
close to `SASS` now, and the basic needs like `variables`,
`calc` etc. are already present in `CSS`.
PostCSS allows you to be close to `CSS` that browsers
support natively.

There is no good PostCSS plugin for VSCode as of now,
so this project enables `SCSS Language mode` for your `CSS`
files.

~~Use [linaria](https://github.com/callstack/linaria)~~
~~for `css-in-js`.~~

`linaria` does not has any runtime, thus `vite` fails to work with it.
For now, no `css-in-js` support is present in this project.


***Do not include any heavy weight libraries, which increases***
***bundle size to a huge extent :pray:***
