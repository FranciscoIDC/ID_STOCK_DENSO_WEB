(function () {
    'use strict';

    angular
        .module('app')
        .factory('FieldLogListService', FieldLogListService);

    FieldLogListService.$inject = ['$http', 'UrlService'];

    function FieldLogListService($http, UrlService) {
        let service = {
            Get: _Get,
            GetWeb: _GetWeb,
            Print: _Print,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getFieldLog,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _GetWeb(params) {
            let request = {
                method: 'GET',
                url: UrlService.getWebFieldLog,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Print(data, userId) {

            let request = {
                method: 'POST',
                url: UrlService.printTagFieldLog + "/" + userId,
                data: JSON.stringify(data),
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();