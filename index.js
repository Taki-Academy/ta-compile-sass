const fs = require('fs');
const path = require('path');
const sass = require('node-sass');

module.exports = function (fileName) {
  var appModules = fs.readdirSync('./app_modules/');

  var globalStylePath = './scss/' + fileName + '.scss';
  var tmpStylePath = './scss/fe_tmpstyle.scss';
  var globalStyle = fs.readFileSync(globalStylePath, 'utf-8');
  fs.writeFileSync(tmpStylePath, globalStyle, 'utf-8');

  appModules.forEach(appModule => {
    var pathToSass = path.resolve('app_modules', appModule, 'scss', fileName + '.scss');
    if (fs.existsSync(pathToSass)) {
      var importLine = '\n@import "' + pathToSass + '";'
      fs.appendFileSync(tmpStylePath, importLine);
    }
  })

  var style = sass.renderSync({
    file: tmpStylePath
  });

  fs.writeFileSync('./public/css/' + fileName + '.css', style.css, 'utf-8');

  fs.unlinkSync(tmpStylePath);
  console.log('Just Compiled ', fileName);
};