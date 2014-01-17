
angular.module('encounter')
.factory('net', function(cache, parse, $http, $q) {
  return {
    fetchTradition: function(tradition) {
      var cached = cache.get(tradition);
      if (cached) {
        return $q.when(cached);
      } else {
        var d = $q.defer();
        $http({
          method: 'GET',
          url: '/traditions/' + tradition + '.md',
          responseType: 'text'
        }).success(function(data, status) {
          var parsed = parse(data);
          cache.put(tradition, parsed);
          d.resolve(parsed);
        }).error(function(data, status) {
          // Yes, resolve.
          d.resolve({ description: 'Failed to retrieve content for ' + tradition });
        });

        return d.promise;
      }
    }
  };
})

.factory('cache', function() {
  var content = {};
  return {
    get: function(key) {
      return content[key];
    },
    put: function(key, val) {
      content[key] = val;
    }
  };
})

.factory('markdown', function($window, $sce) {
  var converter = new $window.Showdown.converter();
  return function(text) {
    return text && $sce.trustAsHtml(converter.makeHtml(text));
  };
})

.factory('parse', function(markdown) {
  // Responsible for reading the file format. The format is as follows:
  // - Markdown description of the tradition.
  // - 0 or more artifact blocks, which have the form:
  //   - A line of ---
  //   - key: value front-matter, including lists as [ foo, bar, baz ]. No quotes.
  //     - Known keys: title, size, date, images (list)
  //   - A line of ---
  //   - Markdown description of the artifact.
  //
  // Returns an object with:
  // - description: HTML. The top-level description of the tradition.
  // - artifacts: Array of objects. Each object is the key-value pairs from the artifact, plus description.
  //   - title: string. The name of the artifact.
  //   - images: Array.<string>. The paths to the images, relative to /assets/:tradition/
  //   - description: string (Markdown, to be parsed on display).
  //   - descriptionHTML: HTML (cache of above)
  //   - Others are optional.
  // - images: Array of objects, with:
  //   - image: Path, relative as above.
  //   - artifact: index into the above artifacts array.

  return function(text) {
    var startTime = performance.now();
    var slugTotal = 0;
    var lines = text.split('\n');
    var obj = {};

    var breakRegex = /^---\s*$/;
    var keyValueRegex = /^\s*([^:\s]+)\s*:\s*(.*?)\s*$/;
    var listRegex = /^\s*\[([^\]]*?)\s*\]\s*$/;
    var imageRegex = /^"([^"]+)"$/;

    var legalChars = "abcdefghijklmnopqrstuvwxyz- ";

    var descTotal = 0;
    var imagesTotal = 0;
    var innerTotal = 0;
    var fmTotal = 0;

    function nextBreak(from) {
      for (var i = from; i < lines.length; i++) {
        if (breakRegex.test(lines[i])) return i;
      }
      return -1;
    }

    var iTop = 0;
    var iBottom = nextBreak(0);

    obj.description = markdown(lines.slice(iTop, iBottom).join('\n'));

    obj.artifacts = [];
    obj.images = [];
    obj.slugMap = {};

    while(iBottom >= 0) {
      iTop = iBottom + 1;
      iBottom = nextBreak(iTop);

      var art = {};

      // Read the front-matter.
      var fmStart = performance.now();
      for(var i = iTop; i < iBottom; i++) {
        var m = lines[i].match(keyValueRegex);
        if(m) {
          if (m[1] == 'images') {
            var list = m[2].match(listRegex);
            if (list && list[1]) {
              art.images = list[1].split(',').map(function(x) {
                var y = x.trim();
                var m = y.match(imageRegex);
                return m[1];
              });
            }
          } else if(m[1] && m[2]) {
            art[m[1]] = m[2];
          }
        }
      }
      fmTotal += performance.now() - fmStart;

      // Now read the description.
      iTop = iBottom + 1;
      iBottom = nextBreak(iTop);
      var start = performance.now();
      art.description = lines.slice(iTop, iBottom).join('\n').trim();
      descTotal += performance.now() - start;

      // Convert the name into a slug that can be used in the URL bar.
      // Drop everything but letters and spaces from the name.
      var slugTime = performance.now();
      art.slug = art.title.toLowerCase().trim().split('').filter(function(c) {
        return legalChars.indexOf(c) >= 0;
      }).map(function(c) {
        return c == ' ' ? '-' : c;
      }).join('');

      if (!obj.slugMap[art.slug]) {
        // obj.slugMap['foo'] points at the globalIndex of the first image of that artifact.
        obj.slugMap[art.slug] = obj.images.length;
      }
      slugTotal += performance.now() - slugTime;

      start = performance.now();
      if (art.images && art.images.length) {
        var index = obj.artifacts.length;

        obj.artifacts.push(art);
        for(var i = 0; i < art.images.length; i++) {
          var inner = performance.now();
          obj.images.push({
            image: art.images[i],
            artifact: index
          });
          innerTotal += performance.now() - inner;
        }
      } else {
        console.warn('Artifact without images', art);
      }
      imagesTotal += performance.now() - start;

    }

    var deltaTime = performance.now() - startTime;
    console.log('Parse time: ' + deltaTime);
    console.log('Slug time: ' + slugTotal);
    console.log('Description time: ' + descTotal);
    console.log('Images time: ' + imagesTotal);
    console.log('Inner time: ' + innerTotal);
    console.log('Front-matter time: ' + fmTotal);
    return obj;
  };
});

