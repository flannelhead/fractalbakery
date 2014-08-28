if (typeof PRODUCTION === 'undefined') PRODUCTION = false;
(function() {

var fb = angular.module('fractalBakery', []);
fb.controller('MainCtrl', ['$scope', function($scope) {
    $scope.fractalParams = {
        eps: 1e-10,
        maxIter: 25,

        reMin: -2,
        reMax: 2,
        imMin: 2,
        imMax: -2,

        roots: [
            { root: { Re: -1, Im: 0 }, hue: 0 },
            { root: { Re:  0, Im: 0 }, hue: 0.333 },
            { root: { Re:  1, Im: 0 }, hue: 0.667 }
        ]
    };

    $scope.width = 800;
    $scope.height = 800;
    $scope.tolExponent = 10;

    $scope.updateTolerance = function() {
        $scope.fractalParams.eps = Math.pow(10, -1 * $scope.tolExponent);
    };

    $scope.reToX = function(Re) {
        return $scope.width /
            ($scope.fractalParams.reMax - $scope.fractalParams.reMin) *
            (Re - $scope.fractalParams.reMin);
    };

    $scope.imToY = function(Im) {
        return $scope.height /
            ($scope.fractalParams.imMax - $scope.fractalParams.imMin) *
            (Im - $scope.fractalParams.imMin);
    };
}]);

})();

