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
            let _statsJSON = "/pbta/games/impulsedrive/id-characterstatsmodel.json";
            let _classesJSON = "/pbta/games/impulsedrive/id-classes.json";
            let _characterTable = "tbl_char";

            vm.userId = 1;
            vm.tabs = {
                reference: { index: 0, heading: 'Reference'},                
                charactersheet: { index: 1, heading: 'Character Sheet'},                
                ship: { index: 2, heading: 'Ship'},                
            };

            vm.character_model = {                
                gameid: _gameid,
                data: "",
                createdby: vm.userId
            };

            // Methods
            vm.getRandomNumber = getRandomNumber;
            vm.save = save;
            vm.load = load;

            // Testing
            vm.test = "Tacos<br /> Nachoes\n _markdown_";

            init();

            function init(){
                getJSON();
            }

            function getJSON(){                
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
                $http.get(_statsJSON).then(getStatsSuccess, getStatsFail);
                    function getStatsSuccess(response){
                        vm.stats = response.data;                  
                    }
                    function getStatsFail(error){
                        console.log(error);
                    }
                $http.get(_classesJSON).then(getClassesSuccess, getClassesFail);
                    function getClassesSuccess(response){
                        vm.classes = response.data;                  
                    }
                    function getClassesFail(error){
                        console.log(error);
                    }                    
            }

            function save(isCreate){                
                vm.character_model.data = JSON.stringify(vm.cd);                
                // New / Create
                if(isCreate){
                    // if(vm.cd.id > -1){
                    //     vm.cd = angular.copy(vm.blankCharacter);
                    // }
                    // JSON / Array conversion
                    //convert(false);
                    // Create returns id of new character row
                    apiservice.Create(_characterTable, vm.character_model).then(function(data){                        
                        console.log(data);
                        //loadCharacter(data);
                    },
                    function(e){
                        console.log(e);
                    });
                } else {
                    // Update
                    // JSON / Array conversion
                    //convert(false);
                    apiservice.Update(_characterTable, vm.cd).then(function(data){                        
                        console.log(data);
                        // reload the dude to reset arrays/objects
                        //loadCharacter(vm.cd.id);
                    },
                    function(e){
                        console.log(e);
                    });
                }
            }

            function load(){
                let id = 1;
                apiservice.GetById(_characterTable, id).then(y,n);
                function y(r){
                    console.log(r);
                    vm.character_model = r;
                    vm.cd = JSON.parse(vm.character_model.data);
                    //console.log(vm.cd);
                }
                function n(e){
                    console.log(e);
                }

            }

            // Helpers
            
            function getRandomNumber(){
                vm.random = Math.floor(Math.random() * 518) + 1;
                console.log(vm.random);
            }
        }
})();