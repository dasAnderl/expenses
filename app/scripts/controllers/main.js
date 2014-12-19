'use strict';

/**
 * @ngdoc function
 * @name expensesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the expensesApp
 */
angular.module('expensesApp')
  .controller('MainCtrl', ['$http', '$q', '$scope', 'appSettings', function ($http, $q, $scope, appSettings) {

    this.name = null;
    this.price = null;
    this.items = [];
    this.status = 'All good!';

    this.getItems = function (mainCtrl) {

      $http.get(appSettings.db + '/_design/expenses/_view/byName').success((function (mainCtrl) {
        return function (data) {
          mainCtrl.items = data.rows;
          console.log('loaded items');
        }
      })(mainCtrl))
        .error(function (error) {
          if (error != null)mainCtrl.status = 'Error: ' + error.reason;
        });
    }

    this.getItems(this);


    this.saveExpense = function () {
      var item = {
        name: this.name,
        price: this.price
      };
      this.saveDoc(item);
    }

    this.saveDoc = function (item) {

      var mainCtrl = this;

      $http.post(appSettings.db, item)
        .success((function (mainCtrl) {
          return function () {
            mainCtrl.status = 'Expense saved!';
            console.log('Item saved:' + item);
            mainCtrl.getItems(mainCtrl);
            mainCtrl.name = null;
            mainCtrl.price = null;
            $scope.form.$setPristine();
          }
        })(mainCtrl))
        .error(function (error) {
          mainCtrl.status = 'Error: ' + error.reason;
          mainCtrl.getItems(mainCtrl);
          console.log('Error saving item:' + item);
        });
    }

    this.deleteExpense = function (item) {

      var mainCtrl = this;
      var revId = -1;

      $http.get(appSettings.db + '/' + item.id).success((function (mainCtrl) {
        return function (data) {
          revId = data._rev;
          console.log('rev to delete ' + revId);
          deleteDoc(item.id, revId, mainCtrl);
          //mainCtrl.getItems(mainCtrl);
        }
      })(mainCtrl))
        .error(function (error) {
          mainCtrl.status = 'Error: ' + error.reason;
        });
    }

    function deleteDoc(id, rev, mainCtrl) {

      $http.delete(appSettings.db + '/' + id + '?rev=' + rev).success((function (mainCtrl) {
        return function (data) {
          console.log('deleted doc, updating items');
          mainCtrl.getItems(mainCtrl);

        }
      })(mainCtrl))
        .error(function (error) {
          mainCtrl.status = 'Error: ' + error.reason;
        });

    }


  }])
  .directive('expensesTable', function () {
    return {
      restrict: 'E',
      scope: {
        expenses: '=expenses'
      },
      templateUrl: '../../views/directives/expenses-table.html'
    };
  });
;
