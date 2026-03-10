(function () {
    'use strict';

    angular
        .module('app')
        .factory('WarehouseListService', WarehouseListService);

    WarehouseListService.$inject = ['$http', 'UrlService'];

    function WarehouseListService($http, UrlService) {
        let service = {
            Get: _Get,
            Delete:_Delete
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getWarehouse,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Delete(id) {
            let url = UrlService.deleteWarehouse.replace("{id}", id)
            let request = {
                method: 'DELETE',
                url: url,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();