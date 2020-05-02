(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .factory('CyberwareService', CyberwareService);

    CyberwareService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$q'];
    function CyberwareService($http, $cookies, $rootScope, $timeout, $q) {
        var api = 'http://16watt.com/dev/api/api.php/';
		var table = 'tbl_Cyberware';
		var config = {
            method: 'GET',
            url: api + table,
            data: {}
        }
		var CyberwareService = {};

		CyberwareService.GetAll = GetAll;
        CyberwareService.GetById = GetById;
        CyberwareService.GetByGameId = GetByGameId;
        CyberwareService.GetByUserId = GetByUserId;
		CyberwareService.Create = Create;
        CyberwareService.Update = Update;
		CyberwareService.Delete = Delete;
		return CyberwareService;

        function GetAll() {            
            return $http(config).then(handleSuccess, handleError('Error getting all Cyberwares'));
        }

        function GetById(id) {
            config.url = config.url + '/id/' + id;
            return $http(config).then(handleSuccess, handleError('Error getting Cyberware by id'));
        }

        function GetByGameId(gameId) {
            return $http.get(api + table + '/gameid/' + gameId).then(handleSuccess, handleError('Error getting Cyberware by gameid'));
        }

        function GetByUserId(createdby) {
            return $http.get(api + table + '/createdby/' + createdby).then(handleSuccess, handleError('Error getting Cyberware by Category'));            
        }
		
        function Create(Cyberware) {
            config.method = "POST"
            config.data = Cyberware;
            return $http(config).then(handleSuccess, handleError('Error creating Cyberware'));
        }

        function Update(Cyberware) {
            config.method = "PUT"
            config.data = Cyberware;
            return $http(config).then(handleSuccess, handleError('Error updating Cyberware'));
        }

        function Delete(id) {
            config.method = "DELETE";
            config.url = config.url + id
            return $http(config).then(handleSuccess, handleError('Error deleting Cyberware'));
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
