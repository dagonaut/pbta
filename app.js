(function() {
	'use strict';
	var app = angular.module('pbta_resources', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ngSanitize', 'checklist-model']);

	//States
	app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
		//Set the state variables

		$urlRouterProvider.otherwise(''); //Instead of 404
		
		/*
		$stateProvider.state('root', {            
            abstract: true,
            resolve: {
                initApp: initApp,
                state: ['$state', function ($state) {
                    return $state;
                }]
            }
        });
		*/
		$stateProvider
			.state('auth.test', {
				url: '/test',
				templateUrl: 'test.html',
				controller: 'TestController',
				controllerAs: 'vm'
			})
			.state('login',{
				url: '/login',
				templateUrl: 'login.html',
				controller: 'LoginController',
				controllerAs: 'vm'
			})
			.state('register',{
				url: '/register',
				templateUrl: 'register.html',
				controller: 'LoginController',
				controllerAs: 'vm'
			})
			.state('auth',{
				templateUrl: 'wrapper.html'				
			})
			.state('auth.character',{
				url: '/cs',
				templateUrl: 'charactersheet.html',
				controller: 'CharacterSheet',
				controllerAs: 'vm'
			})
			.state('auth.so77',{
				url: '/so77',
				templateUrl: 'so77.html',
				controller: 'so77Controller',
				controllerAs: 'vm'
			})			
			.state('auth.reference',{
				url: '/reference',
				templateUrl: 'reference.html',
				controller: 'ReferenceController',
				controllerAs: 'vm'
			})			
			.state('auth.gmreference',{
				url: '/gmreference',
				templateUrl: 'gmreference.html',
				controller: 'ReferenceController',
				controllerAs: 'vm'
			})					
			.state('auth.sprawl',{
				url: '/sprawl',	
				stateName: 'Sprawl',			
				views: {	
					'sprawl':{
						templateUrl: 'sprawl.html',
						controller: 'Sprawl as vm'
					},			
					'charactersheet@auth.sprawl': {
						templateUrl: 'sprawlCharactersheet.html',
						controller: 'Sprawl as vm'
					},
					'reference@auth.sprawl': {
						templateUrl: 'sprawlReference.html',
						controller: 'Sprawl as vm'
					},
					'threats@auth.sprawl': {
						templateUrl: 'sprawlThreats.html',
						controller: 'Sprawl as vm'
					},
				}
			})
			/*
			.state('auth.sprawl.detail',{
				//stateName: 'Sprawl',
				views: {				
					'sprawl.charactersheet@auth.sprawl.detail': {
						templateUrl: 'sprawlCharactersheet.html',
						controller: 'Sprawl as vm'
					},
					'sprawl.reference@auth.sprawl.detail': {
						templateUrl: 'sprawlReference.html',
						controller: 'Sprawl as vm'
					},
					'sprawl.threats@auth.sprawl.detail': {
						templateUrl: 'sprawlThreats.html',
						controller: 'Sprawl as vm'
					},
				}
			})	
						
			.state('auth.sprawl',{
				url: '/sprawl',
				templateUrl: 'sprawl.html',
				controller: 'Sprawl',
				controllerAs: 'vm'
			})			
			.state('auth.sprawlcharactersheet',{
				url: '/sprawlcharactersheet',
				templateUrl: 'sprawlCharactersheet.html',
				controller: 'Sprawl',
				controllerAs: 'vm'
			})			
			.state('auth.sprawlreference',{
				url: '/sprawlreference',
				templateUrl: 'sprawlReference.html',
				controller: 'Sprawl',
				controllerAs: 'vm'
			})		
			.state('auth.threats',{
				url: '/threats',
				templateUrl: 'sprawlThreats.html',
				controller: 'Sprawl',
				controllerAs: 'vm'
			})
			*/
			.state('home',{
				url: '',
				templateUrl: 'reference.html',
				controller: 'ReferenceController',
				controllerAs: 'vm'
			});	

			// To remove #! from URL
			$locationProvider.html5Mode(true);
	});
	
	//Run transitions
	app.run(function($transitions) {		
		$transitions.onStart({ to: 'auth.**' }, function(trans) {
			console.log('app.run.$transition.onStart');
			//console.log(trans.$to().name);
			var Auth = trans.injector().get('Auth');
			if(Auth.checkUser()){
				trans.$to();
			} else {
				console.log('Deny');
				return trans.router.stateService.target('login');				
			}
			
			/*
			var userId = getCookie("id");
			if(!Auth.checkUser()){
				if(userId !== ""){
					//cookies = JSON.parse(cookies);
					//Auth.SetCredentials(cookies.currentUser.username, cookies.currentUser.Password, cookies.currentUser);
					console.log("Cookie sets user")
					Auth.setUser(userId);
					trans.$to();
					//$rootScope.userData = cookies.currentUser;
					//$location.path('/cs');
				}
				else {
					console.log('Deny');
					// User isn't authenticated. Redirect to a new Target State
					return trans.router.stateService.target('login');
				}				
			} else {
				trans.$to();
			}
			*/
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
	// Character Sheet Controller
	app.controller('CharacterSheet', ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', 'Auth', function($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, Auth){
		//Private Properties
		var api = 'http://16watt.com/dev/pbta/api/api.php/';
		
		$scope.user = {};
		$scope.characterData = {};
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
			//console.log($scope.user);
			//console.log($rootScope.userData);
			if (typeof $rootScope.userData === "undefined"){
				if(!Auth.checkUser()){
					$location.path('/login');
				} else {
					$scope.characterData = getCharacterData($cookies.getObject('id'));					
				}
			} else {
				$scope.characterData = getCharacterData($rootScope.userData.id);
			}
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
			characterData.moves = $scope.characterData.moves.toString();
			var method = 'POST';
			//var key = 'id';
			var url = api + 'tbl_Characters/';
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
					createdby: $rootScope.userData.id
				}
			};
			$http(config).then(characterSuccess, characterFailure);
			
			function characterSuccess(response){
				console.log(response);
			}
			function characterFailure(error){
				console.log(error);
			}
			
		};
		
		function getCharacterData(userId){
			$http.get(api + 'tbl_Characters/createdby/' + userId).then(
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
				url: api + 'tbl_Moves/class/"' + $scope.characterData.class + '"'
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
	// Confirmation directive
	app.directive('ngConfirmClick', [
		function(){
			return {
				link: function (scope, element, attr) {
					var msg = attr.ngConfirmClick || "Are you sure?";
					var clickAction = attr.confirmedClick;
					element.bind('click',function (event) {
						if ( window.confirm(msg) ) {
							scope.$eval(clickAction)
						}
					});
				}
			};
	}])
})(); //end iffy
