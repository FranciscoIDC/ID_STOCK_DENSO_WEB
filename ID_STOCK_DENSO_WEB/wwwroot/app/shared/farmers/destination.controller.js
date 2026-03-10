(function () {
    angular
        .module('app')
        .controller('DestinationController', DestinationController);

    DestinationController.$inject = ['$scope', '$state', 'DestinationService', 'AlertService'];

    function DestinationController(self, $state, DestinationService, AlertService) {



    }
})();
