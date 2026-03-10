(function () {
    'use strict';

    angular
        .module('app')
        .factory('ZoneAddService', ZoneAddService);

    ZoneAddService.$inject = ['$http', 'UrlService'];

    function ZoneAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            let request = {
                method: 'POST',
                url: UrlService.postZone,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();