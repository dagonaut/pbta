(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('LoginController', LoginController);

        LoginController.$inject = ['$scope', '$rootScope', '$cookies', '$location', '$http', '$q', 'Auth'];
        function LoginController($scope, $rootScope, $cookies, $location, $http, $q, Auth){
            var vm = this;
            var api = 'http://16watt.com/dev/pbta/api/api.php/';
            
            //Scope Properties
            vm.userData = {};
            vm.isLoggedIn = false;

            //Scope Methods
            vm.login = login;
            vm.logout = logout;
            vm.register = register;
            vm.checkExisting = checkExisting;

            init();

            // Determine if we're logged in or have a cookie to auto login
            function init(){
                if (Auth.isLoggedIn()){
                    vm.userData = $rootScope.userData;
                    vm.isLoggedIn = true;
                } else if ($cookies.getObject('id')) {
                    Auth.setUser($cookies.getObject('id'));
                    Auth.AutoLogin($cookies.getObject('id'), function(response){
                        console.log("rootscope 303: " + $rootScope.userData);
                        vm.isLoggedIn = true;
                        vm.userData = $rootScope.userData;
                        $location.path('/cs');
                    });
                } else {
                    console.log("ln 291: You don't have a cookie.")
                }
            };		
		
            function login(){
                $scope.dataLoading = true;
                $scope.passwordHash = md5($scope.password);
                Auth.Login($scope.username, $scope.passwordHash, function(response) {
                    if(response.success) {
                        Auth.SetCredentials($scope.username, $scope.passwordHash, response.data);
                        vm.userData = response.data;
                        $location.path('/cs');
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            };
            
            function logout(){
                Auth.ClearCredentials();
                $location.path('/login');
            };		
            
            function register(user){
                console.log("Registering");
                // Check for existing user
                var exists = checkExisting(user);
                if(exists == false){
                    var passwordHash = md5(user.Password);
                    var method = 'POST';			
                    var url = api + 'tbl_Users/';
                    var config = {
                        method: method,
                        url: url,
                        data: {
                            id: user.id,
                            username: user.username,
                            FirstName: user.FirstName,
                            LastName: user.LastName,
                            EmailAddress: user.EmailAddress,
                            Password: passwordHash,
                            DateCreated: new Date().toISOString().slice(0,10),
                            DateUpdated: new Date().toISOString().slice(0,10)
                        }
                    };
                    $http(config).then(userSuccess, userFailure);
                }
                function userSuccess(response){
                    console.log(response);
                    $location.path('/login');
                }
                function userFailure(error){
                    console.log(error);
                }
                
            };
            
            function checkExisting(user){
                var deferred = $q.defer();
                $http.get(api + 'tbl_Users/username/"' + user.username + '"').then(				
                    function(response){
                        
                        if(typeof response.data.username !== "undefined" && response.data.username === user.username){
                            return true;
                        } else {
                            return false;
                        }					
                    },
                    function(error){
                        console.log(error);
                    }
                )
            };
        }
})();