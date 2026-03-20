(function () {
    angular
        .module('app')
        .controller('InventoryDetailController', InventoryDetailController);

    InventoryDetailController.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$timeout',
        'InventoryDetailService',
        'AlertService',
        'ErrorService',
        'ConstService',
    ];

    function InventoryDetailController(
        self,
        $state,
        $stateParams,
        $timeout,
        InventoryDetailService,
        AlertService,
        ErrorService,
        ConstService
    ) {
        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _FunctionsInit();
        }

        function _InitValues() {
            self.inventoryId = $stateParams.id;
            self.folio = $stateParams.folio || '';

            self.data = [];
            self.totalItems = 0;
            self.counterData = 0;

            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.currentPage = 1;
            self.displayItems = [];

            self.selectedPart = null;
            self.tagsData = [];
            self.loadingTags = false;

            self._suppressPageWatch = false;
        }

        function _RegisterFunctions() {
            self.ExistData = _ExistData;
            self.ExistTags = _ExistTags;
            self.DatumToString = _DatumToString;
            self.FormatDateTime = _FormatDateTime;
            self.OpenTagsModal = _OpenTagsModal;
            self.GoBack = () => $state.go('inventory.list');

            // ✅ CSV
            self.GetCSV = _GetCSV;

            self.$watch('currentPage', _ChangueCurrentPage);
            self.$watch('itemsPerPage', _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();

            self._suppressPageWatch = true;
            self.currentPage = 1;
            self._suppressPageWatch = false;

            await _LoadDetailAsync(1);
            swal.close();
        }

        // ── Cargar detalle ────────────────────────────────────────────────────
        async function _LoadDetailAsync(page) {
            try {
                self.data = [];
                self.totalItems = self.counterData = 0;

                let params = {
                    inventoryId: self.inventoryId,
                    page: page || 1,
                    itemsPerPage: self.itemsPerPage,
                };

                let response = await InventoryDetailService.Get(params);
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
        async function _OpenTagsModal(part) {
            self.selectedPart = part;
            self.tagsData = [];
            self.loadingTags = true;

            $timeout(() => $('#modalInventoryTags').modal('show'));

            try {
                let response = await InventoryDetailService.GetTagsPart(
                    self.inventoryId,
                    part.IdProduct,
                    part.Localizacion || ''
                );
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

        // ── Exportar CSV ──────────────────────────────────────────────────────
        function _GetCSV() {
            if (!self.data || self.data.length === 0) {
                AlertService.Error('Oops', 'No hay datos para exportar.');
                return;
            }

            let headers = [
                'No. Parte', 'No. Denson', 'Descripción',
                'Localización', 'Cantidad'
            ];

            let csvRows = [headers.join(',')];
            self.data.forEach(function (row) {
                csvRows.push(_BuildCsvRow(row));
            });

            let csvContent = csvRows.join('\n');
            let blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.href = url;
            let fecha = new Date().toLocaleDateString('es-MX').replace(/\//g, '-');
            a.download = 'Inventario_' + (self.folio || self.inventoryId) + '_' + fecha + '.csv';
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }

        function _BuildCsvRow(row) {
            let esc = function (v) {
                if (v === null || v === undefined) return '';
                let s = String(v).replace(/"/g, '""');
                return s.indexOf(',') >= 0 || s.indexOf('"') >= 0 ? '"' + s + '"' : s;
            };

            return [
                esc(row.NoParte),
                esc(row.NoDenson),
                esc(row.Descripcion),
                esc(row.Localizacion),
                esc(row.Cantidad),
            ].join(',');
        }

        // ── Helpers ───────────────────────────────────────────────────────────
        function _ExistData() { return self.data && self.data.length > 0; }
        function _ExistTags() { return self.tagsData && self.tagsData.length > 0; }
        function _DatumToString(datum) { return datum ? datum : '--'; }

        function _FormatDateTime(dateStr) {
            if (!dateStr) return '--';
            return new Date(dateStr).toLocaleString('es-MX', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }

        // ── Paginación ────────────────────────────────────────────────────────
        function _ChangueCurrentPage(nv, ov) {
            if (nv === ov) return;
            if (self._suppressPageWatch) return;
            AlertService.Load();
            _LoadDetailAsync(nv);
            swal.close();
        }

        async function _ChangueItemsPerPage(nv, ov) {
            if (nv === ov) return;
            AlertService.Load();
            await _LoadDetailAsync(1);
            swal.close();
        }

        _Init();
    }
})();