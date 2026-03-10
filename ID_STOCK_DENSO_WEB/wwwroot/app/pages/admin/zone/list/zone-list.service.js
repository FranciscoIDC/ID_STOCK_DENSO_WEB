(function () {
    'use strict';

    angular
        .module('app')
        .factory('ZoneListService', ZoneListService);

    ZoneListService.$inject = ['$http', 'UrlService'];

    function ZoneListService($http, UrlService) {
        let service = {
            Get: _Get,
            Delete: _Delete
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getZone,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Delete(id) {
            let url = UrlService.deleteZone.replace("{id}", id)
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