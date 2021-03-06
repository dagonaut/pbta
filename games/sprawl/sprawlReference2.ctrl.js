(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('sprawl_reference', sprawl_reference);
        
        sprawl_reference.$inject = ['$rootScope','$scope','$http','MoveService','TagService'];
        function sprawl_reference($rootScope, $scope, $http, MoveService, TagService){
            //Private Properties
            let vm = this;
            console.log("Sprawl Reference 2");
            
            // Refernce properties
            vm.sprawlMoves = getSprawlMoves(4);
            vm.jsonMoves = getSprawlJSONMoves();
            vm.allTags = getAllTags(4);            

            //#region Moves
            function getSprawlMoves(id){
                MoveService.GetByGameId(id).then(function(data){
                    vm.sprawlMoves = data;
                    hideAll();
                });
            }

            function getSprawlJSONMoves(){
                $http.get("./games/sprawl/sprawl-moves.json").then(function(moves){
                    vm.jsonMoves = moves.data;
                    vm.basicMoves = moves.data.filter(obj=>obj.type === "Basic");
                    vm.matrixMoves = moves.data.filter(obj=>obj.type === "matrix");
                })
            }

            function hideAll(){
                for(var i = 0; i < vm.sprawlMoves.length; i++){
                    vm.sprawlMoves[i]["hide"] = true;
                }
            }
            //#endregion

            //#region Tags
            function getAllTags(gameid){
                TagService.GetByGameId(gameid).then(
                    function(data){
                        vm.allTags = data;
                        
                        for(var i = 0; i < vm.allTags.length; i++){
                            vm.allTags[i]["hide"] = true;
                        }
                    },
                    function(error){
                    }
                );
            }
            //#endregion
        }
})();

