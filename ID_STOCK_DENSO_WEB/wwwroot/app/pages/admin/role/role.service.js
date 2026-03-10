(function () {
    'use strict';

    angular
        .module('app')
        .factory('RoleService', RoleService);

    RoleService.$inject = ['$http', 'UrlService'];

    function RoleService($http, UrlService) {


        let validationsMap = new Map();
        
        validationsMap.set("Name", function Validar(value) {
            value = value.trim();
            if (!value) {
                return "El nombre es Requerido <br>";
            }
            if (value.length > 50) {
                return "El nombre no puede exeder los 50 caracteres <br>"
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