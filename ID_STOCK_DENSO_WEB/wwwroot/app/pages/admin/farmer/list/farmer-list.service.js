(function () {
    'use strict';

    angular
        .module('app')
        .factory('FarmerListService', FarmerListService);

    FarmerListService.$inject = ['$http', 'UrlService'];

    function FarmerListService($http, UrlService) {
        let service = {
            Get: _Get,
            Print: _Print,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getFarmer,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Print(data, userId) {

            let request = {
                method: 'POST',
                url: UrlService.printTagFarmer + "/" + userId,
                data: JSON.stringify(data),
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();