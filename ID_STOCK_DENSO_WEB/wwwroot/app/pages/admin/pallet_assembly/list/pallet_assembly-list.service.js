(function () {
    'use strict';

    angular
        .module('app')
        .factory('PalletAssemblyListService', PalletAssemblyListService);

    PalletAssemblyListService.$inject = ['$http', 'UrlService'];

    function PalletAssemblyListService($http, UrlService) {
        let service = {
            Get: _Get,
        };

        function _Get(dto) {
            let request = {
                method: 'GET',
                url: UrlService.getPalletAssembly,
                params: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();