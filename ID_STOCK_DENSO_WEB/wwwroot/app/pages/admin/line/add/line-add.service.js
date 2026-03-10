(function () {
    'use strict';

    angular
        .module('app')
        .factory('LineAddService', LineAddService);

    LineAddService.$inject = ['$http', 'UrlService'];

    function LineAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            let request = {
                method: 'POST',
                url: UrlService.postLine,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();