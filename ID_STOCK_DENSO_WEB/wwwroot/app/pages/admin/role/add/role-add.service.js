(function () {
    'use strict';

    angular
        .module('app')
        .factory('RoleAddService', RoleAddService);

    RoleAddService.$inject = ['$http', 'UrlService'];

    function RoleAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postUpsert,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();