(function () {
    'use strict';

    angular
        .module('app')
        .factory('SizeEditService', SizeEditService);

    SizeEditService.$inject = ['$http', 'UrlService'];

    function SizeEditService($http, UrlService) {
        let service = {
            Get: _Get,
            Update: _Update
        };

        function _Get(id) {
            let url = UrlService.getSizeById.replace("{id}", id)
            let request = {
                method: 'GET',
                url: url,
                async: true
            }
            return $http(request)
        }

        function _Update(dto) {
            //let formdata = new FormData();

            //for (const property in dto) {
            //    let value = dto[property];
            //    if (value) {
            //        let arrayDate = ['AcceptanceDate', 'ImportDate', 'IssueDate', 'AssetTaggedDate', 'PictureSubmittedDate', 'AssetInServiceDate'];
            //        let val = null;
            //        if (arrayDate.includes(property)) {
            //            let year = value.getFullYear();
            //            let month = value.getMonth();
            //            let day = value.getDate();
            //            val = `${year}-${month+1}-${day}`;
            //        //    val.toISOString();
            //        } else {
            //            val = dto[property];
            //        }
            //        formdata.append(property, val);
            //    }
            //}

            let request = {
                method: 'PUT',
                url: UrlService.putSize,
                //headers: { "Content-Type": undefined },
                data: dto,
                async: true
            }
            return $http(request)
        }

        return service;
    }
})();