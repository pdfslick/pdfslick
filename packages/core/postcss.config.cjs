const path = require('path');

module.exports = {
  plugins: [
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
