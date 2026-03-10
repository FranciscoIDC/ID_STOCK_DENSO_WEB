(function () {
    'use strict';

    angular
        .module('app')
        .factory('StaffAddService', StaffAddService);

    StaffAddService.$inject = ['$http', 'UrlService'];

    function StaffAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postStaff,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();