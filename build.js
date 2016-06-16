var fs = require('fs');
var rollup = require('rollup');
var uglify = require('uglify-js');
var babel = require('rollup-plugin-babel');
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
  plugins: [
    string({ include: 'src/**/*.html' }),
    babel({ presets: ['es2015-rollup'], plugins: ['transform-object-assign'] })
  ]
})
.then(function (bundle) {
  return write('dist/vue-form.js', bundle.generate({
    format: 'umd',
    banner: banner,
    moduleName: 'VueForm'
  }).code, bundle);
})
.then(function (bundle) {
  return write('dist/vue-form.min.js',
    banner + '\n' + uglify.minify('dist/vue-form.js').code,
  bundle);
})
.then(function (bundle) {
  return write('dist/vue-form.common.js', bundle.generate({
    format: 'cjs',
    banner: banner
  }).code, bundle);
})
.catch(logError);

function write(dest, code, bundle) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
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
