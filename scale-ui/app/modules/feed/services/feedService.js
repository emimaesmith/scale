(function () {
    'use strict';
    angular.module('scaleApp').service('feedService', function ($location, $timeout, $q, $http, scaleConfig, Ingest) {

        var getFeedParams = function (params) {
            if(!params) { params = {}; }
            var p = {};
            p.page_size = 1000;
            p.started = params.started ? params.started : moment.utc().add(-7,'days').startOf('d').toDate();
            p.ended = params.ended ? params.ended : moment.utc().toDate();
            p.use_ingest_time = params.use_ingest_time ? params.use_ingest_time : null;
            return p;
        };

        var getIngestsParams = function (params) {
            return params;
        };

        var getSourceParams = function (page, page_size, started, ended, order, is_parsed, file_name) {
            return {
                page: page,
                page_size: page_size ? page_size : 1000,
                started: started,
                ended: ended,
                order: order ? order : '-last_modified',
                is_parsed: is_parsed,
                file_name: file_name
            };
        };

        return {
            getFeed: function (params) {
                var d = $q.defer();
                var params = getFeedParams(params);
                $http({
                    url: scaleConfig.urls.apiPrefix + 'ingests/status/',
                    method: 'GET',
                    params: params
                }).success(function (data) {
                    d.resolve(data);
                }).error(function (error) {
                    d.reject(error);
                });
                return d.promise;
            },
            getIngestsOnce: function (params) {
                var d = $q.defer();
                var params = getIngestsParams(params);
                $http({
                    url: scaleConfig.urls.apiPrefix + 'ingests/',
                    method: 'GET',
                    params: params
                }).success(function (data) {
                    data.results = Ingest.transformer(data.results);
                    d.resolve(data);
                }).error(function (error) {
                    d.reject(error);
                });
                return d.promise;
            },
            getSources: function (params) {
                params = params || getSourceParams();
                var d = $q.defer();
                $http({
                    url: scaleConfig.urls.apiPrefix + 'sources/',
                    method: 'GET',
                    params: params
                }).success(function (data) {
                    d.resolve(data);
                }).error(function (error) {
                    d.reject(error);
                });
                return d.promise;
            },
            getSourceDetails: function (id) {
                var d = $q.defer();
                $http({
                    url: scaleConfig.urls.apiPrefix + 'sources/' + id + '/',
                    method: 'GET'
                }).success(function (data) {
                    d.resolve(data);
                }).error(function (error) {
                    d.reject(error);
                });
                return d.promise;
            }
        };
    });
})();
