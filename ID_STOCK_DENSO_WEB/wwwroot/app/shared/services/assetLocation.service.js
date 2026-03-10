(function () {
    'use strict';

    angular
        .module('app')
        .factory('AssetLocationService', AssetLocationService);

    AssetLocationService.$inject = ['$http', 'UrlService'];

    function AssetLocationService($http, UrlService) {
        let service = {
            Get: _Get
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getAssetLocation,
                params: params,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();