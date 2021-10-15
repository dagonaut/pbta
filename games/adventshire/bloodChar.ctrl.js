(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('BloodCharacterController', BloodCharacterController);

        BloodCharacterController.$inject = ['$rootScope','$scope','$http','$location', '$cookies', 'apiservice'];
        function BloodCharacterController($rootScope, $scope, $http, $location, $cookies, apiservice){
            let vm = this;
            let userId =  $cookies.getObject('id') || 0;

            let _characterTable = "tbl_char";
            let _gameid = 7 // Rhapsody of Blood
            
            vm.blankCharacter = {
                name: "",
                playername: "",
                class: "",                
                look: "",                
                stats: { iron: 0, glass: 0, sulphur: 0, mercury: 0},
                health: {
                    harm: 0,
                    armor: 0,
                    wounds: {minor: false, major: false, mortal: false}
                },
                moves: [],
                gifts: [],
                blood_advancements: { stat1: false, stat2: false, gift1: false, gift2: false, retire: false },
                covenants: [
                    { explorer: "", strength: "", weak: "", rating: 0}
                ],
                gear: "",
                notes: "",                
                visibility: { moves: 'class', classinfo: true, model: false, custom: true, allmoves: false }                
            };

            vm.blankBloodline = {
                bloodline: "",
                stats: { chalices: 0, swords: 0, wands: 0, coins: 0, relics: 0},
                traditions: { style: "", lore: "", name: ""},
                moves: ["none"],
                pacts:"",
                pact: [
                    { bloodline: "", description: ""}
                ],
                visibility: { moves: 'class', classinfo: true, model: false, custom: true, all_moves: true },
                explorers:[
                    {
                        name: "",
                        class: "",                
                        look: "",                
                        stats: { iron: 0, glass: 0, sulphur: 0, mercury: 0},
                        health: {
                            harm: 0,
                            armor: 0,
                            wounds: {minor: false, major: false, mortal: false}
                        },
                        moves: ["none"],
                        gifts: ["none"],
                        blood: 0,
                        blood_advancements: { stat1: false, stat2: false, gift1: false, gift2: false, retire: false },
                        covenants:"",
                        covenant: [
                            { explorer: "", strength: "", weak: "", rating: 0}
                        ],
                        gear: "",
                        notes: "",
                        retired: false,
                        fate: "",                
                        visibility: { all_moves: true, classinfo: true, model: false, custom: true, all_gifts: true }                
                    }
                ],
                playername: ""
            };
            vm.cd = angular.copy(vm.blankBloodline);
            vm.bloodline = "the_half_damned";
            vm.explorer = "slayer";
            vm.bloodlines = [
                { key: "the_legendary_heroes", value: "The Legendary Heroes"},
                { key: "the_half_damned", value: "The Half Damned"},
                { key: "the_holy_church", value: "The Holy Church"},
                { key: "the_hidden_hand", value: "The Hidden Hand"},
                { key: "the_magi", value: "The Magi"}
            ];
            vm.explorers = [
                { key: "slayer", value: "The Slayer"},
                { key: "bonded", value: "The Bonded"},
                { key: "reckoner", value: "The Reckoner"},
                { key: "mystic", value: "The Mystic"},
                { key: "packrat", value: "The Packrat"}
            ];
            
            vm.userId = userId;

            // Database Objects
            vm.dudes = [];

            // Events
            vm.loadCharacter = loadCharacter;
            vm.updateCharacter = updateCharacter;
            vm.deleteCharacter = deleteCharacter;
            vm.updateAdvancements = updateAdvancements;
            vm.updateMoves = updateMoves;
            vm.updateExplorerMoves = updateExplorerMoves;
            vm.updateBloodGifts = updateBloodGifts;            
            vm.showMoves = showMoves;
            vm.filterMoves = filterMoves;
            vm.markHarm = markHarm;
            vm.markContamination = markContamination;

            init();            

            function init(){ 
                getStatic();
                getDudes();
                //loadCharacter(13)
            }            

            function getStatic(){                
                let _classJSON = './games/blood/blood-static.json';
                $http.get(_classJSON).then(getClassJSONSuccess, getClassJSONFail);
                    function getClassJSONSuccess(response){
                        vm.static = response.data;                          
                    }
                    function getClassJSONFail(error){
                        console.log(error);
                    }
            }
            
            function getDudes(){
                apiservice.GetByGameId(_characterTable, _gameid).then(getDudesSuccess, getDudesFail);

                function getDudesSuccess(r){
                    // Unpack the JSON data
                    r.forEach(function(char){
                        let model = char;
                        model.data = JSON.parse(char.data);
                        vm.dudes.push(model);
                    });
                }

                function getDudesFail(e){
                    console.log(e);
                }
            }  

            function showMoves(type){
                vm.cd.visibility.moves = type;
            }

            function filterMoves(id, type){
                switch(type) {
                    case 'bloodline':
                        if(!vm.cd.visibility.all_moves){
                            if(vm.cd.moves.indexOf(id) !== -1){ 
                                return true; 
                            } else {
                                return false;
                            }                        
                        } else {
                            return true;
                        }
                        break;
                    case 'explorer':
                        if(!vm.cd.explorers[0].visibility.all_moves){
                            if(vm.cd.explorers[0].moves.indexOf(id) !== -1){ 
                                return true; 
                            } else {
                                return false;
                            }                        
                        } else {
                            return true;
                        }
                        break;
                    case 'blood':
                        if(!vm.cd.explorers[0].visibility.all_gifts){
                            if(vm.cd.explorers[0].gifts.indexOf(id) !== -1){ 
                                return true; 
                            } else {
                                return false;
                            }                        
                        } else {
                            return true;
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

            function updateExplorerMoves(moveId){
                let index = vm.cd.explorers[0].moves.indexOf(moveId);
                if( index > -1){
                    vm.cd.explorers[0].moves.splice(index, 1);
                } else {
                    vm.cd.explorers[0].moves.push(moveId);
                }
            }

            function updateBloodGifts(moveId){
                let index = vm.cd.explorers[0].gifts.indexOf(moveId);
                if( index > -1){
                    vm.cd.explorers[0].gifts.splice(index, 1);
                } else {
                    vm.cd.explorers[0].gifts.push(moveId);
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
                        vm.cd = angular.copy(vm.blankBloodline);
                    }
                    // JSON / Array conversion
                    //convert(false);
                    // Build generic model
                    let model = {
                        gameid: _gameid,
                        data: JSON.stringify(vm.cd),
                        createdby: userId
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

            function convert(isLoad){
                // If not isLoad we're assuming it is Saving
                if(isLoad){
                    vm.cd.stats = JSON.parse(vm.cd.stats);
                    vm.cd.visibility = JSON.parse(vm.cd.visibility);
                    vm.cd.moves = JSON.parse("[" + vm.cd.moves + "]");                    
                } else {
                    vm.cd.stats = JSON.stringify(vm.cd.stats);
                    vm.cd.visibility = JSON.stringify(vm.cd.visibility);
                    if(vm.cd.moves.length > 0){ vm.cd.moves = vm.cd.moves.join(",") } else { vm.cd.moves = "" };                    
                }
            }

            function markHarm(level){
                switch(level) {
                    case 'minor':
                        vm.cd.explorers[0].health.wounds.minor = !vm.cd.explorers[0].health.wounds.minor; 
                        break;
                    case 'major':
                        vm.cd.explorers[0].health.wounds.major = !vm.cd.explorers[0].health.wounds.major;                        
                        break;
                    case 'mortal':
                        vm.cd.explorers[0].health.wounds.mortal = !vm.cd.explorers[0].health.wounds.mortal; 
                        break;
                    default:
                        vm.cd.explorers[0].health.harm = level;
                    }
            }
            
            function markContamination(level){
                vm.cd.explorers[0].health.contamination = level;
            }
        }
})();