(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('sprawl_operation', sprawl_operation);
        
        sprawl_operation.$inject = ['$rootScope','$scope','$http'];
        function sprawl_operation($rootScope, $scope, $http){
            //Private Properties
            let vm = this;
            
            // Properties
            // TODO: Make this a $get
            vm.operations = {
                "move": {
                    "name": "CONDUCT AN OPERATION",
                    "stat": "EDGE",                    
                    "description": ", describe your plan and who is carrying it out then roll+EDGE. \n10+: everything goes according to plan; you and your team are in perfect position to carry out the final element of the plan. The MC will describe the scene and present you with the opportunity to act. \n7-9: You get your opportunity to act, but it won’t go as smoothly as you would like, choose 1: \n* A preliminary task was not completed on time or accurately; choose a task and the MC will describe how it causes a problem \n* There’s an unexpected complication; choose a consideration and the MC will describe how it causes a problem \n6-: the MC will describe the scene and make a move that puts you on the back foot; both problems described under 7-9 apply as well",
                    "trigger": "When you lead a planned and coordinated operation",
                    "markdown": "**When you lead a planned and coordinated operation**, describe your plan and who is carrying it out then roll+EDGE.  \n**10+**: everything goes according to plan; you and your team are in perfect position to carry out the final element of the plan. The MC will describe the scene and present you with the opportunity to act.  \n**7-9**: You get your opportunity to act, but it won’t go as smoothly as you would like, choose 1:  \n* A preliminary task was not completed on time or accurately; choose a task and the MC will describe how it causes a problem  \n* There’s an unexpected complication; choose a consideration and the MC will describe how it causes a problem  \n  \n**6-**: the MC will describe the scene and make a move that puts you on the back foot; both problems described under 7-9 apply as well"
                },
                "types": [
                    {
                        "name": "DESTRUCTION",
                        "description": "When you want to engage and destroy target assets",
                        "tasks": [
                            "Determine location of assets and approach routes",
                            "Establish matrix overwatch",
                            "Take positions"
                        ],
                        "complications": [
                            "Position and status of security teams",
                            "Location and environmental factors",
                            "Resilience and mobility of target assets"
                        ]
                    },
                    {
                        "name": "GUARD",
                        "description": "When you want to protect target assets",
                        "tasks":[
                            "Determine approach routes and fields of fire",
                            "Take positions",
                            "Establish matrix overwatch"
                        ],
                        "complications":[
                            "Enemy strength and approach vectors",
                            "Location and environmental factors"
                        ]
                    },
                    {
                        "name": "CAPTURE",
                        "description": "When you want to seize control of assets",
                        "tasks":[
                            "Determine location of assets and approach routes",
                            "Take positions",
                            "Establish matrix overwatch"
                        ],
                        "complications":[
                            "Position and status of security teams",
                            "Location and environmental factors",
                            "Virtual surveillance",
                            "Resilience and mobility of target assets",
                        ]
                    },
                    {
                        "name": "WETWORK",
                        "description": "When you want to eliminate a specified target",
                        "tasks":[
                            "Determine location of target and approach routes",
                            "Take positions",
                            "Establish matrix overwatch"
                        ],
                        "complications":[
                            "Position and status of security teams",
                            "Location and environmental factors",
                            "Target and bodyguard vigilance and resilience"
                        ]
                    },
                    {
                        "name": "EXTRACTION",
                        "description": "When you want to exit a hostile situation",
                        "tasks":[
                            "Determine extraction point(s)",
                            "Establish alternate extraction point(s)",
                             "Manoeuvre to extraction points"
                        ],
                        "complications":[
                            "Position, status and mobility of response teams",
                            "Virtual surveillance",
                            "Location factors"
                        ]
                    },
                    {
                        "name": "HUNT",
                        "description": "When you want to locate a target",
                        "tasks":[
                            "Determine approach and search pattern",
                            "Establish matrix overwatch",
                            "Coordinate multiple agents",
                            "Enact search to find target"
                        ],
                        "complications":[
                            "Position and status of security teams",
                            "Location and environmental factors",
                            "Ability of target to remain hidden and/or mobile"
                        ]
                    },
                    {
                        "name": "INFILTRATION",
                        "description": "When you want to manoeuvre without being detected",
                        "tasks":[
                            "Determine entry points",
                            "Establish matrix overwatch",
                            "Avoid detection and manoeuvre to objective point"
                        ],
                        "complications":[
                            "Position and status of security teams",
                            "Location and environmental factors",
                            "Virtual surveillance",
                            "Vigilance of enemy"
                        ]
                    },
                    {
                        "name": "SMUGGLE/COURIER",
                        "description": "hen you want to deliver assets between multiple locations",
                        "tasks":[
                            "Determine transport method and route",
                            "Establish alternate rendezvous",
                            "Determine potential obstacles, ambush locations and choke"
                        ],
                        "complications":[
                            "Resilience and mobility of transportation methods",
                            "Presence of checkpoints and required credentials",
                            "Strength and mobility of pursuing forces"
                        ]
                    }
                ]
            }

            init();

            function init(){
                console.log("Sprawl Operations 2");
            }            
        }
})();

