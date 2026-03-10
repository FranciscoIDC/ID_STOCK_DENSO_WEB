(function () {
    'use strict';

    angular
        .module('app')
        .factory('StaffEditService', StaffEditService);

    StaffEditService.$inject = ['$http', 'UrlService'];

    function StaffEditService($http, UrlService) {
        let service = {
            Get: _Get,
            Update: _Update
        };

        function _Get(id) {
            let url = UrlService.getStaffById.replace("{id}", id)
            let request = {
                method: 'GET',
                url: url,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                async: true
            }
            return $http(request)
        }

        function _Update(dto) {
            let request = {
                method: 'PUT',
                url: UrlService.putStaff,
                //headers: { "Content-Type": undefined },
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();