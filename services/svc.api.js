(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .factory('apiservice', apiservice);

    apiservice.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$q'];
    function apiservice($http, $cookies, $rootScope, $timeout, $q) {
        var api = 'http://16watt.com/dev/api/api.php/';
		var table = '';
		var config = {
            method: 'GET',
            url: api + table,
            data: {}
        }
		var apiservice = {};

		apiservice.GetAll = GetAll;
        apiservice.GetById = GetById;
        apiservice.GetByGameId = GetByGameId;
        apiservice.GetByUserId = GetByUserId;
        apiservice.GetBy = GetBy;
		apiservice.Create = Create;
        apiservice.Update = Update;
		apiservice.Delete = Delete;
		return apiservice;

        function GetAll(tbl) {
            config.url = api + tbl;
            return $http(config).then(handleSuccess, handleError('Error getting all from table: ' + tbl));
        }

        function GetById(tbl, id) {
            config.method = 'GET'
            config.url = api + tbl + '/id/' + id;
            return $http(config).then(handleSuccess, handleError('Error getting item from '+ tbl +' by id'));
        }

        function GetByGameId(tbl, gameId) {
            return $http.get(api + tbl + '/gameid/' + gameId).then(handleSuccess, handleError('Error getting item from ' + tbl + ' by gameid'));
        }

        function GetByUserId(tbl, createdby) {
            return $http.get(api + tbl + '/createdby/' + createdby).then(handleSuccess, handleError('Error getting ' + tbl + ' by userid'));            
        }

        function GetBy(tbl, col, str){
            return $http.get(api + tbl + '/' + col + '/' + '\'' + str + '\'').then(handleSuccess, handleError('Error getting ' + tbl + ' by Category'));
        }
		
        function Create(tbl, obj) {
            config.url = api + tbl;
            config.method = "POST"
            config.data = obj;
            return $http(config).then(handleSuccess, handleError('Error creating ' + tbl));
        }

        function Update(tbl, obj) {
            config.method = "PUT"
            config.data = obj;
            config.url = api + tbl + "/" + obj.id
            return $http(config).then(handleSuccess, handleError('Error updating ' +  tbl));
        }

        function Delete(tbl, id) {
            config.method = "DELETE";
            config.url = api + tbl + "/" + id
            return $http(config).then(handleSuccess, handleError('Error deleting ' + tbl));
        }
		
        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
