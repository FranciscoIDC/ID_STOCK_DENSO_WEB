(function () {
    angular
        .module('app')
        .controller('ColdRoomController', ColdRoomController);

    ColdRoomController.$inject = ['$scope', '$state', 'ColdRoomService', 'AlertService'];

    function ColdRoomController(self, $state, ColdRoomService, AlertService) {
    }
})();
