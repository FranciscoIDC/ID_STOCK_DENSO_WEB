(function () {
    angular
        .module('app')
        .controller('RoleEditController', RoleEditController);

    RoleEditController.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'RoleService',
        'RoleAddService',
        'RoleEditService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];
    function RoleEditController(
        self,
        $state,
        $stateParams,
        RoleService,
        RoleAddService,
        RoleEditService,
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
            self.roleId = $stateParams.id;

            self.validations = RoleService.validations;
            //self.companyId = "";
            //self.companies = [];

            //self.locationId = "";
            //self.locations = [];

            //self.categoryId = "";
            //self.categories = [];

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
            self.GetAssetImage = _GetImage;
            self.GoUploadImage = _GoUploadImage;
            self.GoEdit = _GoEdit;
            self.DatumToString = _DatumToString;
            self.ExistData = _ExistData;
            self.Save = _Save;
            self.SavePermissions = _SavePermissionsAsync;

            self.ClearFilters = _ClearFilters;
            
            
            //REGISTRO DE EVENTOS

            self.Toggle = _Toggle;
            self.Exists = _Exists;
            self.IsIndeterminate = _IsIndeterminate;
            self.IsChecked = _IsChecked;
            self.ToggleAll = _ToggleAll;


            //VISORES DE LAS VARIABLES QUE SE USAN EL EN CONTROL DE PAGINACION
            self.$watch("currentPage", _ChangueCurrentPage);
            self.$watch("itemsPerPage", _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            //await _GetCategoryAsync();
            await _GetRoleDataOnResume();
            swal.close();
        }

        async function _GetRoleDataOnResume() {
            await _Search();
        }

        async function _Search() {
        
            AlertService.Load();
            //let filters = { 'CompanyId': self.companyId };
            //localStorage.setItem(ConstService.staffListFilters, JSON.stringify(filters))
            self.currentPage = 1;

            //let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'Search': self.filterSearch }
            await _GetRolesAsync();
            await _GetRolePermissions();
            swal.close();
        }

        async function _GetRolesAsync() {
            try {
                let response = await RoleEditService.Get(self.roleId);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                self.model = data;
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        async function _GetRolePermissions() {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;

                let response = await RoleEditService.GetPermissions(self.roleId);
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

        async function _Save() {
            let stringErrors = _ValidateForm();
            if (stringErrors !== "") {
                AlertService.ErrorHtml("Opps", stringErrors);
                return;
            }
            await _SaveAsync();
        }

        async function _SaveAsync() {
            try {
                AlertService.Load();

                let response = await RoleAddService.Save(self.model);
                swal.close();
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Save Asset | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        function _ValidateForm() {
            let stringErrors = "";
            for (const property in self.model) {
                let value = self.model[property];

                let Validar = self.validations.get(property);
                if (Validar) {
                    stringErrors += Validar(value);
                }
            }
            return stringErrors;
        }

        async function _SavePermissionsAsync() {
            try {
                let response = await RoleEditService.SavePermissions(self.roleId, self.data);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }

                AlertService.Success("Listo!", message);
                await _GetRolePermissions();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }


        async function _PrintTagAsync(model) {
            try {
                let dataSend = { 'JsonObject': JSON.stringify(model), 'LabelType': 'asset' }
                let response = await RoleEditService.Print(dataSend);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo", message);

            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        function _GetImage(imageRoute) {
            if (!imageRoute) return "/images/imageNotFound.png";
            let parts = imageRoute.split("/");
            let scheme = parts[0];

            let container = parts[3];
            let imageName = parts[4];


            return scheme + "//" + ConstService.webApiDomain + "/" + container + "/" + imageName;
        }

        function _ExistData() {
            if (!self.data || self.data.length === 0)
                return false;
            else
                return true;
        }

        function _GoUploadImage(id) {
            $state.go("asset.uploadImage", { "id": id });
        }

        function _GoEdit(id) {
            $state.go("role.edit", { "id": id });
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
            let params = { 'Page': newPage, 'ItemsPerPage': self.itemsPerPage, 'LocationId': self.locationId, 'CategoryId': self.categoryId, 'Search': self.filterSearch }

            _GetRolesAsync(params);
            swal.close();
        }

        function _ClearFilters() {
            localStorage.removeItem(ConstService.staffListFilters);
            self.locationId = "";
            self.categoryId = "";
            self.companyId = "";
        }

        async function _ChangueItemsPerPage() {

            self.locationId = self.locationId ? self.locationId : "";
            self.categoryId = self.categoryId ? self.categoryId : "";
            if (!self.locationId || !self.categoryId) {
                return;
            }
            AlertService.Load();
            let filters = { 'LocationId': self.locationId, 'CategoryId': self.categoryId, 'CompanyId': self.companyId };
            localStorage.setItem(ConstService.staffListFilters, JSON.stringify(filters))
            self.currentPage = 1;
            let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'LocationId': self.locationId, 'CategoryId': self.categoryId, 'Search': self.filterSearch }

            await _GetRolesAsync(params);
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

        _Init();
    };

})();
