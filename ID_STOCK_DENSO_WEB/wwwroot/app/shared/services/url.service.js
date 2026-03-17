(function () {
    'use strict';

    angular
        .module('app')
        .factory('UrlService', UrlService);

    UrlService.$inject = ['$http', 'ConstService'];

    function UrlService($http, ConstService) {
        let base = ConstService.webApiIp;
        let baseToken = ConstService.token;
        let baseStaff = base + 'Staff';
        let baseRole = base + 'Role';

        let baseProduct = base + 'Product';
        let baseInventory = base + 'Inventory';

        let basePalletAssembly = base + 'PalletAssembly';

        let baseLogin = base + 'Login/';
        let baseWarehouse = base + 'Warehouse';
        let baseLocation = base + 'Location';
        let baseImage = base + 'Image';
        //let baseLocalization = base + 'Localization';
        let baseZone = base + 'Zone';
        let baseAssetLog = base + 'AssetLog';
        let baseNumpartCategory = base + 'NumpartCategory';
        let baseInbound = base + 'Inbound';
        let baseInboundProduct = base + 'InboundProduct';
        let baseOutbound = base + 'Outbound';
        let baseIncident = base + 'Incident';
        let baseStock = base + 'Stock';
        let baseMovementLog = base + 'MovementLog';

        //Denso
        let baseSize = base + 'Size';
        let baseVariety = base + 'Variety';
        let baseDestination = base + 'Destination';
        let baseBox = base + 'Box';
        let baseDriver = base + 'Driver';
        let baseCarrier = base + 'Carrier';
        let baseFarmer = base + 'Farmer';
        let baseTruck = base + 'Truck';
        let baseColdBox = base + 'ColdBox';
        let baseFieldLog = base + 'FieldLog';
        let baseGateRegistration = base + 'GateRegistration';
        let baseStaticMenu = base + 'StaticMenu';

        let basePurchaseOrder = base + 'PurchaseOrder';
        let baseRequisitionOrder = base + 'Requisition';



        let service = {
            token: baseToken,

            postRequestLogin: baseLogin + 'Authentication',

            getLogLastMoves: baseMovementLog + '/Last-Moves',

            getWarehouse: baseWarehouse + '',
            getWarehouseById: baseWarehouse + '/{id}',
            postWarehouse: baseWarehouse + '/',
            putWarehouse: baseWarehouse + '/',
            deleteWarehouse: baseWarehouse + '/{id}',

            getZone: baseZone + '',
            postZone: baseZone + '/Save',
            putZone: baseZone + '/Update',
            getZoneById: baseZone + '/{id}',
            deleteZone: baseZone + '/{id}',

            getLocation: baseLocation + '',
            postLocation: baseLocation + '/Save',
            putLocation: baseLocation + '/Update',
            getLocationById: baseLocation + '/{id}',
            deleteLocation: baseLocation + '/{id}',

            //sync 
            getLocationSync: baseLocation + '/Sync',

            getProductFull: baseProduct + '',
            getProductLast: baseProduct + '/Last',
            getProductById: baseProduct + '/{id}',
            getProductByBarcode: baseProduct + '/{barcode}',
            getProductImage: baseProduct + '/{id}/ImageRoute',
            uploadProductImage_FormData: baseProduct + '/UploadImage-Form_Data/{id}',

            getStaff: baseStaff + '',
            postStaff: baseStaff + '/Save',
            putStaff: baseStaff + '/Update',
            getStaffById: baseStaff + '/{id}',
            printTagStaff: baseStaff + "/PrintTag",
            postPasswordRecovery: baseStaff + '/PasswordRecovery',

            getRole: baseRole + "",
            postUpsert: baseRole + "/Upsert",
            postUpsertPermissions: baseRole + "/UpsertPermissions/{roleId}",
            getRoleById: baseRole + "/GetById/{id}",
            getRolePermissions: baseRole + "/GetPermissions/{roleId}",

            getAssetLogLastMoves: baseAssetLog + '/Last-Moves-Group-By-Name',

            getNumpartCategory: baseNumpartCategory + '',
            postNumpartCategory: baseNumpartCategory + '',
            putNumpartCategory: baseNumpartCategory + '',
            getNumpartCategoryById: baseNumpartCategory + '/{id}',
            deleteNumpartCategory: baseNumpartCategory + '/{id}',

            getInventory: baseInventory + '',
            getImagesInventory: baseInventory + '/GetImagesById/{id}',
            getInventoryDetail: baseInventory + '/Detail',

            getPalletAssembly: basePalletAssembly + '',
            getPalletAssemblyDetail: basePalletAssembly + '/Detail',

            getInbound: baseInbound + '',

            getInboundReport: baseInboundProduct + '/Report',

            getOutboundReport: baseRequisitionOrder + '/OutboundReport',

            getOutbound: baseOutbound + '',

            getIncident: baseIncident + '',
            getIncidentReport: baseIncident + '',
            getIncidentEmail: baseIncident + '/GetEmail',
            postIncidentEmail: baseIncident + '/Email',
            deleteIncidentEmail: baseIncident + '/Email/{id}',

            getStock: baseStock + '',
            getStockReport: baseStock + '',

            //Denso
            getSize: baseSize + '',
            postSize: baseSize + '',
            putSize: baseSize + '',
            getSizeById: baseSize + '/{id}',

            getVariety: baseVariety + '',
            postVariety: baseVariety + '',
            putVariety: baseVariety + '',
            getVarietyById: baseVariety + '/{id}',

            getDestination: baseDestination + '',
            postDestination: baseDestination + '',
            putDestination: baseDestination + '',
            getDestinationById: baseDestination + '/{id}',

            getBox: baseBox + '',
            postBox: baseBox + '',
            putBox: baseBox + '',
            getBoxById: baseBox + '/{id}',

            getDriver: baseDriver + '',
            postDriver: baseDriver + '',
            putDriver: baseDriver + '',
            getDriverById: baseDriver + '/{id}',

            getCarrier: baseCarrier + '',
            postCarrier: baseCarrier + '',
            putCarrier: baseCarrier + '',
            getCarrierById: baseCarrier + '/{id}',

            getFarmer: baseFarmer + '',
            postFarmer: baseFarmer + '',
            putFarmer: baseFarmer + '',
            getFarmerById: baseFarmer + '/{id}',

            getTruck: baseTruck + '',
            postTruck: baseTruck + '',
            putTruck: baseTruck + '',
            getTruckById: baseTruck + '/{id}',

            getColdBox: baseColdBox + '',
            postColdBox: baseColdBox + '',
            putColdBox: baseColdBox + '',
            getColdBoxById: baseColdBox + '/{id}',

            getFieldLog: baseFieldLog + '',
            getWebFieldLog: baseFieldLog + '/Web',
            postFieldLog: baseFieldLog + '',
            putFieldLog: baseFieldLog + '',
            getFieldLogById: baseFieldLog + '/{id}',

            //Gate
            getGateRegistration: baseGateRegistration + '',

            //Fijos
            getColdRoom: baseStaticMenu + '/ColdRoom',

            getRamp: baseStaticMenu + '/Ramp',

            getPacking: baseStaticMenu + '/Packing',

            getRejection: baseStaticMenu + '/Rejection',

            getPurchaseOrder: basePurchaseOrder + '',
            postPurchaseOrders: basePurchaseOrder + '',
            putPurchaseOrders: basePurchaseOrder + '',
            getPurchaseOrdersById: basePurchaseOrder + '/{id}',

            getRequisitionOrder: baseRequisitionOrder + '',
            postRequisitionOrder: baseRequisitionOrder + '',
            getRequisitionOrder: baseRequisitionOrder + '',
            getRequisitionOrderById: baseRequisitionOrder + '/{id}',

        };

        return service;

    }
})();