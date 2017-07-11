var fs = require('fs');
var rollup = require('rollup');
var uglify = require('uglify-js');
var buble = require('rollup-plugin-buble');
var string = require('rollup-plugin-string');
var package = require('./package.json');
var version = process.env.VERSION || package.version;
var banner =
    "/*!\n" +
    " * vue-form v" + version + "\n" +
    " * Released under the MIT License.\n" +
    " */\n";

rollup.rollup({
  entry: 'src/index.js',
  plugins: [string({ include: 'src/**/*.html' }), buble()]
})
.then(bundle =>
  bundle.generate({
    format: 'umd',
    banner: banner,
    moduleName: 'VueForm'
  }).then(({code}) => write('dist/vue-form.js', code, bundle))
)
.then(bundle =>
  write('dist/vue-form.min.js', banner + '\n' +
    uglify.minify(read('dist/vue-form.js')).code,
  bundle)
)
.then(bundle =>
  bundle.generate({
    format: 'cjs',
    banner: banner
  }).then(({code}) => write('dist/vue-form.common.js', code, bundle))
)
.catch(logError);

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function write(dest, code, bundle) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, code, err => {
      if (err) return reject(err);
      console.log(blue(dest) + ' ' + getSize(code));
      resolve(bundle);
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError(e) {
  console.log(e);
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
