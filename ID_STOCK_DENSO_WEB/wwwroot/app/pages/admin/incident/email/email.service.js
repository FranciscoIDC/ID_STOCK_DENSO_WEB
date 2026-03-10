(function () {
    'use strict';

    angular
        .module('app')
        .factory('EmailService', EmailService);

    EmailService.$inject = ['$http', 'UrlService'];

    function EmailService($http, UrlService) {
        let service = {
            Save: _Save,
            GetEmail: _GetEmail,
            Delete: _Delete
        };

        function _Save(dto) {
            let request = {
                method: 'POST',
                url: UrlService.postIncidentEmail,
                data: dto,
                async: true
            }
            return $http(request)
        }

        function _GetEmail(params) {
            let url = UrlService.getIncidentEmail;
            let request = {
                method: 'GET',
                url: url,
                async: true,
                params: params
            }
            return $http(request)
        }

        function _Delete(id) {
            let url = UrlService.deleteIncidentEmail.replace("{id}", id)
            let request = {
                method: 'DELETE',
                url: url,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();