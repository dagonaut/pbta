(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .factory('DWCharacterService', DWCharacterService);

    DWCharacterService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$q'];
    function DWCharacterService($http, $cookies, $rootScope, $timeout, $q) {
        var api = 'http://16watt.com/dev/api/api.php/';
		var table = 'tbl_Characters';
		var config = {
            method: 'GET',
            url: api + table,
            data: {}
        }
		var DWCharacterService = {};

		DWCharacterService.GetAll = GetAll;
        DWCharacterService.GetById = GetById;
        DWCharacterService.GetByGameId = GetByGameId;
        DWCharacterService.GetByUserId = GetByUserId;
		DWCharacterService.Create = Create;
        DWCharacterService.Update = Update;
		DWCharacterService.Delete = Delete;
		return DWCharacterService;

        function GetAll() {            
            return $http(config).then(handleSuccess, handleError('Error getting all DWCharacters'));
        }

        function GetById(id) {
            config.method = 'GET'
            config.url = api + table + '/id/' + id;
            return $http(config).then(handleSuccess, handleError('Error getting DWCharacter by id'));
        }

        function GetByGameId(gameId) {
            return $http.get(api + table + '/gameid/' + gameId).then(handleSuccess, handleError('Error getting DWCharacter by gameid'));
        }

        function GetByUserId(createdby) {
            return $http.get(api + table + '/createdby/' + createdby).then(handleSuccess, handleError('Error getting DWCharacter by Category'));            
        }
		
        function Create(DWCharacter) {
            config.method = "POST"
            config.data = DWCharacter;
            return $http(config).then(handleSuccess, handleError('Error creating DWCharacter'));
        }

        function Update(DWCharacter) {
            config.method = "PUT"
            config.data = DWCharacter;
            config.url = api + table + "/" + DWCharacter.id
            return $http(config).then(handleSuccess, handleError('Error updating DWCharacter'));
        }

        function Delete(id) {
            config.method = "DELETE";
            config.url = api + table + "/" + id
            return $http(config).then(handleSuccess, handleError('Error deleting DWCharacter'));
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
