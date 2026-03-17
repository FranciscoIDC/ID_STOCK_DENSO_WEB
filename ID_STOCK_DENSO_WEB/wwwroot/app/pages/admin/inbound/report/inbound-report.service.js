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

        // Agregar en UrlService: getInboundReport: baseUrl + 'api/InboundReport'
        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getInboundReport,
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