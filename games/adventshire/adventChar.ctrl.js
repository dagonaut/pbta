(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('AdventCharacterController', AdventCharacterController);

        AdventCharacterController.$inject = ['$http', 'apiservice'];
        function AdventCharacterController($http, apiservice){
            let vm = this;
            let _gameid = 8;
            let _characterTable = "tbl_char";
            vm.userId = 2;           
        
            // Properties
            vm.model = {
                "name": "",
                "class": "",
                "stats": {
                    "poise": 0,
                    "charm": 0,
                    "vigor": 0,
                    "logic": 0,
                    "dream": 0
                },
                "xp":{
                    "enlightenment":0,
                    "resilience": 0
                },
                "armor": 0,
                "moxie": 0,
                "influence": 0,
                "advancements": [],
                "moves":[],
                "harm":0,
                "visibility": { "moves": 'class', "classinfo": true, "model": false, "custom": true, "allmoves": false },
            };
            vm.classes = [
                {"key":"magician", "value":"Street Magician"},
                {"key":"alchemist", "value":"Alchemist"}
            ]
            vm.cd = angular.copy(vm.model);
            vm.dudes = [];
            vm.static = {};

            // tbl_char database model for reference
            let char_model = {
                id: 0,
                gameid: 0,
                data: {},
                createdby: 0
            }

            // Methods
            vm.updateCharacter = updateCharacter;
            vm.loadCharacter = loadCharacter;
            vm.showMoves = showMoves;
            vm.filterMoves = filterMoves;
            vm.updateMoves = updateMoves;
            vm.updateAdvancements = updateAdvancements;
            vm.markEnlightenment = markEnlightenment;
            vm.markResilience = markResilience;
            vm.markHarm = markHarm;

            // Events

            // Watches

            init();

            function init(){
                getStatic();
                getDudes();
            }

            function getStatic(){                
                let _classJSON = './games/adventshire/advent-static.json';
                $http.get(_classJSON).then(getClassJSONSuccess, getClassJSONFail);
                    function getClassJSONSuccess(response){
                        vm.static = response.data;  
                        console.log(vm.static);                        
                    }
                    function getClassJSONFail(error){
                        console.log(error);
                    }
            }

            function getDudes(){
                apiservice.GetByGameId(_characterTable, _gameid).then(getDudesSuccess, getDudesFail);

                function getDudesSuccess(r){
                    console.log(r.id);
                    // Make sure you got some dudes...
                    if(typeof r === 'object'){
                        // Make sure the response data is an array 
                        // (if only 1 row is returned, it is an object not in an array)
                        let rArray = [];
                        if(Array.isArray(r)){
                            rArray = r;
                        } else {
                            rArray.push(r);
                        } 
                        // Unpack the JSON data
                        rArray.forEach(function(char){
                            let model = char;
                            model.data = JSON.parse(char.data);
                            vm.dudes.push(model);
                        });
                    } else {
                        console.log("Sorry... no dudes.")
                    }
                }

                function getDudesFail(e){
                    console.log(e);
                }
            }
            //#region CRUD
            function loadCharacter(characterId){
                apiservice.GetById(_characterTable, characterId).then(yes, no);

                function yes(r){
                    //console.log("response", r);
                    vm.dudeid = r.id;
                    // Pull & parse the JSON
                    vm.cd = JSON.parse(r.data);
                    // Clear the selected Dude
                    //vm.dude = vm.cd.id;
                    //console.log(vm.cd);
                }

                function no(e){
                    console.log(e);
                }
            }
            function updateCharacter(isCreate){
                // New / Create
                if(isCreate){
                    if(vm.cd.id > -1){
                        vm.cd = angular.copy(vm.model);
                    }
                    // JSON / Array conversion
                    //convert(false);
                    // Build generic model
                    let model = {
                        gameid: _gameid,
                        data: JSON.stringify(vm.cd),
                        createdby: vm.userId
                    }
                    // Create returns id of new character row
                    apiservice.Create(_characterTable, model).then(function(data){                        
                        console.log(data);
                        loadCharacter(data);
                    },
                    function(e){
                        console.log(e);
                    });
                } else {
                    // Update
                    // JSON / Array conversion
                    let model = { 
                        id: vm.dudeid,     
                        data: JSON.stringify(vm.cd)                        
                    }
                    apiservice.Update(_characterTable, model).then(function(data){                        
                        console.log(data);
                        // reload the dude to reset arrays/objects
                        loadCharacter(vm.dudeid);
                    },
                    function(e){
                        console.log(e);
                    });
                }
            }
            function deleteCharacter(characterId){
                apiservice.Delete(_characterTable, characterId).then(deleteSuccess, deleteFail);

                function deleteSuccess(r){
                    console.log(r);
                }
                function deleteFail(e){
                    console.log(e);
                }
            }
            //#endregion 


            function showMoves(type){
                // Make sure you have the visibility section (or else this whole thing don't work)
                if(typeof vm.cd.visibility === 'undefined'){
                    vm.cd.visibility = vm.model.visibility;
                }
                vm.cd.visibility.moves = type;
            }

            function filterMoves(id){                
                switch(vm.cd.visibility.moves) {
                    case 'all':
                        return true;
                        break;
                    case 'mine':
                        if(vm.cd.moves.indexOf(id) !== -1){ 
                            return true; 
                        } else {
                            return false;
                        }                        
                        break;
                    case 'class':
                        let move = vm.classmoves.moves.find(obj=>obj.id === id);
                        if(move.class === vm.cd.class){ 
                            return true;
                        } else {
                            return false;
                        }
                        break;
                    default:
                        if(vm.classData[vm.class].moves.indexOf(id) != -1){ return true; }  else { return false; }                      
                }

                // if(vm.cd.visibility.moves){
                //     return true;
                // }else{
                //     if(vm.cd.moves.indexOf(id) > -1){
                //         return true;
                //     }else{
                //         return false;
                //     }
                // }
            }
            
            function updateAdvancements(advId){
                let index = vm.cd.advancements.indexOf(advId);
                if(index > -1){
                    vm.cd.advancements.splice(advId, 1);
                } else {
                    vm.cd.advancements.push(advId);
                }
            }

            function updateMoves(moveId){
                let index = vm.cd.moves.indexOf(moveId);
                if( index > -1){
                    vm.cd.moves.splice(index, 1);
                } else {
                    vm.cd.moves.push(moveId);
                }
            }

            function markEnlightenment(level){
                vm.cd.xp.enlightenment = level;
            }

            function markHarm(level){
                vm.cd.harm = level;
            }

            function markResilience(level){
                vm.cd.xp.resilience = level;
            }           
            
        }
})();