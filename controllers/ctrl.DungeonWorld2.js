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
        vm.characterData = { moves: [""], level: 1};
        vm.characters = [];
        vm.currentCharacter = {};
        vm.create = typeof vm.characterData.id === 'undefined' ? 'Create' : 'Save'; 

        /*Models
        Static Data:
        Class Moves
        --Starting Moves
        --Selected Moves
        --Separated by Advanced/Expert
        Character Data:
        Starting Hit Points
        Base Damage
        Starting Gear
        Starting Gear (choices)
        Alignment & Associated move
        Races & Associated move
        //Moves (AllMoves, ClassMoves, SelectedMoves)
        */
        

        //Events
        vm.selectClass = selectClass;
        vm.saveCharacter = saveCharacter;
        vm.loadCharacter = loadCharacter;
        vm.updateMoves = updateMoves;

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
                }
                function staticFailure(error, b, c){
                    console.log("Fail", error, b, c);                    
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
            // Remove the empty ("") from the model
            let i = vm.characterData.move.indexOf("");
            if(i > -1){vm.characterData.moves.splice(i, 1);}
            
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
                    loadCharacter(vm.characterData.id);
                });
            }
        }
        
        function loadCharacter(character){
            let d = JSON.parse(character);
            // When loading a dude, make sure we get the latest from the DB.
            DWCharacterService.GetById(d.id).then(function(data){
                vm.characterData = data;
                vm.class = vm.characterData.class;
                vm.characterData.moves = JSON.parse("[" + vm.characterData.moves + "]");
                vm.create = "Save";
            });
        }

        function updateMoves(moveKey){
            let index = vm.characterData.moves.indexOf(moveKey);
            if( index > -1){
                vm.characterData.moves.splice(index, 1);
            } else {
                if(vm.characterData.moves = ""){ vm.characterData.moves = [""];}
                vm.characterData.moves.push(moveKey);
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