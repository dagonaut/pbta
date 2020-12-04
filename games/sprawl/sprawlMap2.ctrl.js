(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('sprawl_map', sprawl_map);
        
        sprawl_map.$inject = ['$rootScope','$scope','$http'];
        function sprawl_map($rootScope, $scope, $http){
            //Private Properties
            let vm = this;
            
            // Properties
            

            init();

            function init(){
                console.log("Sprawl Map 2");
            }            
        }
})();

