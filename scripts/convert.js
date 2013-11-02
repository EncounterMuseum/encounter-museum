
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
  abo: { slug: 'aboriginal', tradition: 'Aboriginal', trad: 'abo' },
  anc: { slug: 'ancient_cultures', tradition: 'Ancient Cultures', trad: 'anc' },
  ant: { slug: 'ancient_cultures', tradition: 'Ancient Cultures', trad: 'anc' },
  antcul: { slug: 'ancient_cultures', tradition: 'Ancient Cultures', trad: 'anc' },
  bah: { slug: 'bahai', tradition: 'Baha\'i', trad: 'bah' },
  bud: { slug: 'buddhism', tradition: 'Buddhism', trad: 'bud' },
  chr: { slug: 'christianity', tradition: 'Christianity', trad: 'chr' },
  con: { slug: 'confuscianism', tradition: 'Confuscianism', trad: 'con' },
  dao: { slug: 'daoism', tradition: 'Daoism', trad: 'dao' },
  fun: { slug: 'fun', tradition: 'Just for Fun', trad: 'fun' },
  hin: { slug: 'hinduism', tradition: 'Hinduism', trad: 'hin' },
  isl: { slug: 'islam', tradition: 'Islam', trad: 'isl' },
  jai: { slug: 'jainism', tradition: 'Jainism', trad: 'jai' },
  jud: { slug: 'judaism', tradition: 'Judaism', trad: 'jud' },
  lds: { slug: 'mormonism', tradition: 'Mormonism', trad: 'mor' },
  man: { slug: 'mandaeans', tradition: 'Mandaeans', trad: 'man' },
  mis: { slug: 'misc', tradition: 'Miscellaneous', trad: 'mis' },
  mor: { slug: 'mormonism', tradition: 'Mormonism', trad: 'mor' },
  ras: { slug: 'rastafari', tradition: 'Rastafari', trad: 'ras' },
  sci: { slug: 'scientology', tradition: 'Scientology', trad: 'sci' },
  shi: { slug: 'shinto', tradition: 'Shinto', trad: 'shi' },
  sik: { slug: 'sikh', tradition: 'Sikh', trad: 'sik' },
  uu:  { slug: 'unitarian', tradition: 'Unitarian', trad: 'uu' },
  wic: { slug: 'wicca', tradition: 'Wicca', trad: 'wic' },
  zor: { slug: 'zoroastrian', tradition: 'Zoroastrian', trad: 'zor' }
};


table.forEach(function(art) {
  var trad = art.name.match(/^\s*([\s\S]*?)\s*(\w+)\.([\w\-\.]+)\.(?:doc|com)\s*$/);
  if (trad) {
    art.name = trad[1];
    var slug = trad[2].toLowerCase();
    art.trad = traditions[slug].trad; // Short tradition name.
    art.slug = traditions[slug].slug;
    art.tradition = traditions[art.trad].tradition; // Long tradition name.
    art.basename = trad[3].toLowerCase();
    delete art.number;
  } else {
    art.slug = 'broken';
  }
});

var imageFiles = fs.readdirSync('../assets');

['abo', 'anc', 'bah', 'bud', 'chr', 'con', 'dao', 'fun', 'hin', 'isl', 'jai', 'jud', 'lds', 'man', 'mis', 'ras', 'sci', 'shi', 'sik', 'uu', 'wic', 'zor'].forEach(function(t) {
  var trad = traditions[t];
  var artifacts = table.filter(function(x) { return x.slug == trad.slug; });

  var out = 'Top-level description of ' + trad.slug + '\n\n';

  artifacts.forEach(function(x) {
    out += '---\n';
    out += 'title: ' + x.name.replace('\n', ' ').split('\s+').join(' ') + '\n';

    var images = imageFiles.filter(function(i) {
      return i.indexOf(x.trad) == 0 && i.indexOf(x.basename) >= 0;
    });

    if (images.length) {
      out += 'images: ["' + images.join('","') + '"]\n';
    } else {
      console.error('No images found!', x.name, x.basename, x.trad);
    }

    out += 'size:\n';
    out += '---\n';
    out += x.description + '\n\n\n';
  });

  fs.writeFileSync(trad.slug + '.json', out, 'utf-8');
});

console.log(table.filter(function(x) { return x.slug == 'broken'; }));

