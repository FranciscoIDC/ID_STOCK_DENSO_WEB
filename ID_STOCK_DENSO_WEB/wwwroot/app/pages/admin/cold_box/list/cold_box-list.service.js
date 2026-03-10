(function () {
    'use strict';

    angular
        .module('app')
        .factory('ColdBoxListService', ColdBoxListService);

    ColdBoxListService.$inject = ['$http', 'UrlService'];

    function ColdBoxListService($http, UrlService) {
        let service = {
            Get: _Get,
            Print: _Print,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getColdBox,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Print(data, userId) {

            let request = {
                method: 'POST',
                url: UrlService.printTagColdBox + "/" + userId,
                data: JSON.stringify(data),
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();