(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProductService', ProductService);

    ProductService.$inject = ['$http', 'UrlService'];

    function ProductService($http, UrlService) {

        let validationsMap = new Map();

        let service = {
            validations: validationsMap
        };
        return service;
    }
})();