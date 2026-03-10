(function () {
    'use strict';

    angular
        .module('app')
        .factory('DepartmentService', DepartmentService);

    DepartmentService.$inject = ['$http', 'UrlService'];

    function DepartmentService($http, UrlService) {
        let service = {
            GetByCompany: _GetByCompany
        };

        function _GetByCompany(params) {
            let request = {
                method: 'GET',
                url: UrlService.getDepartmentsByCompany,
                params: params,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();