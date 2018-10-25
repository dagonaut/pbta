(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .directive('hold', hold);
        
        function hold(HoldService){
            return{
                restrict: 'E',                
                templateUrl: "./directives/dir.hold.html",
                scope: {
                    holdObj: "<",
                    onDelete: "&",
                    mc: "="                            
                },
                link: link
            };            
            function link($scope, element, attr){
                

                //methods
                $scope.deleteHold = deleteHold; 
                $scope.updateHold = updateHold; 
                
                init();

                function init(){
                    $scope.hold = $scope.holdObj;
                    console.log("HOLD!");
                }

                function deleteHold(id){
                    HoldService.Delete(id).then(function(data){
                        console.log("Deleted? " + id);
                        $scope.onDelete();
                    });                    
                }
                
                function updateHold(){
                    console.log($scope.hold);
                    HoldService.Update($scope.hold).then(function(data){
                        console.log(data);
                    });
                }
            }
        }
    })();