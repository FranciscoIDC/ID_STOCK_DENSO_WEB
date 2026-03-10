(function () {
    'use strict';

    angular
        .module('app')
        .factory('VarietyAddService', VarietyAddService);

    VarietyAddService.$inject = ['$http', 'UrlService'];

    function VarietyAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postVariety,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();