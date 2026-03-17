(function () {
    angular
        .module('app')
        .controller('ProductListController', ProductListController);

    ProductListController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        'ProductListService',
        'AlertService',
        'ErrorService',
        'ConstService',
    ];

    function ProductListController(
        self,
        $state,
        $timeout,
        ProductListService,
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

            self.data = [];
            self.counterData = 0;
            self.totalItems = 0;

            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.currentPage = 1;
            self.displayItems = [];

            self.isLoadingFull = false; // carga masiva en progreso

            // Modal de imagen
            self.selectedProduct = {};

            // Catálogo de tipos para badge de color
            self.typeLabels = {
                1: 'Electric / Electronic',
                2: 'Hydraulic',
                3: 'Jig / Accessory',
                4: 'Mechanic',
                5: 'Pneumatic / Gas',
                7: 'Mold / Die Component',
            };
        }

        function _RegisterFunctions() {
            self.Search = _Search;
            self.ClearFilters = _ClearFilters;
            self.ExistData = _ExistData;
            self.DatumToString = _DatumToString;
            self.GetTypeClass = _GetTypeClass;
            self.GetProductImage = _GetProductImage;
            self.OpenImageModal = _OpenImageModal;
            self.LoadFullCatalog = _LoadFullCatalog;

            // VISORES DE LAS VARIABLES QUE SE USAN EN EL CONTROL DE PAGINACION
            self.$watch("currentPage", _ChangueCurrentPage);
            self.$watch("itemsPerPage", _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            await _Search();
            swal.close();
        }

        // ========== BÚSQUEDA NORMAL ==========
        async function _Search(newPage) {
            newPage = !newPage ? 1 : newPage;

            AlertService.Load();
            self.currentPage = newPage;

            let params = _BuildParams(self.currentPage);

            await _GetProductsAsync(params);

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

        async function _GetProductsAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;

                let response = await ProductListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;

                console.log('✅ Productos obtenidos:', response);

                if (status !== 200) {
                    console.error('❌ Error:', message);
                    AlertService.Error("Oops", message);
                    return;
                }

                self.data = data || [];
                self.totalItems = counter || 0;
                self.counterData = counter || 0;

                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('❌ Error obteniendo productos:', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        // ========== CARGA MASIVA (GetFull) ==========
        async function _LoadFullCatalog() {
            var confirmed = confirm(
                '¿Iniciar carga masiva?\n\n' +
                'Esta operación sincroniza todos los productos desde SpareParts.\n' +
                'Puede tardar varios minutos.\n\n' +
                '¿Deseas continuar?'
            );

            if (!confirmed) return;

            $timeout(function () {
                self.isLoadingFull = true;
            });

            AlertService.Load();

            try {
                var params = {
                    'Page': 1,
                    'ItemsPerPage': self.itemsPerPage,
                    'Search': '',
                };

                var response = await ProductListService.LoadFull(params);
                var status = response.data.Status;
                var message = response.data.Message;
                var data = response.data.Data;
                var counter = response.data.Counter;

                swal.close();

                if (status !== 200) {
                    AlertService.Error('Error en carga masiva', message);
                    $timeout(function () { self.isLoadingFull = false; });
                    return;
                }

                $timeout(function () {
                    self.data = data || [];
                    self.totalItems = counter || 0;
                    self.counterData = counter || 0;
                    self.currentPage = 1;
                    self.isLoadingFull = false;
                });

                AlertService.Success('¡Listo!', 'Se sincronizaron ' + counter + ' productos.');

            } catch (ex) {
                var error = ErrorService.GetError(ex);
                console.error('❌ Error en carga masiva:', error);
                swal.close();
                AlertService.ErrorHtml('Error en carga masiva', error);
                $timeout(function () { self.isLoadingFull = false; });
            }
        }

        // ========== MODAL IMAGEN ==========
        function _OpenImageModal(product) {
            self.selectedProduct = product;
            $timeout(function () {
                $('#modalProductImage').modal('show');
            });
        }

        // ========== HELPERS ==========
        function _GetProductImage(imageUrl) {
            if (!imageUrl) return '/images/imageNotFound.png';
            return imageUrl;
        }

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

        function _ExistData() {
            return self.data && self.data.length > 0;
        }

        function _DatumToString(datum) {
            return datum ? datum : '--';
        }

        function _ClearFilters() {
            console.log('🧹 Limpiando filtros');

            self.filterSearch = "";

            $timeout(function () {
                _Search(1);
            }, 100);
        }

        // ========== PAGINACIÓN ==========
        function _ChangueCurrentPage(newPage, oldPage) {
            if (newPage === oldPage) return;

            console.log("📄 Cambiando a página:", newPage);
            AlertService.Load();

            let params = _BuildParams(newPage);

            _GetProductsAsync(params);
            swal.close();
        }

        async function _ChangueItemsPerPage(newValue, oldValue) {
            if (newValue === oldValue) return;

            console.log("📊 Items por página:", newValue);
            AlertService.Load();

            let params = _BuildParams(1); // Reiniciar a primera página

            await _GetProductsAsync(params);
            swal.close();
        }

        _Init();
    }
})();