(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .controller('DungeonWorld2', DungeonWorld2);

    DungeonWorld2.$inject = ['$rootScope', '$scope', '$http', '$cookies', 'DWCharacterService'];
    function DungeonWorld2($rootScope, $scope, $http, $cookies, DWCharacterService) {
        //Private Properties
        let vm = this;
        let api = 'http://16watt.com/dev/pbta/api/api.php/';
        let staticFile = "./static/dw-basic.json";    
        let userId = $cookies.getObject('id');
        let gameId = 1;
        let visibility = { starting: true, moves: true, races: true, alignments: true, gear: false } // true is show all; false is show selected
        
        //Debug variables
        window.d = {
            vm: vm,
            scope: $scope,
            rootScope: $rootScope
        }

        //Static        
        vm.static = {};

        //Custom
        vm.paul = {};
        vm.brett = {};

        //Properties        
        vm.class = {};
        vm.characterData = { moves: ["taco"], level: 1, visibility: visibility};
        vm.characters = [];
        vm.currentCharacter = {};
        vm.create = typeof vm.characterData.id === 'undefined' ? 'Create' : 'Save'; 
        
        //Events
        vm.selectClass = selectClass;
        vm.saveCharacter = saveCharacter;
        vm.loadCharacter = loadCharacter;
        vm.updateMoves = updateMoves;
        vm.filterMoves = filterMoves;

        init();

        function init() {
            getStaticCharacterData();
            getCharacters();
            // Custom -- Grabbing Barnabus(11) & Gethin(13)
            DWCharacterService.GetById(11).then(function(data){
                vm.paul = data;                
                vm.paul.moves = vm.paul.moves.split(",");                
            });            
            DWCharacterService.GetById(13).then(function(data){
                vm.brett = data;                
                vm.brett.moves = vm.brett.moves.split(",");
            });
        }

        function getStaticCharacterData(){
                $.get(staticFile).then(staticSuccess, staticFailure);
                function staticSuccess(response){
                    vm.static = response;
                    buildHTMLviews();
                }
                function staticFailure(error, b, c){
                    console.log("Fail", error, b, c);                    
                }
        }

        function buildHTMLviews(){
            var i, nameHTML, looksHTML;            
            for (i=0; i < vm.static.classes_list.length; i++){
                var htmlviews = { names: "", looks: ""};
                nameHTML = "<div>";
                looksHTML = "<div>";
                //Names:
                let races = Object.keys(vm.static.classes_list[i].names);
                races.forEach(function(race, index){
                    nameHTML += "<strong>" + race + ":</strong> ";
                    vm.static.classes_list[i].names[race].forEach(function(race_name){
                        nameHTML += race_name + ", ";
                    });
                    nameHTML += "<br />";
                });
                if(vm.static.classes_list[i].key === 'immolator'){
                    //Applies to any collection of keyed objects: { "Eyes": ["blue", "green", "taco"] }
                    var immolatorlooks = Object.keys(vm.static.classes_list[i].looks);
                    immolatorlooks.forEach(function(l){
                        looksHTML += l + ": ";
                        vm.static.classes_list[i].looks[l].forEach(function(look_description){
                            looksHTML += look_description + ", ";
                        });
                    });
                } else {                                        
                    //Looks: Eyes, Hair, Clothes, Body *** These are in the static JSON without labels, but are consistent { "looks": ["blue eyes","green eyes"],["long hair", "shaggy hair"],[""]}
                    looksHTML += "<strong>Eyes:</strong> " + vm.static.classes_list[i].looks[0] + "<br />";
                    looksHTML += "<strong>Hair:</strong> " + vm.static.classes_list[i].looks[1] + "<br />";
                    looksHTML += "<strong>Clothes:</strong> " + vm.static.classes_list[i].looks[2] + "<br />";
                    looksHTML += "<strong>Body:</strong> " + vm.static.classes_list[i].looks[3];
                }
                nameHTML += "Helen</div>"
                looksHTML += "</div>";
                htmlviews.looks = looksHTML;
                htmlviews.names = nameHTML;
                vm.static.classes[vm.static.classes_list[i].key].htmlviews = htmlviews;
            }
        }

        function selectClass(selectedClass){
            vm.class = selectedClass;
        }

        function getCharacters(){
            // Grabs the list of characters from the DB
            DWCharacterService.GetByGameId(gameId).then(function(data){
                if(Array.isArray(data)){
                    vm.characters = data;
                } else {
                    vm.characters.push(data);
                }
            });
        }

        function saveCharacter(){
            // Update the model
            vm.characterData.gameId = gameId;            
            vm.characterData.class = vm.class;              
            vm.characterData.createdby = userId;
            vm.characterData.moves = vm.characterData.moves.join(',');
            vm.characterData.visibility = JSON.stringify(vm.characterData.visibility);
            
            // New / Create
            if(typeof vm.characterData.id === 'undefined'){
                // Create returns id of new character row
                DWCharacterService.Create(vm.characterData).then(function(data){
                    loadCharacter(data);
                });
            } else {
                // Update
                DWCharacterService.Update(vm.characterData).then(function(data){                        
                    console.log(data);
                    // reload the dude to reset arrays/objects
                    loadCharacter(vm.characterData);
                });
            }
        }
        
        function loadCharacter(character){
            let d = (typeof character === 'string') ? JSON.parse(character) : character;
            // When loading a dude, make sure we get the latest from the DB.
            DWCharacterService.GetById(d.id).then(function(data){
                vm.characterData = data;
                vm.class = vm.characterData.class;
                vm.characterData.moves = vm.characterData.moves.split(",");
                vm.characterData.visibility = JSON.parse(vm.characterData.visibility);
                vm.create = "Save";
            });
        }

        function updateMoves(moveKey){ // SPELLS are MOVES too
            let index = vm.characterData.moves.indexOf(moveKey);
            if( index > -1){
                vm.characterData.moves.splice(index, 1);
            } else {
                vm.characterData.moves.push(moveKey);
            }
        }

        function filterMoves(key){
            if(vm.characterData.visibility.moves == false){
                if(vm.characterData.moves.indexOf(key) > -1){ return true; }else{ return false; }
            }else{
                return true;
            }
        }
    }
})();