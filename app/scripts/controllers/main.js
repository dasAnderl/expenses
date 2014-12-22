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
    this.calPopupOpen = false;
    this.expenseEdited = null;

    this.openCalPopup = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      this.calPopupOpen = true;
    };

    this.getExpenses = function () {
      var wrapper = this;
      var url = appSettings.dbExpenses + '/_design/expenses/_view/byName';
      couchDbService.getJsonFromUrl(url)
        .then((function (wrapper) {
          return function (data) {
            wrapper.items = data;
            wrapper.status = 'Expenses fetched!';
          }
        })(wrapper));
    }

    this.getExpenses();

    this.saveExpense = function (expense) {

      var wrapper = this;
      //are we saving new expense or updating existing one
      var newOrUpdate = expense ? false : true;
      var doc = newOrUpdate ? wrapper.doc : expense;

      couchDbService.postDocToUrl(appSettings.dbExpenses, doc)
        .then((function (wrapper, newOrUpdate) {
          return function () {
            wrapper.getExpenses();
            wrapper.status = 'Expense saved!';
            if (newOrUpdate) {
              wrapper.doc.name = null;
              wrapper.doc.price = null;
              wrapper.doc.date = null;
              $scope.form.$setPristine();
            }
          }
        })
        (wrapper, newOrUpdate)
      )
      ;
    }

    this.deleteExpense = function (expense) {

      var wrapper = this;

      var delMethod = expense.value._rev ? couchDbService.deleteDocByIdAndRev(appSettings.dbExpenses, expense.id, expense.value._rev)
        : couchDbService.deleteDocById(appSettings.dbExpenses, expense.id);

      //couchDbService.deleteDocByIdAndRev(appSettings.dbExpenses, expense.id, expense.value.rev)
      delMethod
        .then((function (wrapper) {
          return function () {
            wrapper.getExpenses();
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
