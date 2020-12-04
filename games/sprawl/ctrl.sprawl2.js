(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('sprawl2', sprawl2);
        
        sprawl2.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', '$sce', '$filter','Auth','UserService','ClockService','MoveService','TagService', 'DirectiveService', 'CyberwareService', 'SprawlCharacterService', 'HoldService', 'apiservice'];
        function sprawl2($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, $sce, $filter, Auth, UserService, ClockService, MoveService, TagService, DirectiveService, CyberwareService, SprawlCharacterService, HoldService, apiservice){
            //Private Properties
            let vm = this;
            let userId =  $cookies.getObject('id');            
            
            vm.IsMC = userId === 2;

            vm.tabs = {
                charactersheet: { index: 0, heading: 'Character Sheet' },
                reference: { index: 1, heading: 'Reference' },
                threats: { index: 2, heading: 'Threats' },
                map: { index: 3, heading: 'Map' },
                contacts: { index: 4, heading: 'Contacts' },
                operation: { index: 5, heading: 'Operation' },
                matrix: { index: 6, heading: 'Matrix' },
                gear: { index: 7, heading: 'Gear' },
                mc: { index: 8, heading: 'MC' },
                csresponsive: { index: 9, heading: 'Experimental' }                          
            };

            init();

            function init(){

            }
        }
})();

