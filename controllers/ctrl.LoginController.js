(function(){
    'use strict';   
    
    angular
        .module('pbta_resources')
        .controller('LoginController', LoginController);

        LoginController.$inject = ['$scope', '$rootScope', '$cookies', '$location', '$http', '$q', 'Auth'];
        function LoginController($scope, $rootScope, $cookies, $location, $http, $q, Auth){
            var vm = this;
            var api = 'http://16watt.com/dev/api/api.php/';
            
            //Scope Properties
            vm.darkMode = true;
            vm.userData = {};
            vm.isLoggedIn = false;
            vm.taco = "PSYCH";
            vm.showError = false;

            //Scope Methods
            vm.setDarkMode = setDarkMode;
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
                        vm.isLoggedIn = true;
                        vm.userData = $rootScope.userData;
                    });
                } else {
                    console.log("LoginController: You don't have a cookie.")
                }
            };		
		
            function login(){
                $scope.dataLoading = true;
                $scope.passwordHash = md5($scope.password);
                Auth.Login($scope.username, $scope.passwordHash, function(response) {
                    if(response.success) {
                        Auth.SetCredentials($scope.username, $scope.passwordHash, response.data);
                        vm.userData = response.data;
                        vm.isLoggedIn = true;
                        $location.path('/');
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
                vm.showError = false;
                // Check for existing user
                checkExisting(user);
            };
            
            function checkExisting(user){
                $http.get(api + 'tbl_Users/username/"' + user.username + '"').then(				
                    function(response){                        
                        if(typeof response.data.username !== "undefined" && response.data.username === user.username){
                            // Give feedback
                            vm.showError = true;
                            vm.errorMsg = "Sorry bro, that username is already taken";
                        } else {
                            createUser(user);
                            
                        }					
                    },
                    function(error){
                        console.log(error);
                    }
                )
            };

            function createUser(user){
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
    
                function userSuccess(response){
                    console.log("you did it", response);
                    $scope.username = user.username;
                    $scope.password = user.Password;
                    login();
                    
                }
                function userFailure(error){
                    console.log(error);
                }
            }

            function setDarkMode(){
                vm.darkMode = !vm.darkMode;
                if(vm.darkMode){
                    $('body').addClass('darkMode');
                } else {
                    $('body').removeClass('darkMode');
                }
            }
        }
})();