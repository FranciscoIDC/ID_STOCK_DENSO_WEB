(function () {
    'use strict';

    angular
        .module('app')
        .factory('DestinationAddService', DestinationAddService);

    DestinationAddService.$inject = ['$http', 'UrlService'];

    function DestinationAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postDestination,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();