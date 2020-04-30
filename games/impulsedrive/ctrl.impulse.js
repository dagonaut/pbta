(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('ImpulseDriveController', ImpulseDriveController);

        ImpulseDriveController.$inject = ['$rootScope','$scope','$http','$location', '$cookies', 'apiservice'];
        function ImpulseDriveController($rootScope, $scope, $http, $location, $cookies, apiservice){
            let vm = this;
            let _gameid = 6; //Impulse Drive
            let _movesJSON = "/pbta/games/impulsedrive/id-moves.json";
            let _tagsJSON = "/pbta/games/impulsedrive/id-tags.json";
            let _namesJSON = "/pbta/games/impulsedrive/id-names.json";

            vm.tabs = {
                reference: { index: 0, heading: 'Reference'},                
            };

            // Methods
            vm.getRandomNumber = getRandomNumber;

            init();

            function init(){
                getMoves();
            }

            function getMoves(){                
                $http.get(_movesJSON).then(getMovesSuccess, getMovesFail);
                    function getMovesSuccess(response){
                        vm.moves = response.data;                  
                    }
                    function getMovesFail(error){
                        console.log(error);
                    }               
                $http.get(_tagsJSON).then(getTagsSuccess, getTagsFail);
                    function getTagsSuccess(response){
                        vm.tags = response.data;                  
                    }
                    function getTagsFail(error){
                        console.log(error);
                    }             
                $http.get(_namesJSON).then(getNamesSuccess, getNamesFail);
                    function getNamesSuccess(response){
                        vm.names = response.data;                  
                    }
                    function getNamesFail(error){
                        console.log(error);
                    }
            }

            // Helpers
            function getRandomNumber(){
                vm.random = Math.floor(Math.random() * 518) + 1;
                console.log(vm.random);
            }
        }
})();