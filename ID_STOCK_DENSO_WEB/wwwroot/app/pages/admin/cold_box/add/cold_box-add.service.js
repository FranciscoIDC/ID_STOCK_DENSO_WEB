(function () {
    'use strict';

    angular
        .module('app')
        .factory('ColdBoxAddService', ColdBoxAddService);

    ColdBoxAddService.$inject = ['$http', 'UrlService'];

    function ColdBoxAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postColdBox,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();