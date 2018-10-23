(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .factory('HoldService', HoldService);

    HoldService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$q'];
    function HoldService($http, $cookies, $rootScope, $timeout, $q) {
        var api = 'http://16watt.com/dev/pbta/api/api.php/';
		var table = 'tbl_Hold';
		var config = {
            method: 'GET',
            url: api + table,
            data: {}
        }
		var HoldService = {};

		HoldService.GetAll = GetAll;
        HoldService.GetById = GetById;
        HoldService.GetByName = GetByName;
        HoldService.GetByType = GetByType;
        HoldService.GetByUserId = GetByUserId;
		HoldService.Create = Create;
        HoldService.Update = Update;
		HoldService.Delete = Delete;
		return HoldService;

        function GetAll() {
            config.method = 'GET';  
            config.url = api + table;          
            return $http(config).then(handleSuccess, handleError('Error getting all Holds'));
        }

        function GetById(id) {
            config.url = config.url + '/id/' + id;
            return $http(config).then(handleSuccess, handleError('Error getting Hold by id'));
        }

        function GetByName(name) {
            return $http.get(api + table + '/name/' + name).then(handleSuccess, handleError('Error getting Hold by name'));
        }

        function GetByType(type) {
            return $http.get(api + table + '/type/' + type).then(handleSuccess, handleError('Error getting Hold by type'));
        }

        function GetByUserId(createdby) {
            return $http.get(api + table + '/createdby/' + createdby).then(handleSuccess, handleError('Error getting Hold by type'));            
        }
		
        function Create(Hold) {
            config.method = "POST"
            config.data = Hold;
            return $http(config).then(handleSuccess, handleError('Error creating Hold'));
        }

        function Update(Hold) {
            config.method = "PUT"
            config.data = Hold;
            config.url = api + table + "/" + Hold.id            
            return $http(config).then(handleSuccess, handleError('Error updating Hold'));
        }

        function Delete(id) {
            config.method = "DELETE";
            config.url = api + table + "/" + id
            return $http(config).then(handleSuccess, handleError('Error deleting Hold'));
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
