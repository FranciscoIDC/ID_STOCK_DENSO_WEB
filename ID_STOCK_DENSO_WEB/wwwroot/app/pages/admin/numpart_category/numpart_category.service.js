(function () {
    'use strict';

    angular
        .module('app')
        .factory('NumpartCategoryService', NumpartCategoryService);

    NumpartCategoryService.$inject = ['$http', 'UrlService'];

    function NumpartCategoryService($http, UrlService) {



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

        validationsMap.set("Description", function Validar(value) {
            value = value.trim();
            if (!value) {
                return "La descripcion es Requerida <br>";
            }
            if (value.length > 150) {
                return "La descripcion no puede exeder los 150 caracteres <br>"
            }
            return "";

        });

       
        let service = {
            validations: validationsMap
        };
        return service;
    }
})();