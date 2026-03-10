(function () {
    angular.module('app', [
        // Angular modules 
        'ui.router',
        'ui.router.state.events',
        'ngMaterial',
        'ngMessages'
    //    'bw.paging'
    //    'bw.paging'
    ]).directive("selectNgFiles", function () {
        return {
            require: "ngModel",
            link: function postLink(scope, elem, attrs, ngModel) {
                elem.on("change", function (e) {
                    var files = elem[0].files;
                    ngModel.$setViewValue(files);
                })
            }
        }
    });

})();