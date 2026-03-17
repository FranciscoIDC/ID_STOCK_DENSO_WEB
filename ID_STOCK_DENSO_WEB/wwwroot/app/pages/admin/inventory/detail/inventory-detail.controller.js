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

            // Tabla de detalle
            self.data = [];
            self.totalItems = 0;
            self.counterData = 0;

            // Paginación
            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.currentPage = 1;
            self.displayItems = [];

            // Modal de tags
            self.selectedPart = null;
            self.tagsData = [];
            self.loadingTags = false;
        }

        function _RegisterFunctions() {
            self.ExistData = _ExistData;
            self.ExistTags = _ExistTags;
            self.DatumToString = _DatumToString;
            self.FormatDateTime = _FormatDateTime;
            self.OpenTagsModal = _OpenTagsModal;
            self.GoBack = () => $state.go('inventory.list');

            self.$watch('currentPage', _ChangueCurrentPage);
            self.$watch('itemsPerPage', _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            await _LoadDetailAsync(self.currentPage);
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