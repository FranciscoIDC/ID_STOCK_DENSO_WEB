(function () {
    angular
        .module('app')
        .controller('RampController', RampController);

    RampController.$inject = ['$scope', '$state', 'RampService', 'AlertService'];

    function RampController(self, $state, RampService, AlertService) {



    }
})();
