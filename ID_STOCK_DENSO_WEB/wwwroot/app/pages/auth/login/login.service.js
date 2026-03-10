(function () {
    'use strict';

    angular
        .module('app')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$http', 'UrlService'];

    function LoginService($http, UrlService) {
        let service = {
            LogIn: _LogIn
        };

        function _LogIn(dto) {
            let request = {
                method: 'POST',
                url: UrlService.postRequestLogin,
                headers: {
                    'Authorization': 'Bearer ' + UrlService.token,
                },
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();