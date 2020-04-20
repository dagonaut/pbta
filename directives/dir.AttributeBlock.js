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
                var vm = this;
                
                //watches
                $scope.$on('refresh-dudes', function(evt, holds){
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