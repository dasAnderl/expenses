'use strict';

angular.module("couchDb", [])
  .factory('couchDbService', ['$http', '$q', function ($http, $q) {

    var getJsonFromUrl = function (url) {
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

    var postDocToUrl = function (url, doc) {
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

    var deleteDoc = function (url) {

      var url = url;

      return getJsonFromUrl(url)
        .then(function (data) {
          var rev = data._rev;
          console.log('retrieved rev ' + rev + ' for ' + url);
          var deleteUrl = url + '?rev=' + rev;
          return $http.delete(deleteUrl)
            .success(function () {
              console.log('Deleted: ' + deleteUrl);
              return true;
            })
            .error(function (error) {
              console.log('Error deleting:' + deleteUrl+' '+error.reason);
              throw error;
            });

        },
        function (httpError) {
          // translate the error
          console.log('error deleting '+url);
          throw httpError.status
          + " for "
          + httpError.config.method
          + " " + httpError.config.url
          + (httpError.data.reason ? " reason: " + httpError.data.reason : "");
        });
    }

    return {
      getJsonFromUrl: function (url) {
        return getJsonFromUrl(url);
      },
      postDocToUrl: function (url, item) {
        return postDocToUrl(url, item);
      },
      deleteUrl: function(url) {
        return deleteDoc(url);
      }
    };


  }]);
