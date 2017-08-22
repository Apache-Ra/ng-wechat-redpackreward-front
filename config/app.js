define(['angular', 'angular-async-loader', 'module', 'angular-ui-router','angular-css'], function (angular, asyncLoader, module) {

    var app = angular.module('app', ['ui.router','door3.css']);

    asyncLoader.configure(app);

    module.exports = app;
});
