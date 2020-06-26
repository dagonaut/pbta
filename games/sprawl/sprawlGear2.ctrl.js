(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('sprawl_gear', sprawl_gear);
        
        sprawl_gear.$inject = ['$rootScope','$scope','$http'];
        function sprawl_gear($rootScope, $scope, $http){
            //Private Properties
            let vm = this;
            
            // Properties
            // TODO: Make this a $get
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

            init();

            function init(){
                console.log("Sprawl Gear 2");
            }            
        }
})();

