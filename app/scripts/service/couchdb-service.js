'use strict';

angular.module("couchDb", [])
  .service('couchDbService', ['$http', '$q', function ($http) {

    this.getJsonFromUrl = function (url) {
      return $http.get(url)
        .then(
        function (response) {

          //multiple rows
          console.log('data loaded');
          if (response.data.rows)return response.data.rows;
          //single result
          else return response.data;
        },
        function (httpError) {
          // translate the error
          console.log('error loading data');
          throw httpError.status
          + " for "
          + httpError.config.method
          + " " + httpError.config.url
          + (httpError.data.reason ? " reason: " + httpError.data.reason : "");
        });
    }

    this.postDocToUrl = function (url, doc) {
      return $http.post(url, doc)
        .success(function () {
          console.log('saved: ' + doc + ' to url ' + url);
          return true;
        }
      )
        .error(function (error) {
          console.log('Error saving:' + doc + ' to url ' + url);
          throw error;
        });
    }

    this.deleteDocById = function (baseUrl, id) {

      var id = id;
      var url = baseUrl + '/' + id;

      return getJsonFromUrl(url)
        .then(function (data) {
          var rev = data._rev;
          console.log('retrieved rev ' + rev + ' for ' + url);
          return deleteDocByIdAndRev(baseUrl, id, rev);
        },
        function (httpError) {
          // translate the error
          console.log('error deleting ' + url);
          throw httpError.status
          + " for "
          + httpError.config.method
          + " " + httpError.config.url
          + (httpError.data.reason ? " reason: " + httpError.data.reason : "");
        });
    }

    this.deleteDocByIdAndRev = function (baseUrl, id, rev) {

      var url = baseUrl + '/' + id + '?rev=' + rev;

      return $http.delete(url)
        .then(function () {
          console.log('Deleted: ' + url);
          return true;
        },
        function (httpError) {
          // translate the error
          console.log('error deleting ' + url);
          throw httpError.status
          + " for "
          + httpError.config.method
          + " " + httpError.config.url
          + (httpError.data.reason ? " reason: " + httpError.data.reason : "");
        });
    }
  }]);
