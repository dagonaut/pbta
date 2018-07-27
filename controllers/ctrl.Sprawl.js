(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('Sprawl', sprawl);
        
        sprawl.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', '$sce','Auth','UserService','ClockService','MoveService','TagService', 'DirectiveService'];
        function sprawl($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, $sce, Auth, UserService, ClockService, MoveService, TagService, DirectiveService){
            //Private Properties
            var vm = this;
            var api = 'http://16watt.com/dev/pbta/api/api.php/';
            var userId = ($rootScope.userData.id || 2);
            
            //Scope Properties
            vm.harm = ["","","","","",""]; // THe Harm array represents the 15,18,21,22,23,00 of the harm bar
            vm.directives = directives();
            vm.classes = [{name:'driver'}, {name:'fixer'}, {name:'hacker'}, {name:'hunter'},{name:'infiltrator'},{name:'killer'},{name:'pusher'},{name:'reporter'},{name:'soldier'},{name:'tech'}];
            vm.class = "driver";
            vm.allDirectives = getAllDirectives();
            vm.classMoves = getClassMoves(vm.class);
            vm.sprawlMoves = getSprawlMoves(4);
            vm.allTags = getAllTags(4);
            vm.directivesHtml = "";
            
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
                buildDirectiveHtml();
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
                DirectiveService.GetAll().then(function(data){
                    vm.allDirectives = data;
                    console.log(vm.allDirectives);
                });
            }
            function directives(){
                return "<ul style='width:300px;'><li>Illustrious: When your desire for fame draws unwanted attention to the mission, mark experience. </li> <li>Intimate: When you put your friend ________________ ahead of the mission, mark experience.</li>                <li>Rejected: When your former membership of _________________ hinders the mission, mark experience. </li>                <li>Vengeful: When you harm _______________ or their interests, mark experience. </li>                    </ul>";               
            }

            function buildDirectiveHtml(){
                vm.directivesHtml = "<ul style='width:300px;'>";
                for(let i = 0; i < vm.classData[vm.class].directives.length; i++){
                    let directive = vm.allDirectives.find(x => x.id === vm.classData[vm.class].directives[i]);
                    //let directive = vm.allDirectives.filter(obj => { return obj.id === vm.classData[vm.class].directives[i] });
                    vm.directives += "<li>" + directive.name + ": " + directive.description + "</li>";
                }
                vm.directivesHtml += "</ul>";
                console.log(vm.directivesHtml);

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
            vm.classData = {
                driver: {directives:[1,2,3,4], cyberware:[9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                fixer: {directives:[5,6,7,8], cyberware:[1,3,9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                hacker: {directives:[5,1,7,9], cyberware:[9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                hunter: {directives:[10,11,12,4], cyberware:[1,2,11,12], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                infiltrator: {directives:[2,6,7,13], cyberware:[1,2,9,10,11], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                killer: {directives:[14,15,8,7], cyberware:[1,4,6,7,8,9,10], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                pusher: {directives:[16,6,3,13], cyberware:[1,3,7,9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                reporter: {directives:[11,7,9,4], cyberware:[1,2,3,9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                soldier: {directives:[12,10,17,6], cyberware:[1,3,9,11,12], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}},
                tech: {directives:[14,7,8,9], cyberware:[1,3,4,9], names:[], look:{eyes:[],face:[],body:[],skin:[],wear:[]}}
            };
        }
})();

