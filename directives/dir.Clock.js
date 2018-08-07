(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .directive('Clock', clock);
        
        clock.$inject = ['$rootScope','$scope','ClockService'];
        function clock($rootScope, $scope, ClockService){
            //Private Properties
            let _template = '<div>Tacos</div>';

            return{
                restrict: 'E',
                template = _template,
                scope: {

                },
                controller: Controller,
                controllerAs: 'vm',
                bindToController: true
            };
        }
    })();