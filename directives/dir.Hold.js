(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .directive('hold', hold);
        
        function hold(HoldService){
            return{
                restrict: 'E',                
                templateUrl: "./directives/dir.Hold.html",
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
                
                //watches
                $scope.$on('hold-update', function(evt, holds){
                    let updatedHold = holds.find(object => object.id === $scope.hold.id);
                    $scope.hold = updatedHold;
                }, true);

                init();

                function init(){
                    $scope.hold = $scope.holdObj;
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