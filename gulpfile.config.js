module.exports = {
    paths: {
        index: 'src/index.html',
        html: ['src/{app,common}/**/*.html', '!src/index.html'],
        sass: ['src/{app,common}/**/*.scss'],
        sassMain: ['src/app/main.scss'],
        bower: 'bower_components',
        assets: ['src/assets/**/*.*'],
        assetsBase: 'src/',
        js: ['src/app/app.js', 'src/{app,common}/**/*.js'],
        dist: 'dist'
    }, bower: {
        js: [
            'angular/angular.min.js',
            'jquery/dist/jquery.min.js',
            'angular-animate/angular-animate.min.js',
            'angular-loading-bar/build/loading-bar.min.js',
            'angular-local-storage/dist/angular-local-storage.min.js',
            'angular-touch/angular-touch.min.js',
            'angular-ui-router/release/angular-ui-router.min.js',
            'bootstrap/dist/js/bootstrap.min.js',
            'angular-bootstrap/ui-bootstrap-tpls.min.js',
            'jasny-bootstrap/dist/js/jasny-bootstrap.min.js',
            'angular-md5/angular-md5.min.js',
            'textAngular/dist/textAngular-rangy.min.js',
            'textAngular/dist/textAngular-sanitize.min.js',
            'textAngular/dist/textAngular.min.js',
            'toastr/toastr.min.js'
        ]
        , css: [
            'bootstrap/dist/css/bootstrap.min.css',
            'angular-bootstrap/ui-bootstrap-csp.css',
            'angular-loading-bar/build/loading-bar.min.css',
            'jasny-bootstrap/dist/css/jasny-bootstrap.min.css',
            'textAngular/dist/textAngular.css',
            'font-awesome/css/font-awesome.min.css',
            'toastr/toastr.min.css'
        ], assets: {
            bootstrapFonts: {
                src: ['bootstrap/fonts/*.*'],
                base: 'bootstrap/'
            },
            fontAwesomeFonts: {
                src: ['font-awesome/fonts/*.*'],
                base: 'font-awesome'
            }
        }
    }
};