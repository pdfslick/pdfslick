const path = require('path');

/**
 * pdf.js's stylesheet — concatenated verbatim into this package's CSS by the
 * `css` script — declares `color-scheme: light dark` on `:root`. That is right
 * for the pdf.js viewer, which is a whole page of its own, but this file is
 * loaded into someone else's app, where it applies to the host document: every
 * native control, form field and scrollbar in that app then follows the OS
 * preference, whatever colour scheme the app itself uses. A consuming app can't
 * easily undo it either, since it lands on `:root` too and this stylesheet is
 * typically injected after the app's own.
 *
 * Drop just that declaration — the rest of the `:root` block declares viewer
 * variables and has to stay — so the host document keeps control of its own
 * scheme. The viewer's appearance is unaffected: `styles/pdf_viewer.css` sets
 * `color-scheme: light` on `.pdfSlick`, and the layers that need it (text,
 * annotation, XFA) declare their own.
 */
const stripRootColorScheme = () => ({
    postcssPlugin: 'pdfslick-strip-root-color-scheme',
    Once(root) {
        root.walkRules((rule) => {
            if (!rule.selectors.some((selector) => selector.trim() === ':root')) {
                return;
            }

            rule.walkDecls('color-scheme', (decl) => decl.remove());
        });
    },
});

module.exports = {
    plugins: [
        stripRootColorScheme(),
        require('autoprefixer'),
        require('postcss-url')({
            url: 'inline',
            basePath: path.resolve(__dirname, '../../node_modules/pdfjs-dist/web/'),
            maxSize: 100, // in kbs - increase if needed
            fallback: 'copy'
        }),
        require('postcss-inline-svg')({
            paths: [
                path.resolve(__dirname, '../../node_modules/pdfjs-dist/web/images/'),
            ]
        })
    ],
};
