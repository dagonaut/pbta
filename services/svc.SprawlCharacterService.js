(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .factory('SprawlCharacterService', SprawlCharacterService);

    SprawlCharacterService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$q'];
    function SprawlCharacterService($http, $cookies, $rootScope, $timeout, $q) {
        var api = 'http://16watt.com/dev/pbta/api/api.php/';
		var table = 'tbl_sprawl_Characters';
		var config = {
            method: 'GET',
            url: api + table,
            data: {}
        }
		var SprawlCharacterService = {};

		SprawlCharacterService.GetAll = GetAll;
        SprawlCharacterService.GetById = GetById;
        SprawlCharacterService.GetByGameId = GetByGameId;
        SprawlCharacterService.GetByUserId = GetByUserId;
		SprawlCharacterService.Create = Create;
        SprawlCharacterService.Update = Update;
		SprawlCharacterService.Delete = Delete;
		return SprawlCharacterService;

        function GetAll() {            
            return $http(config).then(handleSuccess, handleError('Error getting all SprawlCharacters'));
        }

        function GetById(id) {
            config.url = config.url + '/id/' + id;
            return $http(config).then(handleSuccess, handleError('Error getting SprawlCharacter by id'));
        }

        function GetByGameId(gameId) {
            return $http.get(api + table + '/gameid/' + gameId).then(handleSuccess, handleError('Error getting SprawlCharacter by gameid'));
        }

        function GetByUserId(createdby) {
            return $http.get(api + table + '/createdby/' + createdby).then(handleSuccess, handleError('Error getting SprawlCharacter by Category'));            
        }
		
        function Create(SprawlCharacter) {
            config.method = "POST"
            config.data = SprawlCharacter;
            return $http(config).then(handleSuccess, handleError('Error creating SprawlCharacter'));
        }

        function Update(SprawlCharacter) {
            config.method = "PUT"
            config.data = SprawlCharacter;
            config.url = config.url + "/" + SprawlCharacter.id
            return $http(config).then(handleSuccess, handleError('Error updating SprawlCharacter'));
        }

        function Delete(id) {
            config.method = "DELETE";
            config.url = config.url + "/" + id
            return $http(config).then(handleSuccess, handleError('Error deleting SprawlCharacter'));
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
