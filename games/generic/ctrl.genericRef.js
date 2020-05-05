(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('gref', gref);

        gref.$inject = ['$rootScope','$scope','$http','$location', '$cookies', 'apiservice'];
        function gref($rootScope, $scope, $http, $location, $cookies, apiservice){
            let vm = this;
            
            let _movesJSON = "/pbta/games/impulsedrive/id-moves.json";
            let _tagsJSON = "/pbta/games/impulsedrive/id-tags.json";
            let _namesJSON = "/pbta/games/impulsedrive/id-names.json";
            
            vm.games = [
                { gameid: 1, name: "Dungeon World" },
                { gameid: 5, name: "How the West(world) Was Lost" },
                { gameid: 6, name: "Impulse Drive (World)" },
            ]
            vm.configs = [
                { 
                    gameid: 1,
                    column_1: ["basic"],
                    column_2: [],
                    column_3: [],
                    column_4: [],
                    links: [],
                    name_generator: "", // "generic", "scifi"
                    color_scheme: {
                        color1: "",
                        color2: "",
                        color3: "",
                        color4: "",
                        color5: ""
                    },
                    json_files: {
                        moves : "",
                        tags: ""
                    }
                }
                
            ];



            // Properties
            vm.gameid = 1;

            // Methods
            vm.getRandomNumber = getRandomNumber;            

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
            }            

            // Helpers
            
            function getRandomNumber(){
                vm.random = Math.floor(Math.random() * 518) + 1;
                console.log(vm.random);
            }
        }
})();