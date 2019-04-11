(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .controller('DungeonWorld2', DungeonWorld2);

    DungeonWorld2.$inject = ['$rootScope', '$scope', '$http', 'DWCharacterService'];
    function DungeonWorld2($rootScope, $scope, $http, DWCharacterService) {
        //Private Properties
        let vm = this;
        let api = 'http://16watt.com/dev/pbta/api/api.php/';
        let staticFile = "./static/dw-basic.json";    
        let userId = 2 //$rootScope.userData.id;
        let gameId = 1 //??? 
        
        //Debug variables
        window.bug2 = {
            vm: vm,
            scope: $scope,
            rootScope: $rootScope
        }

        //Static        
        vm.static = {};

        //Properties        
        vm.class = {};
        vm.characterData = { moves: ["taco"], level: 1};
        vm.characters = [];
        vm.currentCharacter = {};
        vm.visibility = { starting: true, moves: true, races: true, alignments: true, gear: true } // true is show all; false is show selected
        vm.create = typeof vm.characterData.id === 'undefined' ? 'Create' : 'Save'; 
        
        //Events
        vm.selectClass = selectClass;
        vm.saveCharacter = saveCharacter;
        vm.loadCharacter = loadCharacter;
        vm.updateMoves = updateMoves;
        vm.filterMoves = filterMoves;

        init();

        function init() {
            //console.log($scope.user);
            //console.log($rootScope.userData);
            // if (typeof $rootScope.userData === "undefined") {
            //     if (!Auth.checkUser()) {
            //         $location.path('/login');
            //     } else {
            //         $scope.characterData = getCharacterData($cookies.getObject('id'));
            //     }
            // } else {
            //     $scope.characterData = getCharacterData($rootScope.userData.id);
            // }
            getStaticCharacterData();
            getCharacters();            
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
            let d = JSON.parse(character);
            // When loading a dude, make sure we get the latest from the DB.
            DWCharacterService.GetById(d.id).then(function(data){
                vm.characterData = data;
                vm.class = vm.characterData.class;
                vm.characterData.moves = vm.characterData.moves.split(",");
                vm.create = "Save";
            });
        }

        function updateMoves(moveKey){
            let index = vm.characterData.moves.indexOf(moveKey);
            if( index > -1){
                vm.characterData.moves.splice(index, 1);
            } else {
                vm.characterData.moves.push(moveKey);
            }
        }

        function filterMoves(key){
            if(!vm.visibility.moves){
                if(vm.characterData.moves.indexOf(key) > -1){ return true; }else{ return false; }
            }else{
                return true;
            }
        }


        function getCharacterData(userId) {
            $http.get(api + 'tbl_Characters/createdby/' + userId).then(
                function (response) {
                    $scope.characterData = response.data;
                    if ($scope.characterData.gear) {
                        $scope.gear = JSON.parse($scope.characterData.gear);
                    }
                    if ($scope.characterData.moves == null) { $scope.characterData.moves = []; }
                    getCharacterMoves();
                    getBaseDamage();
                    setModifiers();
                },
                function (error) {
                    console.log(error);
                }
            )
        }

        function showMoves() {
            $scope.movesOpen = !$scope.movesOpen;
        }

    }
})();