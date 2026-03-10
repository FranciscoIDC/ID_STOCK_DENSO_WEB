(function () {
    angular
        .module('app')
        .controller('PackingController', PackingController);

    PackingController.$inject = ['$scope', '$state', 'PackingService', 'AlertService'];

    function PackingController(self, $state, PackingService, AlertService) {



    }
})();
