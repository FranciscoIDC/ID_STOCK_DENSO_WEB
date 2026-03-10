(function () {
    'use strict';

    angular
        .module('app')
        .factory('StockReportService', StockReportService);

    StockReportService.$inject = ['$http', 'UrlService'];

    function StockReportService($http, UrlService) {
        let service = {
            Get: _Get,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getStock,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: params,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();