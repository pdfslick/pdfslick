const { globSync: tinyGlobSync } = require("tinyglobby");
const { isAbsolute } = require("node:path");

// Next's lint plugin uses only globSync(pattern, { onlyDirectories: true }).
// Keep fast-glob's literal-directory behavior; tinyglobby expands them by default.
function globSync(patterns, options = {}) {
  const inputs = Array.isArray(patterns) ? patterns : [patterns];
  const absolute =
    options.absolute || inputs.every((input) => isAbsolute(input));
  return tinyGlobSync(patterns, {
    ...options,
    absolute,
    expandDirectories: false,
  }).map((entry) => {
    // fast-glob omits directory trailing slashes and preserves leading "./".
    const path = entry.replace(/\/$/, "") || "/";
    return !absolute && inputs.every((input) => input.startsWith("./"))
      ? `./${path}`
      : path;
  });
}

module.exports = { globSync };
