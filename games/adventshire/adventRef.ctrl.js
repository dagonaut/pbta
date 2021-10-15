(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('AdventReferenceController', AdventReferenceController);
        
        AdventReferenceController.$inject = ['$rootScope','$scope','$http', 'apiservice'];
        function AdventReferenceController($rootScope, $scope, $http ,apiservice){
            console.log("Advent Ref");

            //Private Properties
            let vm = this;
            //let userId =  $cookies.getObject('id');
            let _JSON = './games/adventshire/advent-static.json';
            
            // Scope Properties
            vm.static = {}

            // Scope Methods

            // Watches

            init();

            function init(){
                getStaticContent();
            }

            function getStaticContent(){
                $http.get(_JSON).then(getStaticContentSuccess, getStaticContentFail);
                    function getStaticContentSuccess(response){
                        vm.static = response.data; 
                    }
                    function getStaticContentFail(error){
                        console.log(error);
                    }
            }
        }
})();