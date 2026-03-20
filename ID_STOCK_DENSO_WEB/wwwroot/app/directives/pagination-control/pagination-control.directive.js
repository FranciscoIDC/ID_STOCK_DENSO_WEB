(function () {

    function PagingController($scope) {

        $scope.pager = {};
        $scope.pager.showItemsPerPage = $scope.showItemsPerPage==="false"?false:true;
        $scope.pagingSize = $scope.pagingSize || 10;



        $scope.pager.dataperPage = ($scope.itemsPerPage || 5)+'';
        $scope.itemsPerPage = $scope.pager.dataperPage;

        $scope.$watch('totalItems', function (newVal, oldVal) {
            //  all directive code here
            let totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
            $scope.pager.totalPages = totalPages;
            $scope.pager.currentPage = $scope.currentPage;
            $scope.setPage($scope.pager.currentPage);


        });

        $scope.$watch('itemsPerPage', function (newVal, oldVal) {
            //  all directive code here
            let totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
            $scope.pager.totalPages = totalPages;
            $scope.pager.currentPage = $scope.currentPage;
            $scope.setPage($scope.pager.currentPage);


        });

        $scope.PageChange = function () {
            console.log("el numero de items por pagina es", $scope.pager.dataperPage);
            $scope.itemsPerPage = $scope.pager.dataperPage;


        }

        function setPager(itemCount, currentPage, itemPerPage) {
            currentPage = currentPage || 1;
            let startPage, endPage;

            //let totalPages = Math.ceil(itemCount / itemPerPage);
            let totalPages = $scope.pager.totalPages;
            if (totalPages <= $scope.pagingSize) {
                startPage = 1;
                endPage = totalPages;
            } else {
                if (currentPage + 1 >= totalPages) {
                    startPage = totalPages - ($scope.pagingSize - 1);
                    endPage = totalPages;
                } else {
                    startPage = currentPage - parseInt($scope.pagingSize / 2);
                    startPage = startPage <= 0 ? 1 : startPage;
                    endPage = (startPage + $scope.pagingSize - 1) <= totalPages ? (startPage + $scope.pagingSize - 1) : totalPages;
                    if (totalPages === endPage) {
                        startPage = endPage - $scope.pagingSize + 1;
                    }
                }
            }

            let startIndex = (currentPage - 1) * itemPerPage;
            let endIndex = startIndex + itemPerPage - 1;

            let index = startPage;
            let pages = [];
            for (; index < endPage + 1; index++)
                pages.push(index);

            $scope.pager.currentPage = currentPage;
            $scope.currentPage = currentPage;
            //$scope.pager.totalPages = totalPages;
            $scope.pager.startPage = startPage;
            $scope.pager.endPage = endPage;
            $scope.pager.startIndex = startIndex;
            $scope.pager.endIndex = endIndex;
            $scope.pager.pages = pages;
        }

        $scope.setPage = function (currentPage) {
            if (currentPage < 1 || currentPage > $scope.pager.totalPages)
                return;

            setPager($scope.totalItems, currentPage, $scope.itemsPerPage);
            //    $scope.displayItems = $scope.totalItems.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
        };

        //    $scope.setPage(1);
    }

    angular.module('app').directive('paginationControl', [function () {
        return {
            restrict: 'E',
            templateUrl: '/idStockWeb/app/directives/pagination-control/pagination-control.directive.html',
            controller: ['$scope', PagingController],
            scope: {
                totalItems: "=",
                displayItems: '=',
                pagingSize: '=',
                itemsPerPage: '=',
                currentPage: '=',
                showItemsPerPage:'@'
            }
        };
    }]);
})();