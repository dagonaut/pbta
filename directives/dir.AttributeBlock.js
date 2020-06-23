(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .directive('attributeBlock', attributeBlock);
        
        function attributeBlock(apiservice){
            return{
                restrict: 'E',                
                templateUrl: "./directives/dir.AttributeBlock.html",
                scope: {
                    table: "="
                },
                link: link
            };

            function link($scope, element, attr){               
                let vm = this;
                let table = "tbl_weirdwest_characters";

                $scope.dude = {
                    //id: "",
                    gameid: 5,
                    name: "",
                    playername: "",
                    class: "",
                    level: 1,
                    xp: 0,
                    look: "",
                    stats: { grit: 0, quick: 0, charm: 0, savvy: 0, strange: 0 },
                    harm: 0,
                    armor: 0,
                    history: "",
                    moves: [],
                    custom: null,
                    horse: "",
                    gear: "",
                    notes: "",
                    advancements: [],
                    visibility: { moves: true, classinfo: true, model: false },
                    createdby: 2
                }
                $scope.getDude = getDude;
                
                //watches
                $scope.$on('got-dudes', function(evt, dudes){
                    $scope.dudes = dudes;
                }, true);
                $scope.$on('moves', function(evt, moves){
                    $scope.moves = moves;
                }, true);
                $scope.$on('refresh-dudes', function(evt, args){
                    getDude($scope.dude.id);
                }, true);

                init();

                function init(){

                }

                function getDude(id){
                    console.log(id);
                    apiservice.GetById(table, id).then(y, n);

                    function y(r){
                        console.log(r);
                        $scope.dude = r;
                        $scope.dude.stats = JSON.parse(r.stats);
                        $scope.dude.horse = JSON.parse(r.horse);
                        $scope.dude.history = JSON.parse(r.history);
                        $scope.dude.visibility = JSON.parse(r.visibility);
                        $scope.dude.moves = JSON.parse("[" + r.moves + "]");
                        $scope.dude.advancements = JSON.parse("[" + r.advancements + "]");
                    }

                    function n(e){
                        console.log(e);
                    }
                }
            }
        }
    })();