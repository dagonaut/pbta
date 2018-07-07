(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('TestController', TestController);

        TestController.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','UserService'];
        function TestController($rootScope, $scope, $http, $q, $state, $stateParams, $location, UserService){
            var vm = this;

            vm.testText = 'Test Text from vm.testText';
            vm.url = $location.path();
            vm.getUser = getUser;
            vm.user = {};

            init();

            function init(){
                console.log("Test Controller Init");
            }

            function getUser(){
                console.log("getUser triggered");
                UserService.GetById(1).then(function(response){
                    vm.user = response;
                    console.log("From TestController: " + vm.user.username);
                });
            }

            
        }
})();