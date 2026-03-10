(function () {
    angular
        .module('app')
        .controller('RejectionController', RejectionController);

    RejectionController.$inject = ['$scope', '$state', 'RejectionService', 'AlertService'];

    function RejectionController(self, $state, RejectionService, AlertService) {



    }
})();
