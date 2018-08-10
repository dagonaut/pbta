(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .directive('clock', clock);
        
        function clock(ClockService){
            return{
                restrict: 'E',                
                templateUrl: "./directives/dir.Clock.html",
                scope: {
                    clockObj: '=',                                  
                },
                link: link
            };            
            function link($scope, element, attr){
                //let vm = this;
                console.log("clockobj", $scope.clockObj);
                $scope.name = $scope.clockObj.name;
                $scope.position = $scope.clockObj.position;
                $scope.clock = ["","","","","",""];
                $scope.markClock = markClock;
                $scope.clearClock = clearClock;
                $scope.saveClock = saveClock;
                
                init();

                function init(){
                    markClock($scope.position);
                }

                // Clock functions
                function markClock(position){
                    $scope.clockObj.position = position;
                    clearClock();
                    if(position != null){
                        for(var i = 0; i < $scope.clock.length; i++){
                            if (i <= position){
                                $scope.clock[i] = "active";
                            }
                        }
                    }
                }

                function saveClock(){
                    console.log("trying to update", $scope.clockObj);
                    ClockService.Update($scope.clockObj).then(function(data){
                        console.log("updated");                    
                    });
                }

                function clearClock(){
                    $scope.clock = ["","","","","",""];  
                }
            }
        }
    })();