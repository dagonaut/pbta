(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('Sprawl', sprawl);
        
        sprawl.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', '$sce','Auth','UserService','ClockService','MoveService','TagService', 'DirectiveService', 'CyberwareService', 'SprawlCharacterService'];
        function sprawl($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, $sce, Auth, UserService, ClockService, MoveService, TagService, DirectiveService, CyberwareService, SprawlCharacterService){
            //Private Properties
            var vm = this;
            var api = 'http://16watt.com/dev/pbta/api/api.php/';
            var userId =  2;
            
            //Scope Properties
            vm.harm = ["","","","","",""]; // THe Harm array represents the 15,18,21,22,23,00 of the harm bar
            vm.directives = directives();
            vm.classes = [{name:'driver'}, {name:'fixer'}, {name:'hacker'}, {name:'hunter'},{name:'infiltrator'},{name:'killer'},{name:'pusher'},{name:'reporter'},{name:'soldier'},{name:'tech'}];
            vm.class = "driver";
            vm.allDirectives = getAllDirectives();
            vm.classMoves = getClassMoves(vm.class);
            vm.sprawlMoves = getSprawlMoves(4);
            vm.allTags = getAllTags(4);
            vm.allCyberware = getAllCyberware();
            vm.characterData = {};
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
                    },
                    function(error){
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

            // Cyberware
            function getAllCyberware(){
                CyberwareService.GetAll().then(function(data){
                    vm.allCyberware = data;
                });
            }

            // Directives
            function getAllDirectives(){
                DirectiveService.GetAll().then(function(data){
                    vm.allDirectives = data;
                });
            }
            function directives(){
                return "<ul style='width:300px;'><li>Illustrious: When your desire for fame draws unwanted attention to the mission, mark experience. </li> <li>Intimate: When you put your friend ________________ ahead of the mission, mark experience.</li>                <li>Rejected: When your former membership of _________________ hinders the mission, mark experience. </li>                <li>Vengeful: When you harm _______________ or their interests, mark experience. </li>                    </ul>";               
            }

            function buildDirectiveHtml(){
                // vm.directivesHtml = "<ul style='width:300px;'>";
                // for(let i = 0; i < vm.classData[vm.class].directives.length; i++){
                //     let directive = vm.allDirectives.find(x => x.id === vm.classData[vm.class].directives[i]);
                //     //let directive = vm.allDirectives.filter(obj => { return obj.id === vm.classData[vm.class].directives[i] });
                //     vm.directives += "<li>" + directive.name + ": " + directive.description + "</li>";
                // }
                // vm.directivesHtml += "</ul>";
                // console.log(vm.directivesHtml);

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

            var fixer = {
                name: "HUSTLING",
                description: "You have people who work for you in various ways. You start with 2-crew and two jobs from the list below. Between missions, choose a number of those jobs equal to or less than your current crew, describe what each job is, and roll EDGE: 10+: you profit from each of your jobs; 7-9: one of them is a Disaster and you Profit from the rest;  6-: everything’s FUBAR. The MC will make a move based on the Disaster for each job.                Choose two:",
                items:[
                    {
                        name: "Surveillance:", 
                        description: "You have a small network of informants who report on events; you then sell that information.",
                        profit: "gain [intel]",
                        disaster: "someone acts on bad info"
                    },
                    { name: "Debt collection:", description: "You have a few burly looking fuckers who collect outstanding debts.", profit: "gain [gear].", disaster: "someone’s out of pocket."},
                    { name: "Petty theft:", description: "You have a small crew who perform minor local robberies.", profit: "gain [gear].", disaster: "they robbed the wrong guy."},
                    { name: "Deliveries:", description: "People hire you to transport things and you have a driver who takes care of that.", profit: "gain 1 Cred.", disaster: "the delivery never arrives."},
                    { name: "Brokering deals:", description: "You arrange for the right people to meet each other.", profit: "gain 1 Cred.", disaster: "the deal that you arranged goes wrong."},
                    { name: "Technical work:", description: "You have a couple of techs whom you supply with work.", profit: "gain [gear].", disaster: "something bad happens to someone else’s property."},
                    { name: "Pimping:", description: "You manage a small stable of physical or virtual sex workers.", profit: "gain [intel].", disaster: "something goes wrong with a customer."},
                    { name: "Addictive Substances:", description: "You manage a small lab producing either drugs or simstim chips.", profit: "gain [intel].", disaster: "something goes wrong for a user or for the lab itself."}
                ]
            }
            
        }
})();

