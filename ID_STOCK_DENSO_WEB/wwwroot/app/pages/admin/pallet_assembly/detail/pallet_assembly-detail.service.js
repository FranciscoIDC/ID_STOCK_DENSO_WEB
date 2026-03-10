(function () {
    'use strict';

    angular
        .module('app')
        .factory('PalletAssemblyDetailService', PalletAssemblyDetailService);

    PalletAssemblyDetailService.$inject = ['$http', 'UrlService'];

    function PalletAssemblyDetailService($http, UrlService) {
        let service = {
            Get: _Get,
            /*Getimages: _Getimages,*/
        };

        function _Get(dto) {
            let request = {
                method: 'GET',
                url: UrlService.getPalletAssemblyDetail,
                params: dto,
                async: true
            }
            return $http(request)
        }
        //function _Getimages(id) {
        //    let request = {
        //        method: 'GET',
        //        url: UrlService.getImagesPalletAssemblyDetail.replace("{id}", id),
        //        async: true
        //    }
        //    return $http(request)
        //}

        return service;
    }
})();