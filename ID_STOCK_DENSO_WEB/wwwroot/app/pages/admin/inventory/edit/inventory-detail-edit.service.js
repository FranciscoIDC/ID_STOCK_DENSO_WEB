(function () {
    'use strict';

    angular
        .module('app')
        .factory('InventoryDetailEditService', InventoryDetailEditService);

    InventoryDetailEditService.$inject = ['$http', 'UrlService'];

    function InventoryDetailEditService($http, UrlService) {
        let service = {
            Get: _Get,
            Update: _Update
        };

        function _Get(id) {
            let url = UrlService.getInventoryDetailById.replace("{id}", id)
            let request = {
                method: 'GET',
                url: url,
                async: true
            }
            return $http(request)
        }

        /**
         * Allows to update the comment only
         * @param {any} dto
         */
        function _Update(dto) {
            let request = {
                method: 'PUT',
                url: UrlService.putInventoryDetail,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();