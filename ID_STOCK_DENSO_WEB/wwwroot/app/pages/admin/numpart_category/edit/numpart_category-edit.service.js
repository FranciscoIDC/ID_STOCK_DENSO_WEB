(function () {
    'use strict';

    angular
        .module('app')
        .factory('NumpartCategoryEditService', NumpartCategoryEditService);

   NumpartCategoryEditService.$inject = ['$http', 'UrlService'];

    function NumpartCategoryEditService($http, UrlService) {
        let service = {
            Get: _Get,
            Update: _Update
        };

        function _Get(id) {
            let url = UrlService.getNumpartCategoryById.replace("{id}", id)
            let request = {
                method: 'GET',
                url: url,
                async: true
            }
            return $http(request)
        }

        function _Update(dto) {
            let request = {
                method: 'PUT',
                url: UrlService.putNumpartCategory,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();