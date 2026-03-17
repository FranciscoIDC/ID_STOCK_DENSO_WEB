(function () {
    angular
        .module('app')
        .controller('StockReportController', StockReportController);

    StockReportController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        'StockReportService',
        'AlertService',
        'ErrorService',
        'ConstService',
    ];

    function StockReportController(
        self,
        $state,
        $timeout,
        StockReportService,
        AlertService,
        ErrorService,
        ConstService
    ) {
        // ── Init ─────────────────────────────────────────────────────────────
        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _FunctionsInit();
        }

        function _InitValues() {
            self.filterSearch = '';

            self.data = [];
            self.totalItems = 0;
            self.counterData = 0;

            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.currentPage = 1;
            self.displayItems = [];

            // Modal de tags
            self.selectedProduct = null;
            self.tagsData = [];
            self.loadingTags = false;
        }

        function _RegisterFunctions() {
            self.Search = _Search;
            self.ClearFilters = _ClearFilters;
            self.ExistData = _ExistData;
            self.ExistTags = _ExistTags;
            self.DatumToString = _DatumToString;
            self.FormatDate = _FormatDate;
            self.FormatDateTime = _FormatDateTime;
            self.OpenTagsModal = _OpenTagsModal;

            self.$watch('currentPage', _ChangueCurrentPage);
            self.$watch('itemsPerPage', _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            await _Search(1);
            swal.close();
        }

        // ── Búsqueda ─────────────────────────────────────────────────────────
        async function _Search(newPage) {
            newPage = !newPage ? 1 : newPage;
            self.currentPage = newPage;
            AlertService.Load();
            await _GetStockAsync(_BuildParams(newPage));
            swal.close();
        }

        function _BuildParams(page) {
            return {
                Search: self.filterSearch || '',
                Page: page || 1,
                ItemsPerPage: self.itemsPerPage,
            };
        }

        async function _GetStockAsync(params) {
            try {
                self.data = [];
                self.totalItems = self.counterData = 0;

                let response = await StockReportService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;

                if (status !== 200) {
                    AlertService.Error('Oops', message);
                    return;
                }

                self.data = data || [];
                self.totalItems = counter || 0;
                self.counterData = counter || 0;
                self.$apply();
            } catch (ex) {
                AlertService.ErrorHtml('Oops...', ErrorService.GetError(ex));
            }
        }

        // ── Modal de tags ─────────────────────────────────────────────────────
        async function _OpenTagsModal(product) {
            self.selectedProduct = product;
            self.tagsData = [];
            self.loadingTags = true;

            $timeout(() => $('#modalStockTags').modal('show'));

            try {
                let response = await StockReportService.GetTags(product.IdProduct);
                const { Status: status, Message: message, Data: data } = response.data;

                if (status !== 200) {
                    AlertService.Error('Oops', message);
                    self.loadingTags = false;
                    return;
                }

                self.tagsData = data || [];
                self.loadingTags = false;
                self.$apply();
            } catch (ex) {
                self.loadingTags = false;
                AlertService.ErrorHtml('Oops...', ErrorService.GetError(ex));
            }
        }

        // ── Helpers ───────────────────────────────────────────────────────────
        function _ExistData() { return self.data && self.data.length > 0; }
        function _ExistTags() { return self.tagsData && self.tagsData.length > 0; }
        function _DatumToString(datum) { return datum ? datum : '--'; }

        function _FormatDate(dateStr) {
            if (!dateStr) return '--';
            return new Date(dateStr).toLocaleDateString('es-MX', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        }

        function _FormatDateTime(dateStr) {
            if (!dateStr) return '--';
            return new Date(dateStr).toLocaleString('es-MX', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        }

        function _ClearFilters() {
            self.filterSearch = '';
            $timeout(() => _Search(1), 100);
        }

        // ── Paginación ────────────────────────────────────────────────────────
        function _ChangueCurrentPage(nv, ov) {
            if (nv === ov) return;
            AlertService.Load();
            _GetStockAsync(_BuildParams(nv));
            swal.close();
        }

        async function _ChangueItemsPerPage(nv, ov) {
            if (nv === ov) return;
            AlertService.Load();
            await _GetStockAsync(_BuildParams(1));
            swal.close();
        }

        _Init();
    }
})();