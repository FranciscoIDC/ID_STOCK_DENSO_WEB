(function () {
    'use strict';

    angular
        .module('app')
        .factory('OutboundService', OutboundService);

    OutboundService.$inject = ['$http', 'UrlService'];

    function OutboundService($http, UrlService) {
                
        let validationsMap = new Map();

        let service = {
            validations: validationsMap
        };
        return service;
    }
})();