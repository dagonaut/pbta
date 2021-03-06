(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('sprawl_mc', sprawl_mc);
        
        sprawl_mc.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', '$sce', '$filter','Auth','UserService','ClockService','MoveService','TagService', 'DirectiveService', 'CyberwareService', 'SprawlCharacterService', 'HoldService', 'apiservice'];
        function sprawl_mc($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, $sce, $filter, Auth, UserService, ClockService, MoveService, TagService, DirectiveService, CyberwareService, SprawlCharacterService, HoldService, apiservice){
            console.log("Sprawl MC 2");
            //Private Properties
            let vm = this;
            let userId =  $cookies.getObject('id');
            let _classDataFile = './static/sprawl-ClassData.json';
            
            vm.tabs = {
                charactersheet: { index: 0, heading: 'Character Sheet' },
                reference: { index: 1, heading: 'Reference' },
                threats: { index: 2, heading: 'Threats' },
                matrix: { index: 3, heading: 'Matrix' },
                gear: { index: 4, heading: 'Gear' },
                mc: { index: 5, heading: 'MC' }
                //log: { index: 6, heading: 'Log' }
            };
            vm.darkMode = true;

            // Static JSON Objects
            setStaticContent();
            
            let _characterDefaults = { advancements:[], moves:[], cyberware:[], links:[{ "id": 0, "value": 0, "name": ""}], cred: 5 };

            //Scope Properties
            vm.harm = ["","","","","",""]; // THe Harm array represents the 15,18,21,22,23,00 of the harm bar
            vm.class = "driver";
            vm.allDirectives = getAllDirectives();
            vm.classMoves = getClassMoves(vm.class);            
            vm.allCyberware = getAllCyberware();
            vm.characterData = angular.copy(_characterDefaults);
            vm.showAllCyberware = true;
            vm.create = typeof vm.characterData.id === 'undefined' ? 'Create' : 'Save';
            vm.userId = userId;
            vm.dudes = [];
            vm.holds = [];
            vm.mcDudes = [{}];
            vm.visibility = { advancement: true, cyberware: 'class' }
            vm.isMC = userId === 2;

            // Refernce properties
            vm.sprawlMoves = getSprawlMoves(4);
            vm.allTags = getAllTags(4);
            vm.showClockEdit = false;

            // Threat properties
            vm.intel = $cookies.getObject('intel') || 0;
            vm.gear = $cookies.getObject('gear') || 0;
           
            vm.nameLookHTML = setNameLookHTML();

            // Log properties
            vm.logs = getLogEntries();
            vm.currentLog = {};
            
            // Scope Methods	
            vm.markHarm = markHarm;
            vm.clearHarm = clearHarm;
            vm.saveCharacter = saveCharacter;
            vm.loadDude = loadDude;
            vm.deleteDude = deleteDude;
            vm.clearDude = clearDude;
            vm.updateAdvancements = updateAdvancements;
            vm.updateMoves = updateMoves;
            vm.updateCyberware = updateCyberware;
            vm.showCyberware = showCyberware;
            vm.filterCyberware = filterCyberware;
            vm.addLink = addLink;
            vm.removeLink = removeLink;
            vm.loadMCDude = loadMCDude;
            vm.getHolds = getHolds;
            vm.addHold = addHold;
            vm.onTabChange = onTabChange;

            // Scope Events
            vm.setIntel = setIntel;
            vm.setGear = setGear;
            vm.refresh = refresh;

            // Reference Sheet methods
            vm.clocks = [];
            vm.createClock = createClock;
            vm.deleteClock = deleteClock;
            vm.getClassMoves = getClassMoves;
            vm.getAllTags = getAllTags;
            vm.getClocksByUserId = getClocksByUserId;            

            // Log methods
            vm.updateLogEntry = updateLogEntry;
            vm.addLogEntry = addLogEntry;
            vm.selectLog = selectLog;

            init();
            
            function init(){
                getDudes();
                getHolds();
                getClocksByUserId(2);
            }

            //#region Tabs
            function onTabChange(){
                getHolds();
                getClocksByUserId(2);
            }
            //#endregion

            //#region Dude / Character load/save/etc
            function refresh(){
                for(let i = 0; i < 4; i++){
                    let position = i;
                    let d = vm.mcDudes[position];
                    // Don't do it if there isn't a dude.
                    if(typeof d.id !== 'undefined'){
                        SprawlCharacterService.GetById(d.id).then(function(data){
                            vm.mcDudes[position] = data;                        
                            vm.mcDudes[position].moves = JSON.parse("[" + data.moves + "]");
                            vm.mcDudes[position].cyberware = JSON.parse("[" + data.cyberware + "]");
                        });
                    }              
                }
            }

            function saveCharacter(){
                // Update the model
                console.log(vm.characterData);
                vm.characterData.class = vm.class;                
                vm.characterData.createdby = userId;
                vm.characterData.advancements = vm.characterData.advancements.join(',');
                vm.characterData.moves = vm.characterData.moves.join(',');
                vm.characterData.cyberware = vm.characterData.cyberware.join(',');
                vm.characterData.links = JSON.stringify(vm.characterData.links);
                
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

            function getDudes(){
                SprawlCharacterService.GetAll().then(function(data){    
                    if(Array.isArray(data)){
                        vm.dudes = data;
                    } else {
                        vm.dudes.push(data);
                    }
                });
            }

            function loadDude(dude){
                let d = JSON.parse(dude);
                // When loading a dude, make sure we get the latest from the DB.
                SprawlCharacterService.GetById(d.id).then(function(data){
                    vm.characterData = data;
                    vm.class = vm.characterData.class;
                    getClassMoves(vm.class);
                    markHarm(vm.characterData.harm);
                    vm.characterData.advancements = JSON.parse("[" + vm.characterData.advancements + "]");
                    vm.characterData.moves = JSON.parse("[" + vm.characterData.moves + "]");
                    vm.characterData.cyberware = JSON.parse("[" + vm.characterData.cyberware + "]");
                    vm.characterData.links = JSON.parse(vm.characterData.links);
                    vm.create = "Save";
                });
            }

            function loadMCDude(position){
                // Grab the dude from the JSON.
                vm.mcDudes[position] = JSON.parse(vm.mcDudes[position]); 
                vm.mcDudes[position].cyberware = JSON.parse("[" + vm.mcDudes[position].cyberware + "]");
            }

            function deleteDude(){
                //alert("Dude deleteion attempted");
                SprawlCharacterService.Delete(vm.characterData.id).then(function(data){
                    console.log("Dude " + vm.characterData.id + " deleted");
                    vm.characterData = _characterDefaults;
                    vm.class = "driver";
                    vm.dudes = getDudes();
                })
            }

            function clearDude(){
                // Clear it all
                vm.characterData = {};
                vm.characterData = angular.copy(_characterDefaults);                
                $scope.$apply();
            }

            function getClassData(){
                $.get(_classDataFile).then(storySuccess, storyFailure);
                function storySuccess(response){
                    vm.classData = response;
                    console.log("class data", vm.classData);
                }
                function storyFailure(error){
                    console.log(error);
                }
            }
            //#endregion

            //#region Advancements
            function updateAdvancements(advId){
                if(vm.characterData.advancements.indexOf(advId) > -1){
                    vm.characterData.advancements.splice(advId, 1);
                } else {
                    vm.characterData.advancements.push(advId);
                }
            }
            //#endregion

            //#region Links
            function addLink(){
                let link = {"value":0,"name":""}
                vm.characterData.links.push(link);
            }
            function removeLink(index){
                vm.characterData.links.splice(index, 1);
            }
            //#endregion

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

            function setIntel(){
                $cookies.putObject('intel', vm.intel);
            }

            function setGear(){
                $cookies.putObject('gear', vm.gear);
            }
            //#endregion

            //#region Moves
            function updateMoves(moveId){
                let index = vm.characterData.moves.indexOf(moveId);
                if( index > -1){
                    vm.characterData.moves.splice(index, 1);
                } else {
                    vm.characterData.moves.push(moveId);
                }
            }

            function getClassMoves(c){
                apiservice.GetBy('tbl_Moves', 'class', c).then(function (data) {                
                    vm.classMoves = data;
                    vm.nameLookHTML = setNameLookHTML();
                    getAllDirectives();
                });
            }

            function getSprawlMoves(id){
                MoveService.GetByGameId(id).then(function(data){
                    vm.sprawlMoves = data;
                    hideAll();
                });
            }

            function hideAll(){
                for(var i = 0; i < vm.sprawlMoves.length; i++){
                    vm.sprawlMoves[i]["hide"] = true;
                }
            }
            //#endregion

            //#region Tags
            function getAllTags(gameid){
                TagService.GetByGameId(gameid).then(
                    function(data){
                        vm.allTags = data;
                        
                        for(var i = 0; i < vm.allTags.length; i++){
                            vm.allTags[i]["hide"] = true;
                        }
                    },
                    function(error){
                    }
                );
            }
            //#endregion
            
            //#region Harm
            function markHarm(position){
                if(position === null){ return; }
                clearHarm();
                vm.characterData.harm = position;
                for(var i = 0; i < vm.harm.length; i++){
                    if (i <= position){
                        vm.harm[i] = "active";
                    }
                }
            }

            function clearHarm(){
                vm.characterData.harm = null;
                vm.harm = ["","","","","",""];  
            }
            //#endregion

            //#region Cyberware
            function getAllCyberware(){
                CyberwareService.GetAll().then(function(data){
                    vm.allCyberware = data;
                });
            }
            function updateCyberware(cyberwareId){
                if(vm.characterData.cyberware.indexOf(cyberwareId) > -1){
                    vm.characterData.cyberware.splice(cyberwareId, 1);
                } else {
                    vm.characterData.cyberware.push(cyberwareId);
                }
            }
            function showCyberware(type){
                vm.visibility.cyberware = type;

            }
            function filterCyberware(id){
                switch(vm.visibility.cyberware) {
                    case 'all':
                        return true;
                        break;
                    case 'mine':
                        if(vm.characterData.cyberware.indexOf(id) != -1){ 
                            return true; 
                        } else {
                            return false;
                        }                        
                        break;
                    case 'class':
                        if(vm.classData[vm.class].cyberware.indexOf(id) != -1){ 
                            return true;
                        } else {
                            return false;
                        }
                        break;
                    default:
                        if(vm.classData[vm.class].cyberware.indexOf(id) != -1){ return true; }  else { return false; }                      
                }
            }
            //#endregion

            //#region Name / Look
            function setNameLookHTML(){
                let HTML = "<div><strong>Names:</strong> ";
                for(let i = 0; i < vm.classData[vm.class].names.length; i++){ HTML += vm.classData[vm.class].names[i] + (i === vm.classData[vm.class].names.length - 1 ? " " : ", ");}
                HTML += "<br /><strong>Eyes:</strong> ";
                for(let i = 0; i < vm.classData[vm.class].look.eyes.length; i++){ HTML += vm.classData[vm.class].look.eyes[i] + (i === vm.classData[vm.class].look.eyes.length - 1 ? " " : ", ");}
                HTML += "<br /><strong>Face:</strong> ";
                for(let i = 0; i < vm.classData[vm.class].look.face.length; i++){ HTML += vm.classData[vm.class].look.face[i] + (i === vm.classData[vm.class].look.face.length - 1 ? " " : ", ");}
                HTML += "<br /><strong>Body:</strong> ";
                for(let i = 0; i < vm.classData[vm.class].look.body.length; i++){ HTML += vm.classData[vm.class].look.body[i] + (i === vm.classData[vm.class].look.body.length - 1 ? " " : ", ");}
                HTML += "<br /><strong>Wear:</strong> ";
                for(let i = 0; i < vm.classData[vm.class].look.wear.length; i++){ HTML += vm.classData[vm.class].look.wear[i] + (i === vm.classData[vm.class].look.wear.length - 1 ? " " : ", ");}
                HTML += "<br /><strong>Skin:</strong> ";
                for(let i = 0; i < vm.classData[vm.class].look.skin.length; i++){ HTML += vm.classData[vm.class].look.skin[i] + (i === vm.classData[vm.class].look.skin.length - 1 ? " " : ", ");}
                HTML += "</div>";
                return HTML;                
            }
            //#endregion

            //#region Directives
            function getAllDirectives(){
                DirectiveService.GetAll().then(function(data){
                    vm.allDirectives = data;
                    let html = "<ul><li>";
                    vm.allDirectives.forEach(function(dir){
                        if(vm.classData[vm.class].directives.indexOf(dir.id) > -1){
                            html += "<strong>" + dir.name + "</strong>: " + dir.description + "</li><li>";
                        }
                    })
                    html += "</li></ul>";
                    vm.directives = html;
                });
            }
            //#endregion
            
            //#region Log
            function getLogEntries(){
                let config = {                    
                    url: "http://16watt.com/dev/api/api.php/tbl_Log"
                }
                $http.get(config.url).then(function(data){
                    vm.logs = data.data;
                },
                function(err){
                    console.log(err);
                });
            }

            function updateLogEntry(){
                vm.currentLog.date                
                let config = {
                    url: 'http://16watt.com/dev/api/api.php/tbl_Log/' + vm.currentLog.id,
                    data: vm.currentLog,
                    method: 'PUT'
                }
                $http(config).then(function(data){
                    console.log(data);
                },
                function(err){
                    console.log(err);
                });
            }

            function addLogEntry(){
                let newEntry = {
                    name: 'New Entry',
                    text: 'New Entry',
                    datecreated: $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    gameid: 4,
                    createdby: 1
                }
                let config = {
                    url: 'http://16watt.com/dev/api/api.php/tbl_Log/',
                    data: newEntry,
                    method: 'POST'
                }
                $http(config).then(function(data){
                    getLogEntries();
                },
                function(err){
                    console.log(err);
                });
            }

            function selectLog(logId){
                let config = {                    
                    url: "http://16watt.com/dev/api/api.php/tbl_Log/id/" + logId
                }
                $http.get(config.url).then(function(data){
                    vm.currentLog = data.data;
                },
                function(err){
                    console.log(err);
                }); 
            }
            //#endregion

            //#region Static
            function setStaticContent(){
                // TODO: move these to an external JSON or Database
                vm.classes = [{name:'driver'}, {name:'fixer'}, {name:'hacker'}, {name:'hunter'},{name:'infiltrator'},{name:'killer'},{name:'pusher'},{name:'reporter'},{name:'soldier'},{name:'tech'}];
                vm.classData = {
                    "driver": {"stat": "cool", "directives":[1,2,3,4], "cyberware":[9], "gear":"<strong>Custom cyber-linked vehicle (as described below)</strong> <br /><strong>Choose one weapon:</strong><ul> <li>Automatic shotgun (3-harm close/near loud messy autofire) <li>Heavy pistol (3-harm close/near loud) <li>Machette (3-harm hand) </ul><strong>Choose one:</strong><ul> <li>Armour jacket (1-armour) <li>Synth leathers (0-armour, +discreet, subtract 1 when rolling the harm move <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) </ul>","names": ["Aziz","Cartman","Cowboy","Demon","Frank","Furiosa","Luka","Max","Roadkill","Roo","Rook","Squirrel","Tower","an animal name","a violent name","a cocky name"], "look": { "eyes": ["laughing","cool","hard","cold","distant","artificial"], "face": ["blank","thin","covered","attractive","decorated","rugged"], "body": ["toned","lithe","compact","scarred","augmented","flabby","unfit"], "wear": ["flashy","formal","casual","utility","scrounge","vintage","leathers","military","corporate"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]},"classSpecific": "<h4>VEHICLES</h4><strong>Choose a Frame:</strong> motorcycle, car, hovercraft, boat, vectored-thrust panzer, fixed-wing aircraft, helicopter, amphibious <br /><strong>Choose a Design:</strong> racing, recreational, passenger transport, cargo, military, luxury, civilian,  commercial, courier <br /><strong>Choose a Profile:</strong> <br />» Power+2, Looks+1, Weakness+1; 1-Armour <br />» Power+2, Looks+2, Weakness+1; 0-Armour <br />» Power+1, Looks+2, Weakness+1; 1-Armour <br />» Power+2, Looks+1, Weakness+2; 2-Armour <br /><i>For each point of Power, choose a strength; For each point of Looks, choose a look; For each point of Weakness, choose a weakness. </i><br />» <strong>Strengths:</strong> fast, quiet, rugged, aggressive, huge, off-road, responsive, uncomplaining, capacious, workhorse, easily repaired. <br />» <strong>Looks:</strong>sleek, vintage, pristine, powerful, luxurious, flashy, muscular, quirky, pretty, garish, armoured, armed, nondescript. <br />» <strong>Weaknesses:</strong> slow, fragile, sloppy, lazy, cramped, picky, guzzler, unreliable, loud <br />If your vehicle has Power+2, it may mount one weapon system; Military vehicles may mount an additional weapon system. <br />» <strong>Weapons:</strong> Machine guns (3-harm near/far area loud messy autofire),  grenade launchers (4-harm near/far area loud messy), missile launcher (5-harm far area messy breach), autocannon (4-harm near/far area messy breach) <br />When you've finished creating your vehicle, name it. ________________________________ _______ <br />Arrow, Bianca, Christine, Hobbes, Jeeves, Lucifer, Lucky, Mamma, Needle, Ninja, R.H.I.N.O.,  Shit Box, Silver, The Other Car, Thumbalina, Vanguard, a technical name, a task-oriented name,  an anthropomorphic name, a gendered name, an animal name<h4>DRONES</h4><strong>Choose a Motive style:</strong>  rotor, fixed-wing, quadruped, octoped, tracked, wheeled, aquatic, amphibious, submarine.<br /> <strong>Choose a Frame:</strong><ul> <li>Tiny (insect-sized): +small, +fragile, +stealthy, pick one sensor   <li>Small (rat- to cat-sized): choose one strength, one sensor, one weakness, and one other from any category   <li>Medium (dog-sized): choose one strength, one sensor, one weakness, and two others from any category   <li>Large (bear-sized): +obvious, choose two strengths, one sensor, one weakness and two others from any category  </ul><strong> Strengths:</strong> fast, rugged, off-road, responsive, uncomplaining, easily repaired, stealthy, tight encryption, autonomous, robot arm, armed, satellite relay. <br /><strong>Sensors:</strong> magnification, medical, thermographic, jamming,  image enhancement, analysis software, sonar. <br /><strong>Weaknesses:</strong> slow, fragile, unreliable, loud, loose encryption, obvious. <br /><strong>Armed:</strong> a weapon can be mounted on the drone. The weapon’s size is determined by the size of the frame. <br />A small drone can mount a gun dealing 2- or s-harm with a range tag of close or less and without the autofire tag.<br />A medium drone can mount a gun dealing up to 3-harm with a range tag of near or less.<br /> A large drone can mount a gun dealing up to 5-harm."},
                    "fixer": {"stat": "style", "directives":[5,6,7,8], "cyberware":[1,3,9], "gear": "<strong>Choose one weapon:</strong><ul> <li>Holdout pistol (2-harm hand/close discreet quick reload loud) <li>Semi-auto pistol (2-harm close/near loud quick)</li></ul>< <strong>Choose two:</strong><ul><li>Armoured coat (1-armour) <li>Armoured clothing (armour 0, +discreet, subtract 1 when rolling the harm move) <li>Flashy ride (choose one: motorcycle, sports car, speed boat) <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) <li>+Encrypted communications gear </li></ul>", "names":["Gant","Hub","Intrigue","Jacinta","Jinx","Lilliana","Master D","Mr. Johnson","Sally","The Goto","a connected name","a gregarious name","a shadowy name"], "look":{"eyes":["trustworthy","focused","artificial","cool"],"face":["attractive","scarred","hidden","friendly"],"body":["small","thin","bulky","toned","muscular","fleshy"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"],"wear":["corporate","formal","street","military","utility"]},"classSpecific": "<h4>HUSTLING</h4> You have people who work for you in various ways. You start with 2-crew and two jobs from the list below. Between missions, choose a number of those jobs equal to or less than your current crew, describe what each job is, and roll Edge: 10+: you profit from each of your jobs; 7-9: one of them is a Disaster and you Profit from the rest;  6-: everything’s FUBAR. The MC will make a move based on the Disaster for each job<br /><strong>Choose two:</strong> <br /><strong>Surveillance:</strong> You have a small network of informants who report on events; you then sell that information. <strong>Profit:</strong> gain [intel]. <strong>Disaster:</strong> someone acts on bad info <br /><strong>Debt collection:</strong> You have a few burly looking fuckers who collect outstanding debts. <strong>Profit:</strong> gain [gear]. <strong>Disaster:</strong> someone’s out of pocket <br /><strong>Petty theft:</strong> You have a small crew who perform minor local robberies. <strong>Profit:</strong> gain [gear]. <strong>Disaster:</strong> they robbed the wrong guy. <br /><strong>Deliveries:</strong>People hire you to transport things and you have a driver who takes care of that. <strong>Profit:</strong> gain 1 Cred. <strong>Disaster:</strong> the delivery never arrives. <br /><strong>Brokering deals:</strong>You arrange for the right people to meet each other <strong>Profit:</strong> gain 1 Cred. <strong>Disaster:</strong> the deal that you arranged goes wrong. <br /><strong>Technical work:</strong>You have a couple of techs whom you supply with work <strong>Profit:</strong> gain [gear]. <strong>Disaster:</strong> something bad happens to someone else’s property. <br /><strong>Pimping:</strong> You manage a small stable of physical or virtual sex workers <strong>Profit:</strong> gain [intel]. <strong>Disaster:</strong> something goes wrong with a customer. <br /><strong>Addictive Substances:</strong> You manage a small lab producing either drugs or simstim chips.  <strong>Profit:</strong> gain [intel]. <strong>Disaster:</strong> something goes wrong for a user or for the lab itself"},
                    "hacker": {"stat": "synth and mind", "directives":[5,1,7,9], "cyberware":[9], "gear":"<strong>Choose and name one cyberdeck:</strong><ul> <li>Defensive deck (Hardening 2, Firewall 2, Processor 1, Stealth 1) and two programs from the list below <li>Performance deck (Hardening 1, Firewall 1, Processor 2, Stealth 2) and three programs from the list below <strong>Programs:</strong><ul> <li>Lockdown (When you successfully compromise security, hold +1) <li>Defend (+2 Firewall) <li>Efficiency Routines (+2 Processor) <li>Sift (Take +1 ongoing to research or search for paydata in a secure database) <li>Manipulate (When you successfully manipulate systems, hold +1) <li>Alert (When you successfully assess in the matrix, Choose one extra option) <li>Identity Protection (+2 Stealth) <li>Eject (+1 forward to jack out)</ul></ul> <strong>Choose one weapon:</strong><ul> <li>Flechette pistol (3-harm close/near quick flechette) <li>Machine pistol (2-harm close/near loud autofire) <strong>Choose two:</strong><ul> <li>Armoured coat (1-armour) <li>Armoured clothing (0-armour, discreet, subtract 1 when rolling the harm move) <li>Armoured fridge (3-armour, immobile) <li>Microtronics workstation (you may perform field repairs on electronics and cyberware) <li>+Flashy motorcycle </ul>","names": ["Case","Core","Crowley","Dead Rob","Djinn","Frozz","Gaius Lupo","Hazer","Johnny","Nezumi","Patch","Wyldstyle","a sneaky name","a techy name","a mystical name"], "look": {"eyes": ["young","cool","impatient","smug","twitching","mocking"], "face": ["scarred","sneering","smooth","decorated","hidden"], "body": ["small","thin","awkward","flabby","young"], "wear": ["worn","corporate","punk","street","scrounged"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                    "hunter": {"stat": "edge", "directives":[10,11,12,4], "cyberware":[1,2,11,12], "gear": "<strong>Choose two weapons:</strong><ul> <li>Heavy revolver (3-harm close/near reload loud) <li>Holdout pistol (2-harm hand/close discreet quick reload loud) <li>Flechette pistol (3-harm close/near quick flechette) <li>Hand taser (s-harm hand reload) <li>Sniper rifle (3-harm far/extreme loud)</ul> <strong>Choose two:</strong><ul> <li>Armoured coat (1-armour) <li>Armoured clothing (armour 0, +discreet, subtract 1 when rolling the harm move) <li>Nondescript sedan <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) <li>Glasses or goggles (Choose one: +light amplification +magnification, +recording)</li></ul>", "names":["Archer","Boone","Deckard","Frost","Marîd","Markham","Mr. Black","Python","Quade","Richards","Ritter","Seamus Riley","Taylor","a real name","an anonymising name","a predatory name"], "look":{"eyes": ["searching","restless","artificial","penetrating","resigned","jaded","obscured"], "face": ["scarred","impassive","friendly","nondescript","weathered"], "body": ["muscular","lithe","augmented","wiry","compact","overweight"], "wear": ["worn","faded","corporate","casual","street","scrounged."] ,"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                    "infiltrator": {"stat": "cool and edge", "directives":[2,6,7,13], "cyberware":[1,2,9,10,11], "gear":"<strong>Choose three weapons:</strong><ul> <li>Sniper rifle (3-harm far/extreme loud) <li>Machine pistol (2-harm close/near loud autofire) <li>Hand taser (s-harm hand reload) <li>Silenced SMG (2-harm close/near autofire) <li>Silenced semi-auto pistol (2-harm close quick) <li>Monofilament whip (4-harm hand messy area dangerous) <li>Sword (3-harm hand messy) <li>Shuriken or Throwing Knives (2-harm close infinite) </ul><strong>Choose one:</strong><ul> <li>Stealth suit (+1 ongoing to avoid being detected while alone and hidden) <li>Disguise kit (+1 ongoing to avoid being detected while successfully maintaining a fake persona) <li>Recording equipment <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) <li>Infiltration deck (Hardening 1, Firewall 1, Processor 1, Stealth 2) and three programs: Identity Protection (+2 Stealth), Lockdown (when you successfully compromise security, hold +1) and Manipulate (When you successfully manipulate systems, hold +1).</ul>","names": ["Bertrand","Blue","Kit","Loe Qi","Max","Nef","Smoke","Spectre","Zero","a sneaky name","a cool name","an efficient name"], "look": { "eyes": ["dark","focused","black","artificial","cunning","restless"], "face": ["hidden","ambiguous","nondescript","sneering","calm","weathered"], "body":["lithe","augmented","wiry","athletic","slim"], "wear": ["utility","military","corporate","street","scrounged"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                    "killer": {"stat": "synth and meat", "directives":[14,15,8,7], "cyberware":[1,4,6,7,8,9,10], "gear":"Custom Weapon (as described above).<br /> <strong>Choose two more weapons (any firearm can be +linked):</strong><ul> <li>Silenced machine pistol (2-harm close/near autofire) <li>Automatic shotgun (3-harm close/near loud messy autofire) <li>Heavy revolver (3-harm close/near reload loud) <li>Assault rifle (3-harm near/far loud autofire) <li>Sword (3-harm hand messy) <li>Machette (3-harm hand) </ul><strong>Choose one:</strong><ul> <li>Body armour (2-armour) <li>Armoured jacket (1-armour) <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) <li>Aggressive motorcycle </ul>","names": ["Angelo","Dead Eyes","John","LouLou","Kennedy","Knock","Mé Moì","Molly","Oakley","Sarah","Sleeper","an ironic name","a cool name","a deadly name"], "look": { "eyes": ["hard","dead","mirrored","artificial","cunning","manic","unhinged","wild"], "face": ["scarred","impassive","friendly","nondescript","weathered","decorated"], "body": ["muscular","lithe","augmented","wiry","compact"], "wear": ["military","corporate","punk","street","scrounged"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                    "pusher": {"stat": "style and edge", "directives":[16,6,3,13], "cyberware":[1,3,7,9], "gear":"<strong>Choose two weapons:</strong><ul> <li>Holdout pistol (2-harm hand/close discreet quick reload loud) <li>Flechette pistol (3-harm close/near quick flechette) <li>Semi-auto pistol (2-harm close/near loud quick)</ul> <strong>Choose two:</strong><ul> <li>Synth leathers or armoured clothing (0-armour, discreet, subtract 1 when rolling the harm move) <li>Sleek ride (<strong>Choose one:</strong> motorcycle, car, helicopter) <li>Simsense recording equipment <li>Musical instruments <li>Encrypted communications relay <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) </ul>","names": ["Apostle","Chalice","Dancer","Dillon Vicara","Eleven","Ice Smooth","Lola Chrome","Magnetic","Nebula","Nigell","Prophet9","Relay","Sennheiser","Shard","a media name","a social name","a real name"], "look": {"eyes": ["shining","driven","vulnerable"," passionate","intense","trustworthy","artificial"], "face": ["attractive","friendly","striking","alluring","serene","sculpted"], "body": ["toned","muscular","relaxed","slim","augmented","soft","pudgy"], "wear": ["corporate","high fashion","avant-garde","street","flashy","punk"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]},"classSpecific": "<h4>BELIEVERS</h4> You are part of a gang, tribe, band, corporation or similar group. You can go to them for aid, for resources or to hide out until the heat dies down. As a group, they're pretty trustworthy, but they will make demands on you in return (your gang counts as a Contact). By default this group has a core of about 20 people as well as various associates and groupies What kind of gang is it? Choose one: Street, Corporate, Entertainment/Media, Military, Political How big is your gang? Choose a size and choose two tags: Small: 10 or fewer (loyal, mobile, wellarmed, specialists) Medium: 20-40 (mobile, well-armed, specialists) Large: 50-100 (well-connected, resources, self-sufficient) Huge: 200+ (well-connected, resources, spread out, self-sufficient) Define your gang's territory. Do they control a few blocks of the streets? Do they operate out of a compound or an arcology? Choose one: poor, wanted, hard to find, unreliable, violent, hated Who leads your gang? If your gang is small, you may be the leader. Otherwise, choose one: immoral, demanding, grasping, a real fucker, useless, absent What are your gang's main gigs? Choose two: commerce, crime, parties, muscle, deliveries, entertainment, infiltration, scavenging, activism, politics"},
                    "reporter": {"stat": "edge and mind", "directives":[11,7,9,4], "cyberware":[1,2,3,9], "gear":"<strong>Choose one weapon:</strong><ul> <li>Holdout pistol (2-harm hand/close discreet quick reload loud) <li>Flechette pistol (3-harm close/near quick flechette) <li>Hand taser (s-harm hand reload) </ul><strong>Choose two:</strong><ul> <li>Armoured clothing (0-armour, discreet, subtract 1 when rolling the harm move) <li>Encrypted communications equipment <li>Recording equipment <li>Glasses (choose 2: +light amplification, +magnification, +recording) <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm)) </ul>","names": ["Conduit","Farouk Dakins","Glass","Grant Access","Edison","Hoot","Madison Brookes-Watanabe","Parisa Zahed","Scoop","Spider","Witness","a media name","an inquiring name","an incisive name"], "look": {"eyes": ["penetrating","intense","empathetic","calm","determined","sad","dejected"], "face": ["attractive","friendly","serious","grim","composed","worn","weathered"], "body": ["toned","slim","augmented","tense","animated","flabby","tired"], "wear": ["corporate","street","punk","flashy","outdated","messy","worn"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                    "soldier": {"stat": "edge", "directives":[12,10,17,6], "cyberware":[1,3,9,11,12], "gear":"<strong>Choose two weapons:</strong><ul> Heavy pistol (3-harm close/near loud) <li>Assault rifle (3-harm near/far loud autofire) <li>Fragmentation Grenades (4-harm near area reload loud messy) <li>Flashbangs (s-harm near area loud reload) </ul><strong>Choose two:</strong><ul> <li>Armoured vest (1-armour) <li>Armoured clothing (armour 0, +discreet, subtract 1 when rolling the harm move) <li>Communications relay (Choose +encrypted or +jamming) <li>Goggles (Choose two: +thermographic, +light amplification, +magnification, +flare compensation) <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm)</ul>","names": ["Alif","Armitage","Connomarah","Cortez","Grit","Mac","Sly","Turnus","Turner","a professional name","a determined name","a strange name"], "look":{ "eyes": ["hard","searching","artificial","cunning","penetrating","weary","jaded","haunted"], "face": ["rugged","scarred","weathered","tired","thin","decorated","calm"],"body": ["muscular","toned","unfit","graceful","wiry","tanned"], "wear": ["casual","utility","vintage","military","corporate","worn"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                    "tech": {"stat": "cool and mind", "directives":[14,7,8,9], "cyberware":[1,3,4,9], "gear":"<strong>You get this:</strong><ul> <li>Toolkit and gear appropriate to your area(s) of expertise Choose two weapons: <li>Holdout pistol (2-harm hand/close discreet quick reload loud) <li>Assault rifle (3-harm near/far loud autofire) <li>Fragmentation Grenades (4-harm near area reload loud messy) <li>Gas Grenades (s-harm near area reload gas) </ul><strong>Choose two:</strong><ul> <li>Armoured jacket (1-armour) <li>Armoured clothing (0-armour, discreet, subtract 1 when rolling the harm move) <li>Goggles (Choose two: +thermographic, +light amplification, +magnification, +flare compensation, +recording) <li>Truck or van (Choose one strength: +rugged, +off-road, +huge, +workhorse; and one weakness: +slow, +cramped, +loud) <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) <li>Encrypted jamming communications relay</ul>","names": ["Angel.1.3","AntiK-Tera","Bobby","Cathode","Eleni Larabee","Houwayyek","Mr. Wizard","Spanner","Transitivity","a weird name","a normal name","an technofetishising name"], "look": { "eyes": ["focused","excited","artificial","squinty","impatient","calm","appraising"], "face": ["plain","friendly","nondescript","weathered","expressive"], "body": ["muscular","wiry","compact","thin","flabby","fatty"], "wear": ["utility","military","corporate","street","scrounged"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]},"classSpecific": "<h4>AREAS OF EXPERTISE</h4><br /><strong>Mechanic:</strong> you are an expert in the construction, maintenance and operation of vehicles & drones; you have two drones created according to the Driver move drone jockey<br /><strong>Splicer:</strong> you are an expert in cybernetics and biomodification; you may begin with one extra piece of cyberware; describe how you implanted this in yourself, but you need not describe how you paid for it<br /><strong>Breadboarder:</strong> you are an expert in computers and electronics; you have a cyberdeck with 5 points of ratings (no rating may be higher than 2) and a number of programs equal to its Processor rating+1 <br /><strong>Gunsmith:</strong> you are an expert in armaments; you begin with the Killer move  custom weapon <br /><strong>Medic:</strong> you are an expert in medicine and pharmaceuticals; when you apply first aid, you heal one additional harm segment, even on a miss <br /><strong>Pyrotechnician:</strong> you are an expert in chemistry and explosives; ignore the +dangerous tag for explosives You start with workshops appropriate to your areas of expertise (e.g. surgery, electronics workshop, garage)."}
                };
                vm.defaultAdvancements = [
                    {"id":0,"type":"basic","description":"Choose another move from your playbook."},
                    {"id":1,"type":"basic","description":"Choose another move from your playbook."},
                    {"id":2,"type":"basic","description":"Choose another move from your playbook."},
                    {"id":3,"type":"basic","description":"Choose a move from another playbook."},
                    {"id":4,"type":"basic","description":"Choose a move from another playbook."},
                    {"id":5,"type":"basic","description":"+1 style (max +2)."},
                    {"id":6,"type":"basic","description":"+1 edge (max +2)."},
                    {"id":7,"type":"basic","description":"+1 cool (max +2)."},
                    {"id":8,"type":"basic","description":"+1 mind (max +2)."},
                    {"id":9,"type":"basic","description":"+1 meat (max +2)."},
                    {"id":10,"type":"basic","description":"+1 synth (max +3)."},
                    {"id":11,"type":"advanced","description":"+1 to any stat (max +3)."},
                    {"id":12,"type":"advanced","description":"buy off an obligation, enemy or owned."},
                    {"id":13,"type":"advanced","description":"change your character to a new playbook."},
                    {"id":14,"type":"advanced","description":"rewind a corporate countdown clock to 1800. [req 10cred]"},
                    {"id":15,"type":"advanced","description":"retire your character to safety. [req 20cred]"},
                    {"id":16,"type":"advanced","description":"make a second character."}
                ];
                vm.staticGear = {
                    'weapons': {
                        "firearms": {
                            "category": "Firearms",
                            "description": "Any firearm can be +linked at no additional cost.",
                            "items": [
                                {
                                    "name": "Holdout pistol",
                                    "tags": "2-harm hand/close discreet quick reload loud)"
                                },
                                {
                                    "name": "Flechette pistol",
                                    "tags": "3-harm close/near quick flechette"
                                },
                                {
                                    "name": "Revolver",
                                    "tags": "2-harm close/near reload loud quick"
                                },
                                {
                                    "name": "Semi-auto pistol",
                                    "tags": "2-harm close/near loud quick"
                                },
                                {
                                    "name": "Heavy revolver",
                                    "tags": "3-harm close/near reload loud"
                                },
                                {
                                    "name": "Heavy pistol",
                                    "tags": "3-harm close/near loud"
                                },
                                {
                                    "name": "Shotgun",
                                    "tags": "3-harm close/near loud messy reload"
                                },
                                {
                                    "name": "Automatic shotgun",
                                    "tags": "3-harm close/near loud messy autofire"
                                },
                                {
                                    "name": "Assault rifle",
                                    "tags": "3-harm near/far loud autofire"
                                },
                                {
                                    "name": "Machine pistol",
                                    "tags": "2-harm close/near loud autofire"
                                },
                                {
                                    "name": "SMG",
                                    "tags": "2-harm close/near loud autofire"
                                },
                                {
                                    "name": "LMG",
                                    "tags": "3-harm near/far loud messy autofire clumsy"
                                },
                                {
                                    "name": "Hunting rifle",
                                    "tags": "2-harm far/ex loud"
                                },
                                {
                                    "name": "Crossbow or hunting bow",
                                    "tags": "2-harm close/near/far reload"
                                },
                                {
                                    "name": "Sniper rifle",
                                    "tags": "3-harm far/ex loud clumsy"
                                },
                                {
                                    "name": "Anti-materiel rifle",
                                    "tags": "3-harm far/ex loud messy breach clumsy"
                                },
                                {
                                    "name": "Grenade launcher",
                                    "tags": "4-harm near/far area loud messy clumsy"
                                },
                                {
                                    "name": "Grenade tube",
                                    "tags": "4-harm near area reload loud messy"
                                },
                                {
                                    "name": "Assault cannon",
                                    "tags": "4-harm near/far area messy breach clumsy"
                                },
                                {
                                    "name": "Missile launcher",
                                    "tags": "5-harm far area messy breach clumsy"
                                }
                            ]
                        },
                        "grenades": {
                            "category": "Grenades",
                            "description": "At ranges intimate/hand/close, grenades are +dangerous.",
                            "items": [
                                {
                                    "name": "Fragmentation grenades",
                                    "tags": "4-harm near area reload loud messy"
                                },
                                {
                                    "name": "Flashbangs",
                                    "tags": "s-harm near area loud reload"
                                },
                                {
                                    "name": "Gas grenades",
                                    "tags": "s-harm near area reload gas"
                                }
                            ]
                        },
                        "melee": {
                            "category": "Hand Weapons",
                            "description": "",
                            "items": [
                                {
                                    "name": "Knife",
                                    "tags": "2-harm hand"
                                },
                                {
                                    "name": "Club",
                                    "tags": "2-harm hand"
                                },
                                {
                                    "name": "Sword",
                                    "tags": "3-harm hand messy"
                                },
                                {
                                    "name": "Hand taser",
                                    "tags": "s-harm hand reload"
                                },
                                {
                                    "name": "Monofilament whip",
                                    "tags": "4-harm hand messy area dangerous"
                                },
                                {
                                    "name": "Shuriken or throwing knives",
                                    "tags": "2-harm close numerous"
                                }
                            ]
                        },
                        "armour": {
                            "category": "Armour",
                            "description": "",
                            "items": [
                                {
                                    "name": "Armoured clothing or synth leathers",
                                    "tags": "0-armour, +discreet, subtract 1 when rolling the harm move"
                                },
                                {
                                    "name": "Armoured vest, jacket or coat",
                                    "tags": "1-armour"
                                },
                                {
                                    "name": "Body Armour",
                                    "tags": "2-armour"
                                },
                                {
                                    "name": "Military hardsuit",
                                    "tags": "3-armour, clumsy"
                                }
                            ]
                        },
                        "ammunition": {
                            "category": "Ammunition",
                            "description": "The Sprawl doesn't require you to count bullets, but some missions might require different kinds of ammo. Most of these simply add a tag to the weapon they're loaded into.",
                            "items": [
                                {
                                    "name": "AP rounds penetrate armour more easily",
                                    "tags": "a weapon loaded with AP rounds adds the +AP tag"
                                },
                                {
                                    "name": "Airburst rounds explode in the air near a target either by proximity or as controlled by a targeting suite",
                                    "tags": "a weapon loaded with airburst rounds adds the +area and +messy tags"
                                },
                                {
                                    "name": "Explosive rounds explode on impact with a target",
                                    "tags": "a weapon loaded with explosive rounds adds +1 harm and cannot be silenced"
                                },
                                {
                                    "name": "Flechette rounds are a tightly packed bundle of synthetic plastic shards which tear through flesh, but are easily stopped by armour",
                                    "tags": "a weapon loaded with flechette rounds adds +1 harm, but the target's armour value is doubled. Weapons with the +flechette tag already include the +1 harm"
                                },
                                {
                                    "name": "Gel rounds are designed to be less lethal",
                                    "tags": "a weapon loaded with gel rounds inflicts s-harm instead of its listed harm value; targets harmed by gel rounds add the original harm value (minus armour) to their roll when making the harm move"
                                },
                            ]
                        }
                    },
                    'weapons_list': [
                        {
                            "category": "Firearms",
                            "description": "Any firearm can be +linked at no additional cost.",
                            "items": [
                                {
                                    "name": "Holdout pistol",
                                    "tags": "2-harm hand/close discreet quick reload loud)"
                                },
                                {
                                    "name": "Flechette pistol",
                                    "tags": "3-harm close/near quick flechette"
                                },
                                {
                                    "name": "Revolver",
                                    "tags": "2-harm close/near reload loud quick"
                                },
                                {
                                    "name": "Semi-auto pistol",
                                    "tags": "2-harm close/near loud quick"
                                },
                                {
                                    "name": "Heavy revolver",
                                    "tags": "3-harm close/near reload loud"
                                },
                                {
                                    "name": "Heavy pistol",
                                    "tags": "3-harm close/near loud"
                                },
                                {
                                    "name": "Shotgun",
                                    "tags": "3-harm close/near loud messy reload"
                                },
                                {
                                    "name": "Automatic shotgun",
                                    "tags": "3-harm close/near loud messy autofire"
                                },
                                {
                                    "name": "Assault rifle",
                                    "tags": "3-harm near/far loud autofire"
                                },
                                {
                                    "name": "Machine pistol",
                                    "tags": "2-harm close/near loud autofire"
                                },
                                {
                                    "name": "SMG",
                                    "tags": "2-harm close/near loud autofire"
                                },
                                {
                                    "name": "LMG",
                                    "tags": "3-harm near/far loud messy autofire clumsy"
                                },
                                {
                                    "name": "Hunting rifle",
                                    "tags": "2-harm far/ex loud"
                                },
                                {
                                    "name": "Crossbow or hunting bow",
                                    "tags": "2-harm close/near/far reload"
                                },
                                {
                                    "name": "Sniper rifle",
                                    "tags": "3-harm far/ex loud clumsy"
                                },
                                {
                                    "name": "Anti-materiel rifle",
                                    "tags": "3-harm far/ex loud messy breach clumsy"
                                },
                                {
                                    "name": "Grenade launcher",
                                    "tags": "4-harm near/far area loud messy clumsy"
                                },
                                {
                                    "name": "Grenade tube",
                                    "tags": "4-harm near area reload loud messy"
                                },
                                {
                                    "name": "Assault cannon",
                                    "tags": "4-harm near/far area messy breach clumsy"
                                },
                                {
                                    "name": "Missile launcher",
                                    "tags": "5-harm far area messy breach clumsy"
                                }
                            ]
                        },
                        {
                            "category": "grenades",
                            "description": "At ranges intimate/hand/close, grenades are +dangerous.",
                            "items": [
                                {
                                    "name": "Fragmentation grenades",
                                    "tags": "4-harm near area reload loud messy"
                                },
                                {
                                    "name": "Flashbangs",
                                    "tags": "s-harm near area loud reload"
                                },
                                {
                                    "name": "Gas grenades",
                                    "tags": "s-harm near area reload gas"
                                }
                            ]
                        },
                        {
                            "category": "Hand Weapons",
                            "description": "",
                            "items": [
                                {
                                    "name": "Knife",
                                    "tags": "2-harm hand"
                                },
                                {
                                    "name": "Club",
                                    "tags": "2-harm hand"
                                },
                                {
                                    "name": "Sword",
                                    "tags": "3-harm hand messy"
                                },
                                {
                                    "name": "Hand taser",
                                    "tags": "s-harm hand reload"
                                },
                                {
                                    "name": "Monofilament whip",
                                    "tags": "4-harm hand messy area dangerous"
                                },
                                {
                                    "name": "Shuriken or throwing knives",
                                    "tags": "2-harm close numerous"
                                }
                            ]
                        },
                        {
                            "category": "Armour",
                            "description": "",
                            "items": [
                                {
                                    "name": "Armoured clothing or synth leathers",
                                    "tags": "0-armour, +discreet, subtract 1 when rolling the harm move"
                                },
                                {
                                    "name": "Armoured vest, jacket or coat",
                                    "tags": "1-armour"
                                },
                                {
                                    "name": "Body Armour",
                                    "tags": "2-armour"
                                },
                                {
                                    "name": "Military hardsuit",
                                    "tags": "3-armour, clumsy"
                                }
                            ]
                        },
                        {
                            "category": "Ammunition",
                            "description": "The Sprawl doesn't require you to count bullets, but some missions might require different kinds of ammo. Most of these simply add a tag to the weapon they're loaded into.",
                            "items": [
                                {
                                    "name": "AP rounds penetrate armour more easily",
                                    "tags": "a weapon loaded with AP rounds adds the +AP tag"
                                },
                                {
                                    "name": "Airburst rounds explode in the air near a target either by proximity or as controlled by a targeting suite",
                                    "tags": "a weapon loaded with airburst rounds adds the +area and +messy tags"
                                },
                                {
                                    "name": "Explosive rounds explode on impact with a target",
                                    "tags": "a weapon loaded with explosive rounds adds +1 harm and cannot be silenced"
                                },
                                {
                                    "name": "Flechette rounds are a tightly packed bundle of synthetic plastic shards which tear through flesh, but are easily stopped by armour",
                                    "tags": "a weapon loaded with flechette rounds adds +1 harm, but the target's armour value is doubled. Weapons with the +flechette tag already include the +1 harm"
                                },
                                {
                                    "name": "Gel rounds are designed to be less lethal",
                                    "tags": "a weapon loaded with gel rounds inflicts s-harm instead of its listed harm value; targets harmed by gel rounds add the original harm value (minus armour) to their roll when making the harm move"
                                },
                            ]
                        }
                    ]
                };
                vm.matrix = {
                    "subsystems_list":[        
                        {
                            "key":"login",
                            "name":"LOGIN GATES",
                            "description":"Login Gates govern entry into a Matrix system. By definition, all secure systems have a login gate. This is where authorised users provide their credentials and unauthorised users fake those credentials with login. ",
                            "routines":[],
                            "security":[
                                "Admit or deny a login",
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        },
                        {
                            "key":"root",
                            "name":"ROOT",
                            "description":"Root controls the entire system. This is often the first place a system operator will go to defend the system against an intruder. ",
                            "routines":[],
                            "security":[
                                "Change user permissions (including removing “restricted” status from login)",
                                "Isolate or reintegrate a sub-system",
                                "Sever all external logins, sever all internal logins, or both",
                                "Shut down or reboot the virtual environment; this will often have major consequences for the operation of physical systems",
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE in any sub-system"
                            ]
                        },
                        {
                            "key":"databases",
                            "name":"DATABASES",
                            "description":"Databases contain data. These will often be the target of intrusion attempts aiming at discovering or extracting specific data, as well as general paydata fishing attempts. Many hackers consider this a great way to make a bit of extra Cred on the side... but you have to be good at sifting out the hot, tagged or worthless data. ",
                            "routines":[
                                "Create, edit or delete records",
                                "Delete backups",
                                "Delete or edit access logs",
                                "Search for paydata (when you search for paydata in a Database, roll Mind: On a hit you find something hot that you can sell; on a 10+, when you hit the street to sell it choose one less option on a 7-9.)"
                            ],
                            "security":[
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        },
                        {
                            "key":"building_security",
                            "name":"BUILDING SECURITY NODES",
                            "description":"BUILDING SECURITY NODES monitor physical security systems. Most secure systems monitor similarly secure physical sites with a full array of cameras, sensors, and cutting edge security devices. Sometimes the easiest way to get inside is to cut through matrix security and turn off all those physical defences. ",
                            "routines":[
                                "Activate, deactivate, monitor, record, subvert or loop a camera network",
                                "Activate or deactivate a physical alarm",
                                "Activate or deactivate an electronically locked door",
                                "Activate, deactivate, override or modify the targeting priorities of automated weapon system",
                                "Activate or cancel a lockdown of the entire physical facility",
                                "Activate or deactivate an electronically controlled trap"
                            ],
                            "security":[
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        },
                        {
                            "key":"building_services",
                            "name":"BUILDING SERVICES NODES",
                            "description":"BUILDING SERVICES NODES control the various mundane operations of the physical building or compound. Most facilities have some sort of automated systems controlling lights, air conditioning, power supplies, and the like. ",
                            "routines":[
                                "Activate, deactivate, monitor or reprogram a building system (such as air conditioning, lights, power; note that security or life support systems will often have independent backup power controlled from a separate Matrix system)" 
                            ],
                            "security":[
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        },
                        {
                            "key":"production",
                            "name":"PRODUCTION CONTROL SYSTEMS",
                            "description":"PRODUCTION CONTROL SYSTEMS control the things that the facility makes. Large corporate facilities (such as the virtual environment of a giant arcology) may have many different kinds of production control system each controlling different labs, warehouses and factories. The routines that these systems control differ widely depending on the goods being manufactured: the seed germination facility of an agricorp system will have quite different routines than the testing range of a weapons division. ",
                            "routines":[
                                "Start or stop a production line",
                                "Initiate a production run or delivery",
                                "Activate or deactivate part of a production line",
                                "Reprogram part of a production line"
                            ],
                            "security":[
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        },
                        {
                            "key":"research",
                            "name":"R&D CONTROL SYSTEMS",
                            "description":"R&D CONTROL SYSTEMS control laboratories and databases where cutting-edge research is performed and stored. As above, the routines that these systems control differ widely depending on the goods being researched and tested: gene-splicing, explosives development, and organ growth all require different controls and systems. ",
                            "routines":[
                                "Seal or unseal a hermetically controlled area",
                                "Change test parameters",
                                "Initiate or rescind a test process",
                                "Issue or rescind an evacuation order",
                                "Activate or deactivate emergency protocols"
                            ],
                            "security":[
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        }
                    ],
                    "subsystems":{
                        "login": {
                            "key":"login",
                            "name":"LOGIN GATES",
                            "description":"Login Gates govern entry into a Matrix system. By definition, all secure systems have a login gate. This is where authorised users provide their credentials and unauthorised users fake those credentials with login. ",
                            "routines":[],
                            "security":[
                                "Admit or deny a login",
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        },
                        "root": {
                            "key":"root",
                            "name":"ROOT",
                            "description":"Root controls the entire system. This is often the first place a system operator will go to defend the system against an intruder. ",
                            "routines":[],
                            "security":[
                                "Change user permissions (including removing “restricted” status from login)",
                                "Isolate or reintegrate a sub-system",
                                "Sever all external logins, sever all internal logins, or both",
                                "Shut down or reboot the virtual environment; this will often have major consequences for the operation of physical systems",
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE in any sub-system"
                            ]
                        },
                        "databases": {
                            "key":"databases",
                            "name":"DATABASES",
                            "description":"Databases contain data. These will often be the target of intrusion attempts aiming at discovering or extracting specific data, as well as general paydata fishing attempts. Many hackers consider this a great way to make a bit of extra Cred on the side... but you have to be good at sifting out the hot, tagged or worthless data. ",
                            "routines":[
                                "Create, edit or delete records",
                                "Delete backups",
                                "Delete or edit access logs",
                                "Search for paydata (when you search for paydata in a Database, roll Mind: On a hit you find something hot that you can sell; on a 10+, when you hit the street to sell it choose one less option on a 7-9.)"
                            ],
                            "security":[
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        },
                        "building_security":{
                            "key":"building_security",
                            "name":"BUILDING SECURITY NODES",
                            "description":"BUILDING SECURITY NODES monitor physical security systems. Most secure systems monitor similarly secure physical sites with a full array of cameras, sensors, and cutting edge security devices. Sometimes the easiest way to get inside is to cut through matrix security and turn off all those physical defences. ",
                            "routines":[
                                "Activate, deactivate, monitor, record, subvert or loop a camera network",
                                "Activate or deactivate a physical alarm",
                                "Activate or deactivate an electronically locked door",
                                "Activate, deactivate, override or modify the targeting priorities of automated weapon system",
                                "Activate or cancel a lockdown of the entire physical facility",
                                "Activate or deactivate an electronically controlled trap"
                            ],
                            "security":[
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        },
                        "building_services":{
                            "key":"building_services",
                            "name":"BUILDING SERVICES NODES",
                            "description":"BUILDING SERVICES NODES control the various mundane operations of the physical building or compound. Most facilities have some sort of automated systems controlling lights, air conditioning, power supplies, and the like. ",
                            "routines":[
                                "Activate, deactivate, monitor or reprogram a building system (such as air conditioning, lights, power; note that security or life support systems will often have independent backup power controlled from a separate Matrix system)" 
                            ],
                            "security":[
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        },
                        "production":{
                            "key":"production",
                            "name":"PRODUCTION CONTROL SYSTEMS",
                            "description":"PRODUCTION CONTROL SYSTEMS control the things that the facility makes. Large corporate facilities (such as the virtual environment of a giant arcology) may have many different kinds of production control system each controlling different labs, warehouses and factories. The routines that these systems control differ widely depending on the goods being manufactured: the seed germination facility of an agricorp system will have quite different routines than the testing range of a weapons division. ",
                            "routines":[
                                "Start or stop a production line",
                                "Initiate a production run or delivery",
                                "Activate or deactivate part of a production line",
                                "Reprogram part of a production line"
                            ],
                            "security":[
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        },
                        "research":{
                            "key":"research",
                            "name":"R&D CONTROL SYSTEMS",
                            "description":"R&D CONTROL SYSTEMS control laboratories and databases where cutting-edge research is performed and stored. As above, the routines that these systems control differ widely depending on the goods being researched and tested: gene-splicing, explosives development, and organ growth all require different controls and systems. ",
                            "routines":[
                                "Seal or unseal a hermetically controlled area",
                                "Change test parameters",
                                "Initiate or rescind a test process",
                                "Issue or rescind an evacuation order",
                                "Activate or deactivate emergency protocols"
                            ],
                            "security":[
                                "Trigger or cancel an alert",
                                "Activate or deactivate ICE"
                            ]
                        }
                    },
                    "ice_list":[
                        {
                            "type":"BLUE ICE",
                            "description":"locates intruders, raises the alarm, traces their location allowing the system owner to alert physical response teams (either internal corporate teams or the appropriate local police authorities), then attempts to sever the intruder's connection.",
                            "choose":"When Blue ICE executes a routine, the MC chooses 1:",
                            "moves":[
                                "Trigger an alarm (advance relevant Mission Clock)",
                                "Trace an intruder's location (Trace +1)",
                                "Identify intruder (advance Corporate Clock)",
                                "Sever an intruder's connection",
                                "Call for counter-hacker backup"
                            ]
                        },
                        {
                            "type":"RED ICE",
                            "description":"locates intruders, raises the alarm, traces their location, then engages them to damage their cyberdeck with feedback algorithms.",
                            "choose":"When Red ICE executes a routine, the MC chooses 2:",
                            "moves":[
                                "Trigger an alarm (advance relevant Mission Clock)",
                                "Trace an intruder's location (Trace +2)",
                                "Identify an intruder (advance Corporate Clock)",
                                "Sever an intruder's connection",
                                "Corrupt an intruder's program (Destroy an active program)",
                                "Damage an intruder's cyberdeck (Lower one of the cyberdeck's ratings by 1)"
                            ]
                        },
                        {
                            "type":"BLACK ICE",
                            "description":"locates intruders, raises the alarm, traces their location, then engages them to harm the intruder herself with lethal feedback algorithms, trying to trap them in the matrix until the Black ICE kills them or physical response teams can reach their location.",
                            "choose":"When Black ICE executes a routine, the MC chooses 3:",
                            "moves":[
                                "Trigger an alarm (advance relevant Mission Clock)",
                                "Trace an intruder's location (Trace +3)",
                                "Identify an intruder (advance Corporate Clock)",
                                "Damage an intruder's cyberdeck (Lower one of the cyberdeck's ratings by 2)",
                                "Inflict physical harm to a jacked in intruder (1-harm +AP)",
                                "Prevent an intruder from jacking out and trap their mind"
                            ]
                        }
                    ],
                    "ice":{
                        "blue":{
                            "type":"BLUE ICE",
                            "description":"locates intruders, raises the alarm, traces their location allowing the system owner to alert physical response teams (either internal corporate teams or the appropriate local police authorities), then attempts to sever the intruder's connection.",
                            "choose":"When Blue ICE executes a routine, the MC chooses 1:",
                            "moves":[
                                "Trigger an alarm (advance relevant Mission Clock)",
                                "Trace an intruder's location (Trace +1)",
                                "Identify intruder (advance Corporate Clock)",
                                "Sever an intruder's connection",
                                "Call for counter-hacker backup"
                            ]
                        },
                        "red":{
                            "type":"RED ICE",
                            "description":"locates intruders, raises the alarm, traces their location, then engages them to damage their cyberdeck with feedback algorithms.",
                            "choose":"When Red ICE executes a routine, the MC chooses 2:",
                            "moves":[
                                "Trigger an alarm (advance relevant Mission Clock)",
                                "Trace an intruder's location (Trace +2)",
                                "Identify an intruder (advance Corporate Clock)",
                                "Sever an intruder's connection",
                                "Corrupt an intruder's program (Destroy an active program)",
                                "Damage an intruder's cyberdeck (Lower one of the cyberdeck's ratings by 1)"
                            ]
                        },
                        "black":{
                            "type":"BLACK ICE",
                            "description":"locates intruders, raises the alarm, traces their location, then engages them to harm the intruder herself with lethal feedback algorithms, trying to trap them in the matrix until the Black ICE kills them or physical response teams can reach their location.",
                            "choose":"When Black ICE executes a routine, the MC chooses 3:",
                            "moves":[
                                "Trigger an alarm (advance relevant Mission Clock)",
                                "Trace an intruder's location (Trace +3)",
                                "Identify an intruder (advance Corporate Clock)",
                                "Damage an intruder's cyberdeck (Lower one of the cyberdeck's ratings by 2)",
                                "Inflict physical harm to a jacked in intruder (1-harm +AP)",
                                "Prevent an intruder from jacking out and trap their mind"
                            ]
                        }
                    }
                };                
            }
            //#endregion
            /*
            var taco = classSpecific: {
                name: "HUSTLING",
                description: "You have people who work for you in various ways. You start with 2-crew and two jobs from the list below. Between missions, choose a number of those jobs equal to or less than your current crew, describe what each job is, and roll EDGE: 10+: you profit from each of your jobs; 7-9: one of them is a Disaster and you Profit from the rest;  6-: everything's FUBAR. The MC will make a move based on the Disaster for each job.                Choose two:",
                items:[
                    {
                        name: "Surveillance:", 
                        description: "You have a small network of informants who report on events; you then sell that information.",
                        profit: "gain [intel]",
                        disaster: "someone acts on bad info"
                    },
                    { name: "Debt collection:", description: "You have a few burly looking fuckers who collect outstanding debts.", profit: "gain [gear].", disaster: "someone's out of pocket."},
                    { name: "Petty theft:", description: "You have a small crew who perform minor local robberies.", profit: "gain [gear].", disaster: "they robbed the wrong guy."},
                    { name: "Deliveries:", description: "People hire you to transport things and you have a driver who takes care of that.", profit: "gain 1 Cred.", disaster: "the delivery never arrives."},
                    { name: "Brokering deals:", description: "You arrange for the right people to meet each other.", profit: "gain 1 Cred.", disaster: "the deal that you arranged goes wrong."},
                    { name: "Technical work:", description: "You have a couple of techs whom you supply with work.", profit: "gain [gear].", disaster: "something bad happens to someone else's property."},
                    { name: "Pimping:", description: "You manage a small stable of physical or virtual sex workers.", profit: "gain [intel].", disaster: "something goes wrong with a customer."},
                    { name: "Addictive Substances:", description: "You manage a small lab producing either drugs or simstim chips.", profit: "gain [intel].", disaster: "something goes wrong for a user or for the lab itself."}
                ]
            };
            */
           
            
        }
})();

