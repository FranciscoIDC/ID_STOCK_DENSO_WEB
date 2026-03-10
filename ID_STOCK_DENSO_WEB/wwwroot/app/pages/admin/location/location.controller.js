(function () {
    angular
        .module('app')
        .controller('LocationController', LocationController);

    LocationController.$inject = ['$scope', '$state', 'LocationService', 'AlertService'];

    function LocationController(self, $state, LocationService, AlertService) {


    }
})();
