(function () {
    angular
        .module('app')
        .controller('NumpartCategoryController', NumpartCategoryController);

    NumpartCategoryController.$inject = ['$scope', '$state', 'NumpartCategoryService', 'AlertService'];

    function NumpartCategoryController(self, $state, NumpartCategoryService, AlertService) {


    }
})();
