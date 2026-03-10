(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProductEditService', ProductEditService);

    ProductEditService.$inject = ['$http', 'UrlService'];

    function ProductEditService($http, UrlService) {
        let service = {
            Get: _Get
        };

        function _Get(id) {
            let url = UrlService.getProductById.replace("{id}", id)
            let request = {
                method: 'GET',
                url: url,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                async: true
            }
            return $http(request)
        }
        return service;
    }
})();