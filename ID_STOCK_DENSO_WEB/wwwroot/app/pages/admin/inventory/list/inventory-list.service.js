(function () {
    'use strict';

    angular
        .module('app')
        .factory('InventoryListService', InventoryListService);

    InventoryListService.$inject = ['$http', 'UrlService'];

    function InventoryListService($http, UrlService) {
        let service = {
            Get: _Get,
            Getimages: _Getimages,
        };

        function _Get(dto) {
            let request = {
                method: 'GET',
                url: UrlService.getInventory,
                headers: {
                    'Authorization': 'Bearer ' + UrlService.token,
                },
                params: dto,
                async: true
            }
            return $http(request)
        }

        function _Getimages(id) {
            let request = {
                method: 'GET',
                url: UrlService.getImagesInventory.replace("{id}", id),
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();