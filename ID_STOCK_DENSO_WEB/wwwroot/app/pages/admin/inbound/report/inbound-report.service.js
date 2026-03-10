(function () {
    'use strict';

    angular
        .module('app')
        .factory('InboundReportService', InboundReportService);

    InboundReportService.$inject = ['$http', 'UrlService'];

    function InboundReportService($http, UrlService) {
        let service = {
            Get: _Get,
        };

        function _Get(dto) {
            let request = {
                method: 'GET',
                url: UrlService.getInboundReport,
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