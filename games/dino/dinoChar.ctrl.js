(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('DinoCharacterController', DinoCharacterController);

        DinoCharacterController.$inject = ['$rootScope','$scope','$http','$location', '$cookies', 'apiservice'];
        function DinoCharacterController($rootScope, $scope, $http, $location, $cookies, apiservice){
            let vm = this;
            let userId =  $cookies.getObject('id') || 0;

            let _characterTable = "tbl_char";
            let _gameid = 6 // Escape from Dino Island       
            
            vm.blankCharacter = {
                name: "",
                playername: "",
                class: "",                
                xp: 0,
                look: "",
                personality:"",
                stats: { clever: 0, fit: 0, steady: 0 },
                harm: 0,                
                moves: [],                
                gear: "",
                notes: "",                
                visibility: { moves: 'class', classinfo: true, model: false, custom: true, allmoves: false }                
            };
            vm.cd = angular.copy(vm.blankCharacter);
            vm.classes_list = [
                { key: "doctor", value: "Doctor"},
                { key: "engineer", value: "Engineer"},
                { key: "hunter", value: "Hunter"},
                { key: "kid", value: "Kid"},
                { key: "paleontologist", value: "Paleontologist"},
                { key: "soldier", value: "Soldier"},
                { key: "survivor", value: "Survivor"}
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
            vm.showMoves = showMoves;
            vm.filterMoves = filterMoves;
            vm.markHarm = markHarm;

            init();            

            function init(){ 
                getStatic();
                getDudes();
            }            

            function getStatic(){                
                let _classJSON = './games/dino/dino-static.json';
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
                    vm.dudes = r;
                    console.log(r);
                }

                function getDudesFail(e){
                    console.log(e);
                }
            }  

            function showMoves(type){
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
          
            
            //#region CRUD
            function loadCharacter(characterId){
                apiservice.GetById(_characterTable, characterId).then(yes, no);

                function yes(r){
                    //console.log("response", r);
                    
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
                        vm.cd = angular.copy(vm.blankCharacter);
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
                    convert(false);
                    apiservice.Update(_characterTable, vm.cd).then(function(data){                        
                        console.log(data);
                        // reload the dude to reset arrays/objects
                        loadCharacter(vm.cd.id);
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
                vm.cd.harm = level;
            }           
        }
})();