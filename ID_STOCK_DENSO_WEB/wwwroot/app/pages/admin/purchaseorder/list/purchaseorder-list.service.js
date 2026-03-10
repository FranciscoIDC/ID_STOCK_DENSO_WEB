(function () {
    'use strict';
    angular
        .module('app')
        .factory('PurchaseOrderListService', PurchaseOrderListService);

    PurchaseOrderListService.$inject = ['$http', 'UrlService'];

    function PurchaseOrderListService($http, UrlService) {
        let service = {
            Get: _Get,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getPurchaseOrder, // Agregar en UrlService: getPurchaseOrders: baseUrl + 'api/PurchaseOrder'
                headers: {
                    'Authorization': 'Bearer ' + UrlService.token,
                },
                params: params,
                async: true
            };
            return $http(request);
        }

        return service;
    }
})();