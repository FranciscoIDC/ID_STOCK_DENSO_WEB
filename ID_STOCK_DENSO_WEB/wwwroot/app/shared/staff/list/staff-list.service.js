(function () {
    'use strict';

    angular
        .module('app')
        .factory('StaffListService', StaffListService);

    StaffListService.$inject = ['$http', 'UrlService'];

    function StaffListService($http, UrlService) {
        let service = {
            Get: _Get,
            GetAll: _GetAll,
            
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getStaff,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _GetAll(params) {
            let request = {
                method: 'GET',
                url: UrlService.getStaffAll,
                params: params,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();