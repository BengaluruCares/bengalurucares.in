/* eslint-disable no-undef */
const { breakpoints } = require("./variables");

/**
 * These will be used by `postcss-env-function`
 * plugin, to support CSS `env()` specs
 */
module.exports = {
  environmentVariables: {
    /* Breakpoints */
    "--breakpoint-xs": `${breakpoints.xs}px`,
    "--breakpoint-sm": `${breakpoints.sm}px`,
    "--breakpoint-md": `${breakpoints.md}px`,
    "--breakpoint-lg": `${breakpoints.lg}px`,
    "--breakpoint-xl": `${breakpoints.xl}px`,
  },
};
