angular.module('app.addArticle', [])

    .config(function ($stateProvider) {
        $stateProvider.state('addArticle', {
            url: '/addArticle',
            templateUrl: 'app/addArticle/addArticle.html',
            controller: 'AddArticleCtrl'
        });
    })

    .controller('AddArticleCtrl', function ($scope, $http) {
        $scope.selected = {};
        $scope.selected.platform = {};
        $scope.selected.fsk = '0';
        $scope.isTouched = false;
        $scope.isPriceInvalid = false;
        $scope.isPriceTouched = false;
        $http.get('../assets/json/genres.json')
            .then(function (response) {
                $scope.genres = response.data;
            }, function (error) {
                console.log(error);
            });
        function validatePrice(input) {
            return /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/.test(input);
        }

        $scope.priceValidation = function () {
            $scope.isPriceTouched = true;
            !validatePrice($scope.price) ? $scope.isPriceInvalid = true : $scope.isPriceInvalid = false;
        };

        $scope.addArticle = function () {
            $scope.isTouched = true;
            $scope.isPriceTouched = true;
            $scope.isPriceInvalid = false;
            if ($scope.title && $scope.selected.genre && $scope.price && ($scope.selected.platform.wiiu ||
                $scope.selected.platform.windows || $scope.selected.platform.ps || $scope.selected.platform.xbox ||
                $scope.selected.platform.osx) && $scope.release && $scope.language && $scope.minRam &&
                $scope.minProcessor && $scope.description) {
                if (!validatePrice($scope.price)) {
                    toastr.warning('Ungültiger Preis!');
                    $scope.isPriceInvalid = true;
                } else {
                    toastr.success('Top');
                }
            } else {
                toastr.warning('Fehlende Informationen!');
            }
        }
    });