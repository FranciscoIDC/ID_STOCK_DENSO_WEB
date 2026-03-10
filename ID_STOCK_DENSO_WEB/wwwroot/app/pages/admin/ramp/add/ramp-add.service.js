(function () {
    'use strict';

    angular
        .module('app')
        .factory('RampAddService', RampAddService);

    RampAddService.$inject = ['$http', 'UrlService'];

    function RampAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postRamp,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();