(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .controller('DungeonWorld2', DungeonWorld2);

    DungeonWorld2.$inject = ['$rootScope', '$scope', '$http', '$q', '$state', '$stateParams', '$location', '$cookies', 'Auth'];
    function DungeonWorld2($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, Auth) {
        //Private Properties
        let vm = this;
        let api = 'http://16watt.com/dev/pbta/api/api.php/';
        
        //Debug variables
        window.bug2 = {
            vm: vm,
            scope: $scope,
            rootScope: $rootScope
        }

        //Static
        vm.attributes = {
            "18": "+3",
            "17": "+2",
            "16": "+2",
            "15": "+1",
            "14": "+1",
            "13": "+1",
            "12": "0",
            "11": "0",
            "10": "0",
            "9": "0",
            "8": "-1",
            "7": "-1",
            "6": "-1",
            "5": "-2",
            "4": "-2",
            "3": "-3",
            "2": "-3",
            "1": "-3"
        };
        vm.staticData = {};

        //Properties        
        vm.user = {};
        vm.class = {};
        vm.allMoves = []; //getCharacterMoves();
        $scope.gear = [{ id: 0 }, { id: 1 }];
        vm.movesOpen = false;

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
            GetStaticCharacterData();            
        }

        function GetStaticCharacterData(){
            var file = "./static/dw-basic.json";                
                $.get(file).then(staticSuccess, staticFailure);
                function staticSuccess(response){
                    $scope.$apply(function(){vm.static = response});
                }
                function staticFailure(error){
                    console.log(error);
                }
        }

        function selectClass(selectedClass){
            vm.class = selectedClass;
        }

        $scope.addNewChoice = function () {
            var newItemNo = $scope.gear.length;
            $scope.gear.push({ 'id': newItemNo });
        };

        $scope.removeChoice = function (id) {

            $scope.gear.splice(id, 1);
        };

        $scope.updateCharacter = function (characterData) {
            //Grab the Gear array (maybe just put it in the data object below)
            characterData.gear = JSON.stringify($scope.gear);
            characterData.moves = $scope.characterData.moves.toString();
            var method = 'POST';
            //var key = 'id';
            var url = api + 'tbl_Characters/';
            if (characterData.id) {
                method = 'PUT';
                url = url + characterData.id;
            }
            var config = {
                method: method,
                url: url,
                data: {
                    id: characterData.id,
                    gameid: characterData.gameid,
                    playername: characterData.playername,
                    name: characterData.name,
                    class: characterData.class,
                    level: characterData.level,
                    xp: characterData.xp,
                    look: characterData.look,
                    alignment: characterData.alignment,
                    damage: characterData.damage,
                    hp: characterData.hp,
                    basehp: characterData.basehp,
                    armor: characterData.armor,
                    str: characterData.str,
                    dex: characterData.dex,
                    con: characterData.con,
                    int: characterData.int,
                    wis: characterData.wis,
                    cha: characterData.cha,
                    bonds: characterData.bonds,
                    moves: characterData.moves,
                    gear: characterData.gear,
                    notes: characterData.notes,
                    createdby: $rootScope.userData.id
                }
            };
            $http(config).then(characterSuccess, characterFailure);

            function characterSuccess(response) {
                console.log(response);
            }
            function characterFailure(error) {
                console.log(error);
            }

        };

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