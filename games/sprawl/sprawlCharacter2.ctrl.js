(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('sprawl_character', sprawl_character);
        
        sprawl_character.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', '$sce', '$filter','Auth','UserService','ClockService','MoveService','TagService', 'DirectiveService', 'CyberwareService', 'SprawlCharacterService', 'HoldService', 'apiservice'];
        function sprawl_character($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, $sce, $filter, Auth, UserService, ClockService, MoveService, TagService, DirectiveService, CyberwareService, SprawlCharacterService, HoldService, apiservice){
            console.log("Sprawl Charactersheet 2");
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
            vm.visibility = { advancement: true, cyberware: 'class', moves: 'class' }
            vm.isMC = userId === 2;

            // Refernce properties
            vm.sprawlMoves = getSprawlMoves(4);           
                       
            vm.nameLookHTML = setNameLookHTML();

            
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
            vm.showMoves = showMoves;
            vm.filterMoves = filterMoves;
            vm.addLink = addLink;
            vm.removeLink = removeLink;
                    
            vm.getClassMoves = getClassMoves;

            init();
            
            function init(){
                getDudes();                
            }            

            //#region Dude / Character load/save/etc
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

            function showMove(id){

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

            function showMoves(type){
                vm.visibility.moves = type;
            }
            function filterMoves(id){
                switch(vm.visibility.moves) {
                    case 'all':
                        return true;
                        break;
                    case 'mine':
                        if(vm.characterData.moves.indexOf(id) !== -1){ 
                            return true; 
                        } else {
                            return false;
                        }                        
                        break;
                    case 'class':
                        let move = vm.sprawlMoves.find(obj=>obj.id === id);                        
                        if(move.class === vm.class){ 
                            return true;
                        } else {
                            return false;
                        }
                        break;
                    default:
                        if(vm.classData[vm.class].moves.indexOf(id) != -1){ return true; }  else { return false; }                      
                }
            }

            function hideAll(){
                for(var i = 0; i < vm.sprawlMoves.length; i++){
                    vm.sprawlMoves[i]["hide"] = true;
                }
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
            }
            //#endregion

            //#region Experimental
            vm.markdown = "~~tacos~~  \ntacos";
            vm.assess = "**When you closely study a person, place or situation, or when you quickly size up an opponent or a charged situation,** roll Edge.  \n**10+**: gain 3 hold  \n**7-9**: gain 1 hold In the ensuing action, you may spend 1 hold at any time to ask the MC a question from the list below if your examination could have revealed the answer. The MC may ask you questions to clarify your intent. *Take +1 forward when acting on the answers.*  \n» What potential complication do I need to be wary of?  \n» What do I notice despite an effort to conceal it?  \n» How is ______ vulnerable to me?  \n» How can I avoid trouble or hide here?  \n» What is my best way in/way out/way past?  \n» Where can I gain the most advantage?  \n» Who or what is my biggest threat in this situation?  \n» Who or what is in control here?  \n  \n Assess is the move for examining a person, place or situation for useful information. Use it to gather information in the Legwork Phase, and to gain tactical advantage in tense situations. Although it has a restricted list of questions, it is more versatile than it seems. As MC, be generous with your answers to assess. Paint a detailed picture of the scene so the players can accurately imagine and describe their characters actions within it. Remember, you are the players' window into the fiction. Because all the moves start and end in the fiction, you must provide enough detail for the game to run smoothly so they need to know what the space looks like, who is in it, where the important actors are, where their characters are and what immediate threats are there. Exactly how much information you need to give will vary depending on the situation in the game and on your players, but scene descriptions are a great opportunity for you to chrome The Sprawl, smear it in dirt, and bathe it in neon, as your agenda and principles require. If there is anything hidden in the scene that you want the players to discover, you will have to give them clues, perhaps obvious clues; assess is your best excuse to do so. Give them information, then see what they do with it. As players, remember to write down when assess gives you +1 forward.";
            vm.xMoves = [
                {
                    "id": 309,
                    "gameid": 4,
                    "type": "Basic",
                    "class": null,
                    "name": "ACT UNDER PRESSURE (COOL)",
                    "description": "*When you race against the clock*, act while in danger or act to avoid danger, roll Cool. *10+:* you do it, no problem 7-9: you stumble, hesitate, or flinch: the MC will offer you a worse outcome, hard bargain, or ugly choice If you want to do something on a mission that isn't covered by the other moves, it probably involves danger or time pressure. Act under pressure involves instinctive reaction and sheer nerve which makes it a solid choice when you know a character has made a move but the action doesn't seem to fit any other move. Act under pressure to immediately find a hiding spot, run across a plaza under the noses of a security team, or cut through the vault door before the security office notices the cameras are down. Assess and several Playbook Moves allow you to spend hold to take actions that might otherwise require you to act under pressure. In those cases, advanced planning, careful positioning, or clever manoeuvring allow you to defuse the element that would otherwise cause you trouble.",
                    
                    "createdby": 1
                },
                {
                    "id": 310,
                    "gameid": 4,
                    "type": "Basic",
                    "class": null,
                    "name": "APPLY FIRST AID (COOL)",
                    "description": ", roll Cool. 10+: if their Harm Clock is at 2100 or less, reduce their harm by two segments. If their Harm Clock is at more than 2100, reduce their harm by one segment 7-9: reduce their harm by one segment. If their Harm Clock is still at more than 2100, they take -1 ongoing until they receive proper medical attention. Once a character has been given first aid, more first aid will not heal them further until they suffer harm again. First aid cannot heal missing body parts or damaged cyberware. To fix those problems, you'll need to make a deal with someone. Trauma Derms are appropriate medical equipment for wounds at 2100 or less, more serious wounds require an EMT kit.",
                    "trigger": "When you treat someone's wounds using appropriate medical equipment",
                    "createdby": 1
                },
                {
                    "id": 311,
                    "gameid": 4,
                    "type": "Basic",
                    "class": null,
                    "name": "ASSESS (EDGE)",
                    "description": ", roll Edge. 10+: gain 3 hold 7-9: gain 1 hold In the ensuing action, you may spend 1 hold at any time to ask the MC a question from the list below if your examination could have revealed the answer. The MC may ask you questions to clarify your intent. Take +1 forward when acting on the answers. <br />» What potential complication do I need to be wary of? <br />» What do I notice despite an effort to conceal it?<br />» How is ______ vulnerable to me? <br />» How can I avoid trouble or hide here? <br />» What is my best way in/way out/way past? <br />» Where can I gain the most advantage? <br />» Who or what is my biggest threat in this situation? <br />» Who or what is in control here? <br /> Assess is the move for examining a person, place or situation for useful information. Use it to gather information in the Legwork Phase, and to gain tactical advantage in tense situations. Although it has a restricted list of questions, it is more versatile than it seems. As MC, be generous with your answers to assess. Paint a detailed picture of the scene so the players can accurately imagine and describe their characters actions within it. Remember, you are the players' window into the fiction. Because all the moves start and end in the fiction, you must provide enough detail for the game to run smoothly so they need to know what the space looks like, who is in it, where the important actors are, where their characters are and what immediate threats are there. Exactly how much information you need to give will vary depending on the situation in the game and on your players, but scene descriptions are a great opportunity for you to chrome The Sprawl, smear it in dirt, and bathe it in neon, as your agenda and principles require. If there is anything hidden in the scene that you want the players to discover, you will have to give them clues, perhaps obvious clues; assess is your best excuse to do so. Give them information, then see what they do with it. As players, remember to write down when assess gives you +1 forward.",
                    "trigger": "When you closely study a person, place or situation, or when you quickly size up an opponent or a charged situation",
                    "createdby": 1
                },
                {
                    "id": 312,
                    "gameid": 4,
                    "type": "Basic",
                    "class": null,
                    "name": "PLAY HARDBALL (EDGE)",
                    "description": ", roll Edge. 10+: NPCs do what you want. PCs choose: do what you want, or suffer the established consequences 7-9: For NPCs, the MC chooses 1: <br />» they attempt to remove you as a threat, but not before suffering the established consequences <br />» they do it, but they want payback. Add them as a Threat <br />» they do it, but tell someone all about it. Advance the appropriate Mission Clock PCs choose: do what you want, or suffer the established consequences. They gain +1 forward to act against you.<br />Play hardball is the move for threatening people until they do what you want. Once you start down the path of violence, turning back will completely undermine your position, though, so you have to follow through. If you're threatening to break the security guard's fingers, but you're trying to scare him, you're blustering; that's fast talk. If you have your gun to the head of the VP and you're going to redecorate his office with his brains if he doesn't give you the codes, you're playing hardball. In The Sprawl, violence will get you what you want in the short term, but it will make enemies. Threats of violence work equally well whether you're getting information about the job in the Legwork Phase or completing mission objectives in the Action Phase, but it's a risk. If everything goes well, it can be a quiet method of getting what you want, but when it goes poorly it can escalate quickly and blow the mission all over the news tickers.",
                    "trigger": "When you get in someone's face threatening violence and you intend to carry through",
                    "createdby": 1
                },
                {
                    "id": 313,
                    "gameid": 4,
                    "type": "Basic",
                    "class": null,
                    "name": "ACQUIRE AGRICULTURAL PROPERTY (MEAT)",
                    "description": ", roll Meat. 10+: you survive until the medics arrive 7-9: you survive at a cost. Pick one: +owned, substandard treatment (-1 to a stat), cyberware damage (give one piece of cyberware a negative tag) 6-: you bleed out on the street Sooner or later, your character's number will come up, and that number will be 0000. Depending on the circumstances, that may mean death, but it may also mean EMTs and hospitalisation. At that point it comes down to your character's relationship to the corporation who owns that medical facility or the local street doc. For the MC, this is an opportunity to introduce complications. Tie the character's treatment into an established corporation or faction or introduce a new player. Hook the injured character with contracts, threats, cybernetic implants, addictive drugs, or antidotes. Corporations care about leverage, not legality or morality.",
                    "trigger": "When you hit 0000 on your Harm Clock",
                    "createdby": 1
                },
                {
                    "id": 314,
                    "gameid": 4,
                    "type": "Basic",
                    "class": null,
                    "name": "MIX IT UP (MEAT)",
                    "description": ", state that objective and roll Meat. 7+: you achieve your objective 7-9: choose 2: <br />» you make too much noise. Advance the relevant Mission Clock <br />» you take harm as established by the fiction <br />» an ally takes harm as established by the fiction <br />» something of value breaks Mix it up is the basic move for taking out enemies violently. Your objective when you mix it up should seldom be -kill everyone-. You're professionals on a mission, not sociopaths. -Take control of the server room and make sure the security team doesn't escape,- -escape the ambush,- and -buy the team enough time to get out of the lab- are more suitable objectives. This move is about using physical violence to impose your will upon your enemies. Dealing damage is a side effect. You can't tailor your objective so that you avoid the consequences of your choice on a 7-9 result. If doing something quietly is an explicit part of the objective you might succeed, but be discovered after or during the action for some other reason, if you choose you make too much noise. If not being detected is important to you, don't choose that option.",
                    "trigger": "When you use violence against an armed force to seize control of an objective",
                    "createdby": 1
                },
                {
                    "id": 315,
                    "gameid": 4,
                    "type": "Basic",
                    "class": null,
                    "name": "RESEARCH (MIND)",
                    "description": ", ask a question from the list below and roll Mind. 10+: take [intel]; the MC will answer your question and answer a follow-up question from this list as well: <br />» Where would I find ______? <br />» How secure is ______? <br />» Who or what is related to ______? <br />» Who owned or employed ______? <br />» Who or what is ______ most valuable to? <br />» What is the relationship between ______ and ______? 7-9: take [intel]; the MC will answer your question 6-: the MC will answer your question... and make a move Research is the move for examining a collection of data for helpful information. Although it has a restricted list of questions, it is still quite versatile. As MC, be generous with your answers to research, especially on a 10+. Help the players feel comfortable planning and executing their mission when they succeed in their research. At the same time, take the opportunity to chrome-plate, dirt-smear, and neon-bathe the information and the world, as your agenda and principles require. You can be more cagey with information about the protagonists' employers, corporate motives, potential twists, and other complications, but if they ask about something and roll a hit, give them good intel! You want the characters to discover those devious corporate plots and they're good at their jobs, so give them the dirt, then see what they do with it. Be a fan of the players. As players, remember to write down when research gives you [intel].",
                    "trigger": "When you investigate a person, place, object, or service using a library, dossier or database (or combination of them)",
                    "createdby": 1
                }
            ]
            //#endregion
           
            
        }
})();

