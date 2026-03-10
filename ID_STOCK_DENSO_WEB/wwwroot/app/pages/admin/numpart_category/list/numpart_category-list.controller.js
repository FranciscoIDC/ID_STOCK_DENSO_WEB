(function () {
    angular
        .module('app')
        .controller('NumpartCategoryListController', NumpartCategoryListController);

    NumpartCategoryListController.$inject = [
        '$scope',
        '$state',
        'NumpartCategoryListService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];

    function NumpartCategoryListController(self, $state, NumpartCategoryListService, AlertService, ErrorService, ConstService) {
        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _FunctionsInit();
        }

        function _InitValues() {
            self.model = {};

            self.data = [];

            self.pagingSize = ConstService.pagingSize;
            self.itemsPerPage = ConstService.itemsPerPage;
            self.totalItems = 0;
            self.counterData = 0;

            self.currentPage = 1;

            self.displayItems = [];
        }

        function _RegisterFunctions() {
            self.GoEdit = _GoEdit;
            self.Remove = _Remove;
            self.DatumToString = _DatumToString;
            self.ExistData = _ExistData;
            self.$watch("currentPage", _ChangueCurrentPage);
            self.$watch("itemsPerPage", _ChangueItemsPerPage);
        }

        async function _FunctionsInit() {
            AlertService.Load();
            let params = { 'page': self.currentPage, 'itemsPerPage': self.itemsPerPage }
            await _GetNumpartCategoryAsync(params);
            swal.close();
        }

        async function _GetNumpartCategoryAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;
                let response = await NumpartCategoryListService.Get(params);
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


        _Init();

        function _ExistData() {
            if (!self.data || self.data.length === 0)
                return false;
            else
                return true;
        }


        function _GoEdit(id) {
            $state.go("numpartcategory.edit", { "id": id });
        }

        async function _Remove(id) {
            try {
                let response = await NumpartCategoryListService.Delete(id);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }

                await _FunctionsInit();
                AlertService.Success('Listo', message);
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

            console.log("La pagina actual es: " + newPage);
            AlertService.Load();
            let params = { 'Page': newPage, 'ItemsPerPage': self.itemsPerPage }

            _GetNumpartCategoryAsync(params);
            swal.close();
        }
        async function _ChangueItemsPerPage() {
            AlertService.Load();
            self.currentPage = 1;
            let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage }
            _GetNumpartCategoryAsync(params);
            swal.close();
        }
    }
})();
