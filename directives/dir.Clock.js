(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .directive('clock', clock);
                
        function clock(){
            return{
                restrict: 'E',                
                templateUrl: "/directives/dir.Clock.html",
                scope: {
                    nombre: '='                    
                }
            };
        }
    })();