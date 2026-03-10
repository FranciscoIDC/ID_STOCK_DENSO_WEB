(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProductUploadImageService', ProductUploadImageService);

    ProductUploadImageService.$inject = ['$http', 'UrlService'];

    function ProductUploadImageService($http, UrlService) {
        let service = {
            Get:_Get,
            Upload: _Upload
        };

        function _Get(productId) {
            let url = UrlService.getProductImage.replace("{id}", productId);
            let request = {
                method: 'GET',
                url: url,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                async: true
            }
            return $http(request)
        }

        function _Upload(productId, image) {
            let url = UrlService.uploadProductImage_FormData.replace("{id}", productId);

            let formData = new FormData();

            formData.append('Image', image);

            let request = {
                method: 'PUT',
                url: url,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                data: formData,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();