(function () {
    'use strict';

    /* Directives */
    angular
        .module('pbta_resources')
        .directive('contact', contact);

    function contact() {
        return {
            templateUrl: 'src/directives/mx-slot/mx-slot.html',
            replace: true,
            restrict: 'E',
            scope: {                
                contact: "="
            },
            controller: ContactController,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    ContactController.$inject = ['$scope', 'apiservice'];
    function ContactController($scope, apiservice) {
        var vm = this;

        // Properties       

        // Methods

        // Events

        // Watches
        $scope.$watch('',);

        // Initialization
        init();

        // Implementation
        function init() {
        
        }

        
    }

})();