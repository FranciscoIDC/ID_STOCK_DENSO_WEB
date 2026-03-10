(function () {
    angular
        .module('app')
        .controller('ZoneController', ZoneController);

    ZoneController.$inject = ['$scope', '$state', 'ZoneService', 'AlertService'];

    function ZoneController(self, $state, ZoneService, AlertService) {


    }
})();
