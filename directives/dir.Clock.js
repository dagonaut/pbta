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
                $scope.toggleEdit = toggleEdit;
                $scope.edit = false;
                
                // Watches
                $scope.$on('clock-update', function(evt, clocks){
                    let updatedClock = clocks.find(object => object.id === $scope.clockObj.id);
                    markClock(updatedClock.position);
                }, true);

                init();

                function init(){
                    markClock($scope.position);
                }

                // Clock functions
                function markClock(position, save){                    
                    clearClock();
                    if(position != null){
                        for(var i = 0; i < $scope.clock.length; i++){
                            if (i <= position){
                                $scope.clock[i] = "active";
                            }
                        }
                    }
                    $scope.clockObj.position = position;
                    if(save){
                        saveClock();
                    }
                }

                function saveClock(){
                    ClockService.Update($scope.clockObj).then(function(data){
                        $scope.edit = false;
                        $scope.onDelete();
                    });
                }

                function deleteClock(clockId){
                    ClockService.Delete(clockId).then(function(data){
                        $scope.onDelete();
                    });                    
                }     

                function clearClock(){
                    $scope.clock = ["","","","","",""];
                    $scope.clockObj.position = null;  
                }

                function toggleEdit(){
                    $scope.edit = !$scope.edit;
                }
            }
        }
    })();