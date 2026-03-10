(function () {
    angular
        .module('app')
        .controller('StockController', StockController);

    StockController.$inject = ['$scope', '$state', 'StockService', 'AlertService'];

    function StockController(self, $state, StockService, AlertService) {


    }
})();
