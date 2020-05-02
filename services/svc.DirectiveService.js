(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .factory('DirectiveService', DirectiveService);

    DirectiveService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$q'];
    function DirectiveService($http, $cookies, $rootScope, $timeout, $q) {
        var api = 'http://16watt.com/dev/api/api.php/';
		var table = 'tbl_Directives';
		var config = {
            method: 'GET',
            url: api + table,
            data: {}
        }
		var DirectiveService = {};

		DirectiveService.GetAll = GetAll;
        DirectiveService.GetById = GetById;
        DirectiveService.GetByGameId = GetByGameId;
        DirectiveService.GetByUserId = GetByUserId;
		DirectiveService.Create = Create;
        DirectiveService.Update = Update;
		DirectiveService.Delete = Delete;
		return DirectiveService;

        function GetAll() {            
            return $http(config).then(handleSuccess, handleError('Error getting all Directives'));
        }

        function GetById(id) {
            config.url = config.url + '/id/' + id;
            return $http(config).then(handleSuccess, handleError('Error getting Directive by id'));
        }

        function GetByGameId(gameId) {
            return $http.get(api + table + '/gameid/' + gameId).then(handleSuccess, handleError('Error getting Directive by gameid'));
        }

        function GetByUserId(createdby) {
            return $http.get(api + table + '/createdby/' + createdby).then(handleSuccess, handleError('Error getting Directive by Category'));            
        }
		
        function Create(Directive) {
            config.method = "POST"
            config.data = Directive;
            return $http(config).then(handleSuccess, handleError('Error creating Directive'));
        }

        function Update(Directive) {
            config.method = "PUT"
            config.data = Directive;
            return $http(config).then(handleSuccess, handleError('Error updating Directive'));
        }

        function Delete(id) {
            config.method = "DELETE";
            config.url = config.url + id
            return $http(config).then(handleSuccess, handleError('Error deleting Directive'));
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
