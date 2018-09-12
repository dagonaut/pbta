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
                    mc: '=',
                    clockObj: '=',
                    onDelete: '&',
                    onSave: '&'                                  
                },
                link: link
            };            
            function link($scope, element, attr){
                //let vm = this;
                $scope.name = $scope.clockObj.name;
                $scope.position = $scope.clockObj.position;
                $scope.type = $scope.clockObj.type;
                $scope.description = $scope.clockObj.description;
                $scope.goal = $scope.clockObj.goal;
                $scope.clock = ["","","","","",""];
                $scope.markClock = markClock;
                $scope.clearClock = clearClock;
                $scope.deleteClock = deleteClock;
                $scope.saveClock = saveClock;
                $scope.edit = false;
                
                init();

                function init(){
                    markClock($scope.position);
                }

                // Clock functions
                function markClock(position){                    
                    clearClock();
                    if(position != null){
                        for(var i = 0; i < $scope.clock.length; i++){
                            if (i <= position){
                                $scope.clock[i] = "active";
                            }
                        }
                    }
                    $scope.clockObj.position = position;
                }

                function saveClock(){
                    console.log("trying to update", $scope.clockObj);                    
                    ClockService.Update($scope.clockObj).then(function(data){
                        console.log("updated"); 
                        $scope.edit = false;
                        $scope.onSave();                 
                    });
                }

                function deleteClock(clockId){
                    ClockService.Delete(clockId).then(function(data){
                        console.log("Deleted? " + clockId);
                        $scope.onDelete();
                    });
                    
                }     

                function clearClock(){
                    $scope.clock = ["","","","","",""];
                    $scope.clockObj.position = null;  
                }
            }
        }
    })();