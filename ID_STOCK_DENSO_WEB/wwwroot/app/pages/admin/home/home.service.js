(function () {
    'use strict';

    angular
        .module('app')
        .factory('HomeService', HomeService);

    HomeService.$inject = ['$http', 'UrlService'];

    function HomeService($http, UrlService) {
        let service = {
            GetLastMoves: _GetLastMoves
        };

        function _GetLastMoves(params) {
            let request = {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + UrlService.token,
                },
                url: UrlService.getLogLastMoves,
                params: params,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();