(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .factory('Auth', Auth);

    Auth.$inject = ['Base64', '$http', '$cookies', '$rootScope', '$timeout', '$q'];
    function Auth(Base64, $http, $cookies, $rootScope, $timeout, $q) {
        //Private Properties
		var api = 'http://16watt.com/dev/api/api.php/';
		
		// Set factory return object
		var Auth = {};
		
		var user;
		
		Auth.setUser = function(aUser){
			user = aUser;
		};

		Auth.checkUser = function(){
			if(typeof $rootScope.userData !== 'undefined'){
				return true;
			} else {
				//Not logged in, check for cookie
				var userId = $cookies.getObject('id');
				if (typeof userId !== 'undefined'){
					//We have a cookie, let's log this sucka in
					Auth.AutoLogin(userId, function(response){
						//console.log("Logging in " + $rootScope.userData.username + " from cookie");
					});										
					return true;
				} else {
					return false;
				}				
			}			
		}
		
		Auth.isLoggedIn = function(){
			return(user) ? user : false;
		};
		
		Auth.Login = function (username, password, callback) {
			$http.get(api + 'tbl_Users/username/\'' + username + '\'').then(
				function(response){						
					response.success = (password === response.data.Password);
					callback(response);
					Auth.setUser(response.data.id);
				},
				function(error){
					console.log(error);
				}
			);
		};

		Auth.AutoLogin = function(userId, callback){
            $http.get(api + 'tbl_Users/id/' + userId).then(
                function(response){
              		$rootScope.userData = response.data;
                    Auth.setUser(response.data.id);
                    response.success = true;
                    callback(response);
                },
                function(error){
                    console.log(error);
                }
            );
		};
		
		Auth.SetCredentials = function (username, password, user) {
			var authdata = Base64.encode(username + ':' + password);
			
			$rootScope.globals = {
				currentUser: user
			};
			$rootScope.userData = user;
			
			$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
			//$cookieStore.put('globals', $rootScope.globals);
			var now = new Date(),
			// this will set the expiration to 12 months
			exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
			$cookies.putObject('id', $rootScope.userData.id, {expires: exp});
		};
		
		Auth.ClearCredentials = function () {
			$rootScope.globals = {};
			$rootScope.userData = {};
			$cookies.remove('id');
			$http.defaults.headers.common.Authorization = 'Basic ';
		};
		
		return Auth;
    }

})();
