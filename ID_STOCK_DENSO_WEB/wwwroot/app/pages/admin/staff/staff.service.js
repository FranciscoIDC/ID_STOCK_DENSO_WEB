(function () {
    'use strict';

    angular
        .module('app')
        .factory('StaffService', StaffService);

    StaffService.$inject = ['$http', 'UrlService'];

    function StaffService($http, UrlService) {


        let validationsMap = new Map();

        validationsMap.set("Name", function Validar(value) {
            value = value.trim();
            if (!value) {
                return "El nombre es Requerido <br>";
            }
            if (value.length > 100) {
                return "El nombre no puede exeder los 100 caracteres <br>"
            }
            return "";

        });
        validationsMap.set("LastName", function Validar(value) {
            value = value.trim();
            if (!value) {
                return "El apellido es Requerido <br>";
            }
            if (value.length > 100) {
                return "El apellido no puede exeder los 100 caracteres <br>"
            }
            return "";

        });
        validationsMap.set("Email", function Validar(value) {
            value = value.trim();
            if (!value) {
                return "El email es Requerido <br>";
            }
            if (value.length > 150) {
                return "El email no puede exeder los 150 caracteres <br>"
            }
            var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!value.match(validRegex)) {
                return "El email no tiene un formato valido <br>"
            }
            return "";

        });
        

        let service = {
            validations: validationsMap
        };
        return service;
    }
})();