(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .directive('clock', clock);
                
        function clock(){
            return{
                restrict: 'E',                
                templateUrl: "./directives/dir.Clock.html",
                scope: {
                    clockObj: '=',
                    position: '=',
                    nomnbre: '='                 
                },
                link: link
            };            
            function link($scope, element, attr){
                //let vm = this;
                console.log($scope.nomnbre);
                //$scope.nomnbre = $scope.clockObj.name;
                //$scope.position = $scope.clockObj.position;
                $scope.clock = ["","","","","",""];
                $scope.taco = 'Goat';
                $scope.markClock = markClock;
                $scope.clearClock = clearClock;
                
                init();

                function init(){
                    console.log($scope.position);
                    markClock($scope.position);
                }

                // Clock functions
                function markClock(position){
                    clearClock();
                    for(var i = 0; i < $scope.clock.length; i++){
                        if (i <= position){
                            $scope.clock[i] = "active";
                        }
                    }
                    console.log($scope.clock);
                }

                function clearClock(){
                    $scope.clock = ["","","","","",""];  
                }
            }
        }
    })();