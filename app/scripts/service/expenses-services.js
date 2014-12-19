'use strict';

angular.module("expensesServices", [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch'
])
  .factory('expensesService', ['$http', '$q', '$scope', function ($http, $q, $scope) {


    var getExpensesFromDb = function () {
      return $http.get( '/_design/expenses/_view/byName').success((function () {
        return function (data) {
          console.log('loaded items');
          return data.rows;
        }
      })())
        .error(function (error) {
          console.log('Error loading expenses' + error)
          return error;
        });
    }

    return {
      getExpenses: function () {
        return getExpensesFromDb();
      }
    };


  }]);
