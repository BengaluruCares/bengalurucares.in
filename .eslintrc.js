const commonExtensions = [
  "eslint:recommended",
  "plugin:react/recommended",
  "prettier",
];

const commonPlugins = ["react", "prettier"];

const commonRules = {
  "prettier/prettier": "error",
  "no-restricted-imports": [
    "error",
    {
      paths: [{
          name: "react",
          importNames: ["default"],
          message: "React is globally imported to support new JSX transform"
      }],
    }
  ],
  "react/display-name": 0,
  "react/prop-types": 0,
  "react/react-in-jsx-scope": 0,
  "react/jsx-no-undef": 0,
  "no-console": 2,
  "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],
};

module.exports = {
  extends: commonExtensions,
  plugins: commonPlugins,
  env: {
    browser: true,
    node: false,
    es6: true,
  },
  overrides: [
    {
      files: ["**/*.test.js", "**/*.test.ts"],
      env: {
        jest: true,
      },
      plugins: ["jest"],
    },
    {
      files: ["src/**/*.ts", "src/**/*.tsx"],
      extends: [...commonExtensions, "plugin:@typescript-eslint/recommended"],
      plugins: [...commonPlugins, "@typescript-eslint"],
      rules: {
        ...commonRules,
        "@typescript-eslint/camelcase": 0,
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/explicit-module-boundary-types": [
          1,
          {
            allowArgumentsExplicitlyTypedAsAny: true,
          },
        ],
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/ban-ts-comment": 0,
      },
    },
  ],
  rules: commonRules,
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  parser: "@typescript-eslint/parser",
};
