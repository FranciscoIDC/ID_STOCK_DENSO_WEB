(function () {
    angular
        .module('app')
        .controller('SizeController', SizeController);

    SizeController.$inject = ['$scope', '$state', 'SizeService', 'AlertService'];

    function SizeController(self, $state, SizeService, AlertService) {



    }
})();
