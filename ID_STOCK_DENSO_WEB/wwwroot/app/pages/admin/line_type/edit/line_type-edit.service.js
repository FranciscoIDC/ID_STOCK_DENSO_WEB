(function () {
    'use strict';

    angular
        .module('app')
        .factory('LineTypeEditService', LineTypeEditService);

   LineTypeEditService.$inject = ['$http', 'UrlService'];

    function LineTypeEditService($http, UrlService) {
        let service = {
            Get: _Get,
            Update: _Update
        };

        function _Get(id) {
            let url = UrlService.getLineTypeById.replace("{id}", id)
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
                url: UrlService.putLineType,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();