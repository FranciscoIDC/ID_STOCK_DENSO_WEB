(function () {
    'use strict';

    angular
        .module('app')
        .factory('ColdRoomAddService', ColdRoomAddService);

    ColdRoomAddService.$inject = ['$http', 'UrlService'];

    function ColdRoomAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postColdRoom,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();