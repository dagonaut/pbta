(function() {
	'use strict';
	var app = angular.module('pbta_resources', ['ui.router', 'ngCookies', 'ngSanitize']);
	var dookie = {};
	//States
	app.config(function($stateProvider) {
		//Set the state variables
		
		var paulState = {
			name: 'auth.paul',
			url: '/paul',
			templateUrl: 'charactersheet.html',
			controller: 'CharacterSheet'
		};
		
		var seanState = {
			name: 'auth.sean',
			url: '/sean',
			templateUrl: 'charactersheet.html',
			controller: 'CharacterSheet'
		};
		
		var brettState = {
			name: 'auth.brett',
			url: '/brett',
			templateUrl: 'charactersheet.html',
			controller: 'CharacterSheet'
		};
		
		var testState = {
			name: 'test',
			url: '/test',
			templateUrl: 'test.html',
			controller: 'TestController',
			data: 4
		};
		
		var loginState = {
			name: 'login',
			url: '/login',
			templateUrl: 'login.html',
			controller: 'LoginController'		  	  	
		};
		
		var registerState = {
			name: 'register',
			url: '/register',
			templateUrl: 'register.html',
			controller: 'LoginController'		  	  	
		};
		
		var authState = {
			name: 'auth',
			templateUrl: 'wrapper.html'
			
		};
		
		var characterState = {
			name: 'auth.character',
			url: '/cs',
			templateUrl: 'charactersheet.html',
			controller: 'CharacterSheet'
		};
		
		var referenceState = {
			name: 'reference',
			url: '/reference',
			templateUrl: 'reference.html',
			controller: 'ReferenceController'
		};
		
		var homeState = {
			name: 'home',
			url: '',
			templateUrl: 'reference.html',
			controller: 'ReferenceController'
		};
		
		//Set the states
		$stateProvider.state(paulState);
		$stateProvider.state(seanState);
		$stateProvider.state(brettState);
		$stateProvider.state(testState);
		$stateProvider.state(loginState);
		$stateProvider.state(authState);
		$stateProvider.state(characterState);
		$stateProvider.state(registerState);
		$stateProvider.state(referenceState);
		$stateProvider.state(homeState);
	});
	
	//Run transitions
	app.run(function($transitions) {
		console.log("app.run");
		
		$transitions.onStart({ to: 'auth.**' }, function(trans) {
			console.log('app.run.$transition.onStart');
			console.log(trans.$to().name);
			var Auth = trans.injector().get('Auth');
			var cookies = getCookie("globals");
			if(cookies !== ""){
				cookies = JSON.parse(cookies);
				Auth.SetCredentials(cookies.currentUser.username, cookies.currentUser.Password, cookies.currentUser);
				Auth.setUser(cookies.currentUser.id)
				//$rootScope.userData = cookies.currentUser;
				//$location.path('/cs');
			}
			if (!Auth.isLoggedIn()) {
				console.log('Deny');
				// User isn't authenticated. Redirect to a new Target State
				return trans.router.stateService.target('login');
			} else { 
				console.log("else"); 
				trans.$to(); 
			}
		});
		
		function getCookie(cname) {
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(';');
			for(var i = 0; i <ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		}
	});
	
	// Authentication Service
	app.factory('Auth', ['Base64', '$http', '$cookies', '$rootScope', '$timeout', function(Base64, $http, $cookies, $rootScope, $timeout){
		// Set factory return object
		var Auth = {};
		
		var user;
		
		Auth.setUser = function(aUser){
			user = aUser;
		};
		
		Auth.isLoggedIn = function(){
			return(user) ? user : false;
		};
		
		Auth.Login = function (username, password, callback) {
			
			/* Dummy authentication for testing, uses $timeout to simulate api call
			----------------------------------------------*/
			/*
			$timeout(function(){
				var response = { success: username === 'test' && password === 'test' };
				if(!response.success) {
					response.message = 'Username or password is incorrect';
				}
				callback(response);
				Auth.setUser("paul");
			}, 1000);
			
			
			/* Use this for real authentication
			----------------------------------------------*/
			$http.get('./api/api.php/tbl_Users/username/"' + username + '"').then(
				function(response){						
					response.success = (password === response.data.Password)
					callback(response);
					Auth.setUser(response.data.id);
				},
				function(error){
					console.log(error);
				}
			)
			/*
			$http.post('./api.php/tbl_Users', { username: username, password: password })
			.success(function (response) {
				console.log("user success");
				callback(response);
			});
			*/		
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
			$cookies.putObject('globals', $rootScope.globals, {expires: exp});
		};
		
		Auth.ClearCredentials = function () {
			$rootScope.globals = {};
			$rootScope.userData = {};
			$cookies.remove('globals');
			$http.defaults.headers.common.Authorization = 'Basic ';
		};
		
		return Auth;
	}]);
	
	// Base64 Requirement for Auth
	app.factory('Base64', function () {
		/* jshint ignore:start */
		
		var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
		
		return {
			encode: function (input) {
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;
				
				do {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);
					
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					
					output = output +
					keyStr.charAt(enc1) +
					keyStr.charAt(enc2) +
					keyStr.charAt(enc3) +
					keyStr.charAt(enc4);
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
				} while (i < input.length);
				
				return output;
			},
			
			decode: function (input) {
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;
				
				// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
				var base64test = /[^A-Za-z0-9\+\/\=]/g;
				if (base64test.exec(input)) {
					window.alert("There were invalid base64 characters in the input text.\n" +
					"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
					"Expect errors in decoding.");
				}
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
				
				do {
					enc1 = keyStr.indexOf(input.charAt(i++));
					enc2 = keyStr.indexOf(input.charAt(i++));
					enc3 = keyStr.indexOf(input.charAt(i++));
					enc4 = keyStr.indexOf(input.charAt(i++));
					
					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;
					
					output = output + String.fromCharCode(chr1);
					
					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}
					
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
					
				} while (i < input.length);
				
				return output;
			}
		};
	});
	
	app.controller('LoginController', ['$scope', '$rootScope', '$location', '$http', 'Auth', function ($scope, $rootScope, $location, $http, Auth) {
		$scope.userData = {};
		
		// reset login status
		//Auth.ClearCredentials();
		
		$scope.login = function () {
			$scope.dataLoading = true;
			$scope.passwordHash = md5($scope.password);
			Auth.Login($scope.username, $scope.passwordHash, function(response) {
				if(response.success) {
					Auth.SetCredentials($scope.username, $scope.passwordHash, response.data);
					$scope.userData = response.data;
					$location.path('/cs');
				} else {
					$scope.error = response.message;
					$scope.dataLoading = false;
				}
			});
		};
		
		$scope.logout = function() {
			Auth.ClearCredentials();
			$location.path('/login');
		}
		
		
		$scope.register = function(user){
			// Check for existing user
			var exists = checkExisting(user);
			if(exists == false){
				var passwordHash = md5(user.Password);
				var method = 'POST';			
				var url = '/api/api.php/tbl_Users/';
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
				}
				$http(config).then(userSuccess, userFailure);
			}
			function userSuccess(response){
				console.log(response);
				$location.path('/login');
			}
			function userFailure(error){
				console.log(error);
			}
			
		}
		function checkExisting(user){
			$http.get('./api/api.php/tbl_Users/username/"' + user.username + '"').then(
				function(response){
					if(response.data.username === user.username){
						return true;
					} else {
						return false;
					}					
				},
				function(error){
					console.log(error);
				}
			)
		}
	}]);
	
	app.controller('TestController', ['$rootScope','$scope','$http','$q','$state','$stateParams','$location', function($rootScope, $scope, $http, $q, $state, $stateParams, $location){
		$scope.testText = 'Test text from $scope.testText';
		$scope.url = $location.path();
	}]);
	
	app.controller('CharacterSheet', ['$rootScope','$scope','$http','$q','$state','$stateParams','$location', function($rootScope, $scope, $http, $q, $state, $stateParams, $location){
		$scope.user = getUser();
		$scope.characterData = getCharacterData();
		$scope.attrModifiers = { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0};
		$scope.allMoves = []; //getCharacterMoves();
		$scope.gear = [{id: 0}, {id: 1}];
		$scope.movesOpen = false;
		
		//Scope Methods
		$scope.attrBonus = attrBonus;
		$scope.setModifiers = setModifiers;
		$scope.showMoves = showMoves;
		
		init();
		
		function init(){
			console.log($scope.user);
			console.log($rootScope.userData);
		}
		
		function getUser(){
			if($location.path() === '/paul'){ return 1; }
			if($location.path() === '/sean'){ return 2; }
			if($location.path() === '/brett'){ return 3; }
			if($location.path() === '/test'){ return 4; }
		}
		
		$scope.addNewChoice = function() {
			var newItemNo = $scope.gear.length;
			$scope.gear.push({'id':newItemNo});
		};
		
		$scope.removeChoice = function(id) {
			
			$scope.gear.splice(id, 1);
		};
		
		$scope.updateCharacter = function(characterData){
			//Grab the Gear array (maybe just put it in the data object below)
			characterData.gear = JSON.stringify($scope.gear);
			characterData.moves = getSelectedMoves();
			var method = 'POST';
			//var key = 'id';
			var url = './api/api.php/tbl_Characters/';
			if(characterData.id){
				method = 'PUT';
				url = url + characterData.id;
			}
			var config = {
				method: method,
				url: url,
				data: {
					id: characterData.id,
					gameid: characterData.gameid,
					playername: characterData.playername,
					name: characterData.name,
					class: characterData.class,
					level: characterData.level,
					xp: characterData.xp,
					look: characterData.look,
					alignment: characterData.alignment,
					damage: characterData.damage,
					hp: characterData.hp,
					basehp: characterData.basehp,
					armor: characterData.armor,
					str: characterData.str,
					dex: characterData.dex,
					con: characterData.con,
					int: characterData.int,
					wis: characterData.wis,
					cha: characterData.cha,
					bonds: characterData.bonds,
					moves: characterData.moves,
					gear: characterData.gear,
					notes: characterData.notes,
					createdby: 1
				}
			}
			$http(config).then(characterSuccess, characterFailure);
			
			function characterSuccess(response){
				console.log(response);
			}
			function characterFailure(error){
				console.log(error);
			}
			
		}
		
		function getCharacterData(){
			$http.get('./api/api.php/tbl_Characters/createdby/' + $rootScope.userData.id).then(
				function(response){
					$scope.characterData = response.data;
					if($scope.characterData.gear){
						$scope.gear = JSON.parse($scope.characterData.gear);
					}
					if($scope.characterData.moves == null){ $scope.characterData.moves = []; }
					getCharacterMoves();
					getBaseDamage();
					setModifiers();
				},
				function(error){
					console.log(error);
				}
			)
		}
		
		function getCharacterDataJSON(){
			$http.get('character_data.json').then(
				function(response){ 
					$scope.characterData = response.data.characters;
					setModifiers();
					//console.log($scope.characterData);
				},
				function(error){ 
					console.log(error); 
				}
			);
		}
		
		function getBaseDamage(){
			if($scope.characterData.class === 'big game hunter') { $scope.characterData.damage = 'd8'; }
			if($scope.characterData.class === 'scrapper') { $scope.characterData.damage = 'd10'; }
			if($scope.characterData.class === 'punk') { $scope.characterData.damage = 'd8'; }
			if($scope.characterData.class === 'clockwerk') { $scope.characterData.damage = 'd4'; }
			if($scope.characterData.class === 'apothecary') { $scope.characterData.damage = 'd6'; }
		}
		
		function getCharacterMoves(){
			var config = {
				method: 'GET',
				url: './api/api.php/tbl_Moves/class/"' + $scope.characterData.class + '"'
			};
			$http(config).then(
				function(response){
					var moves = [];
					for(var i = 0; i < response.data.length; i++){
						moves.push(response.data[i]); 
					}
					$scope.allMoves = moves;
					//console.log(moves);
					//console.log($scope.allMoves);
					
				},
				function(error){
					console.log(error);
				}
			);		
		}
		
		function getSelectedMoves(){
			
		}
		
		function setModifiers(){
			$scope.attrModifiers = {
				"str" : attrBonus($scope.characterData.str),
				"dex" : attrBonus($scope.characterData.dex),
				"con" : attrBonus($scope.characterData.con),
				"int" : attrBonus($scope.characterData.int),
				"wis" : attrBonus($scope.characterData.wis),
				"cha" : attrBonus($scope.characterData.cha)
			}
			//console.log($scope.attrModifiers); 
		}
		
		function attrBonus(attr){
			var modifier = 0;
			switch(attr) {
				case 18:
				modifier = "+3";
				break;
				case 17:
				modifier = "+2";
				break;
				case 16:
				modifier = "+2";
				break;
				case 15:
				modifier = "+1";
				break;
				case 14:
				modifier = "+1";
				break;
				case 13:
				modifier = "+1";
				break;
				case 8:
				modifier = "-1";
				break;
				case 7:
				modifier = "-1";
				break;
				case 6:
				modifier = "-1";
				break;
				case 5:
				modifier = "-2";
				break;
				case 4:
				modifier = "-2";
				break;
				case 3:
				modifier = "-3";
				break;
				case 2:
				modifier = "-3";
				break;
				case 1:
				modifier = "-3";
				break;
				default:
				modifier = "0";
				break;
			}
			
			return modifier;
		}
		
		function showMoves(){
			$scope.movesOpen = !$scope.movesOpen;
		}
		
	}]); 
	
	app.controller('ReferenceController', ['$rootScope','$scope','$http','$q','$sce', function($rootScope, $scope, $http, $q, $sce){
		
		//Scope Properties
		$scope.allMoves = getAllMoves();
		$scope.allMonsters = getAllMonsters();
		$scope.allTags = getAllTags();
		$scope.firstName = "";
		$scope.surName = "";
		$scope.addGrimPortent = addGrimPortent();
		$scope.grimPortents = [];
		
		
		function getAllMoves(){
			var config = {
				method: 'GET',
				url: './api/api.php/tbl_Moves/'
			};
			$http(config).then(
				function(response){
					$scope.allMoves = response.data;
					hideAll();
					console.log($scope.allMoves);				
				},
				function(error){
					console.log(error);
				}
			);
		}
		
		function getAllTags(){
			var config = {
				method: 'GET',
				url: './api/api.php/tbl_Tags/'
			};
			$http(config).then(
				function(response){
					$scope.allTags = response.data;
					
					for(var i = 0; i < $scope.allTags.length; i++){
						$scope.allTags[i]["hide"] = true;
					}
					console.log($scope.allTags);
				},
				function(error){
					console.log(error);
				}
			);
		}
		
		function getAllMonsters(){
			var config = {
				method: 'GET',
				url: './api/api.php/tbl_Monsters/'
			};
			$http(config).then(
				function(response){
					$scope.allMonsters = response.data;
					
					for(var i = 0; i < $scope.allMonsters.length; i++){
						$scope.allMonsters[i]["hide"] = true;
					}
					console.log($scope.allMonsters);
				},
				function(error){
					console.log(error);
				}
			);
		}
		
		$scope.updateFront = function(front){
			var config = {
				method: 'POST',
				url: 'http://16watt.com/pbta/api.php/tbl_Fronts/',
				data: {
					type: front.type,
					cast: front.cast,
					stakes: front.stakes,
					dangertype: front.dangertype,
					grimportents: front.grimportent,
					impendingdoom: front.impendingdoom,
					gameid: 1,
					createdby: 1
				}
			}
			$http(config).then(frontSuccess, frontFailure);
			
			function frontSuccess(response){
				console.log(response);
			}
			function frontFailure(error){
				console.log(error);
			}
			
		}
		
		$scope.grimPortents = [{id: 'gp1'}]
		
		function addGrimPortent(){
			//var newItemNo = $scope.grimPortents.length + 1;
			//$scope.grimPortents.push({id: 'gp' + newItemNo })
		}
		
		
		$scope.updateMonster = function(monster){
			var config = {
				method: 'POST',
				url: './api/api.php/tbl_Monsters/',
				data: {
					name: monster.name,
					category: monster.category,
					attack: monster.attack,
					hp: monster.hp,
					armor: monster.armor,
					weapontags:monster.weapontags,
					specialquality:monster.specialquality,
					description:monster.description,
					monstertags:monster.monstertags,
					moves:monster.moves,
					instinct:monster.instinct,
					gameid: 1,
					createdby: 1
				}
			}
			$http(config).then(monsterSuccess, monsterFailure);
			
			function monsterSuccess(response){
				console.log(response);
			}
			function monsterFailure(error){
				console.log(error);
			}
			
		}
		
		$scope.updateMove = function(move){
			var config = {
				method: 'POST',
				url: 'http://16watt.com/pbta/api.php/tbl_Moves/',
				data: {
					type: move.type,
					name: move.name,
					description: move.description,
					trigger: move.trigger,
					gameid: 1,
					createdby: 1
				}
			}
			$http(config).then(moveSuccess, moveFailure);
			
			function moveSuccess(response){
				console.log(response);
			}
			function moveFailure(error){
				console.log(error);
			}
			
		}
		
		$scope.updateTag = function(tag){
			var config = {
				method: 'POST',
				url: 'http://16watt.com/pbta/api.php/tbl_Tags/',
				data: {
					name: tag.name,
					description: tag.description,
					category: tag.category,
					gameid: 1,
					createdby: 1
				}
			}
			$http(config).then(tagSuccess, tagFailure);
			
			function tagSuccess(response){
				console.log(response);
			}
			function tagFailure(error){
				console.log(error);
			}
			
		}
		
		function hideAll(){
			for(var i = 0; i < $scope.allMoves.length; i++){
				$scope.allMoves[i]["hide"] = true;
			}
		}
		
		$scope.getName = function(type) {
			var min = 0;
			var max = 21125;
			var first = "";
			var surname = "";
			if(type == 'M'){ min = 0; max = 6288;}
			if(type == 'F'){ min = 6289; max = 10679;}
			$scope.firstName = getNameAPI(getRandomArbitrary(min, max));
			$scope.surName = getNameAPI(getRandomArbitrary(10680, 21125));
		}
		
		function getRandomArbitrary(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		
		function getNameAPI(id){
			var config = {
				method: 'GET',
				url: './api/api.php/tbl_Names/id/' + id
			};
			
			$http(config).then(
				function(response){
					if(id < 10680){ $scope.firstName = response.data.name; }
					else { $scope.surName = response.data.name; }
				},
				function(error){
					console.log(error);
				}
			);
		}
		
		
		
		
		
		
		
	}]);
	
	//end app.controller
})(); //end iffy
