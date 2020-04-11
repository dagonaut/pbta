(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('WestController', WestController);

        WestController.$inject = ['$rootScope','$scope','$http','$location', 'apiservice'];
        function WestController($rootScope, $scope, $http, $location, apiservice){
            var vm = this;
        
            vm.tabs = {
                charactersheet: { index: 0, heading: 'Character Sheet'},
                reference: { index: 1, heading: 'Reference'},                
                log: { index: 2, heading: 'Log'},
                mc: { index: 3, heading: 'Marshall'}
            };
            vm.visible = { "Basic": [], "Other": [], "Dinero": [], "Fights": []};
            vm.cd = {
                id: "",
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
                history: [],
                moves: [],
                custom: null,
                horse: {},
                gear: "",
                notes: "",
                advancements: [],
                visibility: {},
                createdby: 0
            };

            init();

            function init(){ 
                console.log("west controller loaded");
                getMoves();
                getUsers();
                loadCharacter(1);
            }            

            function getMoves(){
                let _movesJSON = './static/weirdwest/ww-moves.json'
                let _fightmovesJSON = './static/weirdwest/ww-fightsMoves.json'
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
                apiservice.GetById("tbl_weirdwest_characters", 1).then(yes, no);

                function yes(r){
                    console.log(JSON.parse(r.stats));                    
                }

                function no(e){
                    console.log(e);
                }
            }
            function updateCharacter(characterId){}
            function deleteCharacter(characterId){}
            //#endregion
        }
})();