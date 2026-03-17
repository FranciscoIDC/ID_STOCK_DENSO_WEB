(function () {
    angular
        .module('app')
        .controller('LocationListController', LocationListController);

    LocationListController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        'LocationListService',
        'AlertService',
        'ErrorService',
        'ConstService',
    ];

    function LocationListController(
        self,
        $state,
        $timeout,
        LocationListService,
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
            self.filterSearch = '';

            self.data = [];
            self.counterData = 0;
            self.totalItems = 0;

            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.currentPage = 1;
            self.displayItems = [];

            self.isSyncing = false; // sync WMS en progreso

            // Modal detalle
            self.selectedLocation = {};
        }

        function _RegisterFunctions() {
            self.Search = _Search;
            self.ClearFilters = _ClearFilters;
            self.ExistData = _ExistData;
            self.DatumToString = _DatumToString;
            self.OpenDetail = _OpenDetail;
            self.SyncFromWMS = _SyncFromWMS;
            self.GetAlmacenClass = _GetAlmacenClass;

            // VISORES DE LAS VARIABLES QUE SE USAN EN EL CONTROL DE PAGINACION
            self.$watch('currentPage', _ChangueCurrentPage);
            self.$watch('itemsPerPage', _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            await _Search(1);
            swal.close();
        }

        // ========== BÚSQUEDA LOCAL ==========
        async function _Search(newPage) {
            newPage = newPage || 1;

            AlertService.Load();
            self.currentPage = newPage;

            var params = _BuildParams(self.currentPage);

            await _GetLocationsAsync(params);

            swal.close();
        }

        // Centraliza la construcción de parámetros para evitar inconsistencias entre funciones
        function _BuildParams(page) {
            return {
                'Page': page || 1,
                'ItemsPerPage': self.itemsPerPage,
                'Search': self.filterSearch,
            };
        }

        async function _GetLocationsAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;

                var response = await LocationListService.Get(params);
                var status = response.data.Status;
                var message = response.data.Message;
                var data = response.data.Data;
                var counter = response.data.Counter;

                console.log('✅ Localizaciones obtenidas:', response);

                if (status !== 200) {
                    console.error('❌ Error:', message);
                    AlertService.Error('Oops', message);
                    return;
                }

                self.data = data || [];
                self.totalItems = counter || 0;
                self.counterData = counter || 0;

                self.$apply();
            } catch (ex) {
                var error = ErrorService.GetError(ex);
                console.error('❌ Error obteniendo localizaciones:', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        // ========== SYNC DESDE WMS ==========
        async function _SyncFromWMS() {
            var confirmed = confirm(
                '¿Sincronizar localizaciones desde WMS?\n\n' +
                'Esta operación descarga todas las localizaciones de todos\n' +
                'los almacenes (~21,000 registros). Puede tardar varios minutos.\n\n' +
                '¿Deseas continuar?'
            );

            if (!confirmed) return;

            $timeout(function () { self.isSyncing = true; });
            AlertService.Load();

            try {
                var params = {
                    'Page': 1,
                    'ItemsPerPage': self.itemsPerPage,
                    'Search': '',
                };

                var response = await LocationListService.Sync(params);
                var status = response.data.Status;
                var message = response.data.Message;
                var data = response.data.Data;
                var counter = response.data.Counter;

                swal.close();

                if (status !== 200) {
                    AlertService.Error('Error en sincronización', message);
                    $timeout(function () { self.isSyncing = false; });
                    return;
                }

                $timeout(function () {
                    self.data = data || [];
                    self.totalItems = counter || 0;
                    self.counterData = counter || 0;
                    self.currentPage = 1;
                    self.isSyncing = false;
                });

                AlertService.Success('¡Sincronización completa!',
                    'Se sincronizaron ' + counter + ' localizaciones correctamente.');

            } catch (ex) {
                var error = ErrorService.GetError(ex);
                console.error('❌ Error en sync:', error);
                swal.close();
                AlertService.ErrorHtml('Error en sincronización', error);
                $timeout(function () { self.isSyncing = false; });
            }
        }

        // ========== MODAL DETALLE ==========
        function _OpenDetail(location) {
            self.selectedLocation = location;
            $timeout(function () {
                $('#modalLocationDetail').modal('show');
            });
        }

        // ========== HELPERS ==========
        function _ExistData() {
            return self.data && self.data.length > 0;
        }

        function _DatumToString(datum) {
            return datum ? datum : '--';
        }

        function _ClearFilters() {
            console.log('🧹 Limpiando filtros');

            self.filterSearch = '';

            $timeout(function () {
                _Search(1);
            }, 100);
        }

        // Badge de color por almacén (primera letra del código de localización)
        function _GetAlmacenClass(localizacion) {
            if (!localizacion) return 'badge-loc-default';
            var prefix = localizacion.substring(0, 1).toUpperCase();
            switch (prefix) {
                case 'A': return 'badge-loc-a';
                case 'B': return 'badge-loc-b';
                case 'C': return 'badge-loc-c';
                default: return 'badge-loc-default';
            }
        }

        // ========== PAGINACIÓN ==========
        function _ChangueCurrentPage(newPage, oldPage) {
            if (newPage === oldPage) return;

            console.log("📄 Cambiando a página:", newPage);
            AlertService.Load();

            var params = _BuildParams(newPage);

            _GetLocationsAsync(params);
            swal.close();
        }

        async function _ChangueItemsPerPage(newValue, oldValue) {
            if (newValue === oldValue) return;

            console.log("📊 Items por página:", newValue);
            AlertService.Load();

            var params = _BuildParams(1); // Reiniciar a primera página

            await _GetLocationsAsync(params);
            swal.close();
        }

        _Init();
    }
})();