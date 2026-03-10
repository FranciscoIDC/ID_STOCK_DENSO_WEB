(function () {
    'use strict';

    angular
        .module('app')
        .factory('DriverAddService', DriverAddService);

    DriverAddService.$inject = ['$http', 'UrlService'];

    function DriverAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postDriver,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();