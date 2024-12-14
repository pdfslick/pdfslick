const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Create a unique temporary file path
const tempFile = path.join(os.tmpdir(), `combined-${Date.now()}.css`);

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Combine the files
const pdfCss = fs.readFileSync('../../node_modules/pdfjs-dist/web/pdf_viewer.css');
const customCss = fs.readFileSync('styles/pdf_viewer.css');

fs.writeFileSync(tempFile, pdfCss + customCss);

// Get arguments passed through npm
const args = process.argv.slice(2);

// Path to local postcss executable with correct node_modules path
const postcssPath = path.resolve(__dirname, '../../node_modules/.bin/postcss');

// Run postcss with all passed arguments and enable verbose output
const postcss = spawn(postcssPath, [
  tempFile,
  '--config', 
  './postcss.config.cjs',
  '--output',
  'dist/pdf_viewer.css',
  '--verbose',
  ...args
], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// Clean up temp file only when the process exits (not in watch mode)
if (!args.includes('--watch')) {
  postcss.on('exit', (code) => {
    fs.unlinkSync(tempFile);
    if (code !== 0) {
      process.exit(code);
    }
  });
}

// Handle process termination
process.on('SIGINT', () => {
  if (!args.includes('--watch')) {
    fs.unlinkSync(tempFile);
  }
  process.exit();
});