(function () {
    'use strict';

    angular
        .module('app')
        .factory('RecoverPasswordService', RecoverPasswordService);

    RecoverPasswordService.$inject = ['$http', 'UrlService'];

    function RecoverPasswordService($http, UrlService) {
        let service = {
            RecoverPassword: _RecoverPassword
        };

        function _RecoverPassword(email) {
            
            let request = {
                method: 'POST',
                url: UrlService.postPasswordRecovery,
                headers: { 'Authorization': 'Bearer ' + UrlService.token },
                data: JSON.stringify(email),
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();