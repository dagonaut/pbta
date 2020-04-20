(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .directive('attributeBlock', attributeBlock);
        
        function attributeBlock(apiservice, $rootScope){
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
                    console.log("scope on", dudes);
                    $scope.dudes = dudes;
                }, true);

                init();

                function init(){
                  //  console.log("dudes", dudes);
                    console.log("scope dudes", $scope.dudes);
                }



                function getDude(id){
                    console.log(id);
                    apiservice.GetById(table, id).then(y, n);

                    function y(r){
                        console.log(r);
                        $scope.dude = r;
                    }

                    function n(e){
                        console.log(e);
                    }
                }

                function deleteHold(id){
                    HoldService.Delete(id).then(function(data){
                        $scope.onDelete();
                    });                    
                }
                
                function updateHold(){
                    HoldService.Update($scope.hold).then(function(data){
                        $scope.onDelete();
                    });                    
                }
            }
        }
    })();