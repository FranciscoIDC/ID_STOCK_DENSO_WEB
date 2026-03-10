(function () {
    'use strict';

    angular
        .module('app')
        .factory('RoleEditService', RoleEditService);

    RoleEditService.$inject = ['$http', 'UrlService'];

    function RoleEditService($http, UrlService) {
        let service = {
            Get: _Get,
            GetPermissions: _GetPermissions,
            SavePermissions: _SavePermissions,
        };

        function _Get(id) {
            let url = UrlService.getRoleById.replace('{id}', id)
            let request = {
                method: 'GET',
                url: url,
                //params: params,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                async: true
            }
            return $http(request)
        }

        function _GetPermissions(roleId) {
            let url = UrlService.getRolePermissions.replace('{roleId}', roleId)
            let request = {
                method: 'GET',
                url: url,
                //params: params,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                async: true
            }
            return $http(request)
        }

        function _SavePermissions(roleId, list) {
            let url = UrlService.postUpsertPermissions.replace('{roleId}', roleId)
            let request = {
                method: 'POST',
                url: url,
                data: list,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();