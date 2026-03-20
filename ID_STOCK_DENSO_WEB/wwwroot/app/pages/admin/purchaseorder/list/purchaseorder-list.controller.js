(function () {
    angular
        .module('app')
        .controller('PurchaseOrderListController', PurchaseOrderListController);

    PurchaseOrderListController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        'PurchaseOrderListService',
        'AlertService',
        'ErrorService',
        'ConstService',
    ];

    function PurchaseOrderListController(
        self,
        $state,
        $timeout,
        PurchaseOrderListService,
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
            self.model = {};

            self.filterSearch = "";
            self.filterStatus = "";
            self.filterProveedor = "";

            self.data = [];
            self.counterData = 0;
            self.totalItems = 0;

            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.currentPage = 1;
            self.displayItems = [];

            // Modal de detalle de partes
            self.selectedOrder = {};

            // Contadores stat cards — vienen del API, no del filtro local
            self.countPending = 0;
            self.countInProgress = 0;
            self.countCompleted = 0;

            // ✅ Bandera para evitar que el $watch dispare durante _Search
            self._suppressPageWatch = false;

            // Catálogo de estatus para el filtro dropdown
            self.statusOptions = [
                { id: "", label: "Todos los estatus" },
                { id: "1", label: "En espera a su entrada" },
                { id: "3", label: "En Entrada de Productos" },
                { id: "4", label: "Entrada Completada" },
            ];
        }

        function _RegisterFunctions() {
            self.Search = _Search;
            self.ClearFilters = _ClearFilters;
            self.ExistData = _ExistData;
            self.DatumToString = _DatumToString;
            self.FormatDate = _FormatDate;
            self.GetStatusClass = _GetStatusClass;
            self.GetStatusIcon = _GetStatusIcon;
            self.GetTypeClass = _GetTypeClass;
            self.CountParts = _CountParts;
            self.OpenDetailModal = _OpenDetailModal;
            self.SumQuantity = _SumQuantity;

            // VISORES DE LAS VARIABLES QUE SE USAN EN EL CONTROL DE PAGINACION
            self.$watch("currentPage", _ChangueCurrentPage);
            self.$watch("itemsPerPage", _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            await _Search();
            swal.close();
        }

        // ========== BÚSQUEDA PRINCIPAL ==========
        async function _Search(newPage) {
            newPage = !newPage ? 1 : newPage;

            AlertService.Load();

            // ✅ Suprimir el $watch antes de cambiar currentPage
            //    para evitar que _ChangueCurrentPage haga una segunda llamada al API
            self._suppressPageWatch = true;
            self.currentPage = newPage;
            self._suppressPageWatch = false;

            let params = _BuildParams(self.currentPage);
            await _GetPurchaseOrdersAsync(params);
            swal.close();
        }

        // Centraliza la construcción de parámetros para evitar inconsistencias entre funciones
        function _BuildParams(page) {
            return {
                'Page': page || 1,
                'ItemsPerPage': self.itemsPerPage,
                'Search': self.filterSearch,
                'Status': self.filterStatus,
            };
        }

        async function _GetPurchaseOrdersAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;
                self.countPending = 0;
                self.countInProgress = 0;
                self.countCompleted = 0;

                let response = await PurchaseOrderListService.Get(params);
                const {
                    Status: status,
                    Message: message,
                    Data: data,
                    Counter: counter,
                    // ✅ Si el API devuelve contadores globales úsalos directamente.
                    //    Si no, se mantienen en 0 (no se calculan desde la página actual).
                    CountPending: countPending,
                    CountInProgress: countInProgress,
                    CountCompleted: countCompleted
                } = response.data;

                console.log('✅ Ordenes de compra obtenidas:', response);

                if (status !== 200) {
                    console.error('❌ Error:', message);
                    AlertService.Error("Oops", message);
                    return;
                }

                self.data = data || [];
                self.totalItems = counter || 0;
                self.counterData = counter || 0;

                // ✅ Usar contadores del API si existen;
                //    si el API no los devuelve aún, calcular sobre la página actual
                //    como fallback (sabiendo que es parcial)
                self.countPending = countPending != null ? countPending : self.data.filter(function (o) { return o.IdReceivedStatus === 1; }).length;
                self.countInProgress = countInProgress != null ? countInProgress : self.data.filter(function (o) { return o.IdReceivedStatus === 3; }).length;
                self.countCompleted = countCompleted != null ? countCompleted : self.data.filter(function (o) { return o.IdReceivedStatus === 4; }).length;

                self.$apply();

            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('❌ Error obteniendo ordenes:', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        // ========== MODAL DE DETALLE DE PARTES ==========
        function _OpenDetailModal(order) {
            self.selectedOrder = order;
            $timeout(function () {
                $('#modalDetailPO').modal('show');
            });
        }

        function _SumQuantity(listapartes, field) {
            if (!listapartes || listapartes.length === 0) return 0;
            return listapartes.reduce(function (acc, part) {
                return acc + (parseFloat(part[field]) || 0);
            }, 0);
        }

        function _CountParts(order) {
            return order.listapartes ? order.listapartes.length : 0;
        }

        // ========== HELPERS VISUALES ==========
        function _GetStatusClass(idStatus) {
            switch (idStatus) {
                case 4: return 'badge-status-completed';
                case 3: return 'badge-status-in-progress';
                case 1: return 'badge-status-pending';
                default: return 'badge-status-default';
            }
        }

        function _GetStatusIcon(idStatus) {
            switch (idStatus) {
                case 4: return 'lni lni-checkmark-circle';
                case 3: return 'lni lni-reload';
                case 1: return 'lni lni-timer';
                default: return 'lni lni-question-circle';
            }
        }

        function _GetTypeClass(idtipo) {
            switch (idtipo) {
                case 1: return 'type-electric';
                case 4: return 'type-mechanic';
                case 3: return 'type-jig';
                case 5: return 'type-pneumatic';
                default: return 'type-default';
            }
        }

        function _FormatDate(dateStr) {
            if (!dateStr) return '--';
            let date = new Date(dateStr);
            return date.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }

        function _ExistData() {
            return self.data && self.data.length > 0;
        }

        function _DatumToString(datum) {
            return datum ? datum : '--';
        }

        function _ClearFilters() {
            console.log('🧹 Limpiando filtros');
            self.filterSearch = "";
            self.filterStatus = "";
            self.filterProveedor = "";
            _Search(1);
        }

        // ========== PAGINACION ==========
        function _ChangueCurrentPage(newPage, oldPage) {
            if (newPage === oldPage) return;

            // ✅ Si _Search ya actualizó currentPage, ignorar el disparo del $watch
            if (self._suppressPageWatch) return;

            console.log("📄 Cambiando a página:", newPage);
            AlertService.Load();

            let params = _BuildParams(newPage);
            _GetPurchaseOrdersAsync(params);
            swal.close();
        }

        async function _ChangueItemsPerPage(newValue, oldValue) {
            if (newValue === oldValue) return;

            console.log("📊 Items por página:", newValue);
            AlertService.Load();

            let params = _BuildParams(1); // Reiniciar a primera página

            await _GetPurchaseOrdersAsync(params);
            swal.close();
        }

        _Init();
    }
})();