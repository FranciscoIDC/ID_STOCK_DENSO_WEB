(function () {
    'use strict';

    angular
        .module('app')
        .factory('NumpartCategoryAddService', NumpartCategoryAddService);

    NumpartCategoryAddService.$inject = ['$http', 'UrlService'];

    function NumpartCategoryAddService($http, UrlService) {
        let service = {
            Save: _Save
        };

        function _Save(dto) {


            let request = {
                method: 'POST',
                url: UrlService.postNumpartCategory,
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();