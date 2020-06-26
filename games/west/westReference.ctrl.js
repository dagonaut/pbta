(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('WestReferenceController', WestReferenceController);

        WestReferenceController.$inject = ['$rootScope','$scope','$http'];
        function WestReferenceController($rootScope, $scope, $http){
            let vm = this;
            
            // Scope Properties
            vm.visible = { "Basic": [], "Other": [], "Dinero": [], "Fights": []};
            vm.moves = [];
            vm.fightmoves = [];
            
            vm.nameOptions = { 
                male: true,
                female: true,
                cowboy: true,
                simple: true,
                native_american: true,
                spanish: true,
                asian: true
            }   

            init();            

            function init(){ 
                getMoves();            
            }            

            function getMoves(){
                let _movesJSON = './static/weirdwest/ww-moves.json';
                let _fightmovesJSON = './static/weirdwest/ww-fightsMoves.json';                
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

            // Name Generator
            function getName(){
                
            }
        }
})();