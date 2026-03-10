(function () {
    'use strict';

    angular
        .module('app')
        .factory('AlertService', AlertService);

    AlertService.$inject = ['$http'];

    function AlertService($http) {
        let service = {
            Success: _Success,
            Error: _Error,
            ErrorHtml: _ErrorHtml,
            Load: _Load,
            ConfirmHtml: _ConfirmHtml
        };
        function _Success(title, msg) {
            return Swal.fire({
                icon: 'success',
                title: title,
                text: msg
            })
        }
        function _Error(title, msg) {
            Swal.fire({
                icon: 'error',
                title: title,
                text: msg
            })
        }
        function _ErrorHtml(title, msg) {
            Swal.fire({
                icon: 'error',
                title: title,
                html: msg
            })
        }

        function _ConfirmHtml(title, msg, txt_positiveButton = '') {

            txt_positiveButton = txt_positiveButton != '' ? txt_positiveButton : 'Imprimir';

            return Swal.fire({
                icon: 'info',
                title: title,
                html: msg,
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: txt_positiveButton,
                confirmButtonColor: "#4A6CF7",
                cancelButtonColor:"#D50100",
                reverseButtons:true,

            })
        }
        function _Load() {
            Swal.fire({
                icon: 'info',
                title: "Espere!",
                text: "Cargando",
                showConfirmButton: false
            })
        }
        return service;
    }
})();