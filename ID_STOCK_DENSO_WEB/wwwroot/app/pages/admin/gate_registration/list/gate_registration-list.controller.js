(function () {
    angular
        .module('app')
        .controller('GateRegistrationListController', GateRegistrationListController);

    GateRegistrationListController.$inject = [
        '$scope',
        '$state',
        'GateRegistrationListService',
        'AlertService',
        'ErrorService',
        'ConstService',
        'GeneralInfo'
    ];

    function GateRegistrationListController(
        self,
        $state,
        GateRegistrationListService,
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
            self.itemsPerPage = 10;
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

            self.GetCssClass_Status = _GetCssClass_Status;

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
            let filters = JSON.parse(localStorage.getItem(ConstService.gateRegistrationListFilters));
            if (!filters) return;
            self.companyId = filters.CompanyId;
        }

        async function _Search(newPage) {
            newPage = !newPage ? 1 : newPage;
            AlertService.Load();
            let filters = { 'CompanyId': self.companyId };
            localStorage.setItem(ConstService.gateRegistrationListFilters, JSON.stringify(filters))
            self.currentPage = newPage;

            let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'CompanyId': ReturnZeroifnull(self.companyId), 'Search': self.filterSearch }
            await _GetGateRegistrationAsync(params);
            swal.close();
        }

        async function _GetGateRegistrationAsync(params) {
            try {
                self.data = [];
                self.totalItems = 0;
                self.counterData = 0;
                let response = await GateRegistrationListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }

                // 1) Formatear fechas en el arreglo plano (usa tu función existente)
                const raw = _FormatAllDates(data);

                // 2) Agrupar por viaje y construir Details[]
                const grouped = _GroupGateRegistrations(raw);

                // 3) Asignar al view-model
                self.data = grouped;

                // Paginación: por ahora muestro el número de viajes agrupados.
                // Nota: si tu API hace paging por filas detalle, la paginación puede quedar inconsistente.
                self.totalItems = grouped.length;
                self.counterData = counter;

                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        function _GroupGateRegistrations(data) {
            if (!data || !Array.isArray(data)) return [];

            const map = {};

            data.forEach(item => {
                const key = (item.Id !== undefined ? item.Id : '') + '|' + (item.TripName || '');

                if (!map[key]) {
                    map[key] = {
                        Id: item.Id,
                        TripName: item.TripName,
                        FarmRemission: item.FarmRemission,
                        FarmerName: item.FarmerName,
                        FarmerShortName: item.FarmerShortName,
                        ShippingDate: item.ShippingDate,
                        ArrivalDate: item.ArrivalDate,
                        LicensePlate: item.LicensePlate,
                        DriverLicense: item.DriverLicense,
                        TruckType: item.TruckType,
                        CarrierName: item.CarrierName,
                        PotatoTemperature: item.PotatoTemperature,
                        DriverName: item.DriverName,
                        DriverPhone: item.DriverPhone,
                        Comments: item.Comments,
                        Carrier: item.Carrier,
                        DriverName: item.DriverName,
                        TripStatusName: item.TripStatusName,
                        IdTripStatus: item.IdTripStatus,
                        SoilSampleWeight: item.SoilSampleWeight,
                        Details: []
                    };
                }

                // Si el API ya te devolvió Detail[] dentro de cada item, úsalo; sino, usa la misma fila como detail
                if (Array.isArray(item.Detail) && item.Detail.length) {
                    item.Detail.forEach(d => {
                        map[key].Details.push({
                            Id: d.Id || null,
                            Variety: d.Variety,
                            Size: d.Size,
                            Packing: d.Packing,
                            KgShipped: d.KgShipped,
                            BoxesShipped: d.BoxesShipped,
                            TripCost: d.TripCost,
                            TonCost: d.TonCost,
                            Code: d.Code,
                            Subtotal: d.Subtotal || 0,
                            Iva: d.Iva || 0,
                            Total: d.Total || 0
                        });
                    });
                } else {
                    map[key].Details.push({
                        Id: item.Id || null,
                        Variety: item.Variety,
                        Size: item.Size,
                        Packing: item.Packing,
                        KgShipped: item.KgShipped,
                        BoxesShipped: item.BoxesShipped,
                        TripCost: item.TripCost,
                        TonCost: item.TonCost,
                        Code: d.Code,
                        Subtotal: item.Subtotal || 0,
                        Iva: item.Iva || 0,
                        Total: item.Total || 0
                    });
                }
            });

            // Calcular totales por viaje
            const trips = Object.values(map).map(trip => {
                trip.TotalKg = trip.Details.reduce((s, d) => s + (Number(d.KgShipped) || 0), 0);
                trip.TotalBoxes = trip.Details.reduce((s, d) => s + (Number(d.BoxesShipped) || 0), 0);

                trip.TripCost = trip.Details.reduce((s, d) => s + (Number(d.TripCost) || 0), 0);
                trip.TonCost = trip.Details.reduce((s, d) => s + (Number(d.TonCost) || 0), 0);

                const subtotalSum = trip.Details.reduce((s, d) => s + (Number(d.Subtotal) || 0), 0);
                const ivaSum = trip.Details.reduce((s, d) => s + (Number(d.Iva) || 0), 0);
                const totalSum = trip.Details.reduce((s, d) => s + (Number(d.Total) || 0), 0);

                trip.Subtotal = subtotalSum || Number(trip.Subtotal) || 0;
                trip.Iva = ivaSum || Number(trip.Iva) || 0;
                trip.Total = totalSum || Number(trip.Total) || 0;

                // formato: dos decimales (opcional)
                trip.Subtotal = typeof trip.Subtotal === 'number' ? trip.Subtotal.toFixed(2) : trip.Subtotal;
                trip.Iva = typeof trip.Iva === 'number' ? trip.Iva.toFixed(2) : trip.Iva;
                trip.Total = typeof trip.Total === 'number' ? trip.Total.toFixed(2) : trip.Total;

                return trip;
            });

            return trips;
        }

        function _FormatAllDates(data) {
            if (!data || !Array.isArray(data)) return data;

            return data.map(item => {
                for (const key in item) {
                    if (!item.hasOwnProperty(key)) continue;
                    const value = item[key];

                    // Detectar si es fecha ISO o algo que Date pueda parsear
                    if (typeof value === 'string' && _IsDateString(value)) {
                        item[key] = _FormatDate(value);
                    }
                }
                return item;
            });
        }

        function _IsDateString(value) {
            // Detecta ISO 8601 (2025-09-09T18:47:08)
            // o algo que se parezca a fecha válida
            const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/;
            if (!isoRegex.test(value)) return false;

            const date = new Date(value);
            return !isNaN(date.getTime());
        }

        function _FormatDate(dateString) {
            const date = new Date(dateString);
            if (isNaN(date)) return dateString;

            const yyyy = date.getFullYear();
            const MM = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const hh = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            const ss = String(date.getSeconds()).padStart(2, '0');

            // Si la hora es exactamente 00:00:00, solo muestra la fecha
            if (hh === '00' && mm === '00' && ss === '00') {
                return `${dd}-${MM}-${yyyy}`;
            }

            return `${dd}-${MM}-${yyyy} ${hh}:${mm}:${ss}`;
        }

        function _GetCssClass_Status(e, item) {
            const expr = item.TripStatusName.toUpperCase();
            switch (expr) {
                case 'EN TRANSITO':
                    return 'status-btn orange-btn';
                case 'EN PLANTA':
                    return 'status-btn info-btn';
                case 'FUERA DE PLANTA':
                    return 'status-btn active-btn';
                default:
                    return '';
            }

        };

        async function _PrintTagAsync(model) {
            try {
                let adminId = GeneralInfo.getUserIDCurrent();

                let dataSend = { 'JsonObject': JSON.stringify(model), 'LabelType': 'gateRegistration' }
                let response = await GateRegistrationListService.Print(dataSend, adminId);
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
            $state.go("gateRegistration.edit", { "id": id });
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

            _GetGateRegistrationAsync(params);
            swal.close();
        }

        function _ClearFilters() {
            localStorage.removeItem(ConstService.gateRegistrationListFilters);
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
        //    localStorage.setItem(ConstService.gateRegistrationListFilters, JSON.stringify(filters))
        //    self.currentPage = 1;
        //    let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'IdLocation': self.IdLocation, 'CategoryId': self.categoryId, 'Search': self.filterSearch }

        //    await _GetGateRegistrationAsync(params);
        //    swal.close();
        //}


        async function _ChangueItemsPerPage() {
            AlertService.Load();
            let params = { 'Page': self.currentPage, 'ItemsPerPage': self.itemsPerPage, 'Search': self.filterSearch }
            _GetGateRegistrationAsync(params);
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
