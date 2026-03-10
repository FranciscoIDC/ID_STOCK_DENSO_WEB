(function () {
    angular
        .module('app')
        .controller('TruckController', TruckController);

    TruckController.$inject = ['$scope', '$state', 'TruckService', 'AlertService'];

    function TruckController(self, $state, TruckService, AlertService) {



    }
})();
