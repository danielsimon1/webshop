angular.module('app.addArticle', [])

    .config(function ($stateProvider) {
        $stateProvider.state('addArticle', {
            url : '/addArticle',
            templateUrl : 'app/addArticle/addArticle.html',
            controller : 'AddArticleCtrl'
        });
    })

    .controller('AddArticleCtrl', function ($scope, articles, $log, $state) {
        $scope.selected = {};
        $scope.selected.platform = {};
        $scope.selected.fsk = '0';
        $scope.isTouched = false;
        $scope.isPriceInvalid = false;
        $scope.isPriceTouched = false;
        $scope.isCustomGenre = false;
        $scope.genreButtonText = 'Neues Genre anlegen';

        function checkPlatforms() {
            var selected = [];
            angular.forEach($scope.selected.platform, function (bool, key) {
                if (bool) {
                    selected.push(key);
                }
            });
            return selected;
        }


        articles.getAllGenres()
            .then(function (response) {
                $scope.genres = response;
            }, function (error) {
                $log.error(error);
            });

        function validatePrice(input) {
            return /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/.test(input);
        }

        $scope.changeInputStyle = function () {
            $scope.isCustomGenre ? $scope.isCustomGenre = false : $scope.isCustomGenre = true;
            $scope.genreButtonText == 'Neues Genre anlegen' ? $scope.genreButtonText = 'Vorhandenes Genre auswählen' : $scope.genreButtonText = 'Neues Genre anlegen';
        };

        $scope.priceValidation = function () {
            $scope.isPriceTouched = true;
            !validatePrice($scope.price) ? $scope.isPriceInvalid = true : $scope.isPriceInvalid = false;
        };

        $scope.imageToBase64 = function (input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    console.log('image successfully converted to Base64');
                    $scope.image = e.target.result;
                    $scope.$apply();
                };

                reader.readAsDataURL(input.files[0]);
            }
        };

        $scope.isInt = function (n) {
            n = parseInt(n);
            return Number(n) === n && n % 1 === 0;
        };

        $scope.isFloat = function (n) {
            n = parseFloat(n);
            return Number(n) === n && n % 1 !== 0;
        };

        $scope.addArticle = function () {
            $scope.isTouched = true;
            $scope.isPriceTouched = true;
            $scope.isPriceInvalid = false;
            if ($scope.title && (($scope.selected.genre && !$scope.isCustomGenre) || ($scope.customGenre && $scope.isCustomGenre))
                && $scope.price && ($scope.selected.platform.wiiu ||
                $scope.selected.platform.windows || $scope.selected.platform.ps || $scope.selected.platform.xbox ||
                $scope.selected.platform.osx) && $scope.release && $scope.language && $scope.minRam &&
                $scope.minProcessor && $scope.description && $scope.image) {
                if (!validatePrice($scope.price)) {
                    toastr.warning('Ungültiger Preis!');
                    $scope.isPriceInvalid = true;
                } else if (!$scope.isInt($scope.minRam)) {
                    toastr.warning('Der Arbeitsspeicher muss mit einer natürlichen Zahl angegeben werden!');
                } else if (!$scope.isFloat($scope.minProcessor) && !$scope.isInt($scope.minProcessor)) {
                    toastr.warning('Der Prozessor muss mit einer Zahl angegeben werden! Für Nachkommastellen den Punkt verwenden!');
                } else {
                    var date = new Date($scope.release).getTime();
                    var data = {
                        id : 2,
                        name : $scope.title,
                        genre : $scope.isCustomGenre ? $scope.customGenre : $scope.selected.genre,
                        price : $scope.price,
                        fsk : $scope.selected.fsk,
                        platforms : checkPlatforms(),
                        release : date.toString(),
                        language : $scope.language,
                        minRam : $scope.minRam,
                        minProcessor : $scope.minProcessor,
                        description : $scope.description,
                        image : $scope.image
                    };
                    console.log(data);
                    articles.addArticle(data)
                        .then(function (response) {
                            toastr.success(response);
                            $state.go("home");
                        }, function (error) {
                            if (!error) {
                                toastr.error("Fehler bei der Verbindung zum Server!");
                            } else {
                                toastr.error(error);
                            }
                        })
                }
            } else {
                toastr.warning('Fehlende Informationen!');
            }
        }
    });