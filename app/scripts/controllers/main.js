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

    this.doc = {
      name: null,
      price: null,
      date: null
    };

    this.items = [];
    this.status = 'Initial state';

    this.getExpenses = function (url, wrapper) {
      couchDbService.getJsonFromUrl(url)
        .then((function (wrapper) {
          return function (data) {
            wrapper.items = data;
            wrapper.status = 'Expenses updated!';
          }
        })(wrapper));
    }

    var expensesUrl = appSettings.dbExpenses+'/_design/expenses/_view/byName';
    this.getExpenses(expensesUrl, this);

    try {
    var a = new Date();
      var b = JSON.stringify(a);
      console.log(b);
    }
    catch(e){}

    this.saveExpense = function () {
      var wrapper = this;
      couchDbService.postDocToUrl(appSettings.dbExpenses, wrapper.doc)
        .then((function (wrapper) {
          return function () {
            wrapper.getExpenses(expensesUrl, wrapper);
            wrapper.status = 'Expense saved!';
            wrapper.doc.name = null;
            wrapper.doc.price = null;
            wrapper.doc.date = null;
            $scope.form.$setPristine();
          }
        })(wrapper));
    }

    this.deleteExpense = function (item) {

      var wrapper = this;

      couchDbService.deleteDocByIdAndRev(appSettings.dbExpenses, item.id, item.value.rev)
        .then((function (wrapper) {
          return function () {
            wrapper.getExpenses(expensesUrl, wrapper);
            wrapper.status = 'Expense deleted!';
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
