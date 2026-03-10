(function () {
    'use strict';

    angular
        .module('app')
        .factory('DestinationListService', DestinationListService);

    DestinationListService.$inject = ['$http', 'UrlService'];

    function DestinationListService($http, UrlService) {
        let service = {
            Get: _Get,
            Print: _Print,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getDestination,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Print(data, userId) {

            let request = {
                method: 'POST',
                url: UrlService.printTagDestination + "/" + userId,
                data: JSON.stringify(data),
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();