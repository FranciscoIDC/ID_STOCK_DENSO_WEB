(function () {
    angular
        .module('app')
        .controller('StaffEditController', StaffEditController);

    StaffEditController.$inject = [
        '$scope',
        '$stateParams',
        'StaffEditService',
        'AlertService',
        'CompanyListService',
        'DepartmentService',
        'AssetLocationService',
        'AssetService',
        'ErrorService',
        'ConstService',
        'GeneralInfo',
        'authService',
        '$document',
        'RoleListService'
    ];

    function StaffEditController(self, $stateParams, StaffEditService, AlertService, CompanyListService, DepartmentService, AssetLocationService, AssetService, ErrorService, ConstService, GeneralInfo, authService, $document, RoleListService) {


        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetPermission();
            await _GetAssetLocationAsync();
            await _GetCategoryAsync();
            await _GetStaffById();
            await _GetCompanyAsync();
            await _CompanyChange(self.model.CompanyId);
            await _GetRoleAsync();
            setup();
            _WatchForClicksOutside();
        }

        function _InitValues() {
            self.permission = [];
            self.model = new AssetDtoPutFormData();

            self.categories = [];
            self.locations = [];

            self.validations = AssetService.validations;

            self.editMode = false;
            self.staffId = $stateParams.id;
            self.assetAddsId = $stateParams.addsId;

            // Variables para autocompletar
            self.searchTextCompany = '';
            self.filteredCompanies = [];
            self.showSuggestionsCompany = false;

            self.searchTextDepartament = '';
            self.filteredDepartaments = [];
            self.showSuggestionsDepartament = false;
        }
        function _RegisterFunctions() {
            self.Update = _Update;
            self.ChangueMode = _ChangueMode;
            self.Clear = _ClearForm;
            self.CompanyChange = _CompanyChange;

            // Funciones para filtrar
            self.filterCompanies = filterCompanies;  // Línea agregada
            self.filterDepartaments = filterDepartaments;  // Línea agregada

            // Funciones para seleccionar
            self.selectCompany = selectCompany;  // Línea agregada
            self.selectDepartament = selectDepartament;  // Línea agregada
        }

        async function setup() {

            // Asignar nombre visible de la empresa
            let company = self.companies.find(c => c.Id.toString() === self.model.CompanyId?.toString());
            if (company) self.searchTextCompany = company.Name;

            // Asignar nombre visible del departamento
            let departament = self.departaments.find(d => d.Id.toString() === self.model.DepartmentId?.toString());
            if (departament) self.searchTextDepartament = departament.Name;

            self.$apply();
        }

        // Cierra sugerencias si haces clic fuera de cualquier campo o lista de resultados
        function _WatchForClicksOutside() { // <-- agregado
            $document.on('click', function (event) {
                if (!angular.element(event.target).closest('.autocomplete-results, .input-style-1').length) {
                    self.filteredCompanies = [];
                    self.showSuggestionsCompany = false;

                    self.filteredDepartaments = [];
                    self.showSuggestionsDepartament = false;

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

        // Filtrar Departaments
        function filterDepartaments() {
            if (!self.searchTextDepartament) {
                self.filteredDepartaments = self.departaments;
            } else {
                self.filteredDepartaments = self.departaments.filter(function (departament) {
                    return departament.Name.toLowerCase().includes(self.searchTextDepartament.toLowerCase());
                });
            }
            self.showSuggestionsDepartament = self.filteredDepartaments.length > 0;
        }

        // Selección de Empresa
        function selectCompany(company) {
            self.searchTextCompany = company.Name;
            self.companyId = company.Id;
            self.model.CompanyId = company.Id;
            self.filteredCompanies = [];
            self.showSuggestionsCompany = false;
            _GetDepartmentsAsync();
        }

        // Selección de Departamentos
        function selectDepartament(departament) {
            self.searchTextDepartament = departament.Name;
            self.departmentId = departament.Id;
            self.model.DepartmentId = departament.Id;
            self.filteredDepartaments = [];
            self.showSuggestionsDepartament = false;
            _GetResponsiblesAsync();
        }

        function _ChangueMode() {

            // ----- Validacion de la accion a realizar ---------
            const permissionData = self.permission
            const PermissionValue = permissionData.find(permission => permission.Permission === "Personal");
            const ActionValue = PermissionValue.PermissionData.find(permission => permission.Url === "personal.editar");
            if (!ActionValue || !ActionValue.IsEnabled) {
                AlertService.Error("Sin permisos...", `No tienes permisos para [${ActionValue.Name.toLowerCase()}] en módulo de [${PermissionValue.Permission}]. Comunicate con un supervisor.`); return;
                return;
            }
            // ----- Fin de validacion ---------

            self.editMode = !self.editMode;
            if (!self.editMode) {
                _GetStaffById();
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
                self.companies = data;
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        async function _CompanyChange(id) {
            //self.companyId = id;
            
            if (!id) return;

            await _GetDepartmentsAsync();
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

        async function _GetDepartmentsAsync() {
            try {
                self.departaments = [];

                //if (self.companyId < 1) {
                //    return;
                //}
                console.log("la empresa del modelo es:" + self.model.CompanyId)
                /*self.counterData = 0;*/
                let params = { 'Page': 0, 'ItemsPerPage': 0, 'CompanyId': self.model.CompanyId }
                let response = await DepartmentService.GetByCompany(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                self.departaments = data;

                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        async function _Update() {
            let stringErrors = _ValidateForm();
            if (stringErrors !== "") {
                AlertService.ErrorHtml("Opps", stringErrors);
                return;
            }
            if (!self.model.CompanyId) {
                AlertService.ErrorHtml("Opps", "Elija una empresa");
                return;
            }
            if (!self.model.DepartmentId) {
                AlertService.ErrorHtml("Opps", "Elija un departamento");
                return;
            }
            await _UpdateAsync();
        }

        async function _UpdateAsync() {
            try {

                var session = GeneralInfo.getUserInLS()

                self.model.UpdatedBy = session.id;
                self.model.DepartmentId = +self.model.DepartmentId;
                self.model.RoleId = +self.model.RoleId;
                self.model.CompanyId = +self.model.CompanyId;

                let response = await StaffEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update Asset | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetStaffById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetStaffById() {
            try {
                let response = await StaffEditService.Get(self.staffId);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetStaffById: ", response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }

                //data.Image = _GetImage(data.Image);

                data.CompanyId = data.CompanyId.toString();
                data.DepartmentId = data.DepartmentId.toString();
                data.RoleId = data.RoleId.toString();
                //data.CategoryId = data.CategoryId + "";
                //data.AssetLocationId = data.AssetLocationId + "";

                self.model = data;

                console.log("modelo despues de obtener: ", self.model)
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        async function _GetRoleAsync() {
            try {

                let params = { 'page': 0, 'itemsPerPage': 0, 'search': '' }

                let response = await RoleListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                
                self.roles = data;
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        async function _GetAssetLocationAsync() {
            try {
                let params = { 'Page': 0, 'ItemsPerPage': 0, 'DepartamentId': 0 }
                let response = await AssetLocationService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                self.locations = data;
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        async function _GetCategoryAsync() {
            try {
                let params = { 'Page': 0, 'ItemsPerPage': 0 }
                let response = await CompanyListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                self.categories = data;
                self.$apply();
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

        function _ClearForm() {
            self.model = new AssetDtoPutFormData();
            self.model.CompanyId = null;
            self.model.DepartmentId = null;
            self.model.RoleId = null;
        }

        _Init();

        self.showSuggestionsClickCompanies = function () {
            self.showSuggestionsCompany = true; // Aseguramos que las sugerencias se muestren siempre
            self.filterCompanies();
        }

        self.showSuggestionsClickDepartaments = function () {
            self.showSuggestionsDepartament = true; // Aseguramos que las sugerencias se muestren siempre
            self.filterDepartaments();
        }

    }
})();
