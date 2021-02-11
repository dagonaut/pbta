(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('WestReferenceController', WestReferenceController);

        WestReferenceController.$inject = ['$rootScope','$scope','$http'];
        function WestReferenceController($rootScope, $scope, $http){
            let vm = this;
            let _names;
            
            // Scope Properties
            vm.visible = { "Basic": [], "Other": [], "Dinero": [], "Fights": []};
            vm.moves = [];
            vm.fightmoves = [];
            vm.gear = [];
            
            vm.nameOptions = { 
                all: false,               
                cowboy: false,
                simple: false,
                fancy: false,
                apache: false,
                cheyenne: false,
                lakota: false,
                navajo: false,                
                spanish: false,
                asian: false
            };

            vm._nameOptions = [];

            // Events
            vm.getName = getName;
            vm.updateOptions = updateOptions;

            init();            

            function init(){
                setStatic(); 
                getMoves();            
            }            

            function getMoves(){
                let _movesJSON = './static/weirdwest/ww-moves.json';
                let _fightmovesJSON = './static/weirdwest/ww-fightsMoves.json';                
                $http.get(_movesJSON).then(getMovesSuccess, getMovesFail);
                    function getMovesSuccess(response){
                        vm.moves = response.data;                  
                    }
                    function getMovesFail(error){
                        console.log(error);
                    }
                $http.get(_fightmovesJSON).then(getFightMovesSuccess, getFightMovesFail);
                    function getFightMovesSuccess(response){
                        vm.fightmoves = response.data;                  
                    }
                    function getFightMovesFail(error){
                        console.log(error);
                    }                
            }

            // Name Generator
            function updateOptions(option){
                let i = vm._nameOptions.indexOf(option)
                if(i > -1){
                    vm._nameOptions.splice(i, 1);
                } else {
                    vm._nameOptions.push(option);
                }
            }

            function getName(gender){              
                let num, name, genderNames, typeNames;
                if(vm._nameOptions.length === 0 && gender !== 'horse' && gender !== 'all'){ 
                    vm.nameGenerated = 'Pick one or many name types or press ALL'; 
                } else {
                    switch (gender) {
                        case "either":
                            typeNames = _names.filter(obj => vm._nameOptions.indexOf(obj.type) > -1);
                            num = Math.floor(Math.random() * typeNames.length - 1);
                            name = typeNames[num];                        
                            vm.nameGenerated = name.name + " [" + name.type + ", " + name.gender + "]";
                            break;
                        case "male":
                        case "female":
                            genderNames = _names.filter(obj => obj.gender === gender);                        
                            typeNames = genderNames.filter(obj => vm._nameOptions.indexOf(obj.type) > -1);
                            num = Math.floor(Math.random() * typeNames.length - 1);
                            name = typeNames[num];                        
                            vm.nameGenerated = name.name + " [" + name.type + ", " + name.gender + "]";
                            break;
                        case "horse":
                            let horse_names = _names.filter(obj => obj.gender === gender);
                            num = Math.floor(Math.random() * horse_names.length - 1);                        
                            vm.nameGenerated = horse_names[num].name;
                            break;
                        default:
                            num = Math.floor(Math.random() * _names.length - 1);
                            name = _names[num];                        
                            vm.nameGenerated = name.name + " [" + name.type + ", " + name.gender + "]";
                            break;
                    }
                }
            }

            function setStatic(){            
                _names = [
                    {"id":"1", "gender": "male", "type": "cowboy", "name":"Armadillo Slim"},
                    {"id":"2", "gender": "male", "type": "cowboy", "name":"Barnabus “Bear” Green"},
                    {"id":"3", "gender": "male", "type": "cowboy", "name":"Big Zeke"},
                    {"id":"4", "gender": "male", "type": "cowboy", "name":"Black Jack"},
                    {"id":"5", "gender": "male", "type": "cowboy", "name":"Buffalo Smith"},
                    {"id":"6", "gender": "male", "type": "cowboy", "name":"Butch Parker"},
                    {"id":"7", "gender": "male", "type": "cowboy", "name":"Chuck-aLuck Charlie"},
                    {"id":"8", "gender": "male", "type": "cowboy", "name":"Curly Dave"},
                    {"id":"9", "gender": "male", "type": "cowboy", "name":"Dynamite Dan Collins"},
                    {"id":"10", "gender": "male", "type": "cowboy", "name":"Fat Thompson"},
                    {"id":"11", "gender": "male", "type": "cowboy", "name":"Lefty Lukas"},
                    {"id":"12", "gender": "male", "type": "cowboy", "name":"Little Zeke"},
                    {"id":"13", "gender": "male", "type": "cowboy", "name":"Johnny Reno"},
                    {"id":"14", "gender": "male", "type": "cowboy", "name":"Mad Dog Macready"},
                    {"id":"15", "gender": "male", "type": "cowboy", "name":"Mike “Pretty Boy” O'Malley"},
                    {"id":"16", "gender": "male", "type": "cowboy", "name":"Shorty Malone"},
                    {"id":"17", "gender": "male", "type": "cowboy", "name":"“Six-Gun” Jim Mason"},
                    {"id":"18", "gender": "male", "type": "cowboy", "name":"Voodoo Vance"},
                    {"id":"19", "gender": "male", "type": "cowboy", "name":"Vulture Phil Stanchfield"},
                    {"id":"20", "gender": "male", "type": "cowboy", "name":"Wild Will Yeager"},
                    {"id":"21", "gender": "male", "type": "simple", "name":"Al Smith"},
                    {"id":"22", "gender": "male", "type": "simple", "name":"Abe Pickett"},
                    {"id":"23", "gender": "male", "type": "simple", "name":"Bill Ellis"},
                    {"id":"24", "gender": "male", "type": "simple", "name":"Bob Hill"},
                    {"id":"25", "gender": "male", "type": "simple", "name":"Cy O'Malley"},
                    {"id":"26", "gender": "male", "type": "simple", "name":"Dick Chesterfield"},
                    {"id":"27", "gender": "male", "type": "simple", "name":"Ed Jones"},
                    {"id":"28", "gender": "male", "type": "simple", "name":"Gus White"},
                    {"id":"29", "gender": "male", "type": "simple", "name":"Hank McCormick"},
                    {"id":"30", "gender": "male", "type": "simple", "name":"Ike Miller"},
                    {"id":"31", "gender": "male", "type": "simple", "name":"Jubal Anderson"},
                    {"id":"32", "gender": "male", "type": "simple", "name":"John Wilson"},
                    {"id":"33", "gender": "male", "type": "simple", "name":"Jude Conway"},
                    {"id":"34", "gender": "male", "type": "simple", "name":"Mal Collins"},
                    {"id":"35", "gender": "male", "type": "simple", "name":"Pat Barlow"},
                    {"id":"36", "gender": "male", "type": "simple", "name":"Paul Stevens"},
                    {"id":"37", "gender": "male", "type": "simple", "name":"Roy Martin"},
                    {"id":"38", "gender": "male", "type": "simple", "name":"Sam Austin"},
                    {"id":"39", "gender": "male", "type": "simple", "name":"Tom Perkins"},
                    {"id":"40", "gender": "male", "type": "simple", "name":"Tony Lane"        },
                    {"id":"41", "gender": "male", "type": "fancy", "name":"Archibald Cadbury"},
                    {"id":"42", "gender": "male", "type": "fancy", "name":"Alexander Clarke"},
                    {"id":"43", "gender": "male", "type": "fancy", "name":"Bartholomew Hilderbrandt"},
                    {"id":"44", "gender": "male", "type": "fancy", "name":"Cornelius Quimby"},
                    {"id":"45", "gender": "male", "type": "fancy", "name":"Ebenezer Schultz"},
                    {"id":"46", "gender": "male", "type": "fancy", "name":"Everett Burroughs"},
                    {"id":"47", "gender": "male", "type": "fancy", "name":"Hamilton Atlee"},
                    {"id":"48", "gender": "male", "type": "fancy", "name":"Howard Jackson"},
                    {"id":"49", "gender": "male", "type": "fancy", "name":"Isaiah Ward"},
                    {"id":"50", "gender": "male", "type": "fancy", "name":"Jedidiah Cunningham"},
                    {"id":"51", "gender": "male", "type": "fancy", "name":"Lucius Clay"},
                    {"id":"52", "gender": "male", "type": "fancy", "name":"Jonathan Featherstone"},
                    {"id":"53", "gender": "male", "type": "fancy", "name":"Marcus Carmichael"},
                    {"id":"54", "gender": "male", "type": "fancy", "name":"Nathaniel Lancaster"},
                    {"id":"55", "gender": "male", "type": "fancy", "name":"Nigel Rhodes"},
                    {"id":"56", "gender": "male", "type": "fancy", "name":"Norbert Constantine"},
                    {"id":"57", "gender": "male", "type": "fancy", "name":"Silas Cheney"},
                    {"id":"58", "gender": "male", "type": "fancy", "name":"Thaddeus Woolsworth"},
                    {"id":"59", "gender": "male", "type": "fancy", "name":"William Hancock"},
                    {"id":"60", "gender": "male", "type": "fancy", "name":"Winston Dumont"},
                    {"id":"61", "gender": "male", "type": "apache", "name":"Askadodilges (Hides His Foot)"},
                    {"id":"62", "gender": "male", "type": "apache", "name":"Bimisi (Slippery)"},
                    {"id":"63", "gender": "male", "type": "apache", "name":"Biminak (Slick Roper)"},
                    {"id":"64", "gender": "male", "type": "apache", "name":"Bipin (Forest)"},
                    {"id":"65", "gender": "male", "type": "apache", "name":"Bodaway (Firemaker)"},
                    {"id":"66", "gender": "male", "type": "apache", "name":"Chalipun"},
                    {"id":"67", "gender": "male", "type": "apache", "name":"Cochise (Hard Wood)"},
                    {"id":"68", "gender": "male", "type": "apache", "name":"Dasodah (Only Sits There)"},
                    {"id":"69", "gender": "male", "type": "apache", "name":"Delshay"},
                    {"id":"70", "gender": "male", "type": "apache", "name":"Eknath (Poet)"},
                    {"id":"71", "gender": "male", "type": "apache", "name":"Eskiminzin (Big Mouth)"},
                    {"id":"72", "gender": "male", "type": "apache", "name":"Goyathlay (Yawner)"},
                    {"id":"73", "gender": "male", "type": "apache", "name":"Illanipi (Amazing)"},
                    {"id":"74", "gender": "male", "type": "apache", "name":"Itza-chu (Great Hawk)"},
                    {"id":"75", "gender": "male", "type": "apache", "name":"JlinLitzoque (Yellow Horse)"},
                    {"id":"76", "gender": "male", "type": "apache", "name":"Kuruk (Bear)"},
                    {"id":"77", "gender": "male", "type": "apache", "name":"Natan (Spokesman)"},
                    {"id":"78", "gender": "male", "type": "apache", "name":"Nitis (Friend)"},
                    {"id":"79", "gender": "male", "type": "apache", "name":"Taklishim (Grey One)"},
                    {"id":"80", "gender": "male", "type": "apache", "name":"Tarak (Star)"},
                    {"id":"81", "gender": "male", "type": "cherokee", "name":"Adahy (In The Oak Woods)"},
                    {"id":"82", "gender": "male", "type": "cherokee", "name":"Atsadi (Fish)"},
                    {"id":"83", "gender": "male", "type": "cherokee", "name":"Chea Sequah (Red Bird)"},
                    {"id":"84", "gender": "male", "type": "cherokee", "name":"Chuquilatague (Double Head)"},
                    {"id":"85", "gender": "male", "type": "cherokee", "name":"Degataga (Standing Together)"},
                    {"id":"86", "gender": "male", "type": "cherokee", "name":"Dustu (Spring Frog)"},
                    {"id":"87", "gender": "male", "type": "cherokee", "name":"Galegenoh (Stag)"},
                    {"id":"88", "gender": "male", "type": "cherokee", "name":"Gawonii (He Is Speaking)"},
                    {"id":"89", "gender": "male", "type": "cherokee", "name":"Kanagagota (Standing Turkey)"},
                    {"id":"90", "gender": "male", "type": "cherokee", "name":"Kanuna (Bullfrog)"},
                    {"id":"91", "gender": "male", "type": "cherokee", "name":"Koatohee (Corn Tassel)"},
                    {"id":"92", "gender": "male", "type": "cherokee", "name":"Mohe (Elk) Oconostota (Warrior)"},
                    {"id":"93", "gender": "male", "type": "cherokee", "name":"Oukonunaka (White Owl)"},
                    {"id":"94", "gender": "male", "type": "cherokee", "name":"Rayetayah (Hanging Maw)"},
                    {"id":"95", "gender": "male", "type": "cherokee", "name":"Salal (Squirrel)"},
                    {"id":"96", "gender": "male", "type": "cherokee", "name":"Sequoyah (Sparrow)"},
                    {"id":"97", "gender": "male", "type": "cherokee", "name":"Tsiyi (Canoe)"},
                    {"id":"98", "gender": "male", "type": "cherokee", "name":"Unaduti (Wooly Head)"},
                    {"id":"99", "gender": "male", "type": "cherokee", "name":"Waya (Wolf)"},
                    {"id":"100", "gender": "male", "type": "cheyenne", "name":"Ahhoamow (Left Hand Bull)"},
                    {"id":"101", "gender": "male", "type": "cheyenne", "name":"Hakani (Mad Wolf)"},
                    {"id":"102", "gender": "male", "type": "cheyenne", "name":"Hoitseyou (Standing Lightning)"},
                    {"id":"103", "gender": "male", "type": "cheyenne", "name":"Hotowa (Bull Looking Around)"},
                    {"id":"104", "gender": "male", "type": "cheyenne", "name":"Innah (Red Hawk)"},
                    {"id":"105", "gender": "male", "type": "cheyenne", "name":"Minoonia (Man Heart)"},
                    {"id":"106", "gender": "male", "type": "cheyenne", "name":"Mistimiah (Big Owl)"},
                    {"id":"107", "gender": "male", "type": "cheyenne", "name":"Monish (Elk Standing) Motownama (Black Wolf)"},
                    {"id":"108", "gender": "male", "type": "cheyenne", "name":"Mucatawuc (Black Cloud)"},
                    {"id":"109", "gender": "male", "type": "cheyenne", "name":"Nawquis (Little Bear)"},
                    {"id":"110", "gender": "male", "type": "cheyenne", "name":"Nitnutahwaist (Black Eagle)"},
                    {"id":"111", "gender": "male", "type": "cheyenne", "name":"Nucquaissu (Bear Raising)"},
                    {"id":"112", "gender": "male", "type": "cheyenne", "name":"Okomish (Little Coyote)"},
                    {"id":"113", "gender": "male", "type": "cheyenne", "name":"Pawanista (Howling Water)"},
                    {"id":"114", "gender": "male", "type": "cheyenne", "name":"Tahevenahehna (Night Killer)"},
                    {"id":"115", "gender": "male", "type": "cheyenne", "name":"Tomachama (One-Eyed Bull)"},
                    {"id":"116", "gender": "male", "type": "cheyenne", "name":"Wahistah (White Buffalo)"},
                    {"id":"117", "gender": "male", "type": "cheyenne", "name":"Wahattuf (Catching In Battle)"},
                    {"id":"118", "gender": "male", "type": "cheyenne", "name":"Wahtamaket (Dog Man)" },
                    {"id":"119", "gender": "male", "type": "lakota", "name":"Canowicakte (Kills In Woods)"},
                    {"id":"120", "gender": "male", "type": "lakota", "name":"Chankoowashtay (Good Road)"},
                    {"id":"121", "gender": "male", "type": "lakota", "name":"Chatan (Falcon)"},
                    {"id":"122", "gender": "male", "type": "lakota", "name":"Dakota (Friend)"},
                    {"id":"123", "gender": "male", "type": "lakota", "name":"Enapay (Appears Brave)"},
                    {"id":"124", "gender": "male", "type": "lakota", "name":"Hotah (Strong)"},
                    {"id":"125", "gender": "male", "type": "lakota", "name":"Kohana (Swift)"},
                    {"id":"126", "gender": "male", "type": "lakota", "name":"Mahkah (Earth)"},
                    {"id":"127", "gender": "male", "type": "lakota", "name":"Makphia-Luta (Red Cloud)"},
                    {"id":"128", "gender": "male", "type": "lakota", "name":"Matoskah (White Bear)"},
                    {"id":"129", "gender": "male", "type": "lakota", "name":"Mato Watakpe (Running Bear)"},
                    {"id":"130", "gender": "male", "type": "lakota", "name":"Mika (Racoon)"},
                    {"id":"131", "gender": "male", "type": "lakota", "name":"Napayshni (Courageous)"},
                    {"id":"132", "gender": "male", "type": "lakota", "name":"Ohanzee (Shadow)"},
                    {"id":"133", "gender": "male", "type": "lakota", "name":"Otaktay (Kills Many)"},
                    {"id":"134", "gender": "male", "type": "lakota", "name":"Tashunka (Horse)"},
                    {"id":"135", "gender": "male", "type": "lakota", "name":"Teetonka (Big Lodge)"},
                    {"id":"136", "gender": "male", "type": "lakota", "name":"Wahkan (Has Much Practice)"},
                    {"id":"137", "gender": "male", "type": "lakota", "name":"Wambleeska (White Eagle)"},
                    {"id":"138", "gender": "male", "type": "lakota", "name":"Wapasha (Red Leaf)"},
                    {"id":"139", "gender": "male", "type": "navajo", "name":"Ahiga (He Fights)"},
                    {"id":"140", "gender": "male", "type": "navajo", "name":"Ata'halne (He Interrupts)"},
                    {"id":"141", "gender": "male", "type": "navajo", "name":"Atsa (Eagle)"},
                    {"id":"142", "gender": "male", "type": "navajo", "name":"Atsidi (Hammer)"},
                    {"id":"143", "gender": "male", "type": "navajo", "name":"Bidziil (He is Strong)"},
                    {"id":"144", "gender": "male", "type": "navajo", "name":"Bisahalani (Orator)"},
                    {"id":"145", "gender": "male", "type": "navajo", "name":"Gaagii (Raven)"},
                    {"id":"146", "gender": "male", "type": "navajo", "name":"Hashkeh Naabah (Angry Warrior)"},
                    {"id":"147", "gender": "male", "type": "navajo", "name":"Hastiin (Man)"},
                    {"id":"148", "gender": "male", "type": "navajo", "name":"Hok'ee (Rearing Wolf)"},
                    {"id":"149", "gender": "male", "type": "navajo", "name":"Kilchii (Red Boy)"},
                    {"id":"150", "gender": "male", "type": "navajo", "name":"Naalnish (He Works)"},
                    {"id":"151", "gender": "male", "type": "navajo", "name":"Nastas (Foxtail)"},
                    {"id":"152", "gender": "male", "type": "navajo", "name":"Niyol (Wind)"},
                    {"id":"153", "gender": "male", "type": "navajo", "name":"Niichaad (Swolen)"},
                    {"id":"154", "gender": "male", "type": "navajo", "name":"Sike (He Sits At Home)"},
                    {"id":"155", "gender": "male", "type": "navajo", "name":"Tahoma (Water's Edge)"},
                    {"id":"156", "gender": "male", "type": "navajo", "name":"Toh Yah (Walking By River)"},
                    {"id":"157", "gender": "male", "type": "navajo", "name":"Tsela (Stars Lying Down)"},
                    {"id":"158", "gender": "male", "type": "navajo", "name":"Yiska (Night Has Passed)" },
                    {"id":"159", "gender": "male", "type": "spanish", "name":"Agustin Reyes"},
                    {"id":"160", "gender": "male", "type": "spanish", "name":"Alejandro Valdez"},
                    {"id":"161", "gender": "male", "type": "spanish", "name":"Angel Hernandez"},
                    {"id":"162", "gender": "male", "type": "spanish", "name":"Carlos Jimenez"},
                    {"id":"163", "gender": "male", "type": "spanish", "name":"Eduardo Ramos"},
                    {"id":"164", "gender": "male", "type": "spanish", "name":"Fransisco Silva"},
                    {"id":"165", "gender": "male", "type": "spanish", "name":"Guillermo Mendoza"},
                    {"id":"166", "gender": "male", "type": "spanish", "name":"Javier Avila"},
                    {"id":"167", "gender": "male", "type": "spanish", "name":"Jesus Comacho"},
                    {"id":"168", "gender": "male", "type": "spanish", "name":"Jorge Santana"},
                    {"id":"169", "gender": "male", "type": "spanish", "name":"Jose Castillo"},
                    {"id":"170", "gender": "male", "type": "spanish", "name":"Juan Cardenas"},
                    {"id":"171", "gender": "male", "type": "spanish", "name":"Luis Torres"},
                    {"id":"172", "gender": "male", "type": "spanish", "name":"Miguel Valencia"},
                    {"id":"173", "gender": "male", "type": "spanish", "name":"Pedro Herrera"},
                    {"id":"174", "gender": "male", "type": "spanish", "name":"Raul Ibarra"},
                    {"id":"175", "gender": "male", "type": "spanish", "name":"Ricardo Garcia"},
                    {"id":"176", "gender": "male", "type": "spanish", "name":"Sancho Juarez"},
                    {"id":"177", "gender": "male", "type": "spanish", "name":"Santiago Gonzalez"},
                    {"id":"178", "gender": "male", "type": "spanish", "name":"Tomas Rios"      },
                    {"id":"179", "gender": "male", "type": "asian", "name":"Cai Zhang"},
                    {"id":"180", "gender": "male", "type": "asian", "name":"Cheng Ji"},
                    {"id":"181", "gender": "male", "type": "asian", "name":"Deng Bai"},
                    {"id":"182", "gender": "male", "type": "asian", "name":"Gao Yang"},
                    {"id":"183", "gender": "male", "type": "asian", "name":"Fu Ding"},
                    {"id":"184", "gender": "male", "type": "asian", "name":"Han Chen"},
                    {"id":"185", "gender": "male", "type": "asian", "name":"He Yuan"},
                    {"id":"186", "gender": "male", "type": "asian", "name":"Jiang Hong"},
                    {"id":"187", "gender": "male", "type": "asian", "name":"Li Sun"},
                    {"id":"188", "gender": "male", "type": "asian", "name":"Luo Deng"},
                    {"id":"189", "gender": "male", "type": "asian", "name":"Ma Zhou"},
                    {"id":"190", "gender": "male", "type": "asian", "name":"Meng Hao"},
                    {"id":"191", "gender": "male", "type": "asian", "name":"Song Han"},
                    {"id":"192", "gender": "male", "type": "asian", "name":"Sun Liu"},
                    {"id":"193", "gender": "male", "type": "asian", "name":"Tang Wu"},
                    {"id":"194", "gender": "male", "type": "asian", "name":"Wei Gang"},
                    {"id":"195", "gender": "male", "type": "asian", "name":"Xu Fang"},
                    {"id":"196", "gender": "male", "type": "asian", "name":"Yang Huang"},
                    {"id":"197", "gender": "male", "type": "asian", "name":"Zhang Li"},
                    {"id":"198", "gender": "male", "type": "asian", "name":"Zhao Pan" },
                    {"id":"199", "gender": "female", "type": "cowboy", "name":"Annie “Bullet” Baker"},
                    {"id":"200", "gender": "female", "type": "cowboy", "name":"Bad Luck Betty"},
                    {"id":"201", "gender": "female", "type": "cowboy", "name":"Bloody Bonnie Fletcher"},
                    {"id":"202", "gender": "female", "type": "cowboy", "name":"Casino Annie"},
                    {"id":"203", "gender": "female", "type": "cowboy", "name":"Cattle Kate Wallace"},
                    {"id":"204", "gender": "female", "type": "cowboy", "name":"Crazy Clementine Rhodes"},
                    {"id":"205", "gender": "female", "type": "cowboy", "name":"“Desert” Rose Foster"},
                    {"id":"206", "gender": "female", "type": "cowboy", "name":"Desolation Mary"},
                    {"id":"207", "gender": "female", "type": "cowboy", "name":"Diamond Delilah Milton"},
                    {"id":"208", "gender": "female", "type": "cowboy", "name":"Goldie Allen"},
                    {"id":"209", "gender": "female", "type": "cowboy", "name":"Hoosegow Lily"},
                    {"id":"210", "gender": "female", "type": "cowboy", "name":"Jackie “Jackalope” Lopez"},
                    {"id":"211", "gender": "female", "type": "cowboy", "name":"Mariposa Maggie"},
                    {"id":"212", "gender": "female", "type": "cowboy", "name":"Mamma Campbell"},
                    {"id":"213", "gender": "female", "type": "cowboy", "name":"Red"},
                    {"id":"214", "gender": "female", "type": "cowboy", "name":"Sarah “Deadeye” Cooper"},
                    {"id":"215", "gender": "female", "type": "cowboy", "name":"Sandy “Snake Eyes” Hickert"},
                    {"id":"216", "gender": "female", "type": "cowboy", "name":"Shotgun Sally"},
                    {"id":"217", "gender": "female", "type": "cowboy", "name":"Texas Tess"},
                    {"id":"218", "gender": "female", "type": "cowboy", "name":"“Whiskey” Wanda Manley"},
                    {"id":"219", "gender": "female", "type": "simple", "name":"Abigail Brown"},
                    {"id":"220", "gender": "female", "type": "simple", "name":"Belle Reaves"},
                    {"id":"221", "gender": "female", "type": "simple", "name":"Betsy Callahan"},
                    {"id":"222", "gender": "female", "type": "simple", "name":"Dorothy Porter"},
                    {"id":"223", "gender": "female", "type": "simple", "name":"Edith Hall"},
                    {"id":"224", "gender": "female", "type": "simple", "name":"Elsie Woods"},
                    {"id":"225", "gender": "female", "type": "simple", "name":"Faith Bradshaw"},
                    {"id":"226", "gender": "female", "type": "simple", "name":"Florence Olsen"},
                    {"id":"227", "gender": "female", "type": "simple", "name":"Grace Cooper"},
                    {"id":"228", "gender": "female", "type": "simple", "name":"Hannah Fisher"},
                    {"id":"229", "gender": "female", "type": "simple", "name":"Hester Sweeny"},
                    {"id":"230", "gender": "female", "type": "simple", "name":"Jamie Thompson"},
                    {"id":"231", "gender": "female", "type": "simple", "name":"Kitty McCall"},
                    {"id":"232", "gender": "female", "type": "simple", "name":"Leah Bringham"},
                    {"id":"233", "gender": "female", "type": "simple", "name":"Martha Perry"},
                    {"id":"234", "gender": "female", "type": "simple", "name":"Nettie Ryder"},
                    {"id":"235", "gender": "female", "type": "simple", "name":"Pattie Gibson"},
                    {"id":"236", "gender": "female", "type": "simple", "name":"Rose Parker"},
                    {"id":"237", "gender": "female", "type": "simple", "name":"Susan Culver"},
                    {"id":"238", "gender": "female", "type": "simple", "name":"Vicki Anders"        },
                    {"id":"239", "gender": "female", "type": "fancy", "name":"Adeline Cromwell"},
                    {"id":"240", "gender": "female", "type": "fancy", "name":"Allegra Vickers"},
                    {"id":"241", "gender": "female", "type": "fancy", "name":"Augusta Crumpacker"},
                    {"id":"242", "gender": "female", "type": "fancy", "name":"Catherine Oppenheimer"},
                    {"id":"243", "gender": "female", "type": "fancy", "name":"Clementine Beauregard"},
                    {"id":"244", "gender": "female", "type": "fancy", "name":"Emelia Sinclair"},
                    {"id":"245", "gender": "female", "type": "fancy", "name":"Florence Kennedy"},
                    {"id":"246", "gender": "female", "type": "fancy", "name":"Georgia Shinburn"},
                    {"id":"247", "gender": "female", "type": "fancy", "name":"Harriet Stanton"},
                    {"id":"248", "gender": "female", "type": "fancy", "name":"Jocelyn Duvall"},
                    {"id":"249", "gender": "female", "type": "fancy", "name":"Lilian Pinkerton"},
                    {"id":"250", "gender": "female", "type": "fancy", "name":"Olivia Watson"},
                    {"id":"251", "gender": "female", "type": "fancy", "name":"Philadelphia Winthrop"},
                    {"id":"252", "gender": "female", "type": "fancy", "name":"Prudence Newcomb"},
                    {"id":"253", "gender": "female", "type": "fancy", "name":"Samantha Bishop"},
                    {"id":"254", "gender": "female", "type": "fancy", "name":"Sophia Abercrombie"},
                    {"id":"255", "gender": "female", "type": "fancy", "name":"Therese Beloit"},
                    {"id":"256", "gender": "female", "type": "fancy", "name":"Victoria Penrose"},
                    {"id":"257", "gender": "female", "type": "fancy", "name":"Virginia Frazier"},
                    {"id":"258", "gender": "female", "type": "fancy", "name":"Wilhelmina Comstock" },
                    {"id":"259", "gender": "female", "type": "apache", "name":"Alopay"},
                    {"id":"260", "gender": "female", "type": "apache", "name":"Cocheta"},
                    {"id":"261", "gender": "female", "type": "apache", "name":"Cumpah"},
                    {"id":"262", "gender": "female", "type": "apache", "name":"Dahteste"},
                    {"id":"263", "gender": "female", "type": "apache", "name":"Ela (Earth)"},
                    {"id":"264", "gender": "female", "type": "apache", "name":"Ekta (Unity)"},
                    {"id":"265", "gender": "female", "type": "apache", "name":"Gouyen (Wise Woman)"},
                    {"id":"266", "gender": "female", "type": "apache", "name":"Ha-o-zinne"},
                    {"id":"267", "gender": "female", "type": "apache", "name":"Ih-Tedda (Young Girl)"},
                    {"id":"268", "gender": "female", "type": "apache", "name":"Kushala (Safe)"},
                    {"id":"269", "gender": "female", "type": "apache", "name":"Jacali"},
                    {"id":"270", "gender": "female", "type": "apache", "name":"Leosanni"},
                    {"id":"271", "gender": "female", "type": "apache", "name":"Liluye (Hawk Singing)"},
                    {"id":"272", "gender": "female", "type": "apache", "name":"Maa-ya-ha"},
                    {"id":"273", "gender": "female", "type": "apache", "name":"Nalin"},
                    {"id":"274", "gender": "female", "type": "apache", "name":"Nascha (Owl)"},
                    {"id":"275", "gender": "female", "type": "apache", "name":"Onawa (Wide Awake) Sonsee-array (Morning Star)"},
                    {"id":"276", "gender": "female", "type": "apache", "name":"Zi-yeh" },
                    {"id":"277", "gender": "female", "type": "cherokee", "name":"Adisla (Blossom)"},
                    {"id":"278", "gender": "female", "type": "cherokee", "name":"Ahyoka (She Brought Happiness)"},
                    {"id":"279", "gender": "female", "type": "cherokee", "name":"Amadahy (Forest Water)"},
                    {"id":"280", "gender": "female", "type": "cherokee", "name":"Awinita (Fawn)"},
                    {"id":"281", "gender": "female", "type": "cherokee", "name":"Ayita (First to Dance)"},
                    {"id":"282", "gender": "female", "type": "cherokee", "name":"Galilahi (Attractive)"},
                    {"id":"283", "gender": "female", "type": "cherokee", "name":"Galilani (Friend)"},
                    {"id":"284", "gender": "female", "type": "cherokee", "name":"Ghigau (Beloved Woman)"},
                    {"id":"285", "gender": "female", "type": "cherokee", "name":"Hialeah (Beautiful Meadow)"},
                    {"id":"286", "gender": "female", "type": "cherokee", "name":"Immookalee (Waterfall)"},
                    {"id":"287", "gender": "female", "type": "cherokee", "name":"Inola (Black Fox)"},
                    {"id":"288", "gender": "female", "type": "cherokee", "name":"Knasgowa (Heron)"},
                    {"id":"289", "gender": "female", "type": "cherokee", "name":"Leotie (Prairie Flower)"},
                    {"id":"290", "gender": "female", "type": "cherokee", "name":"Nanye-hi (Goes About)"},
                    {"id":"291", "gender": "female", "type": "cherokee", "name":"Sequoia (Redwood) Tayanita (Beaver)"},
                    {"id":"292", "gender": "female", "type": "cherokee", "name":"Tsistunagiska (Wild Rose)"},
                    {"id":"293", "gender": "female", "type": "cherokee", "name":"Tsula (Fox)"},
                    {"id":"294", "gender": "female", "type": "cherokee", "name":"Usdi (Baby)"},
                    {"id":"295", "gender": "female", "type": "cherokee", "name":"Yona (Bear)"     },
                    {"id":"296", "gender": "female", "type": "cheyenne", "name":"Ahmahi (Talking Woman)"},
                    {"id":"297", "gender": "female", "type": "cheyenne", "name":"Ahnostssee (Shave Head)"},
                    {"id":"298", "gender": "female", "type": "cheyenne", "name":"Homaera (Squirrel Woman)"},
                    {"id":"299", "gender": "female", "type": "cheyenne", "name":"Hoomose (Little Traveler)"},
                    {"id":"300", "gender": "female", "type": "cheyenne", "name":"Maachi (Red Belly Woman)"},
                    {"id":"301", "gender": "female", "type": "cheyenne", "name":"Mainno (Turtle)"},
                    {"id":"302", "gender": "female", "type": "cheyenne", "name":"Missoih (Dove)"},
                    {"id":"303", "gender": "female", "type": "cheyenne", "name":"Mistounsta (Owl Woman)"},
                    {"id":"304", "gender": "female", "type": "cheyenne", "name":"Mitomoni (Red Painting)"},
                    {"id":"305", "gender": "female", "type": "cheyenne", "name":"Mokitosea (Black Hair)"},
                    {"id":"306", "gender": "female", "type": "cheyenne", "name":"Muskovah (Wild Cat Woman)"},
                    {"id":"307", "gender": "female", "type": "cheyenne", "name":"Nakkuh (Bear Woman)"},
                    {"id":"308", "gender": "female", "type": "cheyenne", "name":"Naku (Cougar)"},
                    {"id":"309", "gender": "female", "type": "cheyenne", "name":"Oconnenic (Bad Teeth)"},
                    {"id":"310", "gender": "female", "type": "cheyenne", "name":"Onehiyou (Sage Woman)"},
                    {"id":"311", "gender": "female", "type": "cheyenne", "name":"Owehi (Medicine Woman)"},
                    {"id":"312", "gender": "female", "type": "cheyenne", "name":"Stewistanna (Black Foot)"},
                    {"id":"313", "gender": "female", "type": "cheyenne", "name":"Wahahnisto (Howling in Cloud)"},
                    {"id":"314", "gender": "female", "type": "cheyenne", "name":"Wahkehi (Crooked Woman)"},
                    {"id":"315", "gender": "female", "type": "cheyenne", "name":"Washa (Good Woman)" },
                    {"id":"316", "gender": "female", "type": "lakota", "name":"Chapa (Beaver)"},
                    {"id":"317", "gender": "female", "type": "lakota", "name":"Chapawee (Industrious)"},
                    {"id":"318", "gender": "female", "type": "lakota", "name":"Chumani (Dewdrops)"},
                    {"id":"319", "gender": "female", "type": "lakota", "name":"Dowanhowee (Singing Voice)"},
                    {"id":"320", "gender": "female", "type": "lakota", "name":"Ehawee (Laughing Maid)"},
                    {"id":"321", "gender": "female", "type": "lakota", "name":"Hantaywee (Faithful)"},
                    {"id":"322", "gender": "female", "type": "lakota", "name":"Kimimela (Butterfly)"},
                    {"id":"323", "gender": "female", "type": "lakota", "name":"Macha (Aurora)"},
                    {"id":"324", "gender": "female", "type": "lakota", "name":"Magaskawee (Graceful)"},
                    {"id":"325", "gender": "female", "type": "lakota", "name":"Makawee (Earth Maiden)"},
                    {"id":"326", "gender": "female", "type": "lakota", "name":"Ojinjintka (Rose)"},
                    {"id":"327", "gender": "female", "type": "lakota", "name":"Shappa (Red Thunder)"},
                    {"id":"328", "gender": "female", "type": "lakota", "name":"Tahcawin (Doe)"},
                    {"id":"329", "gender": "female", "type": "lakota", "name":"Talutah (Scarlet)"},
                    {"id":"330", "gender": "female", "type": "lakota", "name":"Wachiwi (Dancing Girl)"},
                    {"id":"331", "gender": "female", "type": "lakota", "name":"Wasula (Hair Storm)"},
                    {"id":"332", "gender": "female", "type": "lakota", "name":"Weayaya (Sunset)"},
                    {"id":"333", "gender": "female", "type": "lakota", "name":"Wichahpi (Star)"},
                    {"id":"334", "gender": "female", "type": "lakota", "name":"Zitkala (Bird)"},
                    {"id":"335", "gender": "female", "type": "lakota", "name":"Zonta (Trustworthy)" },
                    {"id":"336", "gender": "female", "type": "navajo", "name":"Ajei (My Heart)"},
                    {"id":"337", "gender": "female", "type": "navajo", "name":"Awee (Baby)"},
                    {"id":"338", "gender": "female", "type": "navajo", "name":"Chooli (Mountain)"},
                    {"id":"339", "gender": "female", "type": "navajo", "name":"Dezba (War)"},
                    {"id":"340", "gender": "female", "type": "navajo", "name":"Dibe (Lamb)"},
                    {"id":"341", "gender": "female", "type": "navajo", "name":"Doba (Peace)"},
                    {"id":"342", "gender": "female", "type": "navajo", "name":"Doli (Blue Bird)"},
                    {"id":"343", "gender": "female", "type": "navajo", "name":"Haloke (Salmon)"},
                    {"id":"344", "gender": "female", "type": "navajo", "name":"Haseya (She Rises)"},
                    {"id":"345", "gender": "female", "type": "navajo", "name":"Kai (Willow Tree)"},
                    {"id":"346", "gender": "female", "type": "navajo", "name":"Johona (Sunny)"},
                    {"id":"347", "gender": "female", "type": "navajo", "name":"Lina (Life)"},
                    {"id":"348", "gender": "female", "type": "navajo", "name":"Manaba (Return to War)"},
                    {"id":"349", "gender": "female", "type": "navajo", "name":"Mosi (Cat)"},
                    {"id":"350", "gender": "female", "type": "navajo", "name":"Nascha (Owl)"},
                    {"id":"351", "gender": "female", "type": "navajo", "name":"Ooljee (Moon)"},
                    {"id":"352", "gender": "female", "type": "navajo", "name":"Sahkyo (Mink)"},
                    {"id":"353", "gender": "female", "type": "navajo", "name":"Sialea-lea (Little Bluebird)"},
                    {"id":"354", "gender": "female", "type": "navajo", "name":"Tsintah (Among the Forest)"},
                    {"id":"355", "gender": "female", "type": "navajo", "name":"Yanaha (Brave)" },
                    {"id":"356", "gender": "female", "type": "spanish", "name":"Alicia Montoya"},
                    {"id":"357", "gender": "female", "type": "spanish", "name":"Ana Morales"},
                    {"id":"358", "gender": "female", "type": "spanish", "name":"Bianca Rodriguez"},
                    {"id":"359", "gender": "female", "type": "spanish", "name":"Beatriz Maldonado"},
                    {"id":"360", "gender": "female", "type": "spanish", "name":"Carmen Delgado"},
                    {"id":"361", "gender": "female", "type": "spanish", "name":"Elena Zamora"},
                    {"id":"362", "gender": "female", "type": "spanish", "name":"Esperanza Santos"},
                    {"id":"363", "gender": "female", "type": "spanish", "name":"Gloria Padilla"},
                    {"id":"364", "gender": "female", "type": "spanish", "name":"Graciela Cruz"},
                    {"id":"365", "gender": "female", "type": "spanish", "name":"Isabel Pena"},
                    {"id":"366", "gender": "female", "type": "spanish", "name":"Juana Rojas"},
                    {"id":"367", "gender": "female", "type": "spanish", "name":"Lucinda Ramirez"},
                    {"id":"368", "gender": "female", "type": "spanish", "name":"Margarita Navarro"},
                    {"id":"369", "gender": "female", "type": "spanish", "name":"Maria Vasquez"},
                    {"id":"370", "gender": "female", "type": "spanish", "name":"Marta Sandoval"},
                    {"id":"371", "gender": "female", "type": "spanish", "name":"Milagros Carillo"},
                    {"id":"372", "gender": "female", "type": "spanish", "name":"Rosa Delacruz"},
                    {"id":"373", "gender": "female", "type": "spanish", "name":"Sofia Ortega"},
                    {"id":"374", "gender": "female", "type": "spanish", "name":"Tatiana Lopez"},
                    {"id":"375", "gender": "female", "type": "spanish", "name":"Yolanda Romero" },
                    {"id":"376", "gender": "female", "type": "asian", "name":"Cao Ling"},
                    {"id":"377", "gender": "female", "type": "asian", "name":"Chen Jun"},
                    {"id":"378", "gender": "female", "type": "asian", "name":"Ding Jie"},
                    {"id":"379", "gender": "female", "type": "asian", "name":"Feng Ai"},
                    {"id":"380", "gender": "female", "type": "asian", "name":"Guo Rong"},
                    {"id":"381", "gender": "female", "type": "asian", "name":"Hu Shun"},
                    {"id":"382", "gender": "female", "type": "asian", "name":"Huang Lei"},
                    {"id":"383", "gender": "female", "type": "asian", "name":"Liang Shu"},
                    {"id":"384", "gender": "female", "type": "asian", "name":"Lin Xiu"},
                    {"id":"385", "gender": "female", "type": "asian", "name":"Liu Ning"},
                    {"id":"386", "gender": "female", "type": "asian", "name":"Mao Ya"},
                    {"id":"387", "gender": "female", "type": "asian", "name":"Peng Ju"},
                    {"id":"388", "gender": "female", "type": "asian", "name":"Shen Fa"},
                    {"id":"389", "gender": "female", "type": "asian", "name":"Wang Mei"},
                    {"id":"390", "gender": "female", "type": "asian", "name":"Wu Zhen"},
                    {"id":"391", "gender": "female", "type": "asian", "name":"Yan Lin"},
                    {"id":"392", "gender": "female", "type": "asian", "name":"Yu Ming"},
                    {"id":"393", "gender": "female", "type": "asian", "name":"Yuan Nuo"},
                    {"id":"394", "gender": "female", "type": "asian", "name":"Zheng Hua"},
                    {"id":"395", "gender": "female", "type": "asian", "name":"Zhu Ting"},
                    {"id":"396", "gender": "horse", "type": "horse", "name":"Apple"},
                    {"id":"397", "gender": "horse", "type": "horse", "name":"Blackjack"},
                    {"id":"398", "gender": "horse", "type": "horse", "name":"Blaze"},
                    {"id":"399", "gender": "horse", "type": "horse", "name":"Buttermilk"},
                    {"id":"400", "gender": "horse", "type": "horse", "name":"Captain"},
                    {"id":"401", "gender": "horse", "type": "horse", "name":"Champ"},
                    {"id":"402", "gender": "horse", "type": "horse", "name":"Comet"},
                    {"id":"403", "gender": "horse", "type": "horse", "name":"Dewdrop"},
                    {"id":"404", "gender": "horse", "type": "horse", "name":"Diamond"},
                    {"id":"405", "gender": "horse", "type": "horse", "name":"Gamble"},
                    {"id":"406", "gender": "horse", "type": "horse", "name":"Ghost"},
                    {"id":"407", "gender": "horse", "type": "horse", "name":"Glory"},
                    {"id":"408", "gender": "horse", "type": "horse", "name":"Hunter"},
                    {"id":"409", "gender": "horse", "type": "horse", "name":"Jewel"},
                    {"id":"410", "gender": "horse", "type": "horse", "name":"Legend"},
                    {"id":"411", "gender": "horse", "type": "horse", "name":"Lucky"},
                    {"id":"412", "gender": "horse", "type": "horse", "name":"Midnight"},
                    {"id":"413", "gender": "horse", "type": "horse", "name":"Patch"},
                    {"id":"414", "gender": "horse", "type": "horse", "name":"Quicksilver"},
                    {"id":"415", "gender": "horse", "type": "horse", "name":"Rebel"},
                    {"id":"416", "gender": "horse", "type": "horse", "name":"Reckoner"},
                    {"id":"417", "gender": "horse", "type": "horse", "name":"Rider"},
                    {"id":"418", "gender": "horse", "type": "horse", "name":"Scout"},
                    {"id":"419", "gender": "horse", "type": "horse", "name":"Shadow"},
                    {"id":"420", "gender": "horse", "type": "horse", "name":"Smoky"},
                    {"id":"421", "gender": "horse", "type": "horse", "name":"Snow"},
                    {"id":"422", "gender": "horse", "type": "horse", "name":"Storm"},
                    {"id":"423", "gender": "horse", "type": "horse", "name":"Thunder"},
                    {"id":"424", "gender": "horse", "type": "horse", "name":"Velvet"},
                    {"id":"425", "gender": "horse", "type": "horse", "name":"Whirlwind"}
                ]
                vm.gear = [
                    {
                        "category": "Common Guns",
                        "description": "Usually cost 1 dinero",
                        "list": [
                            "Derringer (2 harm close reload loud)",
                            "Revolver (2 harm close reload loud)",
                            "Rifle (2 harm close/far loud)",
                            "Magnum Pistol (3 harm close reload loud)",
                            "Shotgun (3 harm close reload messy loud)"
                        ]
                    },
                    {
                        "category": "Unusual Guns",
                        "description": "Usually cost 1 or 2 dinero",
                        "list": [
                            "Buffalo Gun (3 harm close/far reload loud)",
                            "Le Mat Revolver (2 harm close reload loud, with one-shot shotgun: 3 harm close refill)",
                            "Musket (3 harm close/far reload loud)",
                            "Gatling Gun (3 harm close/far area messy loud)"
                        ]
                    },
                    {
                        "category": "Melee Weapons",
                        "description": "Usually costs 1 dineo",
                        "list": [
                            "Bayonet (2 harm hand)",
                            "Big Knife (2 harm hand)",
                            "Many, Many Knives ( 2 harm hand infinite)",
                            "Saber (3 harm hand)",
                            "Sword Cane (3 harm hand valuable)",
                            "Tomahawk (2 harm hand)"
                        ]
                    },
                    {
                        "category": "Other",
                        "description": "Costs... best guess",
                        "list": [                    
                            "Bow and Arrows (2 harm, close/far)",
                            "Medket (3 uses, heal 1 harm per use) Cost: 1 dinero"
                        ]
                    }
                ]
            }
        
        }
})();