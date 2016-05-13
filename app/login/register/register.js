'use strict';

angular.module('app.register', [])

    .config(function ($stateProvider) {
        $stateProvider.state('register', {
            url: '/register',
            templateUrl: 'login/register/register.html',
            controller: 'RegisterCtrl'
        });
    })

    .controller('RegisterCtrl', function ($scope) {
        $scope.data = {};
        $scope.register = function () {
            
        }
    });