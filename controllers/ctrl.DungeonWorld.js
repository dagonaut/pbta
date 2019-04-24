(function () {
    'use strict';

    angular
        .module('pbta_resources')
        .controller('DungeonWorld', DungeonWorld);

    DungeonWorld.$inject = ['$rootScope', '$scope', '$http', '$q', '$state', '$stateParams', '$location', '$cookies', 'Auth'];
    function DungeonWorld($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, Auth) {
        
        
        //Private Properties
        let vm = this;
        let api = 'http://16watt.com/dev/pbta/api/api.php/';
        
        //Debug variables
        window.bug = {
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

        //Scope Properties
        vm.tabs = {
            charactersheet: { index: 0, heading: 'Character Sheet'},
            reference: { index: 1, heading: 'Reference'},
            log: { index: 2, heading: 'DM'},
        };
        $scope.user = {};
        $scope.characterData = {};
        $scope.attrModifiers = { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0 };
        $scope.allMoves = []; //getCharacterMoves();
        $scope.gear = [{ id: 0 }, { id: 1 }];
        $scope.movesOpen = false;

        //Scope Methods
        $scope.attrBonus = attrBonus;
        $scope.setModifiers = setModifiers;
        $scope.showMoves = showMoves;

        init();

        function init() {
            //console.log($scope.user);
            //console.log($rootScope.userData);
            if (typeof $rootScope.userData === "undefined") {
                if (!Auth.checkUser()) {
                    $location.path('/login');
                } else {
                    $scope.characterData = getCharacterData($cookies.getObject('id'));
                }
            } else {
                $scope.characterData = getCharacterData($rootScope.userData.id);
            }
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

        function getCharacterDataJSON() {
            $http.get('character_data.json').then(
                function (response) {
                    $scope.characterData = response.data.characters;
                    setModifiers();
                    //console.log($scope.characterData);
                },
                function (error) {
                    console.log(error);
                }
            );
        }

        function getBaseDamage() {
            if ($scope.characterData.class === 'big game hunter') { $scope.characterData.damage = 'd8'; }
            if ($scope.characterData.class === 'scrapper') { $scope.characterData.damage = 'd10'; }
            if ($scope.characterData.class === 'punk') { $scope.characterData.damage = 'd8'; }
            if ($scope.characterData.class === 'clockwerk') { $scope.characterData.damage = 'd4'; }
            if ($scope.characterData.class === 'apothecary') { $scope.characterData.damage = 'd6'; }
        }

        function getCharacterMoves() {
            var config = {
                method: 'GET',
                url: api + 'tbl_Moves/class/"' + $scope.characterData.class + '"'
            };
            $http(config).then(
                function (response) {
                    var moves = [];
                    for (var i = 0; i < response.data.length; i++) {
                        moves.push(response.data[i]);
                    }
                    $scope.allMoves = moves;
                    //console.log(moves);
                    //console.log($scope.allMoves);

                },
                function (error) {
                    console.log(error);
                }
            );
        }

        function setModifiers() {
            $scope.attrModifiers = {
                "str": attrBonus($scope.characterData.str),
                "dex": attrBonus($scope.characterData.dex),
                "con": attrBonus($scope.characterData.con),
                "int": attrBonus($scope.characterData.int),
                "wis": attrBonus($scope.characterData.wis),
                "cha": attrBonus($scope.characterData.cha)
            }
            //console.log($scope.attrModifiers); 
        }

        function attrBonus(attr) {
            var modifier = 0;
            switch (attr) {
                case 18:
                    modifier = "+3";
                    break;
                case 17:
                    modifier = "+2";
                    break;
                case 16:
                    modifier = "+2";
                    break;
                case 15:
                    modifier = "+1";
                    break;
                case 14:
                    modifier = "+1";
                    break;
                case 13:
                    modifier = "+1";
                    break;
                case 8:
                    modifier = "-1";
                    break;
                case 7:
                    modifier = "-1";
                    break;
                case 6:
                    modifier = "-1";
                    break;
                case 5:
                    modifier = "-2";
                    break;
                case 4:
                    modifier = "-2";
                    break;
                case 3:
                    modifier = "-3";
                    break;
                case 2:
                    modifier = "-3";
                    break;
                case 1:
                    modifier = "-3";
                    break;
                default:
                    modifier = "0";
                    break;
            }

            return modifier;
        }

        function showMoves() {
            $scope.movesOpen = !$scope.movesOpen;
        }

    }
})();