import path from "path";
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

const srcPath = path.resolve(__dirname, "./src");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: [
      {
        find: /^@src\/(.*)/,
        replacement: `${srcPath}/$1`,
      },
    ],
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  }
});
