// Data arrays (CARS, PKGS, REVIEWS, FAQ, I18N) currently live alongside the
// legacy DOM-init code in src/lib/siteInit.js to preserve behavior 1:1.
// To migrate them out, copy the `var CARS = [...]`, `var PKGS = [...]`,
// `var REVIEWS = [...]`, `var FAQ = [...]`, and `var I18N = {...}` blocks
// from siteInit.js into this file as `export const ...` and import them
// where needed.
export {};
