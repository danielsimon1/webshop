'use strict';

angular.module('app.register', [])

    .config(function ($stateProvider) {
        $stateProvider.state('register', {
            url: '/register',
            templateUrl: 'app/login/register/register.html',
            controller: 'RegisterCtrl'
        });
    })

    .controller('RegisterCtrl', function ($scope) {
        $scope.data = {};
        $scope.data.userName = '';
        $scope.data.email = '';
        $scope.data.password = '';
        $scope.data.passwordConfirm = '';
        $scope.register = function () {
            if (!$scope.data.userName || !$scope.data.password || !$scope.data.passwordConfirm) {
                toastr.warning('Alle Felder müssen ausgefüllt werden!', 'Fehlende Informationen!')
            } else if (!$scope.email) {
                toastr.warning('Die Email-Adresse ist ungültig!', 'Fehlerhafte Informationen!')
            } else if ($scope.data.password != $scope.data.passwordConfirm) {
                toastr.warning('Die Passwörter stimmen nicht überein.', 'Fehlerhafte Informationen!')
            } else {
                toastr.success('Registrierung war valid.');                
            }
        }
    });