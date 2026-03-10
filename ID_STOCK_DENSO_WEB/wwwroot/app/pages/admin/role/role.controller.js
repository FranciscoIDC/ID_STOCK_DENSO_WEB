(function () {
    angular
        .module('app')
        .controller('RoleController', RoleController);

    RoleController.$inject = ['$scope', '$state', 'RoleService', 'AlertService'];

    function RoleController(self, $state, RoleService, AlertService) {



    }
})();
