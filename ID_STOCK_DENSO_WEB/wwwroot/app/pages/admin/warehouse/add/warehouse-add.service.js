(function () {
    'use strict';

    angular
        .module('app')
        .factory('WarehouseAddService', WarehouseAddService);

    WarehouseAddService.$inject = ['$http', 'UrlService'];

    function WarehouseAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {


            let request = {
                method: 'POST',
                url: UrlService.postWarehouse,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();