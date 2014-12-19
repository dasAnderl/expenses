'use strict';

/**
 * @ngdoc function
 * @name expensesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the expensesApp
 */
angular.module('expensesApp')
  .controller('MainCtrl', ['$http', '$q', '$scope', 'appSettings', 'couchDbService', function ($http, $q, $scope, appSettings, couchDbService) {

    this.name = null;
    this.price = null;
    this.items = [];
    this.status = 'All good!';

    var expensesUrl = 'http://127.0.0.1:5984/expenses/_design/expenses/_view/byName';

    this.getExpenses = function (url, wrapper) {
      couchDbService.getJsonFromUrl(url)
        .then((function (wrapper) {
          return function (data) {
            wrapper.items = data;
          }
        })(wrapper));
    }

    this.getExpenses(expensesUrl, this);


    this.saveExpense = function () {
      var doc = {
        name: this.name,
        price: this.price
      };
      var wrapper = this;
      couchDbService.postDocToUrl(appSettings.db, doc, wrapper)
        .then((function (wrapper) {
          return function () {
            wrapper.status = 'Expense saved!';
            wrapper.getExpenses(expensesUrl, wrapper);
            wrapper.name = null;
            wrapper.price = null;
            $scope.form.$setPristine();
          }
        })(wrapper));
    }

    this.deleteExpense = function (item) {

      var wrapper = this;

      couchDbService.deleteUrl(appSettings.db + '/' +item.id)
        .then((function (wrapper) {
          return function () {
            wrapper.status = 'Expense deleted!';
            wrapper.getExpenses(expensesUrl, wrapper);
          }
        })(wrapper));
    }
  }])
  .
  directive('expensesTable', function () {
    return {
      restrict: 'E',
      templateUrl: '../../views/directives/expenses-table.html'
    };
  });
;
