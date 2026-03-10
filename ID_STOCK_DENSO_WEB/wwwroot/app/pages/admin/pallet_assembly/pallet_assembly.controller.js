(function () {
    angular
        .module('app')
        .controller('PalletAssemblyController', PalletAssemblyController);

    PalletAssemblyController.$inject = ['$scope', '$state', 'PalletAssemblyService', 'AlertService'];

    function PalletAssemblyController(self, $state, PalletAssemblyService, AlertService) {

    }
})();
