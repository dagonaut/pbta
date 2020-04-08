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
                getBasicMoves();
            }

            function getUser(){
                console.log("getUser triggered");
                UserService.GetById(1).then(function(response){
                    vm.user = response;
                    console.log("From TestController: " + vm.user.username);
                });
            }

            function getBasicMoves(){
                let _basicMovesJSON = './static/ww-basic_moves.json'
                $http.get(_basicMovesJSON).then(basicMovesSuccess, basicMovesFailure);
                function basicMovesSuccess(response){
                    vm.basicMoves = response.data
                    console.log("basic moves", vm.basicMoves);
                }
                function basicMovesFailure(error){
                    console.log(error);
                }
            }

            
        }
})();