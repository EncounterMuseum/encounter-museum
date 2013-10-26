
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
    templateUrl: 'views/tradition.html'
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

.controller('tradition', function($rootScope, $scope, $routeParams, traditions, net) {
  $rootScope.menuSelected = 'gallery';
  $scope.tradition = traditions[$routeParams.tradition];
  $scope.content = net.fetchTradition($scope.tradition.slug);

  $scope.index = 0; // The index within the current page.
  $scope.page = 0;  // The current page of the filmstrip.
  $rootScope.title = $scope.content.title;

  $scope.change = function(index) {
    $scope.index = index;
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

;

