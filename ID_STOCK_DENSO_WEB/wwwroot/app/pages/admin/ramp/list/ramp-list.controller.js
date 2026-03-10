(function () {
    angular
        .module('app')
        .controller('RampListController', RampListController);

    RampListController.$inject = [
        '$scope',
        '$state',
        'RampListService',
        'AlertService',
        'ErrorService',
        'ConstService',
        'GeneralInfo'
    ];

    function RampListController(
        self,
        $state,
        RampListService,
        AlertService,
        ErrorService,
        ConstService,
        GeneralInfo
    ) {
        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _FunctionsInit();
        }

        function _InitValues() {
            self.model = {};

            self.companyId = "";
            self.companies = [];

            self.IdLocation = "";
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
        }

        function _RegisterFunctions() {
            self.Search = _Search;
            //self.GetAssetImage = _GetImage;
            //self.GoUploadImage = _GoUploadImage;
            self.GoEdit = _GoEdit;
            self.DatumToString = _DatumToString;
            self.ExistData = _ExistData;

            self.ClearFilters = _ClearFilters;

            self.CompanyChange = _CompanyChange;
            self.CompanyLocalizationChange = _CompanyLocalizationChange;

            self.PrintTag = _PrintTagAsync;

            //VISORES DE LAS VARIABLES QUE SE USAN EL EN CONTROL DE PAGINACION
            self.$watch("currentPage", _ChangueCurrentPage);
            self.$watch("itemsPerPage", _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            await _GetAssetsOnResume();
            await _Search();
            swal.close();
        }

        async function _GetAssetsOnResume() {
            let filters = JSON.parse(localStorage.getItem(ConstService.rampListFilters));
            if (!filters) return;
            self.companyId = filters.CompanyId;
        }

        async function _Search(newPage) {
            newPage = !newPage ? 1 : newPage;
            AlertService.Load();
            let filters = { 'CompanyId': self.companyId };
            localStorage.setItem(ConstService.rampListFilters, JSON.stringify(filters))
            self.currentPage = newPage;

            let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'CompanyId': ReturnZeroifnull(self.companyId), 'Search': self.filterSearch }
            await _GetRampAsync(params);
            swal.close();
        }

        async function _GetRampAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;
                let response = await RampListService.Get(params);
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

        async function _PrintTagAsync(model) {
            try {
                let adminId = GeneralInfo.getUserIDCurrent();

                let dataSend = { 'JsonObject': JSON.stringify(model), 'LabelType': 'ramp' }
                let response = await RampListService.Print(dataSend, adminId);
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

        function _ExistData() {
            if (!self.data || self.data.length === 0)
                return false;
            else
                return true;
        }

        function _GoEdit(id, addsId) {
            $state.go("ramp.edit", { "id": id });
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
            let params = { 'Page': newPage, 'ItemsPerPage': self.itemsPerPage, 'IdLocation': self.IdLocation, 'CategoryId': self.categoryId, 'Search': self.filterSearch }

            _GetRampAsync(params);
            swal.close();
        }

        function _ClearFilters() {
            localStorage.removeItem(ConstService.rampListFilters);
            self.IdLocation = "";
            self.categoryId = "";
            self.companyId = "";
        }


        //async function _ChangueItemsPerPage() {

        //    self.IdLocation = self.IdLocation ? self.IdLocation : "";
        //    self.categoryId = self.categoryId ? self.categoryId : "";
        //    if (!self.IdLocation || !self.categoryId) {
        //        return;
        //    }
        //    AlertService.Load();
        //    let filters = { 'IdLocation': self.IdLocation, 'CategoryId': self.categoryId, 'CompanyId': self.companyId };
        //    localStorage.setItem(ConstService.rampListFilters, JSON.stringify(filters))
        //    self.currentPage = 1;
        //    let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'IdLocation': self.IdLocation, 'CategoryId': self.categoryId, 'Search': self.filterSearch }

        //    await _GetRampAsync(params);
        //    swal.close();
        //}


        async function _ChangueItemsPerPage() {
            AlertService.Load();
            let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'Search': self.filterSearch }
            _GetRampAsync(params);
            swal.close();

        }

        //EVENTOS

        async function _CompanyChange(id) {
            self.companyId = id;
            if (!self.companyId) return;
            //await _GetAssetLocationAsync();
        }

        async function _CompanyLocalizationChange(id) {
            self.IdLocation = id;
            if (!self.IdLocation) return;

            //await _GetCategoryAsync();
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
