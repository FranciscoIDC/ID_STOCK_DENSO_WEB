(function () {
    'use strict';

    angular
        .module('app')
        .factory('InventoryDetailService', InventoryDetailService);

    InventoryDetailService.$inject = ['$http', 'UrlService'];

    function InventoryDetailService($http, UrlService) {
        let service = {
            Get: _Get,
            /*Getimages: _Getimages,*/
        };

        function _Get(dto) {
            let request = {
                method: 'GET',
                url: UrlService.getInventoryDetail,
                headers: {
                    'Authorization': 'Bearer ' + UrlService.token,
                },
                params: dto,
                async: true
            }
            return $http(request)
        }
        //function _Getimages(id) {
        //    let request = {
        //        method: 'GET',
        //        url: UrlService.getImagesInventoryDetail.replace("{id}", id),
        //        async: true
        //    }
        //    return $http(request)
        //}

        return service;
    }
})();