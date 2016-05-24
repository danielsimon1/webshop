angular.module('app.gameDetail')
    .controller('RatingCtrl', function ($scope, $uibModalInstance, stars) {
        
        $scope.stars = stars;
        $scope.message = '';
        $scope.title = '';
        $scope.submit = function () {
            var result = {
                title: $scope.title,
                message: $scope.message,
                stars: $scope.stars
            };
            $uibModalInstance.close(result);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    });