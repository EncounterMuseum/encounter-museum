
var et = require('elementtree'),
    fs = require('fs');

var xml = et.parse(fs.readFileSync('item list 2.xml').toString());
var table = [];

xml.findall('page').forEach(function(page) {
  page.findall('body').forEach(function(body) {
    body.findall('tab').forEach(function(tab) {
      tab.findall('row').forEach(function(row) {
        var keys = ['number', 'name', 'description', 'tradition'];
        var obj = {};
        row.findall('cell').forEach(function(cell, index) {
          var text = '';
          cell.findall('txt').forEach(function(txt) {
            text += txt.text.trim();
            txt._children.forEach(function(content) {
              text += '\n' + content.tail.trim();
            });
          });
          obj[keys[index]] = text.trim();
        });
        table.push(obj);
      });
    });
  });
});


//var traditions = {};
var traditions = {
  abo: { slug: 'aboriginal', trad: 'Aboriginal' },
  anc: { slug: 'ancient_cultures', trad: 'Ancient Cultures' },
  ant: { slug: 'ancient_cultures', trad: 'Ancient Cultures' },
  antcul: { slug: 'ancient_cultures', trad: 'Ancient Cultures' },
  bah: { slug: 'bahai', trad: 'Baha\'i' },
  bud: { slug: 'buddhism', trad: 'Buddhism' },
  chr: { slug: 'christianity', trad: 'Christianity' },
  con: { slug: 'confuscianism', trad: 'Confuscianism' },
  dao: { slug: 'daoism', trad: 'Daoism' },
  fun: { slug: 'fun', trad: 'Just for Fun' },
  hin: { slug: 'hinduism', trad: 'Hinduism' },
  isl: { slug: 'islam', trad: 'Islam' },
  jai: { slug: 'jainism', trad: 'Jainism' },
  jud: { slug: 'judaism', trad: 'Judaism' },
  lds: { slug: 'mormonism', trad: 'Mormonism' },
  man: { slug: 'mandaeans', trad: 'Mandaeans' },
  mis: { slug: 'misc', trad: 'Miscellaneous' },
  mor: { slug: 'mormonism', trad: 'Mormonism' },
  ras: { slug: 'rastafari', trad: 'Rastafari' },
  sci: { slug: 'scientology', trad: 'Scientology' },
  shi: { slug: 'shinto', trad: 'Shinto' },
  sik: { slug: 'sikh', trad: 'Sikh' },
  uu:  { slug: 'unitarian', trad: 'Unitarian' },
  wic: { slug: 'wicca', trad: 'Wicca' },
  zor: { slug: 'zoroastrian', trad: 'Zoroastrian' }
};


table.forEach(function(art) {
  console.log(art.name);
  var trad = art.name.match(/^\s*(\S+)\s*([^\.\s]+)\.(\S+)\.doc/);
  if (trad) {
    console.log(trad);
    art.name = trad[1];
    var slug = trad[2].toLowerCase();
    console.log('slug', slug);
    art.slug = traditions[slug].slug;
    art.tradition = traditions[slug].trad;
    art.basename = trad[3].toLowerCase();
  }
});
table = table.filter(function(art) { return art.slug; });

console.log(table);

