(function () {
    'use strict';

    angular
        .module('app')
        .factory('CarrierListService', CarrierListService);

    CarrierListService.$inject = ['$http', 'UrlService'];

    function CarrierListService($http, UrlService) {
        let service = {
            Get: _Get,
            Print: _Print,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getCarrier,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Print(data, userId) {

            let request = {
                method: 'POST',
                url: UrlService.printTagCarrier + "/" + userId,
                data: JSON.stringify(data),
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();