(function () {
    'use strict';

    angular
        .module('app')
        .factory('DataTransformService', DataTransformService);

    DataTransformService.$inject = ['$http'];

    function DataTransformService($http) {
        return {
            Transform: _FormatAllDates
        };

        function _FormatAllDates(data) {
            if (!data || !Array.isArray(data)) return data;

            return data.map(item => {
                for (const key in item) {
                    if (!Object.prototype.hasOwnProperty.call(item, key)) continue;
                    const value = item[key];

                    if (typeof value === 'string' && _IsDateString(value)) {
                        item[key] = _FormatDate(value);
                    }
                }
                return item;
            });
        }

        function _IsDateString(value) {
            // Acepta ISO 8601 con Z y offsets
            const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[\+\-]\d{2}:\d{2})?$/;
            if (!isoRegex.test(value)) return false;

            const date = new Date(value);
            return !isNaN(date.getTime());
        }

        function _FormatDate(dateString) {
            const date = new Date(dateString);
            if (isNaN(date)) return dateString;

            const yyyy = date.getFullYear();
            const MM = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const hh = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            const ss = String(date.getSeconds()).padStart(2, '0');

            return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
        }
    }
})();
