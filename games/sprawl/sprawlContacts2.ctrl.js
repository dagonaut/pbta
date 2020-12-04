(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('sprawl_contacts', sprawl_contacts);
        
        sprawl_contacts.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', '$sce', '$filter','Auth','UserService','ClockService','MoveService','TagService', 'DirectiveService', 'CyberwareService', 'SprawlCharacterService', 'HoldService', 'apiservice'];
        function sprawl_contacts($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, $sce, $filter, Auth, UserService, ClockService, MoveService, TagService, DirectiveService, CyberwareService, SprawlCharacterService, HoldService, apiservice){
            console.log("Sprawl Contacts 2");
            
            //Private Properties
            let vm = this;            
            let userId =  $cookies.getObject('id');

            vm.userId = userId;
            
            vm.holds = [];
            
            vm.isMC = userId === 2;

            
            // Threat properties
            vm.intel = $cookies.getObject('intel') || 0;
            vm.gear = $cookies.getObject('gear') || 0;

            // Scope Events
            vm.setIntel = setIntel;
            vm.setGear = setGear;
            vm.clocks = [];
            vm.createClock = createClock;
            vm.deleteClock = deleteClock;
            vm.getClocksByUserId = getClocksByUserId;
            vm.refreshThreats = refreshThreats;

            vm.addHold = addHold;

            

            init();
            
            function init(){
                getHolds();
                getClocksByUserId(2);
            }

            

            //#region Hold
            function getHolds(){
                HoldService.GetAll().then(function(data){
                    vm.holds = data;
                    $scope.$broadcast('hold-update', vm.holds);
                });
            }
            function addHold(){
                let newHold = {
                    type: 'user',
                    name: 'new hold',
                    value: 0,
                    createdby: 1
                };
                HoldService.Create(newHold).then(function(data){
                    getHolds();
                })
            }

            //#endregion
            
            //#region Threats / Mission / Clocks
            function createClock(clock){
                var newClock = {
                    type: clock.type,
                    name: clock.name,
                    description: clock.description,
                    goal: clock.goal,
                    gameid: 4,
                    createdby: userId
                }
                ClockService.Create(newClock).then(function(data){
                    vm.showClockEdit = false;
                    getClocksByUserId(2);
                    clock.name = "";
                    clock.type = "";
                    clock.description = "";
                    clock.goal = "";
                });                
            }

            function deleteClock(clockId){
                ClockService.Delete(clockId).then(function(data){
                    console.log("Deleted? " + clockId);
                    getClocksByUserId(userId);
                });
            }            

            function getClocksByUserId(id){
                ClockService.GetByUserId(2).then(function(data){
                    vm.clocks = data;
                    $scope.$broadcast('clock-update', vm.clocks);

                });
            }
            function refreshThreats(){
                getClocksByUserId(2);
                getHolds();
            }

            function setIntel(){
                $cookies.putObject('intel', vm.intel);
            }

            function setGear(){
                $cookies.putObject('gear', vm.gear);
            }
            //#endregion
        }
})();

