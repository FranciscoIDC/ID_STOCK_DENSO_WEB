(function () {
    angular
        .module('app')
        .controller('InboundReportController', InboundReportController);

    InboundReportController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        'InboundReportService',
        'AlertService',
        'ErrorService',
        'ConstService',
        'GeneralInfo',
    ];

    function InboundReportController(
        self,
        $state,
        $timeout,
        InboundReportService,
        AlertService,
        ErrorService,
        ConstService,
        GeneralInfo
    ) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _FunctionsInit();
        }

        function _InitValues() {
            self.model = {};

            self.filterSearch = "";
            self.filterDtStart = "";
            self.filterDtEnd = "";

            self.data = [];
            self.counterData = 0;
            self.totalItems = 0;

            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.currentPage = 1;
            self.displayItems = [];

            // Modal de detalle de partes
            self.selectedOrder = {};

        }

        function _RegisterFunctions() {
            self.Search = _Search;
            self.ClearFilters = _ClearFilters;
            self.ExistData = _ExistData;
            self.DatumToString = _DatumToString;
            self.FormatDate = _FormatDate;
            self.FormatDateTime = _FormatDateTime;

            // Semáforo de pasos
            self.GetPasoClass = _GetPasoClass;
            self.GetPasoLabel = _GetPasoLabel;
            self.GetStepClass = _GetStepClass;

            // Modal
            self.OpenDetailModal = _OpenDetailModal;
            self.SumQuantity = _SumQuantity;
            self.CountParts = _CountParts;

            // CSV
            self.GetCSV = _GetCSV;

            self.$watch("currentPage", _ChangueCurrentPage);
            self.$watch("itemsPerPage", _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            // No cargamos datos al abrir; el usuario debe aplicar filtros
            swal.close();
        }

        // ========== BÚSQUEDA PRINCIPAL ==========
        async function _Search(newPage) {
            newPage = !newPage ? 1 : newPage;

            self.currentPage = newPage;
            AlertService.Load();

            let params = _BuildParams(self.currentPage, self.itemsPerPage);
            await _GetInboundAsync(params);

            swal.close();
        }

        function _BuildParams(page, itemsPerPage) {
            return {
                Page: page,
                ItemsPerPage: +itemsPerPage,
                Search: self.filterSearch,
                DtStart: self.filterDtStart || null,
                DtEnd: self.filterDtEnd || null,
            };
        }

        async function _GetInboundAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;

                let response = await InboundReportService.Get(params);
                const {
                    Status: status,
                    Message: message,
                    Data: data,
                    Counter: counter
                } = response.data;

                console.log('📦 InboundReport response:', response);

                if (status !== 200) {
                    console.error('❌ Error:', message);
                    AlertService.Error("Oops", message);
                    return;
                }

                // listapartes ya viene ensamblada dentro de cada row por el backend (GroupBy en C#)
                let rows = data || [];

                self.data = rows;
                self.totalItems = counter || 0;
                self.counterData = counter || 0;

                // Contadores para las stat cards del header
                self.countPaso1 = rows.filter(function (r) { return r.PasoActual === 1; }).length;
                self.countPaso2 = rows.filter(function (r) { return r.PasoActual === 2; }).length;
                self.countPaso3 = rows.filter(function (r) { return r.PasoActual === 3; }).length;

                self.$apply();

            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('❌ Oops:', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        // ========== MODAL DE DETALLE DE PARTES ==========
        function _OpenDetailModal(order) {
            self.selectedOrder = order;
            $timeout(function () {
                $('#modalDetailInbound').modal('show');
            });
        }

        function _CountParts(order) {
            return order && order.listapartes ? order.listapartes.length : 0;
        }

        function _SumQuantity(lista, field) {
            if (!lista || lista.length === 0) return 0;
            return lista.reduce(function (acc, p) {
                return acc + (parseFloat(p[field]) || 0);
            }, 0);
        }

        // ========== SEMÁFORO DE PASOS ==========
        // PasoActual: 0=sin mov, 1=recibido, 2=alm.temporal, 3=capturado
        function _GetPasoClass(paso) {
            switch (paso) {
                case 3: return 'badge-status-completed';
                case 2: return 'badge-status-in-progress';
                case 1: return 'badge-status-pending';
                default: return 'badge-status-default';
            }
        }

        function _GetPasoLabel(paso) {
            switch (paso) {
                case 3: return 'Capturado';
                case 2: return 'Alm. Temporal';
                case 1: return 'Recibido';
                default: return 'Sin movimiento';
            }
        }

        // Clase para cada paso individual en la timeline
        // stepIndex: 1=PickUp, 2=TempStorage, 3=Capture
        function _GetStepClass(pasoActual, stepIndex) {
            if (pasoActual >= stepIndex) return 'timeline-step-done';
            if (pasoActual === stepIndex - 1) return 'timeline-step-active';
            return 'timeline-step-pending';
        }

        // ========== EXPORTAR CSV ==========
        function _GetCSV() {
            if (!self.data || self.data.length === 0) {
                AlertService.Error("No hay datos para exportar.");
                return;
            }

            // Cabecera del CSV (formato plano: una fila por parte por PO)
            let headers = [
                '# Orden', 'Solicitud', 'Proveedor',
                'F. Registro', 'F. Recepción',
                'Recepción - Ubicación', 'Recepción - Usuario', 'Recepción - Fecha',
                'Alm. Temporal - Ubicación', 'Alm. Temporal - Usuario', 'Alm. Temporal - Fecha',
                'Captura - Ubicación', 'Captura - Usuario', 'Captura - Fecha',
                'Paso Actual',
                'Línea', 'No. Parte', 'No. Denso', 'Denso N', 'Descripción',
                'Tipo', 'Cant. Solicitada', 'Cant. Recibida'
            ];

            let csvRows = [headers.join(',')];

            self.data.forEach(function (row) {
                let partes = row.listapartes || [];

                if (partes.length === 0) {
                    // PO sin detalle de partes registrado
                    csvRows.push(_BuildCsvRow(row, null));
                } else {
                    partes.forEach(function (part) {
                        csvRows.push(_BuildCsvRow(row, part));
                    });
                }
            });

            let csvContent = csvRows.join('\n');
            let blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.href = url;
            let fecha = new Date().toLocaleDateString('es-MX').replace(/\//g, '-');
            a.download = 'Reporte_Entradas_' + fecha + '.csv';
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }

        function _BuildCsvRow(row, part) {
            let esc = function (v) {
                if (v === null || v === undefined) return '';
                let s = String(v).replace(/"/g, '""');
                return s.indexOf(',') >= 0 || s.indexOf('"') >= 0 ? '"' + s + '"' : s;
            };

            let cols = [
                esc(row.IdPurchaseOrder),
                esc(row.IdRequest),
                esc(row.SupplierName),
                esc(_FormatDate(row.RegistrationDate)),
                esc(_FormatDate(row.ReceptionDate)),
                esc(row.PickUpTracking),
                esc(row.PickUpUser),
                esc(_FormatDateTime(row.PickUpDateTime)),
                esc(row.TempStorageTracking),
                esc(row.TempStorageUser),
                esc(_FormatDateTime(row.TempStorageDateTime)),
                esc(row.CaptureTracking),
                esc(row.CaptureUser),
                esc(_FormatDateTime(row.CaptureDateTime)),
                esc(_GetPasoLabel(row.PasoActual)),
            ];

            if (part) {
                cols = cols.concat([
                    esc(part.Linea),
                    esc(part.NoParte),
                    esc(part.NoDenso),
                    esc(part.NoDensoN),
                    esc(part.Descripcion),
                    esc(part.DescripcionTipo),
                    esc(part.CantidadSolicitada),
                    esc(part.CantidadRecibida),
                ]);
            } else {
                cols = cols.concat(['', '', '', '', '', '', '', '']);
            }

            return cols.join(',');
        }

        // ========== HELPERS ==========
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

        function _ExistData() {
            return self.data && self.data.length > 0;
        }

        function _DatumToString(datum) {
            return datum ? datum : '--';
        }

        function _ClearFilters() {
            self.filterSearch = "";
            self.filterDtStart = "";
            self.filterDtEnd = "";
            self.data = [];
            self.totalItems = 0;
            self.counterData = 0;
        }

        // ========== PAGINACIÓN ==========
        function _ChangueCurrentPage(newPage, oldPage) {
            if (newPage === oldPage) return;
            AlertService.Load();
            let params = _BuildParams(newPage, self.itemsPerPage);
            _GetInboundAsync(params);
            swal.close();
        }

        async function _ChangueItemsPerPage(newValue, oldValue) {
            if (newValue === oldValue) return;
            AlertService.Load();
            let params = _BuildParams(1, self.itemsPerPage);
            await _GetInboundAsync(params);
            swal.close();
        }

        _Init();
    }
})();