(function () {
    'use strict';

    angular
        .module('app')
        .factory('ErrorService', ErrorService);

    ErrorService.$inject = ['$http'];

    function ErrorService($http) {

        let service = {
            GetError: _GetError
        };

        function _GetError(e) {
            let error = "";
            if (e instanceof TypeError) {
                error = `Tipo de Error: ${e.name} - Mensaje ${e.message}`

            } else if (e instanceof RangeError) {
                error = `Tipo de Error: ${e.name} - Mensaje ${e.message}`

            } else if (e instanceof EvalError) {
                error = `Tipo de Error: ${e.name} - Mensaje ${e.message}`

            } else if (e instanceof ReferenceError) {
                error = `Tipo de Error: ${e.name} - Mensaje ${e.message}`

            } else if (e instanceof SyntaxError) {
                error = `Tipo de Error: ${e.name} - Mensaje ${e.message}`

            }
            else if (e instanceof URIError) {
                error = `Tipo de Error: ${e.name} - Mensaje ${e.message}`
            }
            else {
                let status = e.status;
                if (status === 400 && e.data.hasOwnProperty("errors")) {
                    for (const property in e.data.errors) {
                        let value = e.data.errors[property];
                        value.forEach(item => {
                            error += item + "<br>"
                        })
                    }
                } else
                    error = e.data;

            }
            return error;
        }

        return service;

    }
})();