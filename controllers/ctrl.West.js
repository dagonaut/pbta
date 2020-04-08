(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('WestController', WestController);

        WestController.$inject = ['$rootScope','$scope','$http','$location'];
        function WestController($rootScope, $scope, $http, $location){
            var vm = this;
            
            vm.visible = { "Basic": [], "Other": [], "Dinero": [], "Fights": []};

            init();

            function init(){                 
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

            
        }
})();