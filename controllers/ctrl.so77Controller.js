(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('so77Controller', so77Controller);
        
        so77Controller.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', '$sce','Auth'];
        function so77Controller($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, $sce, Auth){
            //Private Properties
            var vm = this;
            var api = 'http://16watt.com/dev/pbta/api/api.php/';
            
            vm.user = 1;
            vm.characterData = {};
            vm.allMoves = []; //getCharacterMoves();
            vm.roles = [{name:'The Bopper'}, {name:'The Good Old Boy'}, {name:'The Honey Pot'}, {name:'The Rocker'},{name:'The Sleuth'},{name:'The Tough Guy'},{name:'The Vigilante'}];
            vm.stories = [{name:'The All-Star'}, {name:'Ex-Con'}, {name:'Former Badge'}, {name:'Glam'},{name:'Humble Beginnings'},{name:'Kung-Fu'},{name:'One Bad Mother'},{name:'War Vet'},{name:'X-Tech'}];
            vm.attributes = {might: 0, hustle: 0, smooth: 0, brains: 0, soul: 0};
            //vm.allMoves = [{id:0,name:"tacos"},{id:1,name:"nachos"},{id:2,name:"machos"},{id:3,name:"honchos"},{id:4,name:"yarblockos"}];
            //vm.allMoves = [0,1,2,3,4];
            vm.allMoves = getAllMoves();
            vm.moves = [];
            vm.roleDescription = "Tacos";
            vm.storyDescription = "Story";
            vm.thangsDescription = "Thangs"
            vm.visible = { story: false, role: false, thangs: false };
            
            //Scope Methods
            //vm.attrBonus = attrBonus;
            //vm.setModifiers = setModifiers;
            //vm.showMoves = showMoves;		
            
            //Scope Functions
            vm.updateCharacter = updateCharacter;
            vm.updateMoves = updateMoves;
            vm.setRoleDescription = setRoleDescription;
            vm.setStoryDescription = setStoryDescription;
            vm.setVisible = setVisible;

            init();
            
            function init(){
                console.log('init');
                setThangsDescription();
                //getCharacterData(vm.user);
                
                if (typeof $rootScope.userData === "undefined"){
                    if(!Auth.checkUser()){
                        $location.path('/login');
                    } else {
                        vm.characterData = getCharacterData($cookies.getObject('id'));					
                    }
                } else {
                    vm.characterData = getCharacterData($rootScope.userData.id);
                }
                
            }
            
            function setRoleDescription(){
                var file = "";
                switch(vm.characterData.role) {
                    case "The Bopper":
                        file = "./static/so77-BopperMoves.html"
                        break;
                    case "The Good Old Boy":
                        file = "./static/so77-GoodOldBoyMoves.html"
                        break;
                    case "The Honey Pot":
                        file = "./static/so77-HoneyPotMoves.html"
                        break;
                    case "The Rocker":
                        file = "./static/so77-RockerMoves.html"
                        break;
                    case "The Sleuth":
                        file = "./static/so77-SleuthMoves.html"
                        break;
                    case "The Tough Guy":
                        file = "./static/so77-ToughGuyMoves.html"
                        break;
                    case "The Vigilante":
                        file = "./static/so77-VigilanteMoves.html"
                        break;                    
                    default:
                        file = "./static/so77-BopperMoves.html"
                }
                $.get(file).then(roleSuccess, roleFailure);
                function roleSuccess(response){
                    $scope.$apply(function(){vm.roleDescription = response});
                }
                function roleFailure(error){
                    console.log(error);
                }
            }

            function setStoryDescription(){
                var file = "";
                switch(vm.characterData.story) {
                    case "The All-Star":
                        file = "./static/so77-AllStar.html"
                        break;
                    case "Ex-Con":
                        file = "./static/so77-ExCon.html"
                        break;
                    case "Former Badge":
                        file = "./static/so77-FormerBadge.html"
                        break;
                    case "Glam":
                        file = "./static/so77-Glam.html"
                        break;
                    case "Humble Beginnings":
                        file = "./static/so77-HumbleBeginning.html"
                        break;
                    case "Kung-Fu":
                        file = "./static/so77-KungFu.html"
                        break;
                    case "One Bad Mother":
                        file = "./static/so77-OneBadMother.html"
                        break;  
                    case "War Vet":
                        file = "./static/so77-WarVet.html"
                        break;  
                    case "X-Tech":
                        file = "./static/so77-XTech.html"
                        break;                    
                    default:
                        file = "./static/so77-BopperMoves.html"
                }
                $.get(file).then(storySuccess, storyFailure);
                function storySuccess(response){
                    $scope.$apply(function(){vm.storyDescription = response});
                }
                function storyFailure(error){
                    console.log(error);
                }
            }

            function setThangsDescription(){
                var file = "./static/so77-thangs.html";                
                $.get(file).then(thangsSuccess, thangsFailure);
                function thangsSuccess(response){
                    $scope.$apply(function(){vm.thangsDescription = response});
                }
                function thangsFailure(error){
                    console.log(error);
                }
            }

            function getAllMoves(){
                var gameid = 3;
                var config = {
                    method: 'GET',
                    url: api + 'tbl_Moves/gameid/"' + gameid + '"'
                };
                $http(config).then(
                    function(response){
                        var moves = [];
                        for(var i = 0; i < response.data.length; i++){
                            moves.push(response.data[i]); 
                        }
                        vm.allMoves = moves;
                        console.log(moves);
                        //console.log($scope.allMoves);
                        
                    },
                    function(error){
                        console.log(error);
                    }
                );		
            }

            function updateMoves(moveId){
                var i = vm.characterData.moves.indexOf(moveId);
                if (i > -1){
                    vm.characterData.moves.splice(i, 1);
                } else {
                    vm.characterData.moves.push(moveId);
                }
            };     

            function updateCharacter(characterData){
                console.log('updateCharacter');
                console.log(characterData);
                console.log(vm.attributes);
                console.log(JSON.stringify(vm.attributes));
                //Grab the Gear array (maybe just put it in the data object below)
                vm.attibutes = JSON.stringify(vm.attributes);
                characterData.moves = vm.characterData.moves.join(',');
                var method = 'POST';
                //characterData.id = 1;
                characterData.gameid = 3;
                //characterData.createdby = 1;
                //var key = 'id';
                var url = api + 'tbl_so77_Characters/';
                if(characterData.id){
                    method = 'PUT';
                    url = url + characterData.id;
                }
                var config = {
                    method: method,
                    url: url,
                    data: {
                        id: characterData.id,
                        gameid: characterData.gameid,
                        name: characterData.name,
                        role: characterData.role,
                        story: characterData.story,
                        level: characterData.level,
                        xp: characterData.xp,
                        look: characterData.look,
                        alignment: characterData.alignment,
                        damage: characterData.damage,
                        harm: characterData.harm,
                        hooks: characterData.hooks,
                        moves: characterData.moves,
                        gear: characterData.gear,
                        notes: characterData.notes,
                        createdby: characterData.createdby,
                        attributes: characterData.attributes,
                        heat: characterData.heat,
                        buzz: characterData.buzz,
                        might: characterData.might,
                        hustle: characterData.hustle,
                        smooth: characterData.smooth,
                        brains: characterData.brains,
                        soul: characterData.soul,
                    }
                };
                $http(config).then(characterSuccess, characterFailure);
                
                function characterSuccess(response){
                    console.log(response);
                }
                function characterFailure(error){
                    console.log(error);
                }
                
            };
            
            function getCharacterData(userId){
                console.log('getCharacter');
                $http.get(api + 'tbl_so77_Characters/createdby/' + userId).then(
                    function(response){
                        console.log(response);
                        vm.characterData = response.data;
                        vm.characterData.moves = JSON.parse("[" + vm.characterData.moves + "]"); //To keep it as integers not strings
                        setRoleDescription(vm.characterData.role);
                        setStoryDescription(vm.characterData.story);
                        //if(vm.characterData.moves == null){ vm.moves = []; }
                        //getCharacterMoves();
                        //getBaseDamage();
                        //setModifiers();					
                    },
                    function(error){
                        console.log(error);
                    }
                )
            }
            
            function setVisible(section){
                vm.visible[section] = !vm.visible[section];
            }

            function getCharacterMoves(){
                var config = {
                    method: 'GET',
                    url: api + 'tbl_Moves/class/"' + $scope.characterData.class + '"'
                };
                $http(config).then(
                    function(response){
                        var moves = [];
                        for(var i = 0; i < response.data.length; i++){
                            moves.push(response.data[i]); 
                        }
                        $scope.allMoves = moves;
                    },
                    function(error){
                        console.log(error);
                    }
                );		
            }
            
            function setModifiers(){
                if(vm.characterData.attributes != null){
                    vm.characterData.attibutes = JSON.parse(vm.characterData.attributes);
                    console.log(vm.characterData.attributes); 
                } else {
                    // set blank object
                    vm.characterData.attributes = {
                        might: 0,
                        hustle: 0,
                        smooth: 0,
                        brains: 0,
                        soul: 0
                    }
                    console.log(vm.characterData.attributes);
                }
            }
        }
})();