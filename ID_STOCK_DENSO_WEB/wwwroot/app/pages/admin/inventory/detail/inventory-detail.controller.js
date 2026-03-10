(function () {
    angular
        .module('app')
        .controller('InventoryDetailController', InventoryDetailController);

    InventoryDetailController.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'InventoryDetailService',
        'ZoneService',
        'AlertService',
        'ErrorService',
        'ConstService',
        'GeneralInfo', 'UrlService'
    ];

    function InventoryDetailController(
        self,
        $state,
        $stateParams,
        InventoryDetailService,
        ZoneService,
        AlertService,
        ErrorService,
        ConstService,
        GeneralInfo, UrlService
    ) {
        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _FunctionsInit();
        }

        function _InitValues() {
            self.model = {};

            self.model = new InventoryDetailDtoGet();

            self.inventoryId = $stateParams.id;

            self.IdZone = "";
            self.zones = [];

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
            //self.CarruselPrev = _CarruselPrev;
            //self.CarruselNext = _CarruselNext;
            //self.imagesMode = _imagesMode;
            //self.GetImagesReport = _GetImagesReport;
            //self.GetCssClass_ActiveFirst = _GetCssClass_ActiveFirst;

            self.Search = _Search;
            self.GoEdit = _GoEdit;
            self.DatumToString = _DatumToString;
            self.ExistData = _ExistData;

            self.ClearFilters = _ClearFilters;
            //self.PrintTag = _PrintTagAsync;

            self.SelectAllAssets = _SelectAllAssets;
            self.UnSelectAllAssets = _UnSelectAllAssets;

            //self.MultipleLabelPrintingAsync = _MultipleLabelPrintingAsync;

            self.ShowAlertSelectedAll = _ShowAlertSelectedAll;
            self.ShowAlertUnSelectedAll = _ShowAlertUnSelectedAll;

            //REGISTRO DE EVENTOS

            self.Toggle = _Toggle;
            self.Exists = _Exists;
            self.IsIndeterminate = _IsIndeterminate;
            self.IsChecked = _IsChecked;
            self.ToggleAll = _ToggleAll;

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
            let params = BuildParamsToGetInventoryDetails(self.currentPage, self.itemsPerPage, self.inventoryId);
            await _GetInventoryDetailAsync(params)
        }

        async function _Search() {
            self.IdZone = self.IdZone ? self.IdZone : "";
            if (!self.IdZone || !self.startDate || !self.endDate) {
                AlertService.Error("Los filtros son requeridos.");
                return;
            }

            AlertService.Load();
            //localStorage.setItem(ConstService.inventoryListFilters, JSON.stringify(filters))
            self.currentPage = 1;

            //var dt1 = GeneralInfo.formatDate(self.startDate);
            //var dt2 = GeneralInfo.formatDate(self.endDate);
            //let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'LocalizationId': self.IdZone, 'DtStart': dt1, 'DtEnd': dt2 }
            let params = BuildParamsToGetInventoryDetails(self.currentPage, self.itemsPerPage, self.inventoryId);
            await _GetInventoryDetailAsync(params);
            swal.close();
        }

        //Apartado para Excel
        async function _GetExcel() {
            //self.IdZone = self.IdZone ? self.IdZone : "";
            //if (!self.IdZone || !self.startDate || !self.endDate) {
            //    AlertService.Error("Los filtros son requeridos.");
            //    return;
            //}
            AlertService.Load();
            self.currentPage = 1;
            let params = ('Page=' + 0 + '&ItemsPerPage=' + 0 +
                '&InventoryId=' + ReturnZeroifnull(self.inventoryId)
            );
            await _Get_toExcel(params);
        }
        function ReturnZeroifnull(id) {
            if (!id || id === '' || id === "")
                return 0
            return id
        }

        async function _Get_toExcel(params) {
            try {

                let request = new XMLHttpRequest();
                request.responseType = "blob";
                request.open("GET", UrlService.getInventoryDetail + '/Excel?' + params);
                request.onload = function () {
                    swal.close();
                    let url = window.URL.createObjectURL(this.response);
                    let a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = url;
                    let hoy = new Date();
                    let cadenaFecha = hoy.toLocaleDateString(); // "14/6/2020"
                    a.download = this.response.name || "Detalle_Inventario_de_Activos_" + cadenaFecha;
                    a.click();
                }
                request.send();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        async function _GetInventoryDetailAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;

                //let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'LocalizationId': self.IdZone, 'DtStart': self.startDate, 'DtEnd': self.endDate }
                let response = await InventoryDetailService.Get(params);
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

        function BuildParamsToGetInventoryDetails(page, itemsPerPage, inventoryId) {
            
            self.model = new InventoryDetailDtoGet();
            self.model.Page = page;
            self.model.ItemsPerPage = +itemsPerPage;
            self.model.InventoryId = +inventoryId;

            return self.model;
        }

        async function _GetZoneAsync() {
            try {
                let params = { 'Page': 0, 'ItemsPerPage': 0, 'DepartamentId': 0 }
                let response = await ZoneService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                self.zones = data;
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

        function _GoEdit(id) {
            $state.go("inventory.edit", { "id": id });
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
            //let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'LocalizationId': self.IdZone, 'DtStart': self.startDate, 'DtEnd': self.endDate }
            let params = BuildParamsToGetInventoryDetails(self.currentPage, self.itemsPerPage, self.inventoryId);
            _GetInventoryDetailAsync(params);
            swal.close();
        }

        function _ClearFilters() {
            localStorage.removeItem(ConstService.assetListFilters);
            self.IdZone = "";
        }

        function getIds(input, field) {
            var output = [];
            const iterator = input.keys();
            for (var i = 0; i < input.size; ++i)
                output.push(iterator.next().value);
            return output;
        }

        //async function _ChangueItemsPerPage() {

        //    self.IdZone = self.IdZone ? self.IdZone : "";
        //    if (!self.IdZone) {
        //        return;
        //    }
        //    AlertService.Load();
        //    //localStorage.setItem(ConstService.inventoryListFilters, JSON.stringify(filters))
        //    self.currentPage = 1;
        //    let params = BuildParamsToGetInventoryDetails(self.currentPage, self.itemsPerPage, self.inventoryId);
        //    //let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'LocalizationId': self.IdZone, 'DtStart': self.startDate, 'DtEnd': self.endDate }
        //    _GetInventoryDetailAsync(params);
        //    swal.close();
        //}


        async function _ChangueItemsPerPage() {
            AlertService.Load();
            let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'inventoryId': self.inventoryId }
            _GetInventoryDetailAsync(params);
            swal.close();

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
        function _Exists (item) {
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

        //function _imagesMode(path) {
        //    if (!path || path == "")
        //        return false;
        //    return true;
        //}

        //async function _GetImagesReport(id,name) {
        //    try {
        //        $('#CarouselImages').carousel(0);
        //        self.ImagesReport = [];
        //        let response = await InventoryDetailService.Getimages(id);
        //        const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
        //        if (status !== 200) {
        //            console.error(message);
        //            AlertService.Error("Opps", message);
        //            return;
        //        }
        //        self.ImagesReport = data;
        //        self.CountImage = 1;
        //        self.CountImages = counter;
        //        self.NameActivo = name;
        //        self.$apply();
        //    } catch (ex) {
        //        let error = ErrorService.GetError(ex);
        //        console.error('Oops...', error);
        //        AlertService.ErrorHtml('Oops...', error);
        //    }
        //}
        //function _CarruselPrev() {
        //    $('#CarouselImages').carousel('prev');
        //    self.CountImage = self.CountImage - 1;
        //    if (self.CountImage < 1)
        //        self.CountImage = self.CountImages;
        //}
        //function _CarruselNext() {
        //    $('#CarouselImages').carousel('next');
        //    self.CountImage = self.CountImage + 1;
        //    if (self.CountImage > self.CountImages)
        //        self.CountImage = 1;
        //}

        //function _GetCssClass_ActiveFirst(e, item) {
        //    let position = self.ImagesReport.indexOf(item);
        //    switch (position) {
        //        case 0:
        //            return 'carousel-item active';
        //        default:
        //            return 'carousel-item';
        //    }
        //};

        _Init();
    };

})();
