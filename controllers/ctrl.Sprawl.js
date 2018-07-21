(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('Sprawl', sprawl);
        
        sprawl.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', '$sce','Auth','UserService','ClockService','MoveService','TagService'];
        function sprawl($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, $sce, Auth, UserService, ClockService, MoveService, TagService){
            //Private Properties
            var vm = this;
            var api = 'http://16watt.com/dev/pbta/api/api.php/';
            var userId = ($rootScope.userData.id || 2);
            
            //Scope Properties
            vm.harm = ["","","","","",""]; // THe Harm array represents the 15,18,21,22,23,00 of the harm bar
            vm.directives = directives();
            vm.classes = [{name:'driver'}, {name:'fixer'}, {name:'hacker'}, {name:'hunter'},{name:'infiltrator'},{name:'killer'},{name:'pusher'},{name:'reporter'},{name:'soldier'},{name:'tech'}];
            vm.class = "driver";
            vm.classMoves = getClassMoves(vm.class);
            vm.sprawlMoves = getSprawlMoves(4);
            vm.allTags = getAllTags(4);
            
            //Scope Methods	
            vm.markHarm = markHarm;
            vm.clearHarm = clearHarm;

            //Clock related
            vm.clocks = getClocksByUserId(userId);
            vm.createClock = createClock;
            vm.deleteClock = deleteClock;
            vm.getClassMoves = getClassMoves;
            vm.getAllTags = getAllTags;

            init();
            
            function init(){
                console.log(vm.clocks);
            }

            // Clocks
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

            // Moves
            function getClassMoves(c){
                MoveService.GetByClass(c).then(function(data){
                    vm.classMoves = data;
                    console.log(vm.classMoves);

                });
            }

            function getSprawlMoves(id){
                MoveService.GetByGameId(id).then(function(data){
                    vm.sprawlMoves = data;
                    hideAll();
                });
            }

            function hideAll(){
                for(var i = 0; i < vm.sprawlMoves.length; i++){
                    vm.sprawlMoves[i]["hide"] = true;
                }
            }

            // Tags
            function getAllTags(gameid){
                TagService.GetByGameId(gameid).then(
                    function(data){
                        vm.allTags = data;
                        
                        for(var i = 0; i < vm.allTags.length; i++){
                            vm.allTags[i]["hide"] = true;
                        }
                        console.log(vm.allTags);
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }
            
            // Harm
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

            // Directives
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

