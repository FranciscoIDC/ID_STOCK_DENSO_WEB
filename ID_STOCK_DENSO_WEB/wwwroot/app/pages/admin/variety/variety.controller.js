(function () {
    angular
        .module('app')
        .controller('VarietyController', VarietyController);

    VarietyController.$inject = ['$scope', '$state', 'VarietyService', 'AlertService'];

    function VarietyController(self, $state, VarietyService, AlertService) {



    }
})();
