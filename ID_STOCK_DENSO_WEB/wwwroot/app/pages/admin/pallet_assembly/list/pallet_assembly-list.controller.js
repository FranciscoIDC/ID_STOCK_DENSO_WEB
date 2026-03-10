(function () {
    angular
        .module('app')
        .controller('PalletAssemblyListController', PalletAssemblyListController);

    PalletAssemblyListController.$inject = [
        '$scope',
        '$state',
        'PalletAssemblyListService',
        'AlertService',
        'ErrorService',
        'ConstService',
        'GeneralInfo',
        'UrlService'
    ];

    function PalletAssemblyListController(
        self,
        $state,
        PalletAssemblyListService,
        AlertService,
        ErrorService,
        ConstService,
        GeneralInfo,
        UrlService
    ) {
        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _FunctionsInit();
        }

        function _InitValues() {
            self.model = {};

            self.model = new PalletAssemblyDtoGet();
            self.filterSearch = "";

            self.data = [];

            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.totalItems = 0;
            self.counterData = 0;

            self.currentPage = 1;

            self.displayItems = [];

            self.itemsSelected = new Map();
            self.counterItemsSelected = 0;

            self.selectedPageAssets = false;

            self.printLabelsButtonIsVisible = false;

            //INDICA SI LOS ACTIVOS DE TODAS LAS PAGINAS ESTAN SELECCIONADOS YA SEA LOGICAMENTE
            self.flagOfAllSelectedAssets = false;
            //INDICA SI LA ALERTA PARA SELECCIONAR TODOS LOS ACTIVOS DE TODAS LAS PAGINAS ESTA VISIBLE
            self.alertSelectAllIsVisible = false;
            //INDICA SI LA ALERTA PARA ANULAR SELECCION DE TODOS LOS ACTIVOS DE TODAS LAS PAGINAS ESTA VISIBLE
            self.alertDeselectAllIsVisible = false;
        }

        function _RegisterFunctions() {
            self.Search = _Search;

            self.GoDetail = _GoDetail;
            self.DatumToString = _DatumToString;
            self.ExistData = _ExistData;

            self.ClearFilters = _ClearFilters;

            //Get excel
            self.GetExcel = _GetExcel;

            //VISORES DE LAS VARIABLES QUE SE USAN EL EN CONTROL DE PAGINACION
            self.$watch("currentPage", _ChangueCurrentPage);
            self.$watch("itemsPerPage", _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            await _GetAssetsOnResume();
            swal.close();
        }

        async function _GetAssetsOnResume() {

            let filters = JSON.parse(localStorage.getItem(ConstService.palletAssemblyListFilters));
            if (!filters) return;
            self.startDate = new Date(filters.DateStart);
            self.endDate = new Date(filters.DateEnd);

            self.$apply();
            //await _GetCategoryAsync();

            let params = BuildParamsToGetPalletAssembly(self.currentPage, self.itemsPerPage, self.startDate, self.endDate);
            await _GetPalletAssemblyAsync(params)
        }

        async function _Search() {
            if (!self.startDate || !self.endDate) {
                AlertService.Error("Los filtros son requeridos.");
                return;
            }

            AlertService.Load();

            self.currentPage = 1;

            let params = BuildParamsToGetPalletAssembly(self.currentPage, self.itemsPerPage, self.startDate, self.endDate);
            await _GetPalletAssemblyAsync(params);
            swal.close();
        }

        async function _GetPalletAssemblyAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;

                let response = await PalletAssemblyListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                self.data = data;
                self.totalItems = counter;
                self.counterData = counter;
                //self.setPage(1);
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        //Apartado para Excel
        async function _GetExcel() {
            if (!self.data || self.data.length == 0) {
                AlertService.Error("No hay elementos para descargar.");
                return;
            }


            if (!self.startDate || !self.endDate) {
                AlertService.Error("Los filtros son requeridos.");
                return;
            }
            AlertService.Load();
            self.currentPage = 1;
            var dt1 = GeneralInfo.formatDate(self.startDate);
            var dt2 = GeneralInfo.formatDate(self.endDate);
            let params = ('Page=' + 0 + '&ItemsPerPage=' + 0
                + '&dtStart=' + dt1 + '&dtEnd=' + dt2);

            await _Get_toExcel(params);
        }

        async function _Get_toExcel(params) {
            try {

                let request = new XMLHttpRequest();
                request.responseType = "blob";
                request.open("GET", UrlService.getPalletAssembly + '/Excel?' + params);
                //request.onloadstart = function () { generalInfo.LoadSpiner(); };
                request.onload = function () {
                    swal.close();
                    let url = window.URL.createObjectURL(this.response);
                    let a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = url;
                    let hoy = new Date();
                    let cadenaFecha = hoy.toLocaleDateString(); // "14/6/2020"
                    a.download = this.response.name || "Inventario_de_Activos_" + cadenaFecha;
                    a.click();
                }
                request.send();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        function BuildParamsToGetPalletAssembly(page, itemsPerPage, dtStart, dtEnd) {
            var dt1 = GeneralInfo.formatDate(dtStart);
            var dt2 = GeneralInfo.formatDate(dtEnd);

            self.model = new PalletAssemblyDtoGet(); _ChangueItemsPerPage
            self.model.Page = page;
            self.model.ItemsPerPage = +itemsPerPage;
            self.model.DtStart = dt1;
            self.model.DtEnd = dt2;

            return self.model;
        }


        function _ExistData() {
            if (!self.data || self.data.length === 0)
                return false;
            else
                return true;
        }

        function _GoDetail(id, addsId) {
            $state.go("pallet_assembly.detail", { "id": id });
        }

        function _DatumToString(datum) {
            return datum ? datum : "--";
        }

        function _ChangueCurrentPage(newPage, oldPage) {
            if (newPage === oldPage) {
                return;
            }

            console.log("La pagina actual es: " + newPage);
            AlertService.Load();
            let params = BuildParamsToGetPalletAssembly(self.currentPage, self.itemsPerPage, self.startDate, self.endDate);
            _GetPalletAssemblyAsync(params);
            swal.close();
        }

        function _ClearFilters() {
            localStorage.removeItem(ConstService.assetListFilters);
            //self.categoryId = "";
        }

        async function _ChangueItemsPerPage() {

            //self.categoryId = self.categoryId ? self.categoryId : "";
            AlertService.Load();
            //localStorage.setItem(ConstService.palletAssemblyListFilters, JSON.stringify(filters))
            self.currentPage = 1;
            let params = BuildParamsToGetPalletAssembly(self.currentPage, self.itemsPerPage, self.startDate, self.endDate);
            await _GetPalletAssemblyAsync(params);
            swal.close();
        }

        //EVENTOS


        //-----------FUNCIONES PARA SELECCIONAR O ANULAR SELECCION DE TODOS LOS ELEMENTOS

        function _SelectAllAssets() {

            self.selectedPageAssets = true;

            //VARIABLE NUEVA PARA SABER SI SE SELECCIONARON LOGICAMENTE TODOS LOS ASSETS
            self.flagOfAllSelectedAssets = true;
        }

        function _UnSelectAllAssets() {
            self.selectedPageAssets = false;

            //VARIABLE NUEVA PARA SABER SI SE SELECCIONARON LOGICAMENTE TODOS LOS ASSETS
            self.flagOfAllSelectedAssets = false;

            self.itemsSelected = new Map();
            self.counterItemsSelected = 0;
        }

        //-----------FUNCIONES QUE MUESTRAN U OCULTAN LAS ALERTAS

        function _ShowAlertSelectedAll() {
            if (!self.data || self.data?.length <= 0) return false;
            if (self.filterSearch) return false;

            let totalRecords = self.counterData;
            let totalRecordsOfTheCurrentPage = self.data?.length ?? 0;
            let counterItemsSelected = _CountSelectedItems();
            let itemsPerPage = self.itemsPerPage;
            let allSelectedAssets = self.flagOfAllSelectedAssets;
            let numberOfAssetsSelectedFromAllPages = self.itemsSelected.size;

            let currentPageFullySelected = totalRecordsOfTheCurrentPage === counterItemsSelected;
            let pages = Math.ceil(totalRecords / itemsPerPage);

            if (pages === 1) {
                let contionSelectedAssets = totalRecords === numberOfAssetsSelectedFromAllPages;
                if (contionSelectedAssets) {
                    self.flagOfAllSelectedAssets = true;
                    self.alertSelectAllIsVisible = false;
                    return false;
                }
                return false;
            }
            if (counterItemsSelected <= 0) return false;

            let contionSelectedAssets = totalRecords === numberOfAssetsSelectedFromAllPages;
            if (contionSelectedAssets) {
                self.flagOfAllSelectedAssets = true;
                self.alertSelectAllIsVisible = false;
                return false;
            }

            let conditionToShow = currentPageFullySelected && !allSelectedAssets && !self.alertDeselectAllIsVisible;
            self.alertSelectAllIsVisible = conditionToShow;

            return conditionToShow;
        }

        function _ShowAlertUnSelectedAll() {
            if (!self.data || self.data?.length <= 0) return false;
            if (self.filterSearch) return false;

            let totalRecords = self.counterData;
            let totalRecordsOfTheCurrentPage = self.data?.length ?? 0;
            let counterItemsSelected = _CountSelectedItems();
            let itemsPerPage = self.itemsPerPage;
            let allSelectedAssets = self.flagOfAllSelectedAssets;
            let numberOfAssetsSelectedFromAllPages = self.itemsSelected.size;

            let currentPageFullySelected = totalRecordsOfTheCurrentPage === counterItemsSelected;
            let pages = Math.ceil(totalRecords / itemsPerPage);

            if (pages === 1) {
                let contionSelectedAssets = totalRecords === numberOfAssetsSelectedFromAllPages;
                if (contionSelectedAssets) {
                    self.flagOfAllSelectedAssets = true;
                    self.alertDeselectAllIsVisible = false;
                    return false;
                }
                return false;
            }
            if (counterItemsSelected <= 0) return false;

            let contionSelectedAssets = totalRecords === numberOfAssetsSelectedFromAllPages;
            if (contionSelectedAssets) {
                self.flagOfAllSelectedAssets = true;
                self.alertDeselectAllIsVisible = true;
                return true;
            }


            let conditionToShow = currentPageFullySelected && allSelectedAssets && !self.alertSelectAllIsVisible;
            self.alertDeselectAllIsVisible = conditionToShow;

            return conditionToShow;
        }

        //FUNCION PARA SELECCIONAR UN ELEMENTO
        function _Toggle(item) {
            let keyAsset = item?.Id;
            let condition = self.itemsSelected.has(keyAsset);
            if (condition) {
                _DeleteValueInItemsSelected(keyAsset);

                let allSelectedAssets = self.flagOfAllSelectedAssets;

                if (allSelectedAssets) {
                    self.flagOfAllSelectedAssets = false;
                }

            } else {
                _AddValueInItemsSelected(keyAsset, item);

                let allSelectedAssets = self.flagOfAllSelectedAssets;

                if (allSelectedAssets) {
                    self.flagOfAllSelectedAssets = false;
                }
            }
            self.counterItemsSelected = _CountSelectedItems();

            console.log("Toggle - Todos los activos seleccionados: ", self.flagOfAllSelectedAssets)
        };

        //FUNCION QUE VERIFICA SI EL ELEMENTO EXISTE EN EL MAP Y LO CHECKEA O DESCHECKEA
        function _Exists(item) {
            let keyAsset = item?.Id;
            return self.itemsSelected.has(keyAsset);
        };

        //FUNCION PARA EL CHECK GLOBAL ESTE COLOCA UNA LINEA HORIZONTAL EN EL CENTRO DEL CHECK
        function _IsIndeterminate() {
            self.counterItemsSelected = _CountSelectedItems();
            let sizeItemsSelected = self.counterItemsSelected;
            //REVISAR
            let sizeData = self.data?.length;
            return (sizeItemsSelected !== 0 && sizeItemsSelected !== sizeData);
        };
        //FUNCION PARA VERIFICAR QUE LOS ELEMENTOS DE LA PAGINA ESTEN SELECCIONADOS Y MARCAR EL CHECK GLOBAL
        function _IsChecked() {
            self.counterItemsSelected = _CountSelectedItems();
            let sizeItemsSelected = self.counterItemsSelected;
            //REVISAR
            let sizeData = self.data?.length;
            if (!sizeData || sizeData <= 0) {
                self.selectedPageAssets = false;
                return false;
            }

            let condition = sizeItemsSelected === self.data?.length;
            self.selectedPageAssets = condition;

            self.printLabelsButtonIsVisible = sizeItemsSelected > 0 && !self.filterSearch;

            return condition;
        };

        //FUNCION PARA MARCAR TODOS LOS ELEMENTOS DE LA PAGINA
        function _ToggleAll() {
            self.counterItemsSelected = _CountSelectedItems();
            let sizeItemsSelected = self.counterItemsSelected;

            let sizeData = self.data?.length;
            if (!sizeData || sizeData <= 0) return;

            if (sizeItemsSelected === sizeData) {
                let data = self.data;
                data.forEach((item) => {
                    let keyAsset = item?.Id;
                    _DeleteValueInItemsSelected(keyAsset);
                });
                let allSelectedAssets = self.flagOfAllSelectedAssets;

                if (allSelectedAssets) {
                    self.flagOfAllSelectedAssets = false;
                }
            } else if (sizeItemsSelected === 0 || sizeItemsSelected > 0) {

                let data = self.data;
                data.forEach((item) => {
                    let keyAsset = item?.Id;
                    _AddValueInItemsSelected(keyAsset, item);
                });
                let allSelectedAssets = self.flagOfAllSelectedAssets;

                if (allSelectedAssets) {
                    self.flagOfAllSelectedAssets = false;
                }
            }
            self.counterItemsSelected = _CountSelectedItems();
        }

        async function _ChangueItemsPerPage() {

            await _Search(1);

        }

        //CUENTA EL NUMERO DE ELEMENTOS SELECCIONADOS DE LA PAGINA ACTUAL
        function _CountSelectedItems() {

            let counter = 0;
            let data = self.data;

            if (!data || data?.length <= 0) return 0;

            let dataSize = data.length;

            for (let index = 0; index < dataSize; index++) {

                let value = data[index];

                let isSelected = self.itemsSelected.has(value?.Id);
                if (isSelected) counter++;
            }

            return counter;
        }

        function ReturnZeroifnull(id) {
            if (!id || id === '' || id === "") {
                return 0
            }
            return +id
        }

        _Init();
    };

})();
