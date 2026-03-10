(function () {
    'use strict';

    angular
        .module('app')
        .factory('WarehouseEditService', WarehouseEditService);

    WarehouseEditService.$inject = ['$http', 'UrlService'];

    function WarehouseEditService($http, UrlService) {
        let service = {
            Get: _Get,
            Update: _Update
        };

        function _Get(id) {
            let url = UrlService.getWarehouseById.replace("{id}", id)
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
                url: UrlService.putWarehouse,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();