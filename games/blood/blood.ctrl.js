(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('BloodController', BloodController);

        BloodController.$inject = [];
        function BloodController(){
            let vm = this;           
        
            vm.tabs = {
                charactersheet: { index: 0, heading: 'Character Sheet'},
                reference: { index: 1, heading: 'Reference'},             
                mc: { index: 2, heading: 'MC'}
            }; 
            
            vm.redirectToGfolder = function(){
                window.location.href = "https://drive.google.com/drive/u/0/folders/1MnvwEb_8sIEr3wqZw-29PcYIvMG0fsge";
            }
        }
})();