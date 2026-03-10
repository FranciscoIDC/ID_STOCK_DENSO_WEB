(function () {
    angular
        .module('app')
        .controller('DriverController', DriverController);

    DriverController.$inject = ['$scope', '$state', 'DriverService', 'AlertService'];

    function DriverController(self, $state, DriverService, AlertService) {



    }
})();
