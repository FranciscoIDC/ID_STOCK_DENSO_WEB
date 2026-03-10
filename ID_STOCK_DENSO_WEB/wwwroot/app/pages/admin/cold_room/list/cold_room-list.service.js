(function () {
    'use strict';

    angular
        .module('app')
        .factory('ColdRoomListService', ColdRoomListService);

    ColdRoomListService.$inject = ['$http', 'UrlService'];

    function ColdRoomListService($http, UrlService) {
        let service = {
            Get: _Get,
            Print: _Print,
        };

        function _Get(params) {
            let request = {
                method: 'GET',
                url: UrlService.getColdRoom,
                params: params,
                async: true
            }
            return $http(request)
        }

        function _Print(data, userId) {

            let request = {
                method: 'POST',
                url: UrlService.printTagColdRoom + "/" + userId,
                data: JSON.stringify(data),
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();