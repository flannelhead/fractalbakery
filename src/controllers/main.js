if (typeof PRODUCTION === 'undefined') PRODUCTION = false;
(function() {

var fb = angular.module('fractalBakery', []);
fb.controller('MainCtrl', ['$scope', function($scope) {
    $scope.fractalParams = {
        eps: 1e-10,
        maxIter: 25,

        bounds: {
            reMin: -2,
            reMax: 2,
            imMin: 2,
            imMax: -1
        },

        roots: [
            { root: { Re: -1, Im: 0 }, hue: 0 },
            { root: { Re:  0, Im: 1 }, hue: 0.167 },
            { root: { Re:  0, Im: 0 }, hue: 0.333 },
            { root: { Re:  1, Im: 0 }, hue: 0.667 }
        ]
    };
    var fp = $scope.fractalParams;

    $scope.width = 800;
    $scope.height = 600;
    $scope.tolExponent = 10;
    $scope.activeRoot = fp.roots[0];

    $scope.zoomStack = [];

    $scope.updateTolerance = function() {
        fp.eps = Math.pow(10, -1 * $scope.tolExponent);
    };

    $scope.reToX = function(Re) {
        return $scope.width / (fp.bounds.reMax - fp.bounds.reMin) *
            (Re - fp.bounds.reMin);
    };

    $scope.imToY = function(Im) {
        return $scope.height / (fp.bounds.imMax - fp.bounds.imMin) *
            (Im - fp.bounds.imMin);
    };

    $scope.xToRe = function(x) {
        return (fp.bounds.reMax - fp.bounds.reMin) / $scope.width * x +
            fp.bounds.reMin;
    };

    $scope.yToIm = function(y) {
        return (fp.bounds.imMax - fp.bounds.imMin) / $scope.height * y +
            fp.bounds.imMin;
    };

    function mouseToComplex(mouse) {
        return {
            Re: $scope.xToRe(mouse.x),
            Im: $scope.yToIm(mouse.y)
        };
    }

    var fractalViewer = jQuery('#fractal fractal-viewer'), win = jQuery(window);
    function mouseCoords($event) {
        var offset = fractalViewer.offset();
        return {
            x: $event.clientX - offset.left + win.scrollLeft(),
            y: $event.clientY - offset.top + win.scrollTop()
        };
    }

    $scope.mouseMove = function($event) {
        if ($scope.dragRoot) {
            $scope.dragRoot.root = mouseToComplex(mouseCoords($event));
        } else if ($scope.zooming) {
            updateZoomPath($event);
        }
    };

    function preserveAspect(startPoint, endPoint) {
        var dx = endPoint.x - startPoint.x,
            dy = endPoint.y - startPoint.y;

        var newDy = Math.abs(dx) * $scope.height / $scope.width;
        if (dy < 0) newDy *= -1;
        return {
            x: endPoint.x,
            y: startPoint.y + newDy
        };
    }

    function updateZoomPath($event) {
        var endPoint = mouseCoords($event);
        if (!$event.ctrlKey) {
            endPoint = preserveAspect($scope.zoomBegin, endPoint);
        }
        $scope.zoomPath = 'M' + ($scope.zoomBegin.x + 0.5) + ',' +
            ($scope.zoomBegin.y + 0.5) + ' H' + (endPoint.x + 0.5) + ' V' +
            (endPoint.y + 0.5) + ' H' + ($scope.zoomBegin.x + 0.5) + ' z';
    }

    $scope.rootColour = function(root) {
        return 'hsl(' + Math.round(root.hue * 360) + ',80%,60%)';
    };

    function randomQuantized(N) {
        return Math.floor(Math.random() * N) / N;
    }

    $scope.addNewRoot = function() {
        var newRoot = {
            root: {
                Re: fp.bounds.reMin + randomQuantized(100) *
                    (fp.bounds.reMax - fp.bounds.reMin),
                Im: fp.bounds.imMin + randomQuantized(100) *
                    (fp.bounds.imMax - fp.bounds.imMin)
            },

            hue: randomQuantized(100)
        };
        fp.roots.push(newRoot);
        $scope.activeRoot = newRoot;
    };

    $scope.removeActiveRoot = function() {
        if (fp.roots.length === 2) {
            alert('Must have at least one root.');
            return;
        }

        var index = fp.roots.indexOf($scope.activeRoot);
        fp.roots.splice(index, 1);
        $scope.activeRoot = fp.roots[0];
    };

    $scope.beginZooming = function($event) {
        if ($scope.zooming) return;

        $scope.zooming = true;

        var point = mouseCoords($event),
            complex = mouseToComplex(point);
        $scope.zoomBegin = {
            Re: complex.Re,
            Im: complex.Im,
            x: point.x,
            y: point.y
        };
    };

    $scope.zoomToMouse = function($event) {
        if (!$scope.zooming) return;

        $scope.zooming = false;
        $scope.zoomPath = 'M0,0';

        var point = mouseCoords($event);
        if (!$event.ctrlKey) {
            point = preserveAspect($scope.zoomBegin, point);
        }
        var complex = mouseToComplex(point);

        $scope.zoomStack.push(fp.bounds);

        fp.bounds = {
            reMin: Math.min($scope.zoomBegin.Re, complex.Re),
            reMax: Math.max($scope.zoomBegin.Re, complex.Re),
            imMin: Math.max($scope.zoomBegin.Im, complex.Im),
            imMax: Math.min($scope.zoomBegin.Im, complex.Im)
        };
    };

    $scope.restorePreviousZoom = function() {
        fp.bounds = $scope.zoomStack.pop();
    };
}]);

})();

