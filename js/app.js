
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
  }).when('/contact', {
    controller: 'contact',
    templateUrl: 'views/contact.html'
  }).otherwise({
    redirectTo: '/'
  });
})
.controller('meta', function($rootScope) {
  $rootScope.clearSearch = function() {
    $rootScope.$broadcast('clearSearch');
  };
})
.controller('menu', function($rootScope, $scope, $location, indexer) {
  // NB: These are in reverse order.
  $rootScope.menu = [
    { slug: 'home',      name: 'Home',      link: '#!/' },
    { slug: 'gallery',   name: 'Galleries', link: '#!/gallery' },
    { slug: 'contact',   name: 'Contact',   link: '#!/contact' }
  ];
  $rootScope.menuSelected = 'home';

  $scope.$watch('search', function(nu) {
    if (!nu) {
      $scope.searchResults = undefined;
    } else {
      $scope.searchResults = indexer.lookup(nu);
    }
  });

  $scope.show = function(artifact) {
    $location.path('/tradition/' + artifact.traditionSlug);
    $location.hash(artifact.slug);
    clearSearch();
  };

  $scope.stopProp = function(e) {
    e.stopPropagation();
  };

  $rootScope.$on('clearSearch', clearSearch);
  function clearSearch() {
    $scope.search = undefined;
    $scope.searchResults = undefined;
  }
})

.controller('main', function($rootScope) {
  $rootScope.menuSelected = 'home';
  $rootScope.title = 'Encounter World Religions Museum';
})

.controller('tradition', function($rootScope, $scope, $routeParams, $location, traditions, net, markdown) {
  $rootScope.menuSelected = 'gallery';
  $scope.tradition = traditions[$routeParams.tradition];
  net.fetchTradition($scope.tradition.slug).then(function(res) {
    $scope.content = res;
    $rootScope.title = $scope.content.title;

    updateByHash();
  });

  // Called to check for hash changes.
  function updateByHash() {
    var hash = $location.hash();
    if (hash) {
      var index = $scope.content.slugMap[hash];
      if (index >= 0 && $scope.content.artifacts[$scope.globalIndex].slug != hash) {
        $scope.globalIndex = index;
        $scope.index = 0;
        update($scope.globalIndex);
      } else {
        update(index);
      }
    } else {
      update(0);
    }
  }

  $rootScope.$on('$locationChangeSuccess', function(event, nu) {
    if ($location.path() == '/tradition/' + $routeParams.tradition)
      updateByHash();
  });

  $scope.index = 0; // The index within the current page.
  $scope.globalIndex = 0;
  $scope.entryLimit = 5;
  $scope.page = 0;
  $scope.pageIndex = 0;

  function update(nu) {
    if ($scope.content && $scope.content.artifacts && $scope.content.artifacts.length) {
      $scope.artifact = $scope.content.artifacts[nu];

      // Reset the artifact-specific values.
      $scope.index = 0;
      $scope.pageIndex = 0;
      $scope.page = 0;

      if (!$scope.artifact.descriptionHTML)
        $scope.artifact.descriptionHTML = markdown($scope.artifact.description);

      /*
      $scope.artifact.image = 'assets/' + $scope.content.artifacts[nu].images[$scope.index];
      $scope.artifact.bigImage = 'assets/big/' + $scope.content.artifacts[nu].images[$scope.index];
      */
      $location.hash($scope.content.artifacts[$scope.globalIndex].slug);
    }
  }

  $scope.$watch('globalIndex', update);

  $scope.changePicture = function(index) {
    $scope.index = index;
    $scope.page = Math.floor($scope.index / $scope.entryLimit);
    $scope.pageIndex = $scope.index % $scope.entryLimit;
  };

  $scope.prevImage = function() {
    $scope.changePicture(Math.max($scope.index - 1, 0));
  };

  $scope.nextImage = function() {
    $scope.changePicture(Math.min($scope.index + 1, $scope.artifact.images.length - 1));
  };

  $scope.prevArtifact = function() {
    $scope.globalIndex = Math.max($scope.globalIndex - 1, 0);
  };

  $scope.nextArtifact = function() {
    $scope.globalIndex = Math.min($scope.globalIndex + 1, $scope.content.artifacts.length - 1);
  };

  // Selecting an image from the gallery.
  $scope.select = function(index) {
    $scope.globalIndex = index;
    $scope.overview = false;
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

.directive('encMagnifier', function() {
  return {
    scope: { img: '=encMagnifier' },
    link: function(scope, elem, attrs) {
      function update() {
        $(elem).html('<a class="mag-anchor" data-large-url="assets/big/' + scope.img + '" class="new-magnifier"><img src="assets/' + scope.img + '" /></a>');
        window.setTimeout(function() {
          $('a', elem).jqzoom({
            zoomType: 'innerzoom',
            zoomWidth: 400,
            zoomHeight: 300,
            title: false
          });
        }, 0);
      }

      scope.$watch('img', function(nu) {
        if (nu) update();
      });
    }
  };
})

;

