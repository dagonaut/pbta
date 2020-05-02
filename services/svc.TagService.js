(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .factory('TagService', TagService);

    TagService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$q'];
    function TagService($http, $cookies, $rootScope, $timeout, $q) {
        var api = 'http://16watt.com/dev/api/api.php/';
		var table = 'tbl_Tags';
		var config = {
            method: 'GET',
            url: api + table,
            data: {}
        }
		var TagService = {};

		TagService.GetAll = GetAll;
        TagService.GetById = GetById;
        TagService.GetByGameId = GetByGameId;
        TagService.GetByCategory = GetByCategory;
        TagService.GetByUserId = GetByUserId;
		TagService.Create = Create;
        TagService.Update = Update;
		TagService.Delete = Delete;
		return TagService;

        function GetAll() {            
            return $http(config).then(handleSuccess, handleError('Error getting all Tags'));
        }

        function GetById(id) {
            config.url = config.url + '/id/' + id;
            return $http(config).then(handleSuccess, handleError('Error getting Tag by id'));
        }

        function GetByGameId(gameId) {
            return $http.get(api + table + '/gameid/' + gameId).then(handleSuccess, handleError('Error getting Tag by gameid'));
        }

        function GetByCategory(category) {
            return $http.get(api + table + '/category/' + category).then(handleSuccess, handleError('Error getting Tag by Category'));
        }

        function GetByUserId(createdby) {
            return $http.get(api + table + '/createdby/' + createdby).then(handleSuccess, handleError('Error getting Tag by Category'));            
        }
		
        function Create(Tag) {
            config.method = "POST"
            config.data = Tag;
            return $http(config).then(handleSuccess, handleError('Error creating Tag'));
        }

        function Update(Tag) {
            config.method = "PUT"
            config.data = Tag;
            return $http(config).then(handleSuccess, handleError('Error updating Tag'));
        }

        function Delete(id) {
            config.method = "DELETE";
            config.url = config.url + id
            return $http(config).then(handleSuccess, handleError('Error deleting Tag'));
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
