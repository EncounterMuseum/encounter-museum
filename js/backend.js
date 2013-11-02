
angular.module('encounter')
.factory('net', function(cache, parse, $http, $q) {
  return {
    fetchTradition: function(tradition) {
      var cached = cache.get(tradition);
      if (cached) {
        return cached;
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
  // - description: string. The top-level description of the tradition.
  // - artifacts: Array of objects. Each object is the key-value pairs from the artifact, plus description.
  //   - title: string. The name of the artifact.
  //   - images: Array.<string>. The paths to the images, relative to /assets/:tradition/
  //   - description: string (Markdown, to be parsed on display).
  //   - Others are optional.
  // - images: Array of objects, with:
  //   - image: Path, relative as above.
  //   - artifact: index into the above artifacts array.

  return function(text) {
    var lines = text.split('\n');
    var obj = {};

    var breakRegex = /^---\s*$/;
    var keyValueRegex = /^\s*([^:\s]+)\s*:\s*(.*?)\s*$/;
    var listRegex = /^\s*\[([^\]]*?)\s*\]\s*$/;

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

    while(iBottom >= 0) {
      iTop = iBottom + 1;
      iBottom = nextBreak(iTop);

      var art = {};

      // Read the front-matter.
      for(var i = iTop; i < iBottom; i++) {
        var m = lines[i].match(keyValueRegex);
        if(m) {
          if (m[1] == 'images') {
            var list = m[2].match(listRegex);
            if (list && list[1]) {
              art.images = list[1].split(',').map(function(x) {
                var y = x.trim();
                var m = y.match(/^"([^"]+)"$/);
                return m[1];
              });
            }
          } else if(m[1] && m[2]) {
            art[m[1]] = m[2];
          }
        }
      }

      // Now read the description.
      iTop = iBottom + 1;
      iBottom = nextBreak(iTop);
      art.description = markdown(lines.slice(iTop, iBottom).join('\n').trim());

      if (art.images && art.images.length) {
        var index = obj.artifacts.length;
        obj.artifacts.push(art);
        for(var i = 0; i < art.images.length; i++) {
          obj.images.push({
            image: art.images[i],
            artifact: index
          });
        }
      } else {
        console.warn('Artifact without images', art);
      }
    }

    return obj;
  };
});

