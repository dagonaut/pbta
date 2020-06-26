(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('WestCharacterController', WestCharacterController);

        WestCharacterController.$inject = ['$rootScope','$scope','$http','$location', '$cookies', 'apiservice'];
        function WestCharacterController($rootScope, $scope, $http, $location, $cookies, apiservice){
            let vm = this;
            let userId =  $cookies.getObject('id') || 0;

            let _characterTable = "tbl_weirdwest_characters";
            let _gameid = 5 // How the West Was Lost        
            
            vm.blankCharacter = {
                //id: "",
                gameid: 5,
                name: "",
                playername: "",
                class: "",
                level: 1,
                xp: 0,
                look: "",
                stats: { grit: 0, quick: 0, charm: 0, savvy: 0, strange: 0 },
                harm: 0,
                armor: 0,
                history: "",
                moves: [],
                custom: null,
                horse: "",
                gear: "",
                notes: "",
                advancements: [],
                visibility: { moves: true, classinfo: true, model: false, custom: true },
                createdby: userId
            };
            vm.cd = angular.copy(vm.blankCharacter);
            vm.classes_list = [
                { key: "blackhat", value: "The Blackhat"},
                { key: "gambler", value: "The Gambler"},
                { key: "gunslinger", value: "The Gunslinger"},
                { key: "headhoncho", value: "The Head Honcho"},
                { key: "homesteader", value: "The Homesteader"},
                { key: "junker", value: "The Junker"},
                { key: "lawdog", value: "The Law Dog"},
                { key: "lonerider", value: "The Lone Rider"},
                { key: "saint", value: "The Saint"},
                { key: "sawbones", value: "The Saw Bones"},
                { key: "siren", value: "The Siren"}
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
            vm.filterMoves = filterMoves;
            vm.markHarm = markHarm;

            init();            

            function init(){ 
                getMoves();
                getDudes();
                // temp load Brother Logarius
                loadCharacter(21);
            }            

            function getMoves(){                
                let _classJSON = './static/weirdwest/ww-classes.json';
                let _classMovesJSON = './static/weirdwest/ww-classmoves.json';                
                $http.get(_classJSON).then(getClassJSONSuccess, getClassJSONFail);
                    function getClassJSONSuccess(response){
                        vm.static = response.data;   
                    }
                    function getClassJSONFail(error){
                        console.log(error);
                    }
                $http.get(_classMovesJSON).then(getClassMovesJSONSuccess, getClassMovesJSONFail);
                    function getClassMovesJSONSuccess(response){
                        vm.classmoves = response.data;
                        $scope.$broadcast("moves", response.data.moves);   
                    }
                    function getClassMovesJSONFail(error){
                        console.log(error);
                    }
            }

            function filterMoves(id){
                if(vm.cd.visibility.moves){
                    return true;
                }else{
                    if(vm.cd.moves.indexOf(id) > -1){
                        return true;
                    }else{
                        return false;
                    }
                }
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

            function getDudes(){
                apiservice.GetAll("tbl_weirdwest_characters").then(getDudesSuccess, getDudesFail);

                function getDudesSuccess(r){
                    vm.dudes = r;
                    //$scope.$broadcast("got-dudes", vm.dudes);
                }

                function getDudesFail(e){
                    console.log(e);
                }
            }            
            
            //#region CRUD
            function loadCharacter(characterId){
                apiservice.GetById(_characterTable, characterId).then(yes, no);

                function yes(r){
                    console.log("response", r);
                    vm.cd = r;
                    // JSON / array conversion
                    convert(true);
                    // Clear the selected Dude
                    vm.dude = vm.cd.id;          
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
                    convert(false);
                    // Create returns id of new character row
                    apiservice.Create(_characterTable, vm.cd).then(function(data){                        
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
                    vm.cd.horse = JSON.parse(vm.cd.horse);
                    vm.cd.history = JSON.parse(vm.cd.history);
                    vm.cd.visibility = JSON.parse(vm.cd.visibility);
                    vm.cd.moves = JSON.parse("[" + vm.cd.moves + "]");
                    vm.cd.advancements = JSON.parse("[" + vm.cd.advancements + "]"); 
                } else {
                    vm.cd.stats = JSON.stringify(vm.cd.stats);
                    vm.cd.horse = JSON.stringify(vm.cd.horse);
                    vm.cd.history = JSON.stringify(vm.cd.history);
                    vm.cd.visibility = JSON.stringify(vm.cd.visibility);
                    vm.cd.moves = vm.cd.moves.join(",");
                    vm.cd.advancements = vm.cd.advancements.join(",");
                }
            }

            function markHarm(level){
                vm.cd.harm = level;

            }           
        }
})();