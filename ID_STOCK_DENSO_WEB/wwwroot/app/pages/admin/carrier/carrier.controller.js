(function () {
    angular
        .module('app')
        .controller('CarrierController', CarrierController);

    CarrierController.$inject = ['$scope', '$state', 'CarrierService', 'AlertService'];

    function CarrierController(self, $state, CarrierService, AlertService) {



    }
})();
