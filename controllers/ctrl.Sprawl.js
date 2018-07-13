(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('Sprawl', sprawl);
        
        sprawl.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', '$sce','Auth','UserService','ClockService'];
        function sprawl($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, $sce, Auth, UserService, ClockService){
            //Private Properties
            var vm = this;
            var api = 'http://16watt.com/dev/pbta/api/api.php/';
            var userId = $rootScope.userData.id;
            
            //Scope Properties
            vm.harm = ["","","","","",""]; // THe Harm array represents the 15,18,21,22,23,00 of the harm bar
            vm.directives = directives();
            
            //Scope Methods	
            vm.markHarm = markHarm;
            vm.clearHarm = clearHarm;

            //Clock related
            vm.clocks = getClocksByUserId(userId);
            vm.createClock = createClock;
            vm.deleteClock = deleteClock;

            init();
            
            function init(){
                console.log(vm.clocks);
            }

            function createClock(){
                var newClock = {
                    type: '',
                    name: '',
                    gameid: 4,
                    createdby: userId
                }
                ClockService.Create(newClock);
                getClocksByUserId(2);
                console.log(vm.clocks);
            }

            function deleteClock(clockId){
                ClockService.Delete(clockId);
                getClocksByUserId(userId);
            }

            function getClocksByUserId(id){
                ClockService.GetByUserId(userId).then(function(data){
                    vm.clocks = data;
                });
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

