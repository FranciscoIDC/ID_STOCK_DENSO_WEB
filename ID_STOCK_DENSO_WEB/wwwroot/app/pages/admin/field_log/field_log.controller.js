(function () {
    angular
        .module('app')
        .controller('FieldLogController', FieldLogController);

    FieldLogController.$inject = ['$scope', '$state', 'FieldLogService', 'AlertService'];

    function FieldLogController(self, $state, FieldLogService, AlertService) {



    }
})();
