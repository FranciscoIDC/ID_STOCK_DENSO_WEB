(function () {
    'use strict';

    angular
        .module('app')
        .factory('InboundListService', InboundListService);

    InboundListService.$inject = ['$http', 'UrlService'];

    function InboundListService($http, UrlService) {
        let service = {
            Get: _Get,
        };

        function _Get(dto) {
            let request = {
                method: 'GET',
                url: UrlService.getInbound,
                headers: {
                    'Authorization': 'Bearer ' + UrlService.token,
                },
                params: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();