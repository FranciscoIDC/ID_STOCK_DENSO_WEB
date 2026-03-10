(function () {
    'use strict';

    angular
        .module('app')
        .factory('InventoryService', InventoryService);

    InventoryService.$inject = ['$http', 'UrlService'];

    function InventoryService($http, UrlService) {
                
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
        validationsMap.set("AssetsAddsId", function Validar(value) {
            value = parseInt(value);
            if (isNaN(value)) {
                return "El AssetsAddsId no es un numero valido <br>";
            }
            if (!value) {
                return "El AssetsAddsId es Requerido <br>";
            }
            if (value < 1) {
                return "El AssetsAddsId debe ser mayor a 0 <br>"
            }
            return "";

        });
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
        validationsMap.set("Manufacturer", function Validar(value) {
            value = value.trim();
            if (!value) {
                return "El fabricante es Requerido <br>";
            }
            if (value.length > 50) {
                return "El fabricante no puede exeder los 50 caracteres <br>"
            }
            return "";

        });
        validationsMap.set("IdTagRFID", function Validar(value) {
            value = value.trim();
            if (!value) {
                return "El Tag RFID es Requerido <br>";
            }
            if (value.length > 12) {
                return "El Tag RFID no puede exeder los 12 caracteres <br>"
            }
            return "";

        });
        validationsMap.set("CategoryId", function Validar(value) {
            value = parseInt(value);
            if (isNaN(value)) {
                return "El id de la categoria no es un numero valido <br>";
            }
            if (!value) {
                return "El id de la categoria es Requerido <br>";
            }
            return "";

        });
        validationsMap.set("AssetLocationId", function Validar(value) {
            value = parseInt(value);
            if (isNaN(value)) {
                return "El id de la localizacion no es un numero valido <br>";
            }
            if (!value) {
                return "El id de la localizacion es Requerido <br>";
            }
            return "";
        });
        let service = {
            validations: validationsMap
        };
        return service;
    }
})();