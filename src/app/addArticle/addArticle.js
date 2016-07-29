angular.module('app.addArticle', [])

    .config(function ($stateProvider) {
        $stateProvider.state('addArticle', {
            url : '/addArticle',
            templateUrl : 'app/addArticle/addArticle.html',
            controller : 'AddArticleCtrl'
        });
    })

    .controller('AddArticleCtrl', function ($scope, articles, $log, $state, localStorageService, user, $rootScope) {
        var currentUser = localStorageService.get("user") || {};
        if (angular.equals({}, currentUser)) {
            toastr.info("Sie müssen sich einloggen, um diese Seite zu sehen");
            $state.go("login");
        } else {
            user.authenticate(currentUser.userName, currentUser.password)
                .then(function (response) {
                    localStorageService.set("user", response);
                    currentUser = response;
                    if (currentUser.role != "admin") {
                        toastr.info("Diese Seite ist geschützt!");
                        $state.go("home");
                    }
                }, function () {
                    toastr.error("Fehler bei der Authentifizierung");
                    toastr.warning("Sie werden nun automatisch ausgeloggt");
                    $rootScope.logout();
                });
        }
        $scope.selected = {};
        $scope.selected.platform = {};
        $scope.selected.fsk = '0';
        $scope.isTouched = false;
        $scope.isPriceInvalid = false;
        $scope.isPriceTouched = false;
        $scope.isCustomGenre = false;
        $scope.genreButtonText = 'Neues Genre anlegen';
        $scope.isLoading = false;

        // function that returns all selected checkboxes
        function checkPlatforms() {
            var selected = [];
            angular.forEach($scope.selected.platform, function (bool, key) {
                if (bool) {
                    selected.push(key);
                }
            });
            return selected;
        }

        $scope.genres = localStorageService.get("genres") || [];
        articles.getAllArticles()
            .then(function () {
                $scope.genres = localStorageService.get("genres") || [];
            }, function (error) {
                toastr.error(error);
            });

        function validatePrice(input) {
            return /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/.test(input);
        }

        // toggle between selecting existing genres and typing in a new genre
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
            $scope.titleRegex = /^.{4,60}$/;
            $scope.genreRegex = /^.{4,20}$/;
            $scope.languageRegex = /^.{4,15}$/;
            $scope.descriptionRegex = /^.{1,8000}$/;

            if ($scope.title && (($scope.selected.genre && !$scope.isCustomGenre) || ($scope.customGenre && $scope.isCustomGenre && $scope.genreRegex.test($scope.customGenre)))
                && $scope.price && $scope.descriptionRegex.test($scope.description) && ($scope.selected.platform.wiiu ||
                $scope.selected.platform.windows || $scope.selected.platform.ps || $scope.selected.platform.xbox ||
                $scope.selected.platform.osx) && $scope.release && $scope.language && $scope.minRam && $scope.languageRegex.test($scope.language) &&
                $scope.minProcessor && $scope.description && $scope.image && $scope.titleRegex.test($scope.title)) {
                if (!validatePrice($scope.price)) {
                    toastr.warning('Ungültiger Preis!');
                    $scope.isPriceInvalid = true;
                } else if (!$scope.isInt($scope.minRam)) {
                    toastr.warning('Der Arbeitsspeicher muss mit einer natürlichen Zahl angegeben werden!');
                } else if (!$scope.isFloat($scope.minProcessor) && !$scope.isInt($scope.minProcessor)) {
                    toastr.warning('Der Prozessor muss mit einer Zahl angegeben werden! Für Nachkommastellen den Punkt verwenden!');
                } else {
                    $scope.isLoading = true;
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
                    articles.addArticle(data)
                        .then(function (response) {
                            $scope.isLoading = false;
                            toastr.success(response);
                            $state.go("home");
                        }, function (error) {
                            $scope.isLoading = false;
                            if (!error) {
                                toastr.error("Ein unbekannter Fehler ist aufgetreten!");
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