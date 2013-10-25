
angular.module('encounter', ['ngRoute']).config(function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/', {
    controller:  'main',
    templateUrl: 'views/main.html'
  }).when('/gallery', {
    controller: 'gallery',
    templateUrl: 'views/gallery.html'
  }).when('/traditions/:tradition', {
    controller: 'tradition',
    templateUrl: 'views/tradition.html'
  }).otherwise({
    redirectTo: '/'
  });
})

.controller('main', function($rootScope) {
  $rootScope.title = 'Encounter World Religions Museum';
})

.controller('tradition', function($rootScope, $scope, $routeParams, traditions, net) {
  var trad = traditions[$routeParams.tradition];
  $scope.content = net.fetchTradition(trad);

  $scope.index = 0; // The index within the current page.
  $scope.page = 0;  // The current page of the filmstrip.
  $rootScope.title = $scope.content.title;
})

.controller('gallery', function($rootScope, $scope, traditions) {
  $scope.traditions = traditions;
})

.directive('encDescription', function($window) {
  var converter = $window.Showdown.converter();
  return {
    restrict: 'A',
    scope: { description: '=encDescription' },
    link: function(scope, elem, attrs) {
      // Convert the Markdown content to HTML and paste it into the content.
      elem.html(converter.makeHtml(scope.description));
    }
  };
})

;

