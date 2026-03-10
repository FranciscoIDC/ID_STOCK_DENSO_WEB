(function () {
    'use strict';

    angular
        .module('app')
        .factory('VarietyListService', VarietyListService);

    VarietyListService.$inject = ['$http', 'UrlService'];

    function VarietyListService($http, UrlService) {
        let service = {
            Get: _Get,
            Print: _Print,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getVariety,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Print(data, userId) {

            let request = {
                method: 'POST',
                url: UrlService.printTagVariety + "/" + userId,
                data: JSON.stringify(data),
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();