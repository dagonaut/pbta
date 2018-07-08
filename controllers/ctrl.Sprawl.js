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
            vm.directives = directives();
            
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

            function directives(){
                return "<ul style='width:300px;'><li>Illustrious: When your desire for fame draws unwanted attention to the mission, mark experience. </li> <li>Intimate: When you put your friend ________________ ahead of the mission, mark experience.</li>                <li>Rejected: When your former membership of _________________ hinders the mission, mark experience. </li>                <li>Vengeful: When you harm _______________ or their interests, mark experience. </li>                    </ul>";
                
                
                // {
                //     "Fixer":
                //     [
                //         {"Illustrious": "When your desire for fame draws unwanted attention to the mission, mark experience." },
                //         {"Intimate": "When you put your friend ________________ ahead of the mission, mark experience."},
                //         {"Rejected": "When your former membership of _________________ hinders the mission, mark experience."},
                //         {"Vengeful": "When you harm _______________ or their interests, mark experience." }
                //     ]
                // }
            }
        }
})();

