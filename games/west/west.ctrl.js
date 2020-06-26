(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('WestController', WestController);

        WestController.$inject = [];
        function WestController(){
            let vm = this;           
        
            vm.tabs = {
                charactersheet: { index: 0, heading: 'Character Sheet'},
                reference: { index: 1, heading: 'Reference'},                
                mc: { index: 2, heading: 'Marshall'}
            };            
        }
})();