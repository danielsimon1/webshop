angular.module('app')
    .factory('user', function ($q, $http) {
        var service = {};

        service.addUser = function (input) {
            var q = $q.defer();
            var data = {
                ID: '0',
                Benutzername: input.userName,
                Passwort: input.password,
                Email: input.email,
                Rolle: input.role
            };
            $http.post('http://localhost:8080/rest/user/add', data)
                .then(function(response) {
                    if (response.data == "User konnte nicht angelegt werden" || response.data == "User existiert bereits") {
                        q.reject(response.data);
                    } else {
                        q.resolve(response.data);
                    }
                });
            return q.promise;
        };

        service.login = function (input) {
            var q = $q.defer();
            $http.get('http://localhost:8080/rest/user/get/' + input.userName)
                .then(function (response) {
                    if (response.data == "User konnten nicht geladen werden") {
                        q.reject(response.data);
                    } else if (response.data.Benutzername == "null") {
                        q.reject("Benutzer existiert nicht!")
                    } else if (response.data.Passwort === input.password) {
                        console.log(response);
                        q.resolve({role: response.data.Rolle, id: response.data.ID});
                    } else {
                        q.reject("Passwort falsch!");
                    }
                }, function (error) {
                    q.reject(error.message);
                });

            return q.promise;
        };

        return service;
    });