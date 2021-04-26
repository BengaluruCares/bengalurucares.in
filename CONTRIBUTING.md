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
To use plain Javascript, create `.jsx?` files, else `.tsx`
files.
Since our project has linter attached to it, to get rid of
typescript linting in `.jsx?` files, add `// @ts-ignore`
as first line in your file.

No use of `Sass` or `Less` is appreciated. Either use
plain old CSS, with PostCSS modules, or use [linaria](https://github.com/callstack/linaria)
for `css-in-js`.


***Do not include any heavy weight libraries, which increases***
***bundle size to a huge extent :pray:***
