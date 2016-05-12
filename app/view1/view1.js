'use strict';

angular.module('app.view1', [])

    .config(function ($stateProvider) {
        $stateProvider.state('view1', {
            url: '/view1',
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    })

    .controller('View1Ctrl', function () {

    });