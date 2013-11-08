
angular.module('encounter', ['ngRoute']).config(function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.when('/', {
    controller:  'main',
    templateUrl: 'views/main.html'
  }).when('/gallery', {
    controller: 'gallery',
    templateUrl: 'views/gallery.html'
  }).when('/tradition/:tradition', {
    controller: 'tradition',
    templateUrl: 'views/tradition.html',
    reloadOnSearch: false
  }).otherwise({
    redirectTo: '/'
  });
})
.run(function($rootScope) {
  // NB: These are in reverse order.
  $rootScope.menu = [
    { slug: 'home',      name: 'Home',      link: '#!/' },
    { slug: 'gallery',   name: 'Galleries', link: '#!/gallery' },
    { slug: 'contact',   name: 'Contact',   link: '#!/contact' },
    { slug: 'encounter', name: 'Encounter', link: 'http://encounterworldreligions.com' }
  ];
  $rootScope.menuSelected = 'home';
})

.controller('main', function($rootScope) {
  $rootScope.menuSelected = 'home';
  $rootScope.title = 'Encounter World Religions Museum';
})

.controller('tradition', function($rootScope, $scope, $routeParams, $location, traditions, net) {
  $rootScope.menuSelected = 'gallery';
  $scope.tradition = traditions[$routeParams.tradition];
  net.fetchTradition($scope.tradition.slug).then(function(res) {
    $scope.content = res;

    var hash = $location.hash();
    if (hash) {
      var index = $scope.content.slugMap[hash];
      if (index >= 0 && $scope.content.artifacts[$scope.content.images[$scope.globalIndex].artifact].slug != hash) {
        $scope.globalIndex = index;
        $scope.index = index % $scope.entryLimit;
        $scope.page = Math.floor(index / $scope.entryLimit);
        update($scope.globalIndex);
      } else {
        update(index);
      }
    } else {
      update(0);
    }
    $rootScope.title = $scope.content.title;
  });

  $scope.index = 0; // The index within the current page.
  $scope.page = 0;  // The current page of the filmstrip.
  $scope.globalIndex = 0;
  $scope.entryLimit = 5;

  function update(nu) {
    if ($scope.content && $scope.content.artifacts && $scope.content.artifacts.length) {
      $scope.artifact = $scope.content.artifacts[$scope.content.images[nu].artifact];
      $scope.artifact.image = '/assets/' + $scope.content.images[nu].image;
      $scope.artifact.bigImage = '/assets/big/' + $scope.content.images[nu].image;
      $location.hash($scope.content.artifacts[$scope.content.images[$scope.globalIndex].artifact].slug);
    }
  }

  $scope.$watch('globalIndex', update);

  $scope.change = function(index) {
    $scope.index = index;
    $scope.globalIndex = $scope.page * $scope.entryLimit + index;
  };

  $scope.prev = function() {
    $scope.page = Math.max(0, $scope.page-1);
    $scope.index = $scope.entryLimit - 1;
    $scope.globalIndex = Math.min(($scope.page+1) * $scope.entryLimit - 1, $scope.content.images.length);
  };

  $scope.next = function() {
    $scope.page = Math.min(Math.floor($scope.content.images.length / $scope.entryLimit), $scope.page+1);
    $scope.index = 0;
    $scope.globalIndex = $scope.page * $scope.entryLimit;
  };
})

.controller('gallery', function($rootScope, $scope, traditions) {
  $rootScope.menuSelected = 'gallery';
  $scope.traditions = traditions;
})

.controller('contact', function($rootScope) {
  $rootScope.menuSelected = 'contact';
})

.factory('traditions', function() {
  return {
    aboriginal:       { slug: 'aboriginal', name: 'Aboriginal' },
    ancient_cultures: { slug: 'ancient_cultures', name: 'Ancient Cultures' },
    bahai:            { slug: 'bahai', name: 'Baha\'i' },
    buddhism:         { slug: 'buddhism', name: 'Buddhism' },
    christianity:     { slug: 'christianity', name: 'Christianity' },
    confuscianism:    { slug: 'confuscianism', name: 'Confuscianism' },
    daoism:           { slug: 'daoism', name: 'Daoism' },
    hinduism:         { slug: 'hinduism', name: 'Hinduism' },
    islam:            { slug: 'islam', name: 'Islam' },
    jainism:          { slug: 'jainism', name: 'Jainism' },
    judaism:          { slug: 'judaism', name: 'Judaism' },
    justforfun:       { slug: 'justforfun', name: 'Just for Fun' },
    mormonism:        { slug: 'mormonism', name: 'Mormonism' },
    mandaeans:        { slug: 'mandaeans', name: 'Mandaeans' },
    misc:             { slug: 'misc', name: 'Miscellaneous' },
    rastafari:        { slug: 'rastafari', name: 'Rastafari' },
    scientology:      { slug: 'scientology', name: 'Scientology' },
    shinto:           { slug: 'shinto', name: 'Shinto' },
    sikh:             { slug: 'sikh', name: 'Sikh' },
    unitarian:        { slug: 'unitarian', name: 'Unitarian' },
    wicca:            { slug: 'wicca', name: 'Wicca' },
    zoroastrian:      { slug: 'zoroastrian', name: 'Zoroastrian' }
  };
})

.filter('startFrom', function() {
  return function(input, by) {
    return input && input.slice(by);
  };
})

// If modifying this, modify the CSS as well.
.constant('magnifier', {
  width: 450,
  height: 400
})

.directive('encMagnifier', function($document, magnifier) {
  return {
    scope: false,
    link: function(scope, elem, attrs) {
      var enable = false;

      var magnified = document.getElementById('magnified');

      function update(event) {
        if(!enable) return;
        // We need to check the total size of the big image in the magnifier.
        var relX = event.offsetX / elem[0].width;
        var relY = event.offsetY / elem[0].height;
        scope.magnify = {
          style: {
            position: 'absolute',
            top: '-' + (magnified.height * relY - magnifier.height/2) + 'px',
            left: '-' + (magnified.width * relX - magnifier.width/2) + 'px'
          }
        };
        scope.$apply();
      }

      elem.on('mouseenter', function(event) {
        enable = true;
      });
      elem.on('mousemove', update);
      elem.on('mouseleave', function() {
        enable = false;
        delete scope.magnify;
        scope.$apply();
      });
    }
  };
})

;

