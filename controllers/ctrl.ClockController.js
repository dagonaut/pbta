(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('ClockController', ClockController);

        ClockController.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','ClockService'];
        function ClockController($rootScope, $scope, $http, $q, $state, $stateParams, $location, ClockService){
            var vm = this;
            
            vm.getClock = getClock;
            vm.clocks = [];

            init();

            function init(){
                console.log("Clock Controller Init");
            }

            function getUser(){
                console.log("getUser triggered");
                UserService.GetById(1).then(function(response){
                    vm.user = response;
                    console.log("From ClockController: " + vm.user.username);
                });
            }

            
        }
})();