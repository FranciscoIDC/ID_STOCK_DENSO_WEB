(function () {
    'use strict';

    angular
        .module('app')
        .factory('FieldLogAddService', FieldLogAddService);

    FieldLogAddService.$inject = ['$http', 'UrlService'];

    function FieldLogAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postFieldLog,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();