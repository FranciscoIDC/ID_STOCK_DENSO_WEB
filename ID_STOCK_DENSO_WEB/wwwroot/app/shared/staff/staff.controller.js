(function () {
    angular
        .module('app')
        .controller('StaffController', StaffController);

    StaffController.$inject = ['$scope', '$state', 'StaffService', 'AlertService'];

    function StaffController(self, $state, StaffService, AlertService) {



    }
})();
