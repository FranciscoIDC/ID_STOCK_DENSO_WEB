(function () {
    'use strict';

    angular
        .module('app')
        .factory('FarmerAddService', FarmerAddService);

    FarmerAddService.$inject = ['$http', 'UrlService'];

    function FarmerAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postFarmer,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();