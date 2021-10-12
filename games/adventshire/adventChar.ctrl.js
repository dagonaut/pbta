(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('AdventCharacterController', AdventCharacterController);

        AdventCharacterController.$inject = [];
        function AdventCharacterController(){
            let vm = this;           
        
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
                "moxie": 0,
                "influence": 0,
                "advancements": [],
                "moves":[],
                "harm":0
            }

            // Methods

            // Events

            // Watches

            init();

            function init(){

            }
            
        }
})();