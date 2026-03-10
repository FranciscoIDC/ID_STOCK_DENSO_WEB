(function () {
    'use strict';

    angular
        .module('app')
        .factory('RequisitionOrderListService', RequisitionOrderListService);

    RequisitionOrderListService.$inject = ['$http', 'UrlService'];

    function RequisitionOrderListService($http, UrlService) {

        let service = {
            Get: _Get,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getRequisitionOrder, // Agregar en UrlService: getRequisitionOrder: baseUrl + 'api/Requisition'
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