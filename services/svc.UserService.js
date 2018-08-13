(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$q'];
    function UserService($http, $cookies, $rootScope, $timeout, $q) {
        var api = 'http://16watt.com/dev/pbta/api/api.php/';
		var table = 'tbl_Users/';
		
		var UserService = {};

		UserService.GetAll = GetAll;
        UserService.GetById = GetById;
        UserService.GetByUsername = GetByUsername;		
		UserService.Create = Create;
        UserService.Update = Update;
		UserService.Delete = Delete;
		
		return UserService;

        function GetAll() {
            return $http.get(api + table).then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get(api + table + '/id/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get(api + table + '/username/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }
		
        function Create(user) {
            return $http.post(api + table + user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put(api + table + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete(api + table + id).then(handleSuccess, handleError('Error deleting user'));
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
