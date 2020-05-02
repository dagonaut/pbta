(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .factory('MoveService', MoveService);

    MoveService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$q'];
    function MoveService($http, $cookies, $rootScope, $timeout, $q) {
        var api = 'http://16watt.com/dev/api/api.php/';
		var table = 'tbl_Moves';
		var config = {
            method: 'GET',
            url: api + table,
            data: {}
        }
		var MoveService = {};

		MoveService.GetAll = GetAll;
        MoveService.GetById = GetById;
        MoveService.GetByGameId = GetByGameId;
        MoveService.GetByClass = GetByClass;
        MoveService.GetByType = GetByType;
        MoveService.GetByUserId = GetByUserId;
		MoveService.Create = Create;
        MoveService.Update = Update;
		MoveService.Delete = Delete;
		return MoveService;

        function GetAll() {            
            return $http(config).then(handleSuccess, handleError('Error getting all Moves'));
        }

        function GetById(id) {
            config.url = config.url + '/id/' + id;
            return $http(config).then(handleSuccess, handleError('Error getting Move by id'));
        }

        function GetByGameId(gameId) {
            return $http.get(api + table + '/gameid/' + gameId).then(handleSuccess, handleError('Error getting Move by gameid'));
        }

        function GetByClass(characterClass) {
            return $http.get(api + table + '/class/"' + characterClass + '"').then(handleSuccess, handleError('Error getting Move by characterClass'));
        }

        function GetByType(type) {
            return $http.get(api + table + '/type/' + type).then(handleSuccess, handleError('Error getting Move by type'));
        }

        function GetByUserId(createdby) {
            return $http.get(api + table + '/createdby/' + createdby).then(handleSuccess, handleError('Error getting Move by type'));            
        }
		
        function Create(Move) {
            config.method = "POST"
            config.data = Move;
            return $http(config).then(handleSuccess, handleError('Error creating Move'));
        }

        function Update(Move) {
            config.method = "PUT"
            config.data = Move;
            return $http(config).then(handleSuccess, handleError('Error updating Move'));
        }

        function Delete(id) {
            config.method = "DELETE";
            config.url = config.url + id
            return $http(config).then(handleSuccess, handleError('Error deleting Move'));
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
