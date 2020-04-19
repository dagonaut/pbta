(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('WestController', WestController);

        WestController.$inject = ['$rootScope','$scope','$http','$location', 'apiservice'];
        function WestController($rootScope, $scope, $http, $location, apiservice){
            let vm = this;

            let _characterTable = "tbl_weirdwest_characters";
            let _gameid = 5 // How the West Was Lost
        
            vm.tabs = {
                charactersheet: { index: 0, heading: 'Character Sheet'},
                reference: { index: 1, heading: 'Reference'},                
                log: { index: 2, heading: 'Log'},
                mc: { index: 3, heading: 'Marshall'}
            };
            vm.visible = { "Basic": [], "Other": [], "Dinero": [], "Fights": []};
            vm.cd = {
                //id: "",
                gameid: 5,
                name: "Taco",
                playername: "Paul",
                class: "lawdog",
                level: 1,
                xp: 0,
                look: "handsome",
                stats: { grit: 1, quick: 2, charm: 3, savvy: -1, strange: -2 },
                harm: 0,
                armor: 0,
                history: [
                    {"Dash":3},
                    {"Bernie":-2}
                ],
                moves: [2,3,4],
                custom: null,
                horse: {"key":"value"},
                gear: "Guns",
                notes: "Adventures",
                advancements: [3,4],
                visibility: {},
                createdby: 1
            };

            vm.classes_list = [
                { key: "gunslinger", value: "The Gunslinger"},
                { key: "lawdog", value: "The Law Dog"},
                { key: "lonerider", value: "The Lone Rider"}
            ]

            // Database Objects
            vm.dudes = [];

            // Events
            vm.loadCharacter = loadCharacter;
            vm.updateCharacter = updateCharacter;
            vm.deleteCharacter = deleteCharacter;

            vm.updateAdvancements = updateAdvancements;
            vm.updateMoves = updateMoves;

            init();

            function init(){ 
                console.log("west controller loaded");
                getMoves();
                getDudes();
                //getUsers();
                //loadCharacter(1);
            }            

            function getMoves(){
                let _movesJSON = './static/weirdwest/ww-moves.json';
                let _fightmovesJSON = './static/weirdwest/ww-fightsMoves.json';
                let _classJSON = './static/weirdwest/ww-classes.json';
                $http.get(_movesJSON).then(getMovesSuccess, getMovesFail);
                function getMovesSuccess(response){
                    vm.moves = response.data;                  
                }
                function getMovesFail(error){
                    console.log(error);
                }
                $http.get(_fightmovesJSON).then(getFightMovesSuccess, getFightMovesFail);
                function getFightMovesSuccess(response){
                    vm.fightmoves = response.data;                  
                }
                function getFightMovesFail(error){
                    console.log(error);
                }
                $http.get(_classJSON).then(getClassJSONSuccess, getClassJSONFail);
                function getClassJSONSuccess(response){
                    vm.static = response.data;   
                    console.log(vm.static);               
                }
                function getClassJSONFail(error){
                    console.log(error);
                }
            }

            function filterMoves(id){

            }

            function updateAdvancements(advId){
                if(vm.cd.advancements.indexOf(advId) > -1){
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
                }

                function getDudesFail(e){
                    console.log(e);
                }
            }

            function getUsers(){
                apiservice.GetAll("tbl_Users").then(y, n);

                function y(r){
                    console.log(r);                    
                }

                function n(e){
                    console.log(e);
                }
            }
            
            //#region CRUD
            function getCharacters(){}
            function loadCharacter(characterId){
                apiservice.GetById(_characterTable, 2).then(yes, no);

                function yes(r){
                    vm.cd = r;
                    // JSON / array conversion
                    vm.cd.stats = JSON.parse(r.stats);
                    vm.cd.horse = JSON.parse(r.horse);
                    vm.cd.history = JSON.parse(r.history);
                    vm.cd.visibility = JSON.parse(r.visibility);
                    vm.cd.moves = r.moves.join(",");
                    console.log(vm.cd);                    
                }

                function no(e){
                    console.log(e);
                }
            }
            function updateCharacter(){
                // JSON / Array conversion
                vm.cd.stats = JSON.stringify(vm.cd.stats);
                vm.cd.horse = JSON.stringify(vm.cd.horse);
                vm.cd.history = JSON.stringify(vm.cd.history);
                vm.cd.visibility = JSON.stringify(vm.cd.visibility);
                vm.cd.moves = vm.cd.moves.split(",");
                // New / Create
                if(typeof vm.cd.id === 'undefined'){
                    console.log(vm.cd);                                    
                    // Create returns id of new character row
                    apiservice.Create(_characterTable, vm.cd).then(function(data){                        
                        console.log(data);
                    },
                    function(e){
                        console.log(e);
                    });
                } else {
                    // Update
                    apiservice.Update(_characterTable, vm.cd).then(function(data){                        
                        console.log(data);
                        // reload the dude to reset arrays/objects
                        //loadCharacter(vm.characterData);
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
        }
})();