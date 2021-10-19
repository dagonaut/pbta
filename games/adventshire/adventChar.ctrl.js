(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('AdventCharacterController', AdventCharacterController);

        AdventCharacterController.$inject = [];
        function AdventCharacterController(){
            let vm = this;
            let _gameid = 8;           
        
            // Properties
            vm.model = {
                "id": 0,
                "userId": 0,
                "gameId": 6,
                "name": "",
                "class": "",
                "stats": {
                    "poise": 0,
                    "charm": 0,
                    "vigor": 0,
                    "logic": 0,
                    "dream": 0
                },
                "xp":{
                    "enlightenment":0,
                    "resilience": 0
                },
                "armor": 0,
                "moxie": 0,
                "influence": 0,
                "advancements": [],
                "moves":[],
                "harm":0
            }

            // tbl_char database model for reference
            char_model = {
                id: 0,
                gameid: 0,
                data: {},
                createdby: 0
            }

            // Methods

            // Events

            // Watches

            init();

            function init(){
                getDudes();
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
                }

                function getDudesFail(e){
                    console.log(e);
                }
            }
            //#region CRUD
            function loadCharacter(characterId){
                apiservice.GetById(_characterTable, characterId).then(yes, no);

                function yes(r){
                    //console.log("response", r);
                    vm.dudeid = r.id;
                    // Pull & parse the JSON
                    vm.cd = JSON.parse(r.data);
                    // Clear the selected Dude
                    //vm.dude = vm.cd.id;
                    //console.log(vm.cd);
                }

                function no(e){
                    console.log(e);
                }
            }
            function updateCharacter(isCreate){
                // New / Create
                if(isCreate){
                    if(vm.cd.id > -1){
                        vm.cd = angular.copy(vm.blankBloodline);
                    }
                    // JSON / Array conversion
                    //convert(false);
                    // Build generic model
                    let model = {
                        gameid: _gameid,
                        data: JSON.stringify(vm.cd),
                        createdby: userId
                    }
                    // Create returns id of new character row
                    apiservice.Create(_characterTable, model).then(function(data){                        
                        console.log(data);
                        loadCharacter(data);
                    },
                    function(e){
                        console.log(e);
                    });
                } else {
                    // Update
                    // JSON / Array conversion
                    let model = { 
                        id: vm.dudeid,     
                        data: JSON.stringify(vm.cd)                        
                    }
                    apiservice.Update(_characterTable, model).then(function(data){                        
                        console.log(data);
                        // reload the dude to reset arrays/objects
                        loadCharacter(vm.dudeid);
                    },
                    function(e){
                        console.log(e);
                    });
                }
            }
            function deleteCharacter(characterId){
                apiservice.Delete(_characterTable, characterId).then(deleteSuccess, deleteFail);

                function deleteSuccess(r){
                    console.log(r);
                }
                function deleteFail(e){
                    console.log(e);
                }
            }
            //#endregion 
            
        }
})();