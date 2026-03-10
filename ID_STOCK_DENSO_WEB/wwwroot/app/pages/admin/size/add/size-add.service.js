(function () {
    'use strict';

    angular
        .module('app')
        .factory('SizeAddService', SizeAddService);

    SizeAddService.$inject = ['$http', 'UrlService'];

    function SizeAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postSize,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();