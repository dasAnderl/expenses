'use strict';

/**
 * http://www.sitepoint.com/tracking-expenses-couchdb-angular/
 *
 * @ngdoc overview
 * @name expensesApp
 * @description
 * # expensesApp
 *
 * Main module of the application.
 */
angular
  .module('expensesApp', [
    'couchDb',
    'ui.bootstrap',
    'xeditable',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage'
  ])
  .factory('httpInterceptor', ['$q', '$rootScope', '$injector',
    function ($q, $rootScope, $injector) {
      $rootScope.consRefused = null;
      return {
        responseError: function(rejection) {
          if(rejection.status == 0) {
            $rootScope.consRefused = 'Connection refused: ' + rejection.config.method + ' ' + rejection.config.url;
            console.log($rootScope.consRefused);
            return;
          }
          return $q.reject(rejection);
        }
      }
    }
  ])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        //we can also assign the controller here, but find it more clear in the template using ng-controller
        //controller: 'MainCtrl',
        //controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $httpProvider.interceptors.push('httpInterceptor');
  }])
  .constant('appSettings', {
    dbExpenses: 'http://127.0.0.1:5984/expenses',
    dateFormat: 'dd.MM.yyyy'
  })
  .run(['$rootScope', 'appSettings', function($rootScope, appSettings) {
    $rootScope.appSettings = appSettings;
  }]);
