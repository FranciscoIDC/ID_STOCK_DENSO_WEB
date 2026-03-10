(function () {
    angular
        .module('app')
        .controller('InventoryController', InventoryController);

    InventoryController.$inject = ['$scope', '$state', 'InventoryService', 'AlertService'];

    function InventoryController(self, $state, InventoryService, AlertService) {

    }
})();
