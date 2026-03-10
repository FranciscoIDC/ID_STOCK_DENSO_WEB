(function () {
    'use strict';

    angular
        .module('app')
        .factory('NumpartCategoryListService', NumpartCategoryListService);

    NumpartCategoryListService.$inject = ['$http', 'UrlService'];

    function NumpartCategoryListService($http, UrlService) {
        let service = {
            Get: _Get,
            Delete:_Delete
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getNumpartCategory,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Delete(id) {
            let url = UrlService.deleteNumpartCategory.replace("{id}", id)
            let request = {
                method: 'DELETE',
                url: url,
                async: true
            }
            return $http(request)
        }


        return service;
    }
})();