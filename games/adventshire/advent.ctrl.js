(function(){
    'use strict';

    angular
        .module('pbta_resources')
        .controller('AdventController', AdventController);

        AdventController.$inject = [];
        function AdventController(){
            let vm = this;           
        
            vm.tabs = {
                charactersheet: { index: 0, heading: 'Character Sheet'},
                reference: { index: 1, heading: 'Reference'}
                //mc: { index: 2, heading: 'MC'}
            }; 
            
            
        }
})();