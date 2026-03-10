(function () {
    angular
        .module('app')
        .controller('ProductController', ProductController);

    ProductController.$inject = ['$scope', '$state', 'ProductService', 'AlertService'];

    function ProductController(self, $state, ProductService, AlertService) {


    }
})();
