(function () {
    'use strict';

    angular
        .module('app')
        .factory('RejectionAddService', RejectionAddService);

    RejectionAddService.$inject = ['$http', 'UrlService'];

    function RejectionAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {
            
            let request = {
                method: 'POST',
                url: UrlService.postRejection,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();