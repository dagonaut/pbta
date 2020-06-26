(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('WestMCController', WestMCController);

        WestMCController.$inject = ['$rootScope','$scope','$http','$location', '$cookies', 'apiservice'];
        function WestMCController($rootScope, $scope, $http, $location, $cookies, apiservice){
            let vm = this;
            let userId =  $cookies.getObject('id') || 0;

            let _characterTable = "tbl_weirdwest_characters";
            let _gameid = 5 // How the West Was Lost
            
            vm.userId = userId;

            // Database Objects
            vm.dudes = [];
            vm.moves = [];

            // Events
            vm.refreshDudes = refreshDudes;

            init();            

            function init(){ 
                getDudes();
                getMoves();
            }            

            function refreshDudes(){
                $scope.$broadcast("refresh-dudes");
            }

            function getDudes(){
                apiservice.GetAll("tbl_weirdwest_characters").then(getDudesSuccess, getDudesFail);

                function getDudesSuccess(r){
                    vm.dudes = r;
                    $scope.$broadcast("got-dudes", vm.dudes);
                }

                function getDudesFail(e){
                    console.log(e);
                }
            }                               

            function getMoves(){
                // Basic, Advanced, Marshall, etc Moves (and threat info)
                let _movesJSON = './static/weirdwest/ww-moves.json';
                $http.get(_movesJSON).then(getMovesSuccess, getMovesFail);
                    function getMovesSuccess(response){
                        vm.moves = response.data;                  
                    }
                    function getMovesFail(error){
                        console.log(error);
                    }
                // Class Moves (required for character sheet/attribute blocks)
                let _classMovesJSON = './static/weirdwest/ww-classmoves.json';                
                $http.get(_classMovesJSON).then(getClassMovesJSONSuccess, getClassMovesJSONFail);
                    function getClassMovesJSONSuccess(response){
                        vm.classmoves = response.data;
                        $scope.$broadcast("moves", response.data.moves);   
                    }
                    function getClassMovesJSONFail(error){
                        console.log(error);
                    }
            }
        }
})();