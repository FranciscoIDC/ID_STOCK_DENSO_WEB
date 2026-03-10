(function () {
    'use strict';

    angular
        .module('app')
        .factory('IncidentReportService', IncidentReportService);

    IncidentReportService.$inject = ['$http', 'UrlService'];

    function IncidentReportService($http, UrlService) {
        let service = {
            Get: _Get,
        };

        function _Get(dto) {
            let request = {
                method: 'GET',
                url: UrlService.getIncidentReport,
                params: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();