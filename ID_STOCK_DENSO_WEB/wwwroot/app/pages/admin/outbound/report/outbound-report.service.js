(function () {
    'use strict';

    angular
        .module('app')
        .factory('OutboundReportService', OutboundReportService);

    OutboundReportService.$inject = ['$http', 'UrlService'];

    function OutboundReportService($http, UrlService) {
        let service = {
            Get: _Get,
        };

        function _Get(dto) {
            let request = {
                method: 'GET',
                url: UrlService.getOutboundReport,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();