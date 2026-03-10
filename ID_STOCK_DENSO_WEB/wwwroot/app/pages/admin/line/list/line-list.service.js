(function () {
    'use strict';

    angular
        .module('app')
        .factory('LineListService', LineListService);

    LineListService.$inject = ['$http', 'UrlService'];

    function LineListService($http, UrlService) {
        let service = {
            Get: _Get,
            Delete: _Delete
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getLine,
                params: params,
                async: true
            }
            return $http(request)

        }

        function _Delete(id) {
            let url = UrlService.deleteLine.replace("{id}", id)
            let request = {
                method: 'DELETE',
                url: url,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();