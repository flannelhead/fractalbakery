(function() {

angular.module('fractalBakery').factory('fractalRenderer', ['$q',
    function($q) {
    var workers = [];

    return {
        render: function(config, width, height, maxIter) {
            return $q(function(resolve, reject) {
                var workerFile = PRODUCTION ? 'renderworker.min.js' :
                    'renderworker.js';
                var worker = new Worker(workerFile);
                worker.postMessage({
                    config: config,
                    width: width,
                    height: height,
                    maxIter: maxIter
                });
                worker.onmessage = function(event) {
                    resolve(event.data);
                };
                workers.push(worker);
            });
        },

        cancelAll: function() {
            workers.forEach(function(worker) { worker.terminate(); });
            workers = [];
        }
    };
}]);
})();

