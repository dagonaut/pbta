(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('BloodMCController', BloodMCController);

        BloodMCController.$inject = ['$http', 'apiservice'];
        function BloodMCController($http, apiservice){
            let vm = this;          
            let _characterTable = "tbl_char";
            let _gameid = 7 // Rhapsody of Blood 
            console.log("Blood MC");

            // Properties
            vm.static = [];
            vm.dudes = [];

            // Methods

            // Events

            // Watches

            init();

            function init(){
                getStatic();
                getDudes();
            }
            function getStatic(){                
                let _classJSON = './games/blood/blood-static.json';
                $http.get(_classJSON).then(getClassJSONSuccess, getClassJSONFail);
                    function getClassJSONSuccess(response){
                        vm.static = response.data;
                        console.log(vm.static);
                    }
                    function getClassJSONFail(error){
                        console.log(error);
                    }
            }

            function getDudes(){
                apiservice.GetByGameId(_characterTable, _gameid).then(getDudesSuccess, getDudesFail);

                function getDudesSuccess(r){
                    // Unpack the JSON data
                    r.forEach(function(char){
                        let model = char;
                        model.data = JSON.parse(char.data);
                        vm.dudes.push(model);
                        
                    });
                    console.log(vm.dudes);
                }

                function getDudesFail(e){
                    console.log(e);
                }
            }  
            
        }
})();