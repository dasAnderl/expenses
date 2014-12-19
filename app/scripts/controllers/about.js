'use strict';

/**
 * @ngdoc function
 * @name expensesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the expensesApp
 */
angular.module('expensesApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
