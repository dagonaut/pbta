(function() {
	'use strict';
	var app = angular.module('pbta_resources', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ngSanitize', 'checklist-model', 'mdMarkdownIt']);

	//States
	app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
		

		$urlRouterProvider.otherwise('/'); //Instead of 404		
		
		//Set the state variables
		$stateProvider
			.state('test', {
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
			.state('auth.dw',{
				url: '/dw',	
				stateName: 'DW',			
				views: {	
					'cs':{
						templateUrl: 'games/dungeonworld/dw.html',
						controller: 'DungeonWorld2 as vm'
					},			
					'charactersheet@auth.dw': {
						templateUrl: 'games/dungeonworld/dwCharactersheet.html',
						controller: 'DungeonWorld2 as vm'
					},
					'reference@auth.dw': {
						templateUrl: 'games/dungeonworld/reference.html',
						controller: 'ReferenceController as vm'
					},
					'log@auth.dw': {
						templateUrl: 'games/dungeonworld/dwDMreference.html',
						controller: 'DungeonWorld2 as vm'
					}
				}
			})		
			.state('auth.so77',{
				url: '/so77',
				views: {
					'so77': {
						templateUrl: 'so77.html',
						controller: 'so77Controller as vm',
					}
				}
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
			.state('auth.impulse',{
				url: '/impulse',	
				stateName: 'Impulse',			
				views: {	
					'impulse':{
						templateUrl: './games/impulsedrive/impulse.html',
						controller: 'ImpulseDriveController as vm'
					},
					'reference@auth.impulse': {
						templateUrl: './games/impulsedrive/impulseRef.html',
						controller: 'ImpulseDriveController as vm'
					},			
					'charactersheet@auth.impulse': {
						templateUrl: './games/impulsedrive/impulseChar.html',
						controller: 'ImpulseDriveController as vm'
					},					
					'ship@auth.impulse': {
						templateUrl: './games/impulsedrive/impulseShip.html',
						controller: 'ImpulseDriveController as vm'
					// },
					// 'mc@auth.impulse': {
					// 	templateUrl: './games/impulsedrive/impulseRef.html',
					// 	controller: 'ImpulseDriveController as vm'
					}
				}
			})												
			.state('auth.west',{
				url: '/west',	
				stateName: 'West',			
				views: {	
					'west':{
						templateUrl: 'games/west/west.html',
						controller: 'WestController as vm'
					},			
					'charactersheet@auth.west': {
						templateUrl: 'games/west/westCharactersheet.html',
						controller: 'WestCharacterController as vm'
					},
					'reference@auth.west': {
						templateUrl: 'games/west/westReference.html',
						controller: 'WestReferenceController as vm'
					},
					'mc@auth.west': {
						templateUrl: 'games/west/westMC.html',
						controller: 'WestMCController as vm'
					}
				}
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
					'log@auth.sprawl': {
						templateUrl: 'sprawlLog.html',
						controller: 'Sprawl as vm'
					},
					'gear@auth.sprawl': {
						templateUrl: 'sprawlGear.html',
						controller: 'Sprawl as vm'
					},
					'matrix@auth.sprawl': {
						templateUrl: 'sprawlMatrix.html',
						controller: 'Sprawl as vm'
					},
					'mc@auth.sprawl': {
						templateUrl: 'sprawlMC.html',
						controller: 'Sprawl as vm'
					}
				}
			})							
			.state('auth.sprawl2',{
				url: '/sprawl2',	
				stateName: 'sprawl',			
				views: {	
					'sprawl2':{
						templateUrl: 'games/sprawl/sprawl2.html',
						controller: 'sprawl2 as vm'
					},			
					'charactersheet@auth.sprawl2': {
						templateUrl: 'games/sprawl/sprawlCharactersheet2.html',
						controller: 'sprawl_character as vm'
					},			
					'csresponsive@auth.sprawl2': {
						templateUrl: 'games/sprawl/sprawlCSresponsive.html',
						controller: 'sprawl_character as vm'
					},
					'reference@auth.sprawl2': {
						templateUrl: 'games/sprawl/sprawlReference2.html',
						controller: 'sprawl_reference as vm'
					},
					'threats@auth.sprawl2': {
						templateUrl: 'games/sprawl/sprawlThreats2.html',
						controller: 'sprawl_threats as vm'
					},					
					'gear@auth.sprawl2': {
						templateUrl: 'games/sprawl/sprawlGear2.html',
						controller: 'sprawl_gear as vm'
					},
					'matrix@auth.sprawl2': {
						templateUrl: 'games/sprawl/sprawlMatrix2.html',
						controller: 'sprawl_matrix as vm'
					},
					'operation@auth.sprawl2': {
						templateUrl: 'games/sprawl/sprawlOperation2.html',
						controller: 'sprawl_operation as vm'
					},
					'mc@auth.sprawl2': {
						templateUrl: 'games/sprawl/sprawlMC2.html',
						controller: 'sprawl_mc as vm'
					},
					'map@auth.sprawl2': {
						templateUrl: 'games/sprawl/sprawlMap2.html',
						controller: 'sprawl_map as vm'
					},
					'contacts@auth.sprawl2': {
						templateUrl: 'games/sprawl/sprawlContacts2.html',
						controller: 'sprawl_contacts as vm'
					}
				}
			})			
			.state('auth.dino',{
				url: '/dino',	
				stateName: 'Dino',			
				views: {	
					'dino':{
						templateUrl: 'games/dino/dino.html',
						controller: 'DinoController as vm'
					},			
					'charactersheet@auth.dino': {
						templateUrl: 'games/dino/dinoChar.html',
						controller: 'DinoCharacterController as vm'
					},
					'reference@auth.dino': {
						templateUrl: 'games/dino/dinoRef.html',
						controller: 'DinoReferenceController as vm'
					}
					// 'mc@auth.west': {
					// 	templateUrl: 'games/dino/dinoMC.html',
					// 	controller: 'WestMCController as vm'
					// }
				}
			})			
			.state('auth.blood',{
				url: '/blood',	
				stateName: 'Blood',			
				views: {	
					'blood':{
						templateUrl: 'games/blood/blood.html',
						controller: 'BloodController as vm'
					},			
					'charactersheet@auth.blood': {
						templateUrl: 'games/blood/bloodChar.html',
						controller: 'BloodCharacterController as vm'
					},
					'reference@auth.blood': {
						templateUrl: 'games/blood/bloodRef.html',
						controller: 'BloodReferenceController as vm'
					},
					'mc@auth.blood': {
						templateUrl: 'games/blood/bloodMC.html',
						controller: 'BloodMCController as vm'
					}
				}
			})			
			.state('auth.advent',{
				url: '/advent',	
				stateName: 'Advent',			
				views: {	
					'advent':{
						templateUrl: 'games/adventshire/advent.html',
						controller: 'AdventController as vm'
					},			
					'charactersheet@auth.advent': {
						templateUrl: 'games/adventshire/adventChar.html',
						controller: 'AdventCharacterController as vm'
					},
					'reference@auth.advent': {
						templateUrl: 'games/adventshire/adventRef.html',
						controller: 'AdventReferenceController as vm'
					}
				}
			})		
			.state('home',{
				url: '/'
				//templateUrl: './games/impulsedrive/impulseRef.html',
				//controller: 'ImpulseDriveController as vm'
				// templateUrl: 'reference.html',
				// controller: 'ReferenceController',
				// controllerAs: 'vm'
			});	

			// To remove #! from URL
			$locationProvider.html5Mode({enabled:true, requireBase: false}).hashPrefix('!');
	});
	
	//Run transitions
	app.run(function($transitions) {		
		$transitions.onStart({ to: 'auth.**' }, function(trans) {
			//console.log('app.run.$transition.onStart');
			//console.log(trans.$to().name);
			var Auth = trans.injector().get('Auth');
			if(Auth.checkUser()){
				trans.$to();
			} else {
				//console.log('Deny');
				return trans.router.stateService.target('login');				
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
