(function () {
    'use strict';

    angular
        .module('app')
        .factory('GateRegistrationListService', GateRegistrationListService);

    GateRegistrationListService.$inject = ['$http', 'UrlService'];

    function GateRegistrationListService($http, UrlService) {
        let service = {
            Get: _Get,
            GetWeb: _GetWeb,
            Print: _Print,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getGateRegistration,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _GetWeb(params) {
            let request = {
                method: 'GET',
                url: UrlService.getWebGateRegistration,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Print(data, userId) {

            let request = {
                method: 'POST',
                url: UrlService.printTagGateRegistration + "/" + userId,
                data: JSON.stringify(data),
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();