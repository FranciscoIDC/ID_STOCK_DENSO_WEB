(function () {
    'use strict';

    angular
        .module('app')
        .factory('ResponsibleService', ResponsibleService);

    ResponsibleService.$inject = ['$http', 'UrlService'];

    function ResponsibleService($http, UrlService) {
        let service = {
            Get: _Get
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getResponsibleByDepartment,
                params: params,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();