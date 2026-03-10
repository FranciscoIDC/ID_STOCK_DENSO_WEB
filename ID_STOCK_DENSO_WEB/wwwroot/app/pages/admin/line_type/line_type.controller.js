(function () {
    angular
        .module('app')
        .controller('LineTypeController', LineTypeController);

    LineTypeController.$inject = ['$scope', '$state', 'LineTypeService', 'AlertService'];

    function LineTypeController(self, $state, LineTypeService, AlertService) {


    }
})();
