(function () {
    angular
        .module('app')
        .controller('StaffAddController', StaffAddController);

    StaffAddController.$inject = [
        '$scope',
        'StaffAddService',
        'AlertService',
        'CompanyListService',
        'DepartmentService',
        'AssetLocationService',
        'StaffService',
        'ErrorService',
        'RoleListService',
        '$document',
        'GeneralInfo'
    ];

    function StaffAddController(self, StaffAddService, AlertService, CompanyListService, DepartmentService, AssetLocationService, StaffService, ErrorService, RoleListService, $document, GeneralInfo) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetAssetLocationAsync();

            await _GetCompanyAsync();
            //await _CompanyChange(null);
            await _GetRoleAsync();
            _WatchForClicksOutside();
        }

        function _InitValues() {
            self.model = new StaffDtoPost();

            self.categories = [];
            self.locations = [];

            self.validations = StaffService.validations;

            // Variables para autocompletar
            self.searchTextCompany = '';
            self.filteredCompanies = [];
            self.showSuggestionsCompany = false;

            self.searchTextDepartament = '';
            self.filteredDepartaments = [];
            self.showSuggestionsDepartament = false;
        }

        function _RegisterFunctions() {
            self.Save = _Save;
            self.Clear = _ClearForm;

            self.CompanyChange = _CompanyChange;

            // Funciones para filtrar
            self.filterCompanies = filterCompanies;  // Línea agregada
            self.filterDepartaments = filterDepartaments;  // Línea agregada

            // Funciones para seleccionar
            self.selectCompany = selectCompany;  // Línea agregada
            self.selectDepartament = selectDepartament;  // Línea agregada
        }

        function _ValidateForm() {
            let stringErrors = "";
            for (const property in self.model) {
                let value = self.model[property];

                //if (property === "IdTagRFID") continue;

                let Validar = self.validations.get(property);
                if (Validar) {
                    stringErrors += Validar(value);
                }
            }
            return stringErrors;
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

        async function _Save() {
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
            await _SaveAsync();
        }

        async function _SaveAsync() {
            try {
                AlertService.Load();

                var session = GeneralInfo.getUserInLS()

                self.model.CreatedBy = session.id;
                self.model.DepartmentId = +self.model.DepartmentId;
                self.model.RoleId = +self.model.RoleId;
                self.model.CompanyId = +self.model.CompanyId;

                let response = await StaffAddService.Save(self.model);
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


        async function _CompanyChange(id) {
            //self.companyId = id;

            if (!id) return;

            await _GetDepartmentsAsync();
        }

        async function _GetDepartmentsAsync() {
            try {
                self.departaments = [];

                //if (self.companyId < 1) {
                //    return;
                //}
                console.log("la empresa del modelo es:" + self.companyId)
                /*self.counterData = 0;*/
                let params = { 'Page': 0, 'ItemsPerPage': 0, 'CompanyId': self.companyId }
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

        function _ClearForm() {
            self.model = new StaffDtoPost();
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
