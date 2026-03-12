angular.module("app")
    .config(function ($stateProvider, $urlRouterProvider) {

    //$urlRouterProvider.when("/asset", "/profile/general");
    $urlRouterProvider.when("/admin/catalog/asset", "/admin/catalog/asset/list");


    $stateProvider
        .state("main", {
            url: '',
            redirectTo: 'login',
            data: {
                requiresAuth: false,
                typeUserAllowed: []
            }
        })
        .state('login', {
            url: '/auth/login',
            templateUrl: 'app/pages/auth/login/login.page.html',
            controller: 'LoginController',
            data: {
                requiresAuth: false,
                menuID: 0,
                typeUserAllowed: []
            }
        })
        .state('recover_password', {
            url: '/auth/recover_password',
            templateUrl: 'app/pages/auth/recover_password/recover_password.page.html',
            controller: 'RecoverPasswordController',
            data: {
                requiresAuth: false,
                menuID: 0,
                typeUserAllowed: []
            }
        })
        .state('home', {
            url: '/admin/dashboard/home',
            templateUrl: 'app/pages/admin/home/home.page.html',
            controller: 'HomeController',
            data: {
                requiresAuth: true,
                menuID: 0,
                typeUserAllowed: [1, 2]
            }
        })
        .state('warehouse', {
            abstract: true,
            url: '/admin/catalog/warehouse',
            templateUrl: 'app/pages/admin/warehouse/warehouse.page.html',
            //template:'<ui-view/>',
            controller: 'WarehouseController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        })
        .state('warehouse.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/warehouse/list/warehouse-list.page.html',
            controller: 'WarehouseListController',
            data: {
                requiresAuth: true,
                menuID: 1,
                typeUserAllowed: [1, 2]
            }
        }).state('warehouse.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/warehouse/add/warehouse-add.page.html',
            controller: 'WarehouseAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('warehouse.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/warehouse/edit/warehouse-edit.page.html',
            controller: 'WarehouseEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('zone', {
            abstract: true,
            url: '/admin/catalog/zone',
            templateUrl: 'app/pages/admin/zone/zone.page.html',
            //template:'<ui-view/>',
            controller: 'ZoneController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('zone.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/zone/list/zone-list.page.html',
            controller: 'ZoneListController',
            data: {
                requiresAuth: true,
                menuID: 2,
                typeUserAllowed: [1, 2]
            }
        }).state('zone.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/zone/add/zone-add.page.html',
            controller: 'ZoneAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('zone.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/zone/edit/zone-edit.page.html',
            controller: 'ZoneEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('location', {
            abstract: true,
            url: '/admin/catalog/location',
            templateUrl: 'app/pages/admin/zone/zone.page.html',
            //template:'<ui-view/>',
            controller: 'LocationController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('location.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/location/list/location-list.page.html',
            controller: 'LocationListController',
            data: {
                requiresAuth: true,
                menuID: 3,
                typeUserAllowed: [1, 2]
            }
        }).state('location.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/location/add/location-add.page.html',
            controller: 'LocationAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('location.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/location/edit/location-edit.page.html',
            controller: 'LocationEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('staff', {
            abstract: true,
            url: '/admin/catalog/staff',
            templateUrl: 'app/pages/admin/staff/staff.page.html',
            //template:'<ui-view/>',
            controller: 'StaffController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('staff.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/staff/list/staff-list.page.html',
            controller: 'StaffListController',
            data: {
                requiresAuth: true,
                menuID: 11,
                typeUserAllowed: [1, 2]
            }
        }).state('staff.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/staff/add/staff-add.page.html',
            controller: 'StaffAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('staff.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/staff/edit/staff-edit.page.html',
            controller: 'StaffEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('assetMovement', {
            abstract: true,
            url: '/admin/report/asset_movements',
            templateUrl: 'app/pages/admin/asset_movements/assetmovements.page.html',
            //template:'<ui-view/>',
            controller: 'AssetMovementController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('assetMovement.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/asset_movements/list/assetmovements-list.page.html',
            controller: 'AssetMovementListController',
            data: {
                requiresAuth: true,
                menuID: 19,
                typeUserAllowed: [1, 2]
            }
        }).state('assetMovement.detail', {
            url: '/:id/detail',
            templateUrl: 'app/pages/admin/asset_movements/detail/assetmovements-detail.page.html',
            controller: 'AssetMovementDetailController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('role', {
            abstract: true,
            url: '/admin/catalog/role',
            templateUrl: 'app/pages/admin/role/role.page.html',
            //template:'<ui-view/>',
            controller: 'RoleController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        })
        .state('role.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/role/list/role-list.page.html',
            controller: 'RoleListController',
            data: {
                requiresAuth: true,
                menuID: 8,
                typeUserAllowed: [1, 2]
            }
        }).state('role.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/role/add/role-add.page.html',
            controller: 'RoleAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('role.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/role/edit/role-edit.page.html',
            controller: 'RoleEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('numpartcategory', {
            abstract: true,
            url: '/admin/catalog/numpartCategory',
            templateUrl: 'app/pages/admin/numpart_category/numpart_category.page.html',
            //template:'<ui-view/>',
            controller: 'NumpartCategoryController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('numpartcategory.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/numpart_category/list/numpart_category-list.page.html',
            controller: 'NumpartCategoryListController',
            data: {
                requiresAuth: true,
                menuID: 5,
                typeUserAllowed: [1, 2]
            }
        }).state('numpartcategory.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/numpart_category/add/numpart_category-add.page.html',
            controller: 'NumpartCategoryAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('numpartcategory.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/numpart_category/edit/numpart_category-edit.page.html',
            controller: 'NumpartCategoryEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('line', {
            abstract: true,
            url: '/admin/catalog/line',
            templateUrl: 'app/pages/admin/line/line.page.html',
            //template:'<ui-view/>',
            controller: 'LineController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('line.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/line/list/line-list.page.html',
            controller: 'LineListController',
            data: {
                requiresAuth: true,
                menuID: 9,
                typeUserAllowed: [1, 2]
            }
        }).state('line.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/line/add/line-add.page.html',
            controller: 'LineAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('line.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/line/edit/line-edit.page.html',
            controller: 'LineEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('product', {
            abstract: true,
            url: '/admin/catalog/product',
            templateUrl: 'app/pages/admin/product/product.page.html',
            //template:'<ui-view/>',
            controller: 'ProductController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('product.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/product/list/product-list.page.html',
            controller: 'ProductListController',
            data: {
                requiresAuth: true,
                menuID: 7,
                typeUserAllowed: [1, 2]
            }
        }).state('product.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/product/edit/product-edit.page.html',
            controller: 'ProductEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('product.uploadImage', {
            url: '/:id/upload-image',
            templateUrl: 'app/pages/admin/product/upload-image/upload-image.page.html',
            controller: 'ProductUploadImageController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('numpart', {
            abstract: true,
            url: '/admin/catalog/numpart',
            templateUrl: 'app/pages/admin/numpart/numpart.page.html',
            //template:'<ui-view/>',
            controller: 'NumpartController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('numpart_bycategory', {
            abstract: true,
            url: '/admin/report/numpart_bycategory',
            templateUrl: 'app/pages/admin/numpart_bycategory/numpart_bycategory.page.html',
            //template:'<ui-view/>',
            controller: 'NumpartByCategoryController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('numpart_bycategory.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/numpart_bycategory/list/numpart_bycategory-list.page.html',
            controller: 'NumpartByCategoryListController',
            data: {
                requiresAuth: true,
                menuID: 15,
                typeUserAllowed: [1, 2]
            }

        }).state('inventory', {
            abstract: true,
            url: '/admin/report/inventory',
            templateUrl: 'app/pages/admin/inventory/inventory.page.html',
            //template:'<ui-view/>',
            controller: 'InventoryController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('inventory.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/inventory/list/inventory-list.page.html',
            controller: 'InventoryListController',
            data: {
                requiresAuth: true,
                menuID: 9,
                typeUserAllowed: [1, 2]
            }
        }).state('inventory.detail', {
            url: '/:id/detail',
            templateUrl: 'app/pages/admin/inventory/detail/inventory-detail.page.html',
            controller: 'InventoryDetailController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('pallet_assembly', {
            abstract: true,
            url: '/admin/report/pallet_assembly',
            templateUrl: 'app/pages/admin/pallet_assembly/pallet_assembly.page.html',
            //template:'<ui-view/>',
            controller: 'PalletAssemblyController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('pallet_assembly.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/pallet_assembly/list/pallet_assembly-list.page.html',
            controller: 'PalletAssemblyListController',
            data: {
                requiresAuth: true,
                menuID: 12,
                typeUserAllowed: [1, 2]
            }
        }).state('pallet_assembly.detail', {
            url: '/:id/detail',
            templateUrl: 'app/pages/admin/pallet_assembly/detail/pallet_assembly-detail.page.html',
            controller: 'PalletAssemblyDetailController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('inbound', {
            abstract: true,
            url: '/admin/catalog/inbound',
            templateUrl: 'app/pages/admin/inbound/inbound.page.html',
            controller: 'InboundController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('inbound.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/inbound/list/inbound-list.page.html',
            controller: 'InboundListController',
            data: {
                requiresAuth: true,
                menuID: 19,
                typeUserAllowed: [1, 2]
            }
        }).state('inbound.report', {
            url: '/report',
            templateUrl: 'app/pages/admin/inbound/report/inbound-report.page.html',
            controller: 'InboundReportController',
            data: {
                requiresAuth: true,
                menuID: 10,
                typeUserAllowed: [1, 2]
            }
        }).state('incident', {
            abstract: true,
            url: '/admin/catalog/incident',
            templateUrl: 'app/pages/admin/incident/incident.page.html',
            controller: 'IncidentController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('incident.report', {
            url: '/report',
            templateUrl: 'app/pages/admin/incident/report/incident-report.page.html',
            controller: 'IncidentReportController',
            data: {
                requiresAuth: true,
                menuID: 14,
                typeUserAllowed: [1, 2]
            }
        }).state('incident.email', {
            url: '/email',
            templateUrl: 'app/pages/admin/incident/email/email.page.html',
            controller: 'EmailController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('stock', {
            abstract: true,
            url: '/admin/catalog/stock',
            templateUrl: 'app/pages/admin/stock/stock.page.html',
            controller: 'StockController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('stock.report', {
            url: '/report',
            templateUrl: 'app/pages/admin/stock/report/stock-report.page.html',
            controller: 'StockReportController',
            data: {
                requiresAuth: true,
                menuID: 11,
                typeUserAllowed: [1, 2]
            }
        }).state('outbound', {
            abstract: true,
            url: '/admin/catalog/outbound',
            templateUrl: 'app/pages/admin/outbound/outbound.page.html',
            controller: 'OutboundController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('outbound.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/outbound/list/outbound-list.page.html',
            controller: 'OutboundListController',
            data: {
                requiresAuth: true,
                menuID: 25,
                typeUserAllowed: [1, 2]
            }
        }).state('outbound.report', {
            url: '/report',
            templateUrl: 'app/pages/admin/outbound/report/outbound-report.page.html',
            controller: 'OutboundReportController',
            data: {
                requiresAuth: true,
                menuID: 13,
                typeUserAllowed: [1, 2]
            }
        }).state('size', {
            abstract: true,
            url: '/admin/catalog/size',
            templateUrl: 'app/pages/admin/size/size.page.html',
            //template:'<ui-view/>',
            controller: 'SizeController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('size.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/size/list/size-list.page.html',
            controller: 'SizeListController',
            data: {
                requiresAuth: true,
                menuID: 1,
                typeUserAllowed: [1, 2]
            }
        }).state('size.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/size/add/size-add.page.html',
            controller: 'SizeAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('size.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/size/edit/size-edit.page.html',
            controller: 'SizeEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('variety', {
            abstract: true,
            url: '/admin/catalog/variety',
            templateUrl: 'app/pages/admin/variety/variety.page.html',
            //template:'<ui-view/>',
            controller: 'VarietyController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('variety.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/variety/list/variety-list.page.html',
            controller: 'VarietyListController',
            data: {
                requiresAuth: true,
                menuID: 2,
                typeUserAllowed: [1, 2]
            }
        }).state('variety.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/variety/add/variety-add.page.html',
            controller: 'VarietyAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('variety.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/variety/edit/variety-edit.page.html',
            controller: 'VarietyEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('destination', {
            abstract: true,
            url: '/admin/catalog/destination',
            templateUrl: 'app/pages/admin/destination/destination.page.html',
            //template:'<ui-view/>',
            controller: 'DestinationController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('destination.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/destination/list/destination-list.page.html',
            controller: 'DestinationListController',
            data: {
                requiresAuth: true,
                menuID: 3,
                typeUserAllowed: [1, 2]
            }
        }).state('destination.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/destination/add/destination-add.page.html',
            controller: 'DestinationAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('destination.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/destination/edit/destination-edit.page.html',
            controller: 'DestinationEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('box', {
            abstract: true,
            url: '/admin/catalog/box',
            templateUrl: 'app/pages/admin/box/box.page.html',
            //template:'<ui-view/>',
            controller: 'BoxController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('box.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/box/list/box-list.page.html',
            controller: 'BoxListController',
            data: {
                requiresAuth: true,
                menuID: 4,
                typeUserAllowed: [1, 2]
            }
        }).state('box.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/box/add/box-add.page.html',
            controller: 'BoxAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('box.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/box/edit/box-edit.page.html',
            controller: 'BoxEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('driver', {
            abstract: true,
            url: '/admin/catalog/driver',
            templateUrl: 'app/pages/admin/driver/driver.page.html',
            //template:'<ui-view/>',
            controller: 'DriverController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('driver.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/driver/list/driver-list.page.html',
            controller: 'DriverListController',
            data: {
                requiresAuth: true,
                menuID: 11,
                typeUserAllowed: [1, 2]
            }
        }).state('driver.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/driver/add/driver-add.page.html',
            controller: 'DriverAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('driver.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/driver/edit/driver-edit.page.html',
            controller: 'DriverEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('carrier', {
            abstract: true,
            url: '/admin/catalog/carrier',
            templateUrl: 'app/pages/admin/carrier/carrier.page.html',
            //template:'<ui-view/>',
            controller: 'CarrierController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('carrier.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/carrier/list/carrier-list.page.html',
            controller: 'CarrierListController',
            data: {
                requiresAuth: true,
                menuID: 7,
                typeUserAllowed: [1, 2]
            }
        }).state('carrier.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/carrier/add/carrier-add.page.html',
            controller: 'CarrierAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('carrier.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/carrier/edit/carrier-edit.page.html',
            controller: 'CarrierEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('farmer', {
            abstract: true,
            url: '/admin/catalog/farmer',
            templateUrl: 'app/pages/admin/farmer/farmer.page.html',
            //template:'<ui-view/>',
            controller: 'FarmerController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('farmer.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/farmer/list/farmer-list.page.html',
            controller: 'FarmerListController',
            data: {
                requiresAuth: true,
                menuID: 8,
                typeUserAllowed: [1, 2]
            }
        }).state('farmer.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/farmer/add/farmer-add.page.html',
            controller: 'FarmerAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('farmer.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/farmer/edit/farmer-edit.page.html',
            controller: 'FarmerEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('truck', {
            abstract: true,
            url: '/admin/catalog/truck',
            templateUrl: 'app/pages/admin/truck/truck.page.html',
            //template:'<ui-view/>',
            controller: 'TruckController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('truck.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/truck/list/truck-list.page.html',
            controller: 'TruckListController',
            data: {
                requiresAuth: true,
                menuID: 8,
                typeUserAllowed: [1, 2]
            }
        }).state('truck.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/truck/add/truck-add.page.html',
            controller: 'TruckAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('truck.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/truck/edit/truck-edit.page.html',
            controller: 'TruckEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('cold_box', {
            abstract: true,
            url: '/admin/catalog/cold_box',
            templateUrl: 'app/pages/admin/cold_box/cold_box.page.html',
            //template:'<ui-view/>',
            controller: 'ColdBoxController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('cold_box.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/cold_box/list/cold_box-list.page.html',
            controller: 'ColdBoxListController',
            data: {
                requiresAuth: true,
                menuID: 8,
                typeUserAllowed: [1, 2]
            }
        }).state('cold_box.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/cold_box/add/cold_box-add.page.html',
            controller: 'ColdBoxAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('cold_box.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/cold_box/edit/cold_box-edit.page.html',
            controller: 'ColdBoxEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('field_log', {
            abstract: true,
            url: '/admin/catalog/field_log',
            templateUrl: 'app/pages/admin/field_log/field_log.page.html',
            //template:'<ui-view/>',
            controller: 'FieldLogController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('field_log.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/field_log/list/field_log-list.page.html',
            controller: 'FieldLogListController',
            data: {
                requiresAuth: true,
                menuID: 13,
                typeUserAllowed: [1, 2]
            }
        }).state('field_log.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/field_log/add/field_log-add.page.html',
            controller: 'FieldLogAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('field_log.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/field_log/edit/field_log-edit.page.html',
            controller: 'FieldLogEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('gate_registration', {
            abstract: true,
            url: '/admin/catalog/gate_registration',
            templateUrl: 'app/pages/admin/gate_registration/gate_registration.page.html',
            //template:'<ui-view/>',
            controller: 'GateRegistrationController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('gate_registration.operation', {
            url: '/list',
            templateUrl: 'app/pages/admin/gate_registration/list/gate_registration-list.page.html',
            controller: 'GateRegistrationListController',
            data: {
                requiresAuth: true,
                menuID: 14,
                typeUserAllowed: [1, 2]
            }
        }).state('cold_room', {
            abstract: true,
            url: '/admin/catalog/cold_room',
            templateUrl: 'app/pages/admin/cold_room/cold_room.page.html',
            //template:'<ui-view/>',
            controller: 'ColdRoomController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('cold_room.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/cold_room/list/cold_room-list.page.html',
            controller: 'ColdRoomListController',
            data: {
                requiresAuth: true,
                menuID: 24,
                typeUserAllowed: [1, 2]
            }
        }).state('cold_room.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/cold_room/add/cold_room-add.page.html',
            controller: 'ColdRoomAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('cold_room.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/cold_room/edit/cold_room-edit.page.html',
            controller: 'ColdRoomEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('ramp', {
            abstract: true,
            url: '/admin/catalog/ramp',
            templateUrl: 'app/pages/admin/ramp/ramp.page.html',
            //template:'<ui-view/>',
            controller: 'RampController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('ramp.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/ramp/list/ramp-list.page.html',
            controller: 'RampListController',
            data: {
                requiresAuth: true,
                menuID: 25,
                typeUserAllowed: [1, 2]
            }
        }).state('ramp.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/ramp/add/ramp-add.page.html',
            controller: 'RampAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('ramp.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/ramp/edit/ramp-edit.page.html',
            controller: 'RampEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('packing', {
            abstract: true,
            url: '/admin/catalog/packing',
            templateUrl: 'app/pages/admin/packing/packing.page.html',
            //template:'<ui-view/>',
            controller: 'PackingController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('packing.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/packing/list/packing-list.page.html',
            controller: 'PackingListController',
            data: {
                requiresAuth: true,
                menuID: 26,
                typeUserAllowed: [1, 2]
            }
        }).state('packing.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/packing/add/packing-add.page.html',
            controller: 'PackingAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('packing.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/packing/edit/packing-edit.page.html',
            controller: 'PackingEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('purchaseorder', {
            abstract: true,
            url: '/admin/catalog/purchaseorder',
            templateUrl: 'app/pages/admin/purchaseorder/purchaseorder.page.html',
            //template:'<ui-view/>',
            controller: 'PurchaseOrderController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('purchaseorder.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/purchaseorder/list/purchaseorder-list.page.html',
            controller: 'PurchaseOrderListController',
            data: {
                requiresAuth: true,
                menuID: 9,
                typeUserAllowed: [1, 2]
            }
        }).state('requisitionorder', {
            abstract: true,
            url: '/admin/catalog/requisitionorder',
            templateUrl: 'app/pages/admin/requisitionorder/requisitionorder.page.html',
            //template:'<ui-view/>',
            controller: 'RequisitionOrderController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('requisitionorder.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/requisitionorder/list/requisitionorder-list.page.html',
            controller: 'RequisitionOrderListController',
            data: {
                requiresAuth: true,
                menuID: 10,
                typeUserAllowed: [1, 2]
            }
        }).state('rejection', {
            abstract: true,
            url: '/admin/catalog/rejection',
            templateUrl: 'app/pages/admin/rejection/rejection.page.html',
            //template:'<ui-view/>',
            controller: 'RejectionController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('rejection.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/rejection/list/rejection-list.page.html',
            controller: 'RejectionListController',
            data: {
                requiresAuth: true,
                menuID: 27,
                typeUserAllowed: [1, 2]
            }
        }).state('rejection.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/rejection/add/rejection-add.page.html',
            controller: 'RejectionAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('rejection.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/rejection/edit/rejection-edit.page.html',
            controller: 'RejectionEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        });

}).run(async function ($rootScope, authService) {
    console.log("*** RUN | metodo run iniciando");

    $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
        console.log("$stateChangeStart")
        //    AuthService.Check(to, from);
        //AuthService.IsLogged(to, from);
        authService.IsLogged(to);
    });

    $rootScope.$on('$stateNotFound',
        function (event, unfoundState, fromState, fromParams) {
            console.log("$stateNotFound");
            console.log(unfoundState.to);  // "lazy.state"
            console.log(unfoundState.toParams);  // {a: 1 , b: 2} 
            console.log(unfoundState.opciones); // {heredar: falso} + opciones predeterminadas 
        })

    $rootScope.$on('$stateChangeError', function (evento, toState, toParams, fromState, fromParams, error) {
        console.debug("$stateChangeError");
    });
});