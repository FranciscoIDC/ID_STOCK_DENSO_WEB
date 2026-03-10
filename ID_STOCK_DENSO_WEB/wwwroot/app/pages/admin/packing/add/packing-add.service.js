(function () {
    'use strict';

    angular
        .module('app')
        .factory('PackingAddService', PackingAddService);

    PackingAddService.$inject = ['$http', 'UrlService'];

    function PackingAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postPacking,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();