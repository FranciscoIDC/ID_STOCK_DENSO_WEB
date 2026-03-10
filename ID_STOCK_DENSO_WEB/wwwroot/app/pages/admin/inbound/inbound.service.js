(function () {
    'use strict';

    angular
        .module('app')
        .factory('InboundService', InboundService);

    InboundService.$inject = ['$http', 'UrlService'];

    function InboundService($http, UrlService) {
                
        let validationsMap = new Map();

        let service = {
            validations: validationsMap
        };
        return service;
    }
})();