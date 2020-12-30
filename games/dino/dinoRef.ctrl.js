(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('DinoReferenceController', DinoReferenceController);
        
        DinoReferenceController.$inject = ['$rootScope','$scope','$http', 'apiservice'];
        function DinoReferenceController($rootScope, $scope, $http ,apiservice){
            console.log("Dino Ref");

            //Private Properties
            let vm = this;
            //let userId =  $cookies.getObject('id');
            let _JSON = './games/dino/dino-static.json';
            
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