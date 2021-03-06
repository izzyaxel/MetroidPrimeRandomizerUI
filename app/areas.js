'use strict';

const fs = require('fs');
const utils = require('./utils');

let files = fs.readdirSync('./app/areas/');
let dgrpLookup = new Map();

files.forEach(file => {
  let src = fs.readFileSync(`./app/areas/${file}`, {encoding: 'UTF-8'});
  let json = JSON.parse(src);

  json.forEach((area, i) => {
    function handleDep(dep) {
      let humanName = utils.getNameOfFile(dep);
      let areas = dgrpLookup.get(humanName);
      if (areas == null || areas == undefined) {
        areas = [];
        dgrpLookup.set(humanName, areas);
      }
      areas.push({
        num: i,
        id: area.header.id,
        mrea: utils.padId(area.header.MREA.toLowerCase().substr(2))
      });
    }

    area.dependencies1.dependencies.forEach(handleDep);
    area.dependencies2.dependencies.forEach(handleDep);
  })
});

console.log(`Loaded reverse-deps for ${dgrpLookup.size} files`);

module.exports = {
  dgrpLookup: dgrpLookup
};
