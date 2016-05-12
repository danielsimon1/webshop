'use strict';

angular.module('app.login', [])

    .config(function ($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        });
    })

    .controller('LoginCtrl', function () {

    });