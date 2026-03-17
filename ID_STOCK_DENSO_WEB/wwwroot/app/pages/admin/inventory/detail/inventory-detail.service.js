// ── InventoryDetailService.js ────────────────────────────────────────────────
(function () {
    'use strict';
    angular
        .module('app')
        .factory('InventoryDetailService', InventoryDetailService);

    InventoryDetailService.$inject = ['$http', 'UrlService'];

    function InventoryDetailService($http, UrlService) {
        return {
            Get: _Get,
            GetTagsPart: _GetTagsPart,
        };

        // Detalle paginado por NoParte  →  GET /api/Inventory/DetailWeb
        function _Get(dto) {
            return $http({
                method: 'GET',
                url: UrlService.getInventoryDetailWeb,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: dto,
                async: true
            });
        }

        // Tags de un número de parte  →  GET /api/Inventory/TagsByPart
        function _GetTagsPart(idInventory, idProduct, localizacion) {
            return $http({
                method: 'GET',
                url: UrlService.getInventoryTagsByPart,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: { idInventory, idProduct, localizacion },
                async: true
            });
        }
    }
})();