(function () {
    angular
        .module('app')
        .controller('OutboundController', OutboundController);

    OutboundController.$inject = ['$scope', '$state', 'OutboundService', 'AlertService'];

    function OutboundController(self, $state, OutboundService, AlertService) {

    }
})();
