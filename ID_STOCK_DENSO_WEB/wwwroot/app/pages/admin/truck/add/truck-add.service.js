(function () {
    'use strict';

    angular
        .module('app')
        .factory('TruckAddService', TruckAddService);

    TruckAddService.$inject = ['$http', 'UrlService'];

    function TruckAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postTruck,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();