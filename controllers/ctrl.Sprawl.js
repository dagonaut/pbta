(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('Sprawl', sprawl);
        
        sprawl.$inject = ['$rootScope','$scope','$http','$q','$state','$stateParams','$location','$cookies', '$sce','Auth','UserService','ClockService','MoveService','TagService', 'DirectiveService', 'CyberwareService', 'SprawlCharacterService'];
        function sprawl($rootScope, $scope, $http, $q, $state, $stateParams, $location, $cookies, $sce, Auth, UserService, ClockService, MoveService, TagService, DirectiveService, CyberwareService, SprawlCharacterService){
            //Private Properties
            var vm = this;
            var api = 'http://16watt.com/dev/pbta/api/api.php/';
            var userId =  2;
            
            //Scope Properties
            vm.harm = ["","","","","",""]; // THe Harm array represents the 15,18,21,22,23,00 of the harm bar
            vm.directives = directives();
            vm.classes = [{name:'driver'}, {name:'fixer'}, {name:'hacker'}, {name:'hunter'},{name:'infiltrator'},{name:'killer'},{name:'pusher'},{name:'reporter'},{name:'soldier'},{name:'tech'}];
            vm.class = "driver";
            vm.allDirectives = getAllDirectives();
            vm.classMoves = getClassMoves(vm.class);
            vm.sprawlMoves = getSprawlMoves(4);
            vm.allTags = getAllTags(4);
            vm.allCyberware = getAllCyberware();
            vm.characterData = {};
            vm.directivesHtml = "";
            vm.showClockEdit = false;

            vm.classData = {
                "driver": {"directives":[1,2,3,4], "cyberware":[9], "gear":"<strong>Custom cyber-linked vehicle (as described below)</strong> <br /><strong>Choose one weapon:</strong><ul> <li>Automatic shotgun (3-harm close/near loud messy autofire) <li>Heavy pistol (3-harm close/near loud) <li>Machette (3-harm hand) </ul><strong>Choose one:</strong><ul> <li>Armour jacket (1-armour) <li>Synth leathers (0-armour, +discreet, subtract 1 when rolling the harm move <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) </ul>","names": ["Aziz","Cartman","Cowboy","Demon","Frank","Furiosa","Luka","Max","Roadkill","Roo","Rook","Squirrel","Tower","an animal name","a violent name","a cocky name"], "look": { "eyes": ["laughing","cool","hard","cold","distant","artificial"], "face": ["blank","thin","covered","attractive","decorated","rugged"], "body": ["toned","lithe","compact","scarred","augmented","flabby","unfit"], "wear": ["flashy","formal","casual","utility","scrounge","vintage","leathers","military","corporate"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]},"classSpecific": "<h4>VEHICLES</h4><strong>Choose a Frame:</strong> motorcycle, car, hovercraft, boat, vectored-thrust panzer, fixed-wing aircraft, helicopter, amphibious <br /><strong>Choose a Design:</strong> racing, recreational, passenger transport, cargo, military, luxury, civilian,  commercial, courier <br /><strong>Choose a Profile:</strong> <br />» Power+2, Looks+1, Weakness+1; 1-Armour <br />» Power+2, Looks+2, Weakness+1; 0-Armour <br />» Power+1, Looks+2, Weakness+1; 1-Armour <br />» Power+2, Looks+1, Weakness+2; 2-Armour <br /><i>For each point of Power, choose a strength; For each point of Looks, choose a look; For each point of Weakness, choose a weakness. </i><br />» <strong>Strengths:</strong> fast, quiet, rugged, aggressive, huge, off-road, responsive, uncomplaining, capacious, workhorse, easily repaired. <br />» <strong>Looks:</strong>sleek, vintage, pristine, powerful, luxurious, flashy, muscular, quirky, pretty, garish, armoured, armed, nondescript. <br />» <strong>Weaknesses:</strong> slow, fragile, sloppy, lazy, cramped, picky, guzzler, unreliable, loud <br />If your vehicle has Power+2, it may mount one weapon system; Military vehicles may mount an additional weapon system. <br />» <strong>Weapons:</strong> Machine guns (3-harm near/far area loud messy autofire),  grenade launchers (4-harm near/far area loud messy), missile launcher (5-harm far area messy breach), autocannon (4-harm near/far area messy breach) <br />When you’ve finished creating your vehicle, name it. ________________________________ _______ <br />Arrow, Bianca, Christine, Hobbes, Jeeves, Lucifer, Lucky, Mamma, Needle, Ninja, R.H.I.N.O.,  Shit Box, Silver, The Other Car, Thumbalina, Vanguard, a technical name, a task-oriented name,  an anthropomorphic name, a gendered name, an animal name<h4>DRONES</h4><strong>Choose a Motive style:</strong>  rotor, fixed-wing, quadruped, octoped, tracked, wheeled, aquatic, amphibious, submarine.<br /> <strong>Choose a Frame:</strong><ul> <li>Tiny (insect-sized): +small, +fragile, +stealthy, pick one sensor   <li>Small (rat- to cat-sized): choose one strength, one sensor, one weakness, and one other from any category   <li>Medium (dog-sized): choose one strength, one sensor, one weakness, and two others from any category   <li>Large (bear-sized): +obvious, choose two strengths, one sensor, one weakness and two others from any category  </ul><strong> Strengths:</strong> fast, rugged, off-road, responsive, uncomplaining, easily repaired, stealthy, tight encryption, autonomous, robot arm, armed, satellite relay. <br /><strong>Sensors:</strong> magnification, medical, thermographic, jamming,  image enhancement, analysis software, sonar. <br /><strong>Weaknesses:</strong> slow, fragile, unreliable, loud, loose encryption, obvious. <br /><strong>Armed:</strong> a weapon can be mounted on the drone. The weapon’s size is determined by the size of the frame. <br />A small drone can mount a gun dealing 2- or s-harm with a range tag of close or less and without the autofire tag.<br />A medium drone can mount a gun dealing up to 3-harm with a range tag of near or less.<br /> A large drone can mount a gun dealing up to 5-harm."},
                "fixer": {"directives":[5,6,7,8], "cyberware":[1,3,9], "gear": "<strong>Choose one weapon:</strong><ul> <li>Holdout pistol (2-harm hand/close discreet quick reload loud) <li>Semi-auto pistol (2-harm close/near loud quick)</li></ul>< <strong>Choose two:</strong><ul><li>Armoured coat (1-armour) <li>Armoured clothing (armour 0, +discreet, subtract 1 when rolling the harm move) <li>Flashy ride (choose one: motorcycle, sports car, speed boat) <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) <li>+Encrypted communications gear </li></ul>", "names":["Gant","Hub","Intrigue","Jacinta","Jinx","Lilliana","Master D","Mr. Johnson","Sally","The Goto","a connected name","a gregarious name","a shadowy name"], "look":{"eyes":["trustworthy","focused","artificial","cool"],"face":["attractive","scarred","hidden","friendly"],"body":["small","thin","bulky","toned","muscular","fleshy"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"],"wear":["corporate","formal","street","military","utility"]},"classSpecific": "<h4>HUSTLING</h4> You have people who work for you in various ways. You start with 2-crew and two jobs from the list below. Between missions, choose a number of those jobs equal to or less than your current crew, describe what each job is, and roll Edge: 10+: you profit from each of your jobs; 7-9: one of them is a Disaster and you Profit from the rest;  6-: everything’s FUBAR. The MC will make a move based on the Disaster for each job<br /><strong>Choose two:</strong> <br /><strong>Surveillance:</strong> You have a small network of informants who report on events; you then sell that information. <strong>Profit:</strong> gain [intel]. <strong>Disaster:</strong> someone acts on bad info <br /><strong>Debt collection:</strong> You have a few burly looking fuckers who collect outstanding debts. <strong>Profit:</strong> gain [gear]. <strong>Disaster:</strong> someone’s out of pocket <br /><strong>Petty theft:</strong> You have a small crew who perform minor local robberies. <strong>Profit:</strong> gain [gear]. <strong>Disaster:</strong> they robbed the wrong guy. <br /><strong>Deliveries:</strong>People hire you to transport things and you have a driver who takes care of that. <strong>Profit:</strong> gain 1 Cred. <strong>Disaster:</strong> the delivery never arrives. <br /><strong>Brokering deals:</strong>You arrange for the right people to meet each other <strong>Profit:</strong> gain 1 Cred. <strong>Disaster:</strong> the deal that you arranged goes wrong. <br /><strong>Technical work:</strong>You have a couple of techs whom you supply with work <strong>Profit:</strong> gain [gear]. <strong>Disaster:</strong> something bad happens to someone else’s property. <br /><strong>Pimping:</strong> You manage a small stable of physical or virtual sex workers <strong>Profit:</strong> gain [intel]. <strong>Disaster:</strong> something goes wrong with a customer. <br /><strong>Addictive Substances:</strong> You manage a small lab producing either drugs or simstim chips.  <strong>Profit:</strong> gain [intel]. <strong>Disaster:</strong> something goes wrong for a user or for the lab itself"},
                "hacker": {"directives":[5,1,7,9], "cyberware":[9], "gear":"<strong>Choose and name one cyberdeck:</strong><ul> <li>Defensive deck (Hardening 2, Firewall 2, Processor 1, Stealth 1) and two programs from the list below <li>Performance deck (Hardening 1, Firewall 1, Processor 2, Stealth 2) and three programs from the list below <strong>Programs:</strong><ul> <li>Lockdown (When you successfully compromise security, hold +1) <li>Defend (+2 Firewall) <li>Efficiency Routines (+2 Processor) <li>Sift (Take +1 ongoing to research or search for paydata in a secure database) <li>Manipulate (When you successfully manipulate systems, hold +1) <li>Alert (When you successfully assess in the matrix, Choose one extra option) <li>Identity Protection (+2 Stealth) <li>Eject (+1 forward to jack out)</ul></ul> <strong>Choose one weapon:</strong><ul> <li>Flechette pistol (3-harm close/near quick flechette) <li>Machine pistol (2-harm close/near loud autofire) <strong>Choose two:</strong><ul> <li>Armoured coat (1-armour) <li>Armoured clothing (0-armour, discreet, subtract 1 when rolling the harm move) <li>Armoured fridge (3-armour, immobile) <li>Microtronics workstation (you may perform field repairs on electronics and cyberware) <li>+Flashy motorcycle </ul>","names": ["Case","Core","Crowley","Dead Rob","Djinn","Frozz","Gaius Lupo","Hazer","Johnny","Nezumi","Patch","Wyldstyle","a sneaky name","a techy name","a mystical name"], "look": {"eyes": ["young","cool","impatient","smug","twitching","mocking"], "face": ["scarred","sneering","smooth","decorated","hidden"], "body": ["small","thin","awkward","flabby","young"], "wear": ["worn","corporate","punk","street","scrounged"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                "hunter": {"directives":[10,11,12,4], "cyberware":[1,2,11,12], "gear": "<strong>Choose two weapons:</strong><ul> <li>Heavy revolver (3-harm close/near reload loud) <li>Holdout pistol (2-harm hand/close discreet quick reload loud) <li>Flechette pistol (3-harm close/near quick flechette) <li>Hand taser (s-harm hand reload) <li>Sniper rifle (3-harm far/extreme loud)</ul> <strong>Choose two:</strong><ul> <li>Armoured coat (1-armour) <li>Armoured clothing (armour 0, +discreet, subtract 1 when rolling the harm move) <li>Nondescript sedan <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) <li>Glasses or goggles (Choose one: +light amplification +magnification, +recording)</li></ul>", "names":["Archer","Boone","Deckard","Frost","Marîd","Markham","Mr. Black","Python","Quade","Richards","Ritter","Seamus Riley","Taylor","a real name","an anonymising name","a predatory name"], "look":{"eyes": ["searching","restless","artificial","penetrating","resigned","jaded","obscured"], "face": ["scarred","impassive","friendly","nondescript","weathered"], "body": ["muscular","lithe","augmented","wiry","compact","overweight"], "wear": ["worn","faded","corporate","casual","street","scrounged."] ,"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                "infiltrator": {"directives":[2,6,7,13], "cyberware":[1,2,9,10,11], "gear":"<strong>Choose three weapons:</strong><ul> <li>Sniper rifle (3-harm far/extreme loud) <li>Machine pistol (2-harm close/near loud autofire) <li>Hand taser (s-harm hand reload) <li>Silenced SMG (2-harm close/near autofire) <li>Silenced semi-auto pistol (2-harm close quick) <li>Monofilament whip (4-harm hand messy area dangerous) <li>Sword (3-harm hand messy) <li>Shuriken or Throwing Knives (2-harm close infinite) </ul><strong>Choose one:</strong><ul> <li>Stealth suit (+1 ongoing to avoid being detected while alone and hidden) <li>Disguise kit (+1 ongoing to avoid being detected while successfully maintaining a fake persona) <li>Recording equipment <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) <li>Infiltration deck (Hardening 1, Firewall 1, Processor 1, Stealth 2) and three programs: Identity Protection (+2 Stealth), Lockdown (when you successfully compromise security, hold +1) and Manipulate (When you successfully manipulate systems, hold +1).</ul>","names": ["Bertrand","Blue","Kit","Loe Qi","Max","Nef","Smoke","Spectre","Zero","a sneaky name","a cool name","an efficient name"], "look": { "eyes": ["dark","focused","black","artificial","cunning","restless"], "face": ["hidden","ambiguous","nondescript","sneering","calm","weathered"], "body":["lithe","augmented","wiry","athletic","slim"], "wear": ["utility","military","corporate","street","scrounged"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                "killer": {"directives":[14,15,8,7], "cyberware":[1,4,6,7,8,9,10], "gear":"Custom Weapon (as described above).<br /> <strong>Choose two more weapons (any firearm can be +linked):</strong><ul> <li>Silenced machine pistol (2-harm close/near autofire) <li>Automatic shotgun (3-harm close/near loud messy autofire) <li>Heavy revolver (3-harm close/near reload loud) <li>Assault rifle (3-harm near/far loud autofire) <li>Sword (3-harm hand messy) <li>Machette (3-harm hand) </ul><strong>Choose one:</strong><ul> <li>Body armour (2-armour) <li>Armoured jacket (1-armour) <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) <li>Aggressive motorcycle </ul>","names": ["Angelo","Dead Eyes","John","LouLou","Kennedy","Knock","Mé Moì","Molly","Oakley","Sarah","Sleeper","an ironic name","a cool name","a deadly name"], "look": { "eyes": ["hard","dead","mirrored","artificial","cunning","manic","unhinged","wild"], "face": ["scarred","impassive","friendly","nondescript","weathered","decorated"], "body": ["muscular","lithe","augmented","wiry","compact"], "wear": ["military","corporate","punk","street","scrounged"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                "pusher": {"directives":[16,6,3,13], "cyberware":[1,3,7,9], "gear":"<strong>Choose two weapons:</strong><ul> <li>Holdout pistol (2-harm hand/close discreet quick reload loud) <li>Flechette pistol (3-harm close/near quick flechette) <li>Semi-auto pistol (2-harm close/near loud quick)</ul> <strong>Choose two:</strong><ul> <li>Synth leathers or armoured clothing (0-armour, discreet, subtract 1 when rolling the harm move) <li>Sleek ride (<strong>Choose one:</strong> motorcycle, car, helicopter) <li>Simsense recording equipment <li>Musical instruments <li>Encrypted communications relay <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) </ul>","names": ["Apostle","Chalice","Dancer","Dillon Vicara","Eleven","Ice Smooth","Lola Chrome","Magnetic","Nebula","Nigell","Prophet9","Relay","Sennheiser","Shard","a media name","a social name","a real name"], "look": {"eyes": ["shining","driven","vulnerable"," passionate","intense","trustworthy","artificial"], "face": ["attractive","friendly","striking","alluring","serene","sculpted"], "body": ["toned","muscular","relaxed","slim","augmented","soft","pudgy"], "wear": ["corporate","high fashion","avant-garde","street","flashy","punk"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]},"classSpecific": "<h4>BELIEVERS</h4> You are part of a gang, tribe, band, corporation or similar group. You can go to them for aid, for resources or to hide out until the heat dies down. As a group, they're pretty trustworthy, but they will make demands on you in return (your gang counts as a Contact). By default this group has a core of about 20 people as well as various associates and groupies What kind of gang is it? Choose one: Street, Corporate, Entertainment/Media, Military, Political How big is your gang? Choose a size and choose two tags: Small: 10 or fewer (loyal, mobile, wellarmed, specialists) Medium: 20-40 (mobile, well-armed, specialists) Large: 50-100 (well-connected, resources, self-sufficient) Huge: 200+ (well-connected, resources, spread out, self-sufficient) Define your gang's territory. Do they control a few blocks of the streets? Do they operate out of a compound or an arcology? Choose one: poor, wanted, hard to find, unreliable, violent, hated Who leads your gang? If your gang is small, you may be the leader. Otherwise, choose one: immoral, demanding, grasping, a real fucker, useless, absent What are your gang's main gigs? Choose two: commerce, crime, parties, muscle, deliveries, entertainment, infiltration, scavenging, activism, politics"},
                "reporter": {"directives":[11,7,9,4], "cyberware":[1,2,3,9], "gear":"<strong>Choose one weapon:</strong><ul> <li>Holdout pistol (2-harm hand/close discreet quick reload loud) <li>Flechette pistol (3-harm close/near quick flechette) <li>Hand taser (s-harm hand reload) </ul><strong>Choose two:</strong><ul> <li>Armoured clothing (0-armour, discreet, subtract 1 when rolling the harm move) <li>Encrypted communications equipment <li>Recording equipment <li>Glasses (choose 2: +light amplification, +magnification, +recording) <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm)) </ul>","names": ["Conduit","Farouk Dakins","Glass","Grant Access","Edison","Hoot","Madison Brookes-Watanabe","Parisa Zahed","Scoop","Spider","Witness","a media name","an inquiring name","an incisive name"], "look": {"eyes": ["penetrating","intense","empathetic","calm","determined","sad","dejected"], "face": ["attractive","friendly","serious","grim","composed","worn","weathered"], "body": ["toned","slim","augmented","tense","animated","flabby","tired"], "wear": ["corporate","street","punk","flashy","outdated","messy","worn"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                "soldier": {"directives":[12,10,17,6], "cyberware":[1,3,9,11,12], "gear":"<strong>Choose two weapons:</strong><ul> Heavy pistol (3-harm close/near loud) <li>Assault rifle (3-harm near/far loud autofire) <li>Fragmentation Grenades (4-harm near area reload loud messy) <li>Flashbangs (s-harm near area loud reload) </ul><strong>Choose two:</strong><ul> <li>Armoured vest (1-armour) <li>Armoured clothing (armour 0, +discreet, subtract 1 when rolling the harm move) <li>Communications relay (Choose +encrypted or +jamming) <li>Goggles (Choose two: +thermographic, +light amplification, +magnification, +flare compensation) <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm)</ul>","names": ["Alif","Armitage","Connomarah","Cortez","Grit","Mac","Sly","Turnus","Turner","a professional name","a determined name","a strange name"], "look":{ "eyes": ["hard","searching","artificial","cunning","penetrating","weary","jaded","haunted"], "face": ["rugged","scarred","weathered","tired","thin","decorated","calm"],"body": ["muscular","toned","unfit","graceful","wiry","tanned"], "wear": ["casual","utility","vintage","military","corporate","worn"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]}},
                "tech": {"directives":[14,7,8,9], "cyberware":[1,3,4,9], "gear":"<strong>You get this:</strong><ul> <li>Toolkit and gear appropriate to your area(s) of expertise Choose two weapons: <li>Holdout pistol (2-harm hand/close discreet quick reload loud) <li>Assault rifle (3-harm near/far loud autofire) <li>Fragmentation Grenades (4-harm near area reload loud messy) <li>Gas Grenades (s-harm near area reload gas) </ul><strong>Choose two:</strong><ul> <li>Armoured jacket (1-armour) <li>Armoured clothing (0-armour, discreet, subtract 1 when rolling the harm move) <li>Goggles (Choose two: +thermographic, +light amplification, +magnification, +flare compensation, +recording) <li>Truck or van (Choose one strength: +rugged, +off-road, +huge, +workhorse; and one weakness: +slow, +cramped, +loud) <li>Trauma Derms (allows you to apply first aid to characters at 2100 or less harm) <li>Encrypted jamming communications relay</ul>","names": ["Angel.1.3","AntiK-Tera","Bobby","Cathode","Eleni Larabee","Houwayyek","Mr. Wizard","Spanner","Transitivity","a weird name","a normal name","an technofetishising name"], "look": { "eyes": ["focused","excited","artificial","squinty","impatient","calm","appraising"], "face": ["plain","friendly","nondescript","weathered","expressive"], "body": ["muscular","wiry","compact","thin","flabby","fatty"], "wear": ["utility","military","corporate","street","scrounged"],"skin":["artificial","asian or south asian","black","decorated","hispanic/latino","indigenous","middle eastern","white","________"]},"classSpecific": "<h4>AREAS OF EXPERTISE</h4><br /><strong>Mechanic:</strong> you are an expert in the construction, maintenance and operation of vehicles & drones; you have two drones created according to the Driver move drone jockey<br /><strong>Splicer:</strong> you are an expert in cybernetics and biomodification; you may begin with one extra piece of cyberware; describe how you implanted this in yourself, but you need not describe how you paid for it<br /><strong>Breadboarder:</strong> you are an expert in computers and electronics; you have a cyberdeck with 5 points of ratings (no rating may be higher than 2) and a number of programs equal to its Processor rating+1 <br /><strong>Gunsmith:</strong> you are an expert in armaments; you begin with the Killer move  custom weapon <br /><strong>Medic:</strong> you are an expert in medicine and pharmaceuticals; when you apply first aid, you heal one additional harm segment, even on a miss <br /><strong>Pyrotechnician:</strong> you are an expert in chemistry and explosives; ignore the +dangerous tag for explosives You start with workshops appropriate to your areas of expertise (e.g. surgery, electronics workshop, garage)."}
            };
            
            //Scope Methods	
            vm.markHarm = markHarm;
            vm.clearHarm = clearHarm;

            //Clock related
            vm.clocks = getClocksByUserId(userId);
            vm.createClock = createClock;
            vm.deleteClock = deleteClock;
            vm.getClassMoves = getClassMoves;
            vm.getAllTags = getAllTags;

            init();
            
            function init(){
                buildDirectiveHtml();
                console.log(vm.clocks);
                console.log(vm.classData);
            }

            // Clocks
            function createClock(clock){
                var newClock = {
                    type: clock.type,
                    name: clock.name,
                    gameid: 4,
                    createdby: userId
                }
                ClockService.Create(newClock).then(function(data){
                    vm.showClockEdit = false;
                    getClocksByUserId(2);
                });                
            }

            function deleteClock(clockId){
                ClockService.Delete(clockId).then(function(data){
                    console.log("Deleted? " + clockId);
                    getClocksByUserId(userId);
                });
            }

            function getClocksByUserId(id){
                ClockService.GetByUserId(userId).then(function(data){
                    vm.clocks = data;
                });
            }

            // Moves
            function getClassMoves(c){
                MoveService.GetByClass(c).then(function(data){
                    vm.classMoves = data;
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

            // Tags
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
            
            // Harm
            function markHarm(position){
                clearHarm();
                for(var i = 0; i < vm.harm.length; i++){
                    if (i <= position){
                        vm.harm[i] = "active";
                    }
                }
            }

            function clearHarm(){
                vm.harm = ["","","","","",""];  
            }

            // Cyberware
            function getAllCyberware(){
                CyberwareService.GetAll().then(function(data){
                    vm.allCyberware = data;
                });
            }

            // Directives
            function getAllDirectives(){
                DirectiveService.GetAll().then(function(data){
                    vm.allDirectives = data;
                });
            }
            function directives(){
                return "<ul style='width:300px;'><li>Illustrious: When your desire for fame draws unwanted attention to the mission, mark experience. </li> <li>Intimate: When you put your friend ________________ ahead of the mission, mark experience.</li>                <li>Rejected: When your former membership of _________________ hinders the mission, mark experience. </li>                <li>Vengeful: When you harm _______________ or their interests, mark experience. </li>                    </ul>";               
            }

            function buildDirectiveHtml(){
                // vm.directivesHtml = "<ul style='width:300px;'>";
                // for(let i = 0; i < vm.classData[vm.class].directives.length; i++){
                //     let directive = vm.allDirectives.find(x => x.id === vm.classData[vm.class].directives[i]);
                //     //let directive = vm.allDirectives.filter(obj => { return obj.id === vm.classData[vm.class].directives[i] });
                //     vm.directives += "<li>" + directive.name + ": " + directive.description + "</li>";
                // }
                // vm.directivesHtml += "</ul>";
                // console.log(vm.directivesHtml);

            }
            vm.directivesByClass = [
                {Driver: [1,2,3,4]},
                {Fixer: [5,6,7,8]},
                {Hacker: [5,1,7,9]},
                {Hunter: [10,11,12,4]},
                {Infiltrator: [2,6,7,13]},
                {Killer: [14,15,8,7]},
                {Pusher: [16,6,3,13]},
                {Reporter: [11,7,9,4]},
                {Soldier: [12,10,17,6]},
                {Tech: [14,7,8,9]}
            ];
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
            vm.characterData.advancements = [
                {"selected":false,"type":"basic","description":"Choose another move from your playbook."},
                {"selected":false,"type":"basic","description":"Choose another move from your playbook."},
                {"selected":false,"type":"basic","description":"Choose another move from your playbook."},
                {"selected":false,"type":"basic","description":"Choose a move from another playbook."},
                {"selected":false,"type":"basic","description":"Choose a move from another playbook."},
                {"selected":false,"type":"basic","description":"+1 style (max +2)."},
                {"selected":false,"type":"basic","description":"+1 edge (max +2)."},
                {"selected":false,"type":"basic","description":"+1 cool (max +2)."},
                {"selected":false,"type":"basic","description":"+1 mind (max +2)."},
                {"selected":false,"type":"basic","description":"+1 meat (max +2)."},
                {"selected":false,"type":"basic","description":"+1 synth (max +3)."},
                {"selected":false,"type":"advanced","description":"+1 to any stat (max +3)."},
                {"selected":false,"type":"advanced","description":"buy off an obligation, enemy or owned."},
                {"selected":false,"type":"advanced","description":"change your character to a new playbook."},
                {"selected":false,"type":"advanced","description":"rewind a corporate countdown clock to 1800. [req 10cred]"},
                {"selected":false,"type":"advanced","description":"retire your character to safety. [req 20cred]"},
                {"selected":false,"type":"advanced","description":"make a second character."}
            ]
            
        }
})();

