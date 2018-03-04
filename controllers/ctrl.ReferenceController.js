(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('ReferenceController', ReferenceController);

        ReferenceController.$inject = ['$rootScope','$scope','$http','$q','$sce'];
        function ReferenceController($rootScope, $scope, $http, $q, $sce){
            //var vm = this;

            //Private Properties
            var api = 'http://16watt.com/dev/pbta/api/api.php/';
            
            //Scope Properties
            $scope.allMoves = getAllMoves();
            $scope.allMonsters = getAllMonsters();
            $scope.allTags = getAllTags();
            $scope.firstName = "";
            $scope.surName = "";
            $scope.addGrimPortent = addGrimPortent();
            $scope.grimPortents = [];
            
            
            function getAllMoves(){
                var config = {
                    method: 'GET',
                    url: api + 'tbl_Moves/'
                };
                $http(config).then(
                    function(response){
                        $scope.allMoves = response.data;
                        hideAll();
                        console.log($scope.allMoves);				
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }
            
            function getAllTags(){
                var config = {
                    method: 'GET',
                    url:  api + 'tbl_Tags/'
                };
                $http(config).then(
                    function(response){
                        $scope.allTags = response.data;
                        
                        for(var i = 0; i < $scope.allTags.length; i++){
                            $scope.allTags[i]["hide"] = true;
                        }
                        console.log($scope.allTags);
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }
            
            function getAllMonsters(){
                var config = {
                    method: 'GET',
                    url:  api + 'tbl_Monsters/'
                };
                $http(config).then(
                    function(response){
                        $scope.allMonsters = response.data;
                        
                        for(var i = 0; i < $scope.allMonsters.length; i++){
                            $scope.allMonsters[i]["hide"] = true;
                        }
                        console.log($scope.allMonsters);
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }
            
            $scope.updateFront = function(front){
                var config = {
                    method: 'POST',
                    url:  api + 'tbl_Fronts/',
                    data: {
                        type: front.type,
                        cast: front.cast,
                        stakes: front.stakes,
                        dangertype: front.dangertype,
                        grimportents: front.grimportent,
                        impendingdoom: front.impendingdoom,
                        gameid: 1,
                        createdby: 1
                    }
                }
                $http(config).then(frontSuccess, frontFailure);
                
                function frontSuccess(response){
                    console.log(response);
                }
                function frontFailure(error){
                    console.log(error);
                }
                
            }
            
            $scope.grimPortents = [{id: 'gp1'}]
            
            function addGrimPortent(){
                //var newItemNo = $scope.grimPortents.length + 1;
                //$scope.grimPortents.push({id: 'gp' + newItemNo })
            }
            
            
            $scope.updateMonster = function(monster){
                var config = {
                    method: 'POST',
                    url:  api + 'tbl_Monsters/',
                    data: {
                        name: monster.name,
                        category: monster.category,
                        attack: monster.attack,
                        hp: monster.hp,
                        armor: monster.armor,
                        weapontags:monster.weapontags,
                        specialquality:monster.specialquality,
                        description:monster.description,
                        monstertags:monster.monstertags,
                        moves:monster.moves,
                        instinct:monster.instinct,
                        gameid: 1,
                        createdby: 1
                    }
                }
                $http(config).then(monsterSuccess, monsterFailure);
                
                function monsterSuccess(response){
                    console.log(response);
                }
                function monsterFailure(error){
                    console.log(error);
                }
                
            }
            
            $scope.updateMove = function(move){
                var config = {
                    method: 'POST',
                    url:  api + 'tbl_Moves/',
                    data: {
                        type: move.type,
                        name: move.name,
                        description: move.description,
                        trigger: move.trigger,
                        gameid: 1,
                        createdby: 1
                    }
                }
                $http(config).then(moveSuccess, moveFailure);
                
                function moveSuccess(response){
                    console.log(response);
                }
                function moveFailure(error){
                    console.log(error);
                }
                
            }
            
            $scope.updateTag = function(tag){
                var config = {
                    method: 'POST',
                    url:  api + 'tbl_Tags/',
                    data: {
                        name: tag.name,
                        description: tag.description,
                        category: tag.category,
                        gameid: 1,
                        createdby: 1
                    }
                }
                $http(config).then(tagSuccess, tagFailure);
                
                function tagSuccess(response){
                    console.log(response);
                }
                function tagFailure(error){
                    console.log(error);
                }
                
            }
            
            function hideAll(){
                for(var i = 0; i < $scope.allMoves.length; i++){
                    $scope.allMoves[i]["hide"] = true;
                }
            }
            
            $scope.getName = function(type) {
                var min = 0;
                var max = 21125;
                var first = "";
                var surname = "";
                if(type == 'M'){ min = 0; max = 6288;}
                if(type == 'F'){ min = 6289; max = 10679;}
                $scope.firstName = getNameAPI(getRandomArbitrary(min, max));
                $scope.surName = getNameAPI(getRandomArbitrary(10680, 21125));
            }
            
            function getRandomArbitrary(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            
            function getNameAPI(id){
                var config = {
                    method: 'GET',
                    url:  api + 'tbl_Names/id/' + id
                };
                
                $http(config).then(
                    function(response){
                        if(id < 10680){ $scope.firstName = response.data.name; }
                        else { $scope.surName = response.data.name; }
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }
        }
})();