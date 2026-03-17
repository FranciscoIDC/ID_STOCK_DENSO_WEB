(function () {
    'use strict';
    angular
        .module('app')
        .factory('StockReportService', StockReportService);

    StockReportService.$inject = ['$http', 'UrlService'];

    function StockReportService($http, UrlService) {
        return {
            Get: _Get,
            GetTags: _GetTags,
        };

        // GET /api/Stock  — listado agrupado por producto
        function _Get(params) {
            return $http({
                method: 'GET',
                url: UrlService.getStock,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                params: params,
                async: true
            });
        }

        // GET /api/Stock/Tags/{idProduct}  — tags del modal
        function _GetTags(idProduct) {
            return $http({
                method: 'GET',
                url: UrlService.getStock + '/Tags/' + idProduct,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                async: true
            });
        }
    }
})();
