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
                matrix: { index: 3, heading: 'Matrix' },
                gear: { index: 4, heading: 'Gear' },
                mc: { index: 5, heading: 'MC' },
                csresponsive: { index: 6, heading: 'Character Sheet Experimental' }                          
            };

            init();

            function init(){

            }
        }
})();

