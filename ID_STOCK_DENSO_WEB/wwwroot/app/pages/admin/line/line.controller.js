(function () {
    angular
        .module('app')
        .controller('LineController', LineController);

    LineController.$inject = ['$scope', '$state', 'LineService', 'AlertService'];

    function LineController(self, $state, LineService, AlertService) {


    }
})();
