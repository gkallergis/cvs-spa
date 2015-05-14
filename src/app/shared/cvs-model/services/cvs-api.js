define(['shared/cvs-model/module', 'lodash'], function (module, _) {

    'use strict';
    module.registerFactory('CVSService', function (SERVICE_ENDPOINT, $rootScope, $http, $q, $log, $timeout) {

    	var artificial_delay = 0;

        function _makeGETRequest(filename) {
        	var deferred = $q.defer();

			$http.get(SERVICE_ENDPOINT.url + filename)
			.success(function(data){
				$timeout(function(){
					deferred.resolve(data);
					$log.info('[CVS_SERVICE] Retrieved [' + filename + '].');
				}, artificial_delay);
			})
			.error(function(response){
				deferred.reject(response);
				$log.error('[CVS_SERVICE] Failed to retrieve [' + filename + '].');
			});

			return deferred.promise;
		}

		function _makeRequest(endpoint, method, data) {
			var deferred = $q.defer();

			var localeOptions = ($rootScope.i18n)?"?lang=" + $rootScope.i18n.activeLanguage.key:"?lang=us";

			var request = {
				method: method,
 				url: SERVICE_ENDPOINT.url + endpoint + localeOptions,
 				headers: {},
 				data: data
			}
			$http(request)
			.success(function(data){
				$timeout(function(){
					deferred.resolve(data);
					$log.info('[CVS_SERVICE] Request Success (' + endpoint + ')');
					$log.debug(data);
				}, artificial_delay);
			})
			.error(function(response){
				deferred.reject(response);
				$log.debug(response);
				$log.error('[CVS_SERVICE] Request Failure (' + endpoint + ')');
			});

			return deferred.promise;
		}

		return {
			login: function(email, password) {
				return _makeRequest('login', 'POST', {"email": email, "password": password});
			},
			getSystemLog: function() {
				return _makeGETRequest('system-log.json');
			},
			getCompanies: function() {
				return _makeGETRequest('company-list.json');
			},
			getCompanyProfile: function(id) {
				return _makeGETRequest('companies/company-' + id + '.json');
			},
			getProfiles: function() {
				return _makeGETRequest('profile-list.json');
			},
			getUserProfile: function(id) {
				return _makeGETRequest('users/user-' + id + '.json');
			},
			getUserRoles: function(id) {
				return _makeGETRequest('user-roles.json');
			},
			getOrders: function() {
				return _makeGETRequest('order-list.json');
			},
			getInvoices: function() {
				return _makeGETRequest('invoice-list.json');	
			},
			getInvoice: function(id) {
				return _makeGETRequest('invoices/invoice-' + id + '.json');
			},
			getSalesData: function() {
				return _makeGETRequest('sales-data-list.json');	
			},
			getProducts: function() {
				return _makeGETRequest('product-list.json');	
			},
			getOwnedProducts: function() {
				return _makeGETRequest('owned-products-list.json');	
			},
			getReports: function() {
				return _makeGETRequest('report-list.json');
			},
		};
    });
});
