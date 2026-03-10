(function () {
    angular
        .module('app')
        .controller('StockReportController', StockReportController);

    StockReportController.$inject = [
        '$scope',
        '$state',
        'StockReportService',
        'AlertService',
        'ErrorService',
        'ConstService',
        'GeneralInfo',
        'UrlService'
    ];

    function StockReportController(
        self,
        $state,
        StockReportService,
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
            //filtros

            self.stockId = "";
            self.stocks = [];


            self.ProcessedBy = "";
            self.ProcessedBy_List = [];

            self.filterSearch = "";

            //data
            self.data = [];
            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.totalItems = 0;
            self.counterData = 0;
            self.currentPage = 1;
            self.displayItems = [];

            self.itemsSelected = new Map();
            self.counterItemsSelected = 0;

            self.selectedPage = false;
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

            self.DatumToString = _DatumToString;
            self.ExistData = _ExistData;

            self.ClearFilters = _ClearFilters;

            self.SelectAllAssets = _SelectAllAssets;
            self.UnSelectAllAssets = _UnSelectAllAssets;

            self.ShowAlertSelectedAll = _ShowAlertSelectedAll;
            self.ShowAlertUnSelectedAll = _ShowAlertUnSelectedAll;

            self.GetCssClass_Days = _GetCssClass_Days;

            //COSAS IN CHANGE
            self.ProcessedByChange = _ProcessedByChange;

            //REGISTRO DE EVENTOS
            self.Toggle = _Toggle;
            self.Exists = _Exists;
            self.IsIndeterminate = _IsIndeterminate;
            self.IsChecked = _IsChecked;
            self.ToggleAll = _ToggleAll;

            //Boton de Excel
            //Funciones de descarga
            self.GetExcel = _GetExcel;

            //VISORES DE LAS VARIABLES QUE SE USAN EL EN CONTROL DE PAGINACION
            self.$watch("currentPage", _ChangueCurrentPage);
            self.$watch("itemsPerPage", _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            let params = { 'page': self.currentPage, 'itemsPerPage': self.itemsPerPage }
            _GetStockAsync(params);
            swal.close();
        }
        async function _ProcessedByChange(id) {
            self.ProcessedBy = id;
        }


        function _GetCssClass_Days(e, item) {
            const expr = item.Color.toUpperCase();
            switch (expr) {
                case 'YELLOW':
                    return 'status-btn warning-btn';
                case 'ORANGE':
                    return 'status-btn orange-btn';
                case 'RED':
                    return 'status-btn danger-btn';
                case 'GREEN':
                    return 'status-btn info-btn';
                default:
                    return 'status-btn active-btn';
            }

        };
        //Boton de Excel
        //Funciones de descarga
        async function _GetExcel() {
            if (!self.data || self.data.length == 0) {
                AlertService.Error("No hay elementos para descargar.");
                return;
            } 
            AlertService.Load();
            let params = ('Page=' + 0 + '&ItemsPerPage=' + 0);
            await _Get_toExcel(params);
        }

        async function _Get_toExcel(params) {
            try {
                let request = new XMLHttpRequest();
                request.responseType = "blob";
                request.open("GET", UrlService.getStock + '/Excel?' + params);
                //request.onloadstart = function () { generalInfo.LoadSpiner(); };
                request.onload = function () {
                    swal.close();
                    let url = window.URL.createObjectURL(this.response);
                    let a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = url;
                    let hoy = new Date();
                    let cadenaFecha = hoy.toLocaleDateString(); // "14/6/2020"
                    a.download = this.response.name || "Stock" + cadenaFecha;
                    a.click();
                }
                request.send();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        async function _GetOnResume() {
            let filters = JSON.parse(localStorage.getItem(ConstService.StockRegisterListFilters));
            if (!filters) return;
            await _Search(1);

            _GetStockAsync(params)
        }

        async function _Search(newPage) {
            newPage = !newPage ? 1 : newPage;
            AlertService.Load();
            self.currentPage = newPage;
            let params = {
                'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage
            }
            await _GetStockAsync(params);
            swal.close();
        }

        async function _GetStockAsync(params) {
            try {
                self.data = [];
                self.counterData = 0;
                let response = await StockReportService.Get(params);
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
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }


        function _ExistData() {
            if (!self.data || self.data.length === 0)
                return false;
            else
                return true;
        }
        function _DatumToString(datum) {
            return datum ? datum : "--";
        }
        async function _ChangueCurrentPage(newPage, oldPage) {
            if (newPage === oldPage) {
                return;
            }

            await _Search(newPage);
        }

        function _ClearFilters() {
            localStorage.removeItem(ConstService.StockRegisterListFilters);
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

        //FUNCTIONES PARA AGREGAR,ELIMINAR U OBTENER ELEMENTOS DEL MAP
        function _AddValueInItemsSelected(key, data) {
            if (self.itemsSelected.has(key))
                console.error("La clave ", key, " ya existe en los elementos seleccionados");
            else
                self.itemsSelected.set(key, data);
        }
        function _DeleteValueInItemsSelected(key) {
            if (!self.itemsSelected.has(key))
                console.error("La clave ", key, " a eliminar no existe en los elementos seleccionados");
            else
                self.itemsSelected.delete(key);
        }
        function _GetValueInItemsSelected(key) {
            if (!self.itemsSelected.has(key)) {
                console.error("La clave ", key, " no existe en los elementos seleccionados valor a retornar null");
                return null;
            }
            return self.itemsSelected.get(key);
        }

        //EVENTOS

        //-----------FUNCIONES PARA SELECCIONAR O ANULAR SELECCION DE TODOS LOS ELEMENTOS

        function _SelectAllAssets() {

            self.selectedPage = true;

            //VARIABLE NUEVA PARA SABER SI SE SELECCIONARON LOGICAMENTE TODOS LOS ASSETS
            self.flagOfAllSelectedAssets = true;
        }

        function _UnSelectAllAssets() {
            self.selectedPage = false;

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
                self.selectedPage = false;
                return false;
            }

            let condition = sizeItemsSelected === self.data?.length;
            self.selectedPage = condition;

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

        _Init();
    };

})();
