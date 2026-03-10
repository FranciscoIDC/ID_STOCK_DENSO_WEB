(function () {
    'use strict';

    angular
        .module('app')
        .factory('StockService', StockService);

    StockService.$inject = ['$http', 'UrlService'];

    function StockService($http, UrlService) {

        let validationsMap = new Map();
       
        let service = {
            validations: validationsMap
        };
        return service;
    }
})();