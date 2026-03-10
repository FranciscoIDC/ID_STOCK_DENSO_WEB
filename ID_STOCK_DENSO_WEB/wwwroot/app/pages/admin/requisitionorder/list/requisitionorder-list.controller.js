(function () {
    angular
        .module('app')
        .controller('RequisitionOrderListController', RequisitionOrderListController);

    RequisitionOrderListController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        'RequisitionOrderListService',
        'AlertService',
        'ErrorService',
        'ConstService',
    ];

    function RequisitionOrderListController(
        self,
        $state,
        $timeout,
        RequisitionOrderListService,
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

            self.data = [];
            self.counterData = 0;
            self.totalItems = 0;

            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.currentPage = 1;
            self.displayItems = [];

            // Modal de detalle de partes
            self.selectedRequisition = {};

            // Estado de carga
            self.isLoading = false;

            // Catálogo de estatus para el filtro dropdown
            // Basado en la respuesta JSON: 1=En Espera de Entrada, 2=Entregado
            self.statusOptions = [
                { id: "", label: "Todos los estatus" },
                { id: "1", label: "En Espera de Entrada" },
                { id: "2", label: "Entregado" },
            ];

            // Contadores de stat cards
            self.countPending = 0;
            self.countDelivered = 0;
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

            self.isLoading = true;
            self.currentPage = newPage;
            AlertService.Load();

            let params = {
                'Page': self.currentPage,
                'ItemsPerPage': self.itemsPerPage,
                'Search': self.filterSearch,
                'Status': self.filterStatus,
            };

            await _GetRequisitionsAsync(params);

            self.isLoading = false;
            swal.close();
        }

        async function _GetRequisitionsAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;

                let response = await RequisitionOrderListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;

                console.log('Requisiciones obtenidas:', response);

                if (status !== 200) {
                    console.error('Error:', message);
                    AlertService.Error("Oops", message);
                    return;
                }

                self.data = data || [];
                self.totalItems = counter || 0;
                self.counterData = counter || 0;

                // Contadores por estatus para las stat cards del header
                self.countPending = self.data.filter(function (r) { return r.IdRequisitionStatus === 1; }).length;
                self.countDelivered = self.data.filter(function (r) { return r.IdRequisitionStatus === 2; }).length;

                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Error obteniendo requisiciones:', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        // ========== MODAL DE DETALLE DE PARTES ==========
        function _OpenDetailModal(requisition) {
            self.selectedRequisition = requisition;
            $timeout(function () {
                $('#modalDetailRequisition').modal('show');
            });
        }

        function _SumQuantity(listapartes, field) {
            if (!listapartes || listapartes.length === 0) return 0;
            return listapartes.reduce(function (acc, part) {
                return acc + (parseFloat(part[field]) || 0);
            }, 0);
        }

        function _CountParts(requisition) {
            if (!requisition || !requisition.listapartes) return 0;
            return requisition.listapartes.length;
        }

        // ========== HELPERS VISUALES ==========
        // Estatus: 1=En Espera de Entrada, 2=Entregado
        function _GetStatusClass(idStatus) {
            switch (idStatus) {
                case 2: return 'badge-status-completed';
                case 1: return 'badge-status-pending';
                default: return 'badge-status-default';
            }
        }

        function _GetStatusIcon(idStatus) {
            switch (idStatus) {
                case 2: return 'lni lni-checkmark-circle';
                case 1: return 'lni lni-timer';
                default: return 'lni lni-question-circle';
            }
        }

        // Tipos de parte (igual que PurchaseOrder)
        function _GetTypeClass(idtipo) {
            switch (idtipo) {
                case 1: return 'type-electric';
                case 2: return 'type-hydraulic';
                case 3: return 'type-jig';
                case 4: return 'type-mechanic';
                case 5: return 'type-pneumatic';
                case 7: return 'type-mold';
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
            self.filterSearch = "";
            self.filterStatus = "";
            $timeout(function () { _Search(1); }, 100);
        }

        // ========== PAGINACIÓN ==========
        function _ChangueCurrentPage(newPage, oldPage) {
            if (newPage === oldPage) return;
            AlertService.Load();

            let params = {
                'Page': newPage,
                'ItemsPerPage': self.itemsPerPage,
                'Search': self.filterSearch,
                'Status': self.filterStatus,
            };

            _GetRequisitionsAsync(params);
            swal.close();
        }

        async function _ChangueItemsPerPage(newValue, oldValue) {
            if (newValue === oldValue) return;
            AlertService.Load();

            let params = {
                'Page': 1,
                'ItemsPerPage': self.itemsPerPage,
                'Search': self.filterSearch,
                'Status': self.filterStatus,
            };

            await _GetRequisitionsAsync(params);
            swal.close();
        }

        _Init();
    }
})();