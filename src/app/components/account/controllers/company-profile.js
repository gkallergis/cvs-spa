define(['components/account/module', 'lodash', 'notification'], function (module, _) {

	'use strict';
	module.registerController('CompanyProfileController', function ($scope, AccountModel, $state, $log) {
		$scope.company = AccountModel.getCurrentCompany();
		$scope.company.list = AccountModel.getCompanyList();
		$scope.countries = AccountModel.getCountryList();
		$scope.user_profiles = AccountModel.getProfileList();

		$scope.mw = {
			bespokeCurrencyModal: {
				visibility: false,
				data: {}
			},
			editCompanyInfoModal: {
				visibility: false,
				data: {}
			},
			attachManagingAccountModal: {
				visibility: false,
				data: {}
			},
			attachToCompanyModal: {
				visibility: false,
				data: {}
			}
		};
		$scope.showModal = function(modal){
			if(modal === 'editCompanyInfoModal') {
				$scope.mw.editCompanyInfoModal.data = _.clone($scope.company);
			} else if(modal === 'attachManagingAccountModal') {
				$scope.mw.attachManagingAccountModal.data.id = $scope.company.managing_account.id;
			} else if(modal === 'attachToCompanyModal') {
				if($scope.company.parent_company != null) {
					$scope.mw.attachToCompanyModal.data.id = $scope.company.parent_company.id;
				}
			}

			$scope.mw[modal].visibility = !$scope.mw[modal].visibility;
	    };

		$scope.refreshPage = function() {
			$state.go($state.current, {}, {reload: true});
		};

		// Actions
		$scope.setBespokeCurrency = function() {
			AccountModel.setBespokeCurrency({
				"company": $scope.company.id,
				"bespoke_code": $scope.mw.bespokeCurrencyModal.data.bespoke,
				"iso_code": $scope.mw.bespokeCurrencyModal.data.iso
			}).then(function() {
				$scope.refreshPage();
			});
		};

		$scope.editCompanyInformation = function() {
			AccountModel.editCompany({
				"company": $scope.company.id,
				"reg_number": $scope.mw.editCompanyInfoModal.data.reg_number,
				"name": $scope.mw.editCompanyInfoModal.data.name,
				"phone": $scope.mw.editCompanyInfoModal.data.phone,
				"primary_address": $scope.mw.editCompanyInfoModal.data.primary_address,
				"secondary_address": $scope.mw.editCompanyInfoModal.data.secondary_address,
				"postcode": $scope.mw.editCompanyInfoModal.data.postcode,
				"city": $scope.mw.editCompanyInfoModal.data.city,
				"country": $scope.mw.editCompanyInfoModal.data.country
			}).then(function() {
				$scope.refreshPage();
			});
		};

		$scope.attachManagingAccount = function() {
			AccountModel.attachManagingAccount({
				"company": $scope.company.id,
				"managing_account": $scope.mw.attachManagingAccountModal.data.id
			}).then(function() {
				$scope.refreshPage();
			});
		};

		$scope.attachToCompany = function() {
			AccountModel.attachToCompany({
				"company": $scope.company.id,
				"parent_company": $scope.mw.attachToCompanyModal.data.id
			}).then(function() {
				$scope.refreshPage();
			});
		};

		$scope.deleteCompany = function(id) {
			$.SmartMessageBox({
                title: "Delete Company!",
                content: "You are about to delete " + $scope.company.name + "! Are you sure?",
                buttons: '[Cancel][Delete]'
            }, function (key_press) {
				if (key_press === "Delete") {
                	AccountModel.deleteProfile(id)
					.then(function(){
						$.smallBox({
	                        title: "Company Deleted",
	                        content: "Company " + $scope.company.name + " was deleted!",
	                        color: "#C46A69",
	                        icon: "fa fa-trash-o swing animated",
	                        timeout: 4000
	                    });
	                    $state.go('app.company', {});
					});
                }
            });
		};
	});
});
