(function () {
    angular
        .module('app')
        .controller('RequisitionOrderController', RequisitionOrderController);

    RequisitionOrderController.$inject = ['$scope', '$state', 'RequisitionOrderService', 'AlertService'];

    function RequisitionOrderController(self, $state, RequisitionOrderService, AlertService) {



    }
})();
