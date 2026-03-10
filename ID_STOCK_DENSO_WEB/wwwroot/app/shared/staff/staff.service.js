(function () {
    'use strict';

    angular
        .module('app')
        .factory('StaffService', StaffService);

    StaffService.$inject = ['$http', 'UrlService'];

    function StaffService($http, UrlService) {


        let validationsMap = new Map();

        validationsMap.set("CompanyId", function Validar(value) {
            value = parseInt(value);
            if (isNaN(value)) {
                return "La empresa no es valida <br>";
            }
            if (!value) {
                return "La empresa es Requerida <br>";
            }
            if (value < 1) {
                return "La clave de la empresa debe ser mayor a 0 <br>"
            }
            return "";

        });
        validationsMap.set("DepartmentId", function Validar(value) {
            value = parseInt(value);
            if (isNaN(value)) {
                return "El departamento no es valido <br>";
            }
            if (!value) {
                return "El departamento es Requerido <br>";
            }
            if (value < 1) {
                return "La clave del departamento debe ser mayor a 0 <br>"
            }
            return "";

        });
        //validationsMap.set("RoleId", function Validar(value) {
        //    value = parseInt(value);
        //    if (isNaN(value)) {
        //        return "El Role no es valido <br>";
        //    }
        //    if (!value) {
        //        return "El Role es Requerido <br>";
        //    }
        //    if (value < 1) {
        //        return "La clave del role debe ser mayor a 0 <br>"
        //    }
        //    return "";

        //});
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
        
        //validationsMap.set("CreatedBy", function Validar(value) {
        //    value = parseInt(value);
        //    if (isNaN(value)) {
        //        return "La clave de la sesión iniciada no es valida <br>";
        //    }
        //    if (!value) {
        //        return "La clave de la sesión en curso es Requerida <br>";
        //    }
        //    return "";

        //});

        

        let service = {
            validations: validationsMap
        };
        return service;
    }
})();