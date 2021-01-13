(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('BloodReferenceController', BloodReferenceController);
        
        BloodReferenceController.$inject = ['$rootScope','$scope','$http', 'apiservice'];
        function BloodReferenceController($rootScope, $scope, $http ,apiservice){
            console.log("Blood Ref");

            //Private Properties
            let vm = this;
            //let userId =  $cookies.getObject('id');
            let _JSON = './games/blood/blood-static.json';
            
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
                        console.log(response.data);                 
                    }
                    function getStaticContentFail(error){
                        console.log(error);
                    }
            }
        }
})();