(function () {
    'use strict';

    angular
        .module('app')
        .factory('LineTypeListService', LineTypeListService);

    LineTypeListService.$inject = ['$http', 'UrlService'];

    function LineTypeListService($http, UrlService) {
        let service = {
            Get: _Get,
            Delete:_Delete
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getLineType,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Delete(id) {
            let url = UrlService.deleteLineType.replace("{id}", id)
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