(function () {
    'use strict';

    angular
        .module('app')
        .factory('PalletAssemblyService', PalletAssemblyService);

    PalletAssemblyService.$inject = ['$http', 'UrlService'];

    function PalletAssemblyService($http, UrlService) {
                
        let validationsMap = new Map();
        validationsMap.set("Id", function Validar(value) {
            value = parseInt(value);
            if (isNaN(value)) {
                return "El Id no es un numero valido <br>";
            }
            if (!value) {
                return "El Id es Requerido <br>";
            }
            if (value < 1) {
                return "El Id debe ser mayor a 0 <br>"
            }
            return "";

        });
        let service = {
            validations: validationsMap
        };
        return service;
    }
})();