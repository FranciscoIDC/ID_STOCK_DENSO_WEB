(function () {
    'use strict';

    angular
        .module('app')
        .factory('LocationAddService', LocationAddService);

    LocationAddService.$inject = ['$http', 'UrlService'];

    function LocationAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            let request = {
                method: 'POST',
                url: UrlService.postLocation,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();