module.exports = {
  plugins: [
    require("postcss-nested"),
    require("postcss-env-function")({
      importFrom: [
        "src/css-env-vars/vars.js",
      ]
    }),
    require("autoprefixer"),
  ],
};
