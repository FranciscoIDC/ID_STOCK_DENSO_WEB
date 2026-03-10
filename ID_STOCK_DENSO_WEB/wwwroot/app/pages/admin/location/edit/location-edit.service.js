(function () {
    'use strict';

    angular
        .module('app')
        .factory('LocationEditService', LocationEditService);

    LocationEditService.$inject = ['$http', 'UrlService'];

    function LocationEditService($http, UrlService) {
        let service = {
            Get: _Get,
            Update: _Update
        };

        function _Get(id) {
            let url = UrlService.getLocationById.replace("{id}", id)
            let request = {
                method: 'GET',
                url: url,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                async: true
            }
            return $http(request)
        }

        function _Update(dto) {
            let request = {
                method: 'PUT',
                url: UrlService.putLocation,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();