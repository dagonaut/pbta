(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('Sprawl', sprawl);
        
        sprawl.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', '$sce','Auth','UserService'];
        function sprawl($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, $sce, Auth, UserService){
            //Private Properties
            var vm = this;
            var api = 'http://16watt.com/dev/pbta/api/api.php/';
            
            //Scope Properties
            vm.harm = ["","","","","",""]; // THe Harm array represents the 15,18,21,22,23,00 of the harm bar
            
            //Scope Methods	
            vm.markHarm = markHarm;
            vm.clearHarm = clearHarm;

            init();
            
            function init(){
                   
            }
            
            function markHarm(position){
                clearHarm();
                for(var i = 0; i < vm.harm.length; i++){
                    if (i <= position){
                        vm.harm[i] = "active";
                    }
                }
            }

            function clearHarm(){
                vm.harm = ["","","","","",""];  
            }
        }
})();