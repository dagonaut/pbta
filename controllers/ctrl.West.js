(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('WestController', WestController);

        WestController.$inject = ['$rootScope','$scope','$http','$location'];
        function WestController($rootScope, $scope, $http, $location){
            var vm = this;
            
            vm.tabs = {
                charactersheet: { index: 0, heading: 'Character Sheet'},
                reference: { index: 1, heading: 'Reference'},                
                log: { index: 2, heading: 'Log'},
                mc: { index: 3, heading: 'Marshall'}
            };
            vm.visible = { "Basic": [], "Other": [], "Dinero": [], "Fights": []};
            vm.character = {};

            init();

            function init(){ 
                console.log(vm.tabs);
                getMoves();
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
            
            //#region CRUD
            function getCharacters(){}
            function loadCharacter(characterId){}
            function updateCharacter(characterId){}
            function deleteCharacter(characterId){}
            //#endregion
        }
})();