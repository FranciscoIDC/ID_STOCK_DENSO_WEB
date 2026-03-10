(function () {
    'use strict';

    angular
        .module('app')
        .factory('BoxAddService', BoxAddService);

    BoxAddService.$inject = ['$http', 'UrlService'];

    function BoxAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postBox,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();