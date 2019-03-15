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
        vm.static = {};

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
            getStaticCharacterData();            
        }

        function getStaticCharacterData(){
            var file = "./static/dw-basic.json";                
                $.get(file).then(staticSuccess, staticFailure);
                function staticSuccess(response){
                    $scope.$apply(function(){vm.static = response});
                }
                function staticFailure(error, b, c){
                    console.log("Fail", error, b, c);
                    
                }
        }

        function selectClass(selectedClass){
            vm.class = selectedClass;
        }

        function saveCharacter(){
            // Update the model            
            vm.characterData.class = vm.class;                
            vm.characterData.createdby = userId;
            vm.characterData.moves = vm.characterData.moves.join(',');
            
            // New / Create
            if(typeof vm.characterData.id === 'undefined'){
                SprawlCharacterService.Create(vm.characterData).then(function(data){
                    loadDude('{"id":' + data + '}');
                });
            } else {
                // Update
                SprawlCharacterService.Update(vm.characterData).then(function(data){                        
                    console.log(data);
                    // reload the dude to reset arrays/objects
                    loadDude('{"id":' + vm.characterData.id + '}');
                });
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