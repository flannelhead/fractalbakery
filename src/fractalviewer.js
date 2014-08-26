(function() {

angular.module('fractalBakery').directive('fractalViewer', ['fractalRenderer',
    function(fractalRenderer) {
    return {
        templateUrl: 'fractalviewer.html',
        restrict: 'E',
        scope: {
            params: '=params'
        },
        link: function(scope, element, attrs) {
            var division = 3, previewSize = 150;
            element.addClass('fractalviewer');

            scope.$watch('params', render, true);
            scope.$watch(function() { return element.width(); },
                updateSize);
            scope.$watch(function() { return element.height(); },
                updateSize);

            var previewCanvas = element.find('.previewcanvas'),
                fractalCanvas = element.find('.fractalcanvas'),
                width, height, previewWidth, previewHeight, blockWidth,
                blockHeight;

            function render() {
                fractalRenderer.cancelAll();
                var previewCtx = previewCanvas[0].getContext('2d'),
                    fractalCtx = fractalCanvas[0].getContext('2d');
                fractalCtx.clearRect(0, 0, width, height);
                // Render the preview image
                fractalRenderer.render(scope.params, previewWidth,
                    previewHeight)
                    .then(function(data) {
                    renderFullImage(data.exposure);
                    var imageData = previewCtx.createImageData(previewWidth,
                        previewHeight);
                    imageData.data.set(new Uint8ClampedArray(data.buffer));
                    previewCtx.putImageData(imageData, 0, 0);
                });

                function renderFullImage(exposure) {
                    // Render the full resolution image in blocks
                    var params = scope.params,
                        reScale = (params.reMax - params.reMin) / (width - 1),
                        imScale = (params.imMax - params.imMin) / (height - 1);

                    function renderBlock(x, y, w, h) {
                        var reMin = params.reMin + reScale * x,
                            imMin = params.imMin + imScale * y;
                        var config = {
                            reMin: reMin,
                            imMin: imMin,
                            reMax: reMin + reScale * w,
                            imMax: imMin + imScale * h,

                            eps: params.eps,
                            maxIter: params.maxIter,

                            roots: params.roots
                        };

                        fractalRenderer.render(config, w, h, exposure)
                            .then(function(data) {
                            var imageData = fractalCtx.createImageData(w, h);
                            imageData.data.set(new Uint8ClampedArray(data.buffer));
                            fractalCtx.putImageData(imageData, x, y);
                        });
                    }

                    var hRemainder = height, wRemainder, h, w;
                    while (hRemainder > 0) {
                        wRemainder = width;
                        if (hRemainder >= blockHeight) {
                            h = blockHeight;
                        } else {
                            h = hRemainder;
                        }
                        while (wRemainder > 0) {
                            if (wRemainder >= blockWidth) {
                                w = blockWidth;
                            } else {
                                w = wRemainder;
                            }
                            renderBlock(width - wRemainder, height - hRemainder,
                                w, h);

                            wRemainder -= w;
                        }
                        hRemainder -= h;
                    }
                }
            }

            function updateSize() {
                width = element.width();
                height = element.height();
                if (width > height) {
                    previewWidth = previewSize;
                    previewHeight = Math.floor(height / width * previewSize);
                } else {
                    previewHeight = previewSize;
                    previewWidth = Math.floor(width / height * previewSize);
                }
                blockWidth = Math.floor(width / division);
                blockHeight = Math.floor(height / division);
                previewCanvas.attr('width', previewWidth);
                previewCanvas.attr('height', previewHeight);
                fractalCanvas.attr('width', width);
                fractalCanvas.attr('height', height);
                render();
            }
            updateSize();
        }
    };
}]);

})();

