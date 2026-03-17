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

        // Agregar en UrlService: getOutboundReport: baseUrl + 'api/InboundReport'
        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getOutboundReport,
                headers: {
                    'Authorization': 'Bearer ' + UrlService.token,
                },
                params: params,
                async: true
            };
            return $http(request);
        }

        return service;
    }
})();