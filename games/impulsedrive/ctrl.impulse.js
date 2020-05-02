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

            // vm.character_model = {
            //     id = 1,
            //     gameid = 6,
            //     data = "",
            //     createdby = 1
            // }            

            // Methods
            vm.getRandomNumber = getRandomNumber;
            //vm.save = save;

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

            // function save(){
            //     vm.character_model.data = JSON.stringify(vm.cd);                
            //     // New / Create
            //     if(isCreate){
            //         if(vm.cd.id > -1){
            //             vm.cd = angular.copy(vm.blankCharacter);
            //         }
            //         // JSON / Array conversion
            //         convert(false);
            //         // Create returns id of new character row
            //         apiservice.Create(_characterTable, vm.cd).then(function(data){                        
            //             console.log(data);
            //             loadCharacter(data);
            //         },
            //         function(e){
            //             console.log(e);
            //         });
            //     } else {
            //         // Update
            //         // JSON / Array conversion
            //         convert(false);
            //         apiservice.Update(_characterTable, vm.cd).then(function(data){                        
            //             console.log(data);
            //             // reload the dude to reset arrays/objects
            //             loadCharacter(vm.cd.id);
            //         },
            //         function(e){
            //             console.log(e);
            //         });
            //     }
            // }

            // Helpers
            
            function getRandomNumber(){
                vm.random = Math.floor(Math.random() * 518) + 1;
                console.log(vm.random);
            }
        }
})();