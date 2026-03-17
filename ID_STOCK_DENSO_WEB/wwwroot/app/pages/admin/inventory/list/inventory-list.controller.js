(function () {
    angular
        .module('app')
        .controller('InventoryListController', InventoryListController);

    InventoryListController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        'InventoryListService',
        'AlertService',
        'ErrorService',
        'ConstService',
    ];

    function InventoryListController(
        self,
        $state,
        $timeout,
        InventoryListService,
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
            // Filtros
            self.filterDateStart = _TodayMinus(30);   // últimos 30 días por defecto
            self.filterDateEnd = _Today();
            self.filterStatus = 0;                  // todos

            // Opciones de estado
            self.statusOptions = [
                { id: 0, label: 'Todos' },
                { id: 1, label: 'En Progreso' },
                { id: 2, label: 'Completado' },
            ];

            // Datos
            self.data = [];
            self.totalItems = 0;
            self.counterData = 0;

            // Contadores para las stat-cards
            self.countInProgress = 0;
            self.countCompleted = 0;

            // Paginación
            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.currentPage = 1;
            self.displayItems = [];
        }

        function _RegisterFunctions() {
            self.Search = _Search;
            self.ClearFilters = _ClearFilters;
            self.ExistData = _ExistData;
            self.FormatDate = _FormatDate;
            self.FormatDateTime = _FormatDateTime;
            self.DatumToString = _DatumToString;
            self.GetStatusClass = _GetStatusClass;
            self.GetStatusIcon = _GetStatusIcon;
            self.GoDetail = _GoDetail;

            self.$watch('currentPage', _ChangueCurrentPage);
            self.$watch('itemsPerPage', _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            await _Search();
            swal.close();
        }

        // ── Búsqueda ─────────────────────────────────────────────────────────
        async function _Search(newPage) {
            newPage = !newPage ? 1 : newPage;
            self.currentPage = newPage;
            AlertService.Load();
            await _GetInventoriesAsync(_BuildParams(self.currentPage));
            swal.close();
        }

        function _BuildParams(page) {
            return {
                DateStart: _FormatDateParam(self.filterDateStart),
                DateEnd: _FormatDateParam(self.filterDateEnd),
                Status: self.filterStatus || 0,
                Page: page || 1,
                ItemsPerPage: self.itemsPerPage,
            };
        }

        function _FormatDateParam(value) {
            if (!value) return null;

            // Si ya viene como string "yyyy-MM-dd" del input, lo devuelve directo
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                return value;
            }

            // Si AngularJS lo convirtió a objeto Date, lo formatea manualmente
            var date = new Date(value);
            if (isNaN(date.getTime())) return null;

            var yyyy = date.getFullYear();
            var mm = String(date.getMonth() + 1).padStart(2, '0');
            var dd = String(date.getDate()).padStart(2, '0');
            return yyyy + '-' + mm + '-' + dd;
        }

        async function _GetInventoriesAsync(params) {
            try {
                self.data = [];
                self.totalItems = self.counterData = 0;

                let response = await InventoryListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;

                if (status !== 200) {
                    AlertService.Error('Oops', message);
                    return;
                }

                self.data = data || [];
                self.totalItems = counter || 0;
                self.counterData = counter || 0;

                self.countInProgress = self.data.filter(r => r.IdEstatus === 1).length;
                self.countCompleted = self.data.filter(r => r.IdEstatus === 2).length;

                self.$apply();
            } catch (ex) {
                AlertService.ErrorHtml('Oops...', ErrorService.GetError(ex));
            }
        }

        // ── Navegación ────────────────────────────────────────────────────────
        function _GoDetail(item) {
            $state.go('inventory.detail', { id: item.IdInventory, folio: item.Folio });
        }

        // ── Helpers visuales ─────────────────────────────────────────────────
        function _GetStatusClass(idEstatus) {
            switch (idEstatus) {
                case 1: return 'badge-status-pending';
                case 2: return 'badge-status-completed';
                default: return 'badge-status-default';
            }
        }

        function _GetStatusIcon(idEstatus) {
            switch (idEstatus) {
                case 1: return 'lni lni-timer';
                case 2: return 'lni lni-checkmark-circle';
                default: return 'lni lni-question-circle';
            }
        }

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

        function _ExistData() { return self.data && self.data.length > 0; }
        function _DatumToString(datum) { return datum ? datum : '--'; }

        function _ClearFilters() {
            self.filterDateStart = _TodayMinus(30);
            self.filterDateEnd = _Today();
            self.filterStatus = 0;
            $timeout(() => _Search(1), 100);
        }

        // ── Paginación ────────────────────────────────────────────────────────
        function _ChangueCurrentPage(nv, ov) {
            if (nv === ov) return;
            AlertService.Load();
            _GetInventoriesAsync(_BuildParams(nv));
            swal.close();
        }

        async function _ChangueItemsPerPage(nv, ov) {
            if (nv === ov) return;
            AlertService.Load();
            await _GetInventoriesAsync(_BuildParams(1));
            swal.close();
        }

        // ── Helpers de fecha ─────────────────────────────────────────────────
        function _Today() {
            return new Date().toISOString().substring(0, 10);
        }

        function _TodayMinus(days) {
            let d = new Date();
            d.setDate(d.getDate() - days);
            return d.toISOString().substring(0, 10);
        }

        _Init();
    }
})();