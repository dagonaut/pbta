(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .directive('clock', clock);
                
        function clock(){
            return{
                restrict: 'E',                
                templateUrl: "./directives/dir.Clock.html",
                scope: {
                    position: '=',
                    nomnbre: '@'                    
                },
                controller: Controller,
                controllerAs: 'vm',
                bindToController: true
            };
            Controller.$inject['$scope'];
            function Controller($scope){
                var vm = this;

                vm.position = 4;
                vm.nomnbre = 'Tama Tonga';
                console.log(vm);
            }
        }
    })();