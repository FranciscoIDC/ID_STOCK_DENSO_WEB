(function () {
    angular
        .module('app')
        .controller('InboundController', InboundController);

    InboundController.$inject = ['$scope', '$state', 'InboundService', 'AlertService'];

    function InboundController(self, $state, InboundService, AlertService) {

    }
})();
