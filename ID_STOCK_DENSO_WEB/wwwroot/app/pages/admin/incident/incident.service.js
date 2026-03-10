(function () {
    'use strict';

    angular
        .module('app')
        .factory('IncidentService', IncidentService);

    IncidentService.$inject = ['$http', 'UrlService'];

    function IncidentService($http, UrlService) {
                
        let validationsMap = new Map();

        let service = {
            validations: validationsMap
        };
        return service;
    }
})();