(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .factory('ClockService', ClockService);

    ClockService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$q'];
    function ClockService($http, $cookies, $rootScope, $timeout, $q) {
        var api = 'http://16watt.com/dev/pbta/api/api.php/';
		var table = 'tbl_Clocks';
		var config = {
            method: 'GET',
            url: api + table,
            data: {}
        }
		var ClockService = {};

		ClockService.GetAll = GetAll;
        ClockService.GetById = GetById;
        ClockService.GetByName = GetByName;
        ClockService.GetByType = GetByType;
        ClockService.GetByUserId = GetByUserId;
		ClockService.Create = Create;
        ClockService.Update = Update;
		ClockService.Delete = Delete;
		return ClockService;

        function GetAll() {            
            return $http(config).then(handleSuccess, handleError('Error getting all Clocks'));
        }

        function GetById(id) {
            config.url = config.url + '/id/' + id;
            return $http(config).then(handleSuccess, handleError('Error getting Clock by id'));
        }

        function GetByName(name) {
            return $http.get(api + table + '/name/' + name).then(handleSuccess, handleError('Error getting Clock by name'));
        }

        function GetByType(type) {
            return $http.get(api + table + '/type/' + type).then(handleSuccess, handleError('Error getting Clock by type'));
        }

        function GetByUserId(createdby) {
            return $http.get(api + table + '/createdby/' + createdby).then(handleSuccess, handleError('Error getting Clock by type'));            
        }
		
        function Create(clock) {
            config.method = "POST"
            config.data = clock;
            return $http(config).then(handleSuccess, handleError('Error creating Clock'));
        }

        function Update(clock) {
            config.method = "PUT"
            config.data = clock;
            config.url = config.url + "/" + clock.id            
            return $http(config).then(handleSuccess, handleError('Error updating Clock'));
        }

        function Delete(id) {
            config.method = "DELETE";
            config.url = config.url + "/" + id
            return $http(config).then(handleSuccess, handleError('Error deleting Clock'));
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
