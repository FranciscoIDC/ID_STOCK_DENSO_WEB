(function () {
    angular
        .module('app')
        .controller('StaffListController', StaffListController);

    StaffListController.$inject = [
        '$scope',
        '$state',
        'StaffListService',
        'AssetLocationService',
        'CategoryListService',
        'AlertService',
        'ErrorService',
        'ConstService',
        'GeneralInfo',
        'authService',
        '$document',
        'CompanyListService'
    ];

    function StaffListController(
        self,
        $state,
        StaffListService,
        AssetLocationService,
        CategoryListService,
        AlertService,
        ErrorService,
        ConstService,
        GeneralInfo,
        authService,
        $document,
        CompanyListService
    ) {
        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _FunctionsInit();
            _WatchForClicksOutside();
        }

        function _InitValues() {
            self.permission = [];
            self.model = {};

            self.companyId = "";
            self.companies = [];

            self.locationId = "";
            self.locations = [];

            self.categoryId = "";
            self.categories = [];

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

            // Variables para autocompletar
            self.searchTextCompany = '';
            self.filteredCompanies = [];
            self.showSuggestionsCompany = false;
        }

        function _RegisterFunctions() {
            self.Search = _Search;
            //self.GetAssetImage = _GetImage;
            //self.GoUploadImage = _GoUploadImage;
            self.GoEdit = _GoEdit;
            self.GoAdd = _GoAdd;
            self.Remove = _Remove;
            self.DatumToString = _DatumToString;
            self.ExistData = _ExistData;

            self.ClearFilters = _ClearFilters;

            self.CompanyChange = _CompanyChange;
            self.CompanyLocalizationChange = _CompanyLocalizationChange;

            // Funciones para filtrar
            self.filterCompanies = filterCompanies;  // Línea agregada

            // Funciones para seleccionar
            self.selectCompany = selectCompany;  // Línea agregada

            //VISORES DE LAS VARIABLES QUE SE USAN EL EN CONTROL DE PAGINACION
            self.$watch("currentPage", _ChangueCurrentPage);
            self.$watch("itemsPerPage", _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            await _GetPermission();
            await _GetCompanyAsync();
            await _GetAssetsOnResume();
            await _Search();
            swal.close();
        }

        function _WatchForClicksOutside() { // <-- agregado
            $document.on('click', function (event) {
                if (!angular.element(event.target).closest('.autocomplete-results, .input-style-1').length) {
                    self.filteredCompanies = [];
                    self.showSuggestionsCompany = false;

                    self.$apply();
                }
            });
        } // <-- fin función agregada

        function filterCompanies() {
            if (!self.searchTextCompany) {
                self.filteredCompanies = self.companies;
            } else {
                self.filteredCompanies = self.companies.filter(function (company) {
                    return company.Name.toLowerCase().includes(self.searchTextCompany.toLowerCase());
                });
            }
            self.showSuggestionsCompany = self.filteredCompanies.length > 0;
        }

        // Selección de Empresa
        function selectCompany(company) {
            self.searchTextCompany = company.Name;
            self.companyId = company.Id;
            self.filteredCompanies = [];
            self.showSuggestionsCompany = false;
            _GetDepartmentsAsync();
        }

        async function _GetCompanyAsync(params) {
            try {

                let params = { 'page': 0, 'itemsPerPage': 0 }

                let response = await CompanyListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                //TODO:Poner codigo para cargar empresas
                data.unshift({ 'Id': 0, 'Name': 'TODOS' });
                self.companies = data;
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        //Agregar Funcion de _GetPermission()
        async function _GetPermission() {
            try {
                let permissions = GeneralInfo.getAuthorizationsInLS();
                if (!permissions) {
                    permissions = await authService.GetPermissions();
                    if (!permissions || permissions.length == 0) {
                        //AlertService.ErrorHtml("Opps", 'Permisos no obtenidos'); //No se coloca aqui porque la peticion al servicio ya muestra un mensaje al respecto
                        return;
                    }
                    self.permission = permissions;
                }

            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }


        async function _GetAssetsOnResume() {
            let filters = JSON.parse(localStorage.getItem(ConstService.staffListFilters));
            if (!filters) return;
            self.companyId = filters.CompanyId;
        }

        async function _Search(newPage) {
            // ----- Validacion de la accion a realizar ---------
            const permissionData = self.permission
            const PermissionValue = permissionData.find(permission => permission.Permission === "Personal");
            const ActionValue = PermissionValue.PermissionData.find(permission => permission.Url === "personal.consultar");
            if (!ActionValue || !ActionValue.IsEnabled) {
                AlertService.Error("Sin permisos...", `No tienes permisos para [${ActionValue.Name.toLowerCase()}] en módulo de [${PermissionValue.Permission}]. Comunicate con un supervisor.`); return;
                return;
            }
            // ----- Fin de validacion ---------

            newPage = !newPage ? 1 : newPage;
            AlertService.Load();
            let filters = { 'CompanyId': self.companyId };
            localStorage.setItem(ConstService.staffListFilters, JSON.stringify(filters))
            self.currentPage = newPage;

            let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'CompanyId': ReturnZeroifnull(self.companyId), 'Search': self.filterSearch }
            await _GetStaffAsync(params);
            swal.close();
        }

        async function _GetStaffAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;
                let response = await StaffListService.GetAll(params);
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

        function _ExistData() {
            if (!self.data || self.data.length === 0)
                return false;
            else
                return true;
        }

        function _GoEdit(id, addsId) {
            $state.go("staff.edit", { "id": id });
        }

        function _GoAdd() {

            // ----- Validacion de la accion a realizar ---------
            const permissionData = self.permission
            const PermissionValue = permissionData.find(permission => permission.Permission === "Personal");
            const ActionValue = PermissionValue.PermissionData.find(permission => permission.Url === "personal.alta");
            if (!ActionValue || !ActionValue.IsEnabled) {
                AlertService.Error("Sin permisos...", `No tienes permisos para [${ActionValue.Name.toLowerCase()}] en módulo de [${PermissionValue.Permission}]. Comunicate con un supervisor.`); return;
                return;
            }
            // ----- Fin de validacion ---------

            $state.go("staff.add");
        }

        async function _Remove(id) {
            try {

                // ----- Validacion de la accion a realizar ---------
                const permissionData = self.permission
                const PermissionValue = permissionData.find(permission => permission.Permission === "Personal");
                const ActionValue = PermissionValue.PermissionData.find(permission => permission.Url === "personal.eliminar");
                if (!ActionValue || !ActionValue.IsEnabled) {
                    AlertService.Error("Sin permisos...", `No tienes permisos para [${ActionValue.Name.toLowerCase()}] en módulo de [${PermissionValue.Permission}]. Comunicate con un supervisor.`); return;
                    return;
                }
                // ----- Fin de validacion ---------

                //let response = await CompanyListService.Delete(id);
                //const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                //console.log(response);
                //if (status !== 200) {
                //    console.error(message);
                //    AlertService.Error("Opps", message);
                //    return;
                //}

                //await _FunctionsInit();
                //AlertService.Success('Listo', message);
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        function _DatumToString(datum) {
            return datum ? datum : "--";
        }

        function _ChangueCurrentPage(newPage, oldPage) {
            if (newPage === oldPage) {
                return;
            }

            // ----- Validacion de la accion a realizar ---------
            const permissionData = self.permission
            const PermissionValue = permissionData.find(permission => permission.Permission === "Personal");
            const ActionValue = PermissionValue.PermissionData.find(permission => permission.Url === "personal.consultar");
            if (!ActionValue || !ActionValue.IsEnabled) {
                AlertService.Error("Sin permisos...", `No tienes permisos para [${ActionValue.Name.toLowerCase()}] en módulo de [${PermissionValue.Permission}]. Comunicate con un supervisor.`); return;
                return;
            }
            // ----- Fin de validacion ---------

            console.log("La pagina actual es: " + newPage);
            AlertService.Load();
            let params = { 'Page': newPage, 'ItemsPerPage': self.itemsPerPage, 'CompanyId': ReturnZeroifnull(self.companyId), 'Search': self.filterSearch }

            _GetStaffAsync(params);
            swal.close();
        }

        function _ClearFilters() {
            localStorage.removeItem(ConstService.staffListFilters);
            self.locationId = "";
            self.categoryId = "";
            self.companyId = "";
        }


        //async function _ChangueItemsPerPage() {

        //    self.locationId = self.locationId ? self.locationId : "";
        //    self.categoryId = self.categoryId ? self.categoryId : "";
        //    if (!self.locationId || !self.categoryId) {
        //        return;
        //    }
        //    AlertService.Load();
        //    let filters = { 'LocationId': self.locationId, 'CategoryId': self.categoryId, 'CompanyId': self.companyId };
        //    localStorage.setItem(ConstService.staffListFilters, JSON.stringify(filters))
        //    self.currentPage = 1;
        //    let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'LocationId': self.locationId, 'CategoryId': self.categoryId, 'Search': self.filterSearch }

        //    await _GetStaffAsync(params);
        //    swal.close();
        //}

        async function _ChangueItemsPerPage() {
            // ----- Validacion de la accion a realizar ---------
            const permissionData = self.permission
            const PermissionValue = permissionData.find(permission => permission.Permission === "Personal");
            const ActionValue = PermissionValue.PermissionData.find(permission => permission.Url === "personal.consultar");
            if (!ActionValue || !ActionValue.IsEnabled) {
                AlertService.Error("Sin permisos...", `No tienes permisos para [${ActionValue.Name.toLowerCase()}] en módulo de [${PermissionValue.Permission}]. Comunicate con un supervisor.`); return;
                return;
            }
            // ----- Fin de validacion ---------
            AlertService.Load();
            let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'CompanyId': ReturnZeroifnull(self.companyId), 'Search': self.filterSearch }
            _GetStaffAsync(params);
            swal.close();

        }

        //EVENTOS

        async function _CompanyChange(id) {
            self.companyId = id;
            if (!self.companyId) return;
            //await _GetAssetLocationAsync();
        }

        async function _CompanyLocalizationChange(id) {
            self.locationId = id;
            if (!self.locationId) return;

            //await _GetCategoryAsync();
        }

        function ReturnZeroifnull(id) {
            if (!id || id === '' || id === "") {
                return 0
            }
            return +id
        }

        _Init();

        self.showSuggestionsClickCompanies = function () {
            self.showSuggestionsCompany = true; // Aseguramos que las sugerencias se muestren siempre
            self.filterCompanies();
        }
    };

})();
