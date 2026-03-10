(function () {
    angular
        .module('app')
        .controller('IncidentController', IncidentController);

    IncidentController.$inject = ['$scope', '$state', 'IncidentService', 'AlertService'];

    function IncidentController(self, $state, IncidentService, AlertService) {

    }
})();
