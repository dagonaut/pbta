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
            let _characterTable = "tbl_char";
            let _gameid = 8;
            
            // Scope Properties
            vm.static = {}
            vm.dudes = [];

            // Scope Methods

            // Watches

            init();

            function init(){
                getStaticContent();
                getDudes();
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

            function getDudes(){
                apiservice.GetByGameId(_characterTable, _gameid).then(getDudesSuccess, getDudesFail);

                function getDudesSuccess(r){
                    console.log(r.id);
                    // Make sure you got some dudes...
                    if(typeof r === 'object'){
                        // Make sure the response data is an array 
                        // (if only 1 row is returned, it is an object not in an array)
                        let rArray = [];
                        if(Array.isArray(r)){
                            rArray = r;
                        } else {
                            rArray.push(r);
                        } 
                        // Unpack the JSON data
                        rArray.forEach(function(char){
                            let model = char;
                            model.data = JSON.parse(char.data);
                            vm.dudes.push(model);
                        });
                        console.log(vm.dudes);
                    } else {
                        console.log("Sorry... no dudes.")
                    }
                }

                function getDudesFail(e){
                    console.log(e);
                }
            }
        }
})();