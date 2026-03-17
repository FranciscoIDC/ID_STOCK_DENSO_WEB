// ── InventoryListService.js ──────────────────────────────────────────────────
(function () {
    'use strict';
    angular
        .module('app')
        .factory('InventoryListService', InventoryListService);

    InventoryListService.$inject = ['$http', 'UrlService'];

    function InventoryListService($http, UrlService) {
        return {
            Get: _Get,
        };

        function _Get(dto) {
            return $http({
                method: 'GET',
                url: UrlService.getInventoryList,   // apunta a /api/Inventory/List
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: dto,
                async: true
            });
        }
    }
})();