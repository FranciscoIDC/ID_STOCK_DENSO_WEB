(function () {
    angular
        .module('app')
        .controller('WarehouseController', WarehouseController);

    WarehouseController.$inject = ['$scope', '$state', 'WarehouseService', 'AlertService'];

    function WarehouseController(self, $state, WarehouseService, AlertService) {


    }
})();
