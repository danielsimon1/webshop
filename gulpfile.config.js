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
            'angular/angular.js',
            'jquery/dist/jquery.min.js',
            'angular-animate/angular-animate.min.js',
            'angular-local-storage/dist/angular-local-storage.min.js',
            'angular-touch/angular-touch.min.js',
            'angular-ui-router/release/angular-ui-router.min.js',
            'bootstrap/dist/js/bootstrap.min.js',
            'angular-bootstrap/ui-bootstrap.min.js',
            'toastr/toastr.min.js'
        ]
        , css: [
            'bootstrap/dist/css/bootstrap.min.css',
            'angular-bootstrap/ui-bootstrap-csp.css',
            'toastr/toastr.min.css'
        ], assets: {
            bootstrapFonts: {
                src: ['bootstrap/fonts/*.*'],
                base: 'bootstrap/'
            }
        }
    }
};