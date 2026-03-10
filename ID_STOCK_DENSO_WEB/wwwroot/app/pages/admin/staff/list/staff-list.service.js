(function () {
    'use strict';

    angular
        .module('app')
        .factory('StaffListService', StaffListService);

    StaffListService.$inject = ['$http', 'UrlService'];

    function StaffListService($http, UrlService) {
        let service = {
            Get: _Get,
            Print: _Print,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getStaff,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Print(data, userId) {

            let request = {
                method: 'POST',
                url: UrlService.printTagStaff + "/" + userId,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                data: JSON.stringify(data),
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();