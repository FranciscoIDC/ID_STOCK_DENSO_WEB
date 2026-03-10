(function () {
    angular
        .module('app')
        .controller('BoxController', BoxController);

    BoxController.$inject = ['$scope', '$state', 'BoxService', 'AlertService'];

    function BoxController(self, $state, BoxService, AlertService) {



    }
})();
