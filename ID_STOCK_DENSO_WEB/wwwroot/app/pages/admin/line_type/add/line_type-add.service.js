(function () {
    'use strict';

    angular
        .module('app')
        .factory('LineTypeAddService', LineTypeAddService);

    LineTypeAddService.$inject = ['$http', 'UrlService'];

    function LineTypeAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {


            let request = {
                method: 'POST',
                url: UrlService.postLineType,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();