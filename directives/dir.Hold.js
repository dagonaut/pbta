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
                                                    
                },
                link: link
            };            
            function link($scope, element, attr){
                                
                init();

                function init(){
                    console.log("HOLD!");
                }

                
            }
        }
    })();