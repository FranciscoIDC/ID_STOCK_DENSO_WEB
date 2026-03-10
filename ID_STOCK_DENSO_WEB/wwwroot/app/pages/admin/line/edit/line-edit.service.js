(function () {
    'use strict';

    angular
        .module('app')
        .factory('LineEditService', LineEditService);

    LineEditService.$inject = ['$http', 'UrlService'];

    function LineEditService($http, UrlService) {
        let service = {
            Get: _Get,
            Update: _Update
        };

        function _Get(id) {
            let url = UrlService.getLineById.replace("{id}", id)
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
                url: UrlService.putLine,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();