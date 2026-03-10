(function () {
    angular
        .module('app')
        .controller('GateRegistrationController', GateRegistrationController);

    GateRegistrationController.$inject = ['$scope', '$state', 'GateRegistrationService', 'AlertService'];

    function GateRegistrationController(self, $state, GateRegistrationService, AlertService) {



    }
})();
