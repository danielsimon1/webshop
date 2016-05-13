'use strict';

angular.module('app.passwordForget', [])

    .config(function ($stateProvider) {
        $stateProvider.state('passwordForget', {
            url: '/passwordForget',
            templateUrl: 'login/passwordForget/passwordForget.html',
            controller: 'PasswordForgetCtrl'
        });
    })

    .controller('PasswordForgetCtrl', function ($scope) {
        $scope.data = {};
        $scope.data.email = '';
        $scope.submit = function () {
            if (!$scope.email) {
                toastr.warning('Ungültige Email-Adresse!');
            } else {
                toastr.success('Gültige Eingabe.');
            }
        }
    });