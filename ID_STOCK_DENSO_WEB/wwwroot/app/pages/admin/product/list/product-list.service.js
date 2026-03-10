(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProductListService', ProductListService);

    ProductListService.$inject = ['$http', 'UrlService'];

    function ProductListService($http, UrlService) {

        let service = {
            Get: _Get,
            GetLast: _GetLast,
            LoadFull: _LoadFull,
        };

        // Consulta paginada normal (usa GetLast en backend)
        function _Get(params) {
            return $http({
                method: 'GET',
                url: UrlService.getProductLast, // baseUrl + 'api/Product/Last'
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: params,
                async: true
            });
        }

        // Carga masiva completa (~100k) — solo para admin
        function _LoadFull(params) {
            return $http({
                method: 'GET',
                url: UrlService.getProductFull, // baseUrl + 'api/Product'
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: params,
                async: true
            });
        }

        // Alias por si se necesita consulta explícita al Last
        function _GetLast(params) {
            return _Get(params);
        }

        return service;
    }
})();