(function () {
    angular
        .module('app')
        .controller('ColdBoxController', ColdBoxController);

    ColdBoxController.$inject = ['$scope', '$state', 'ColdBoxService', 'AlertService'];

    function ColdBoxController(self, $state, ColdBoxService, AlertService) {



    }
})();
