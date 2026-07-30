import withSolid from "rollup-preset-solid";

/** @type {import('rollup').RollupOptions} */
const config = withSolid({ targets: ["cjs", "esm"] });

export default config;
