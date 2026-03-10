(function () {
    angular
        .module('app')
        .controller('FarmerController', FarmerController);

    FarmerController.$inject = ['$scope', '$state', 'FarmerService', 'AlertService'];

    function FarmerController(self, $state, FarmerService, AlertService) {



    }
})();
