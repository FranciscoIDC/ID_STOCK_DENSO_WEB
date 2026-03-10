(function () {
    angular
        .module('app')
        .controller('WarehouseListController', WarehouseListController);

    WarehouseListController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        'WarehouseListService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];

    function WarehouseListController(
        self,
        $state,
        $timeout,
        WarehouseListService,
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

            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.totalItems = 0;
            self.counterData = 0;

            self.currentPage = 1;

            self.displayItems = [];

            // Estado de carga
            self.isLoading = false;
        }

        function _RegisterFunctions() {
            self.Search = _Search;
            self.GoEdit = _GoEdit;
            self.DatumToString = _DatumToString;
            self.ExistData = _ExistData;
            self.ClearFilters = _ClearFilters;
            self.Remove = _RemoveAsync;

            // Watchers de paginación
            self.$watch("currentPage", _ChangueCurrentPage);
            self.$watch("itemsPerPage", _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            await _Search();
            swal.close();
        }

        async function _Search(newPage) {
            newPage = !newPage ? 1 : newPage;

            self.isLoading = true;
            AlertService.Load();

            self.currentPage = newPage;

            let params = {
                'Page': self.currentPage,
                'ItemsPerPage': self.itemsPerPage,
                'Search': self.filterSearch
            };

            await _GetWarehouseAsync(params);

            self.isLoading = false;
            swal.close();
        }

        async function _GetWarehouseAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;

                let response = await WarehouseListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;

                console.log('✅ Almacenes obtenidos:', response);

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
                console.error('❌ Error obteniendo almacenes:', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        async function _RemoveAsync(id) {
            try {
                const result = await swal({
                    title: "¿Estás seguro?",
                    text: "Esta acción no se puede deshacer",
                    icon: "warning",
                    buttons: {
                        cancel: {
                            text: "Cancelar",
                            value: null,
                            visible: true,
                            className: "btn-secondary",
                            closeModal: true,
                        },
                        confirm: {
                            text: "Sí, eliminar",
                            value: true,
                            visible: true,
                            className: "btn-danger",
                            closeModal: true
                        }
                    },
                    dangerMode: true,
                });

                if (!result) return;

                AlertService.Load();

                let response = await WarehouseListService.Delete(id);
                const { Status: status, Message: message } = response.data;

                console.log('🗑️ Eliminación:', response);

                if (status !== 200) {
                    console.error('❌ Error:', message);
                    AlertService.Error("Oops", message);
                    return;
                }

                AlertService.Success("¡Listo!", message);
                await _Search(self.currentPage);

            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('❌ Error eliminando almacén:', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        function _ExistData() {
            return self.data && self.data.length > 0;
        }

        function _GoEdit(id) {
            $state.go("warehouse.edit", { "id": id });
        }

        function _DatumToString(datum) {
            return datum ? datum : "--";
        }

        function _ClearFilters() {
            console.log('🧹 Limpiando filtros');
            self.filterSearch = "";
            $timeout(function () {
                _Search(1);
            }, 100);
        }

        function _ChangueCurrentPage(newPage, oldPage) {
            if (newPage === oldPage) return;

            console.log("📄 Cambiando a página:", newPage);
            AlertService.Load();

            let params = {
                'Page': newPage,
                'ItemsPerPage': self.itemsPerPage,
                'Search': self.filterSearch
            };

            _GetWarehouseAsync(params);
            swal.close();
        }

        async function _ChangueItemsPerPage(newValue, oldValue) {
            if (newValue === oldValue) return;

            console.log("📊 Items por página:", newValue);
            AlertService.Load();

            let params = {
                'Page': 1,
                'ItemsPerPage': self.itemsPerPage,
                'Search': self.filterSearch
            };

            await _GetWarehouseAsync(params);
            swal.close();
        }

        _Init();
    }
})();