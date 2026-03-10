(function () {
    angular
        .module('app')
        .controller('PurchaseOrderController', PurchaseOrderController);

    PurchaseOrderController.$inject = ['$scope', '$state', 'PurchaseOrderService', 'AlertService'];

    function PurchaseOrderController(self, $state, PurchaseOrderService, AlertService) {



    }
})();
