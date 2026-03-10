(function () {
    'use strict';

    angular
        .module('app')
        .factory('CarrierAddService', CarrierAddService);

    CarrierAddService.$inject = ['$http', 'UrlService'];

    function CarrierAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postCarrier,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();