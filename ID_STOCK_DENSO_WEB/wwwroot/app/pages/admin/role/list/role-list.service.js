(function () {
    'use strict';

    angular
        .module('app')
        .factory('RoleListService', RoleListService);

    RoleListService.$inject = ['$http', 'UrlService'];

    function RoleListService($http, UrlService) {
        let service = {
            Get: _Get,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getRole,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: params,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();