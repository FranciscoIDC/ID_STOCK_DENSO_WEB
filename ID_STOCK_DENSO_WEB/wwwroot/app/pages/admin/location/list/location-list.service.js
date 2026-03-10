(function () {
    'use strict';

    angular
        .module('app')
        .factory('LocationListService', LocationListService);

    LocationListService.$inject = ['$http', 'UrlService'];

    function LocationListService($http, UrlService) {

        var service = {
            Get: _Get,
            Sync: _Sync,
        };

        // Consulta local paginada — uso normal (GET /api/Location)
        function _Get(params) {
            return $http({
                method: 'GET',
                url: UrlService.getLocation,        // baseUrl + 'api/Location'
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: params,
                async: true
            });
        }

        // Sync completo desde WMS — solo botón admin (GET /api/Location/Sync)
        function _Sync(params) {
            return $http({
                method: 'GET',
                url: UrlService.getLocationSync,    // baseUrl + 'api/Location/Sync'
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: params,
                async: true
            });
        }

        return service;
    }
})();