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
            vm.allDirectives = getAllDirectives();
            
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
            function getAllDirectives(){
                DirectiveService.getAll().then(function(data){
                    vm.AllDirectives = data
                });
            }
            function directives(){
                return "<ul style='width:300px;'><li>Illustrious: When your desire for fame draws unwanted attention to the mission, mark experience. </li> <li>Intimate: When you put your friend ________________ ahead of the mission, mark experience.</li>                <li>Rejected: When your former membership of _________________ hinders the mission, mark experience. </li>                <li>Vengeful: When you harm _______________ or their interests, mark experience. </li>                    </ul>";               
            }
            vm.directivesByClass = [
                {Driver: [1,2,3,4]},
                {Fixer: [5,6,7,8]},
                {Hacker: [5,1,7,9]},
                {Hunter: [10,11,12,4]},
                {Infiltrator: [2,6,7,13]},
                {Killer: [14,15,8,7]},
                {Pusher: [16,6,3,13]},
                {Reporter: [11,7,9,4]},
                {Soldier: [12,10,17,6]},
                {Tech: [14,7,8,9]}
            ];
            vm.ClassData = {
                Driver: {directives:[1,2,3,4], cyberware:[9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                Fixer: {directives:[5,6,7,8], cyberware:[1,3,9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                Hacker: {directives:[5,1,7,9], cyberware:[9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                Hunter: {directives:[10,11,12,4], cyberware:[1,2,11,12], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                Infiltrator: {directives:[2,6,7,13], cyberware:[1,2,9,10,11], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                Killer: {directives:[14,15,8,7], cyberware:[1,4,6,7,8,9,10], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                Pusher: {directives:[16,6,3,13], cyberware:[1,3,7,9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                Reporter: {directives:[11,7,9,4], cyberware:[1,2,3,9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                Soldier: {directives:[12,10,17,6], cyberware:[1,3,9,11,12], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                Tech: {directives:[14,7,8,9], cyberware:[1,3,4,9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}}
            };
        }
})();

