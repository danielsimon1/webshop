angular.module('app')
    .factory('user', function ($q, $http, localStorageService) {
        var service = {};

        service.addUser = function (input) {
            var q = $q.defer();
            var data = {
                ID : '0',
                Benutzername : input.userName,
                Passwort : input.password,
                Email : input.email,
                Rolle : input.role
            };
            $http.post('http://localhost:8080/rest/user/add', data)
                .then(function (response) {
                    if (response.data == "User konnte nicht angelegt werden" || response.data == "User existiert bereits") {
                        q.reject(response.data);
                    } else {
                        q.resolve(response.data);
                    }
                }, function (error) {
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.login = function (input) {
            var q = $q.defer();
            $http.get('http://localhost:8080/rest/user/get/' + input.userName)
                .then(function (response) {
                    console.log(response);
                    if (response.data == "User konnten nicht geladen werden") {
                        q.reject(response.data);
                    } else if (response.data.Benutzername == "null") {
                        q.reject("Benutzer existiert nicht!")
                    } else if (response.data.Passwort === input.password) {
                        q.resolve({role : response.data.Rolle, id : response.data.ID});
                    } else {
                        q.reject("Passwort falsch!");
                    }
                }, function (error) {
                    q.reject(error.statusText);
                });

            return q.promise;
        };

        service.getAllUsers = function () {
            var q = $q.defer();

            $http.get("http://localhost:8080/rest/users/get")
                .then(function (response) {
                    if (typeof response.data == 'string') {
                        q.reject(response.data);
                    } else {
                        var users = _mapUsers(response.data);
                        q.resolve(users);
                    }
                }, function (error) {
                    q.reject(error);
                });

            return q.promise;
        };

        function _mapUsers(input) {
            var mapped = [];

            angular.forEach(input, function (user) {
                var mappedItem = {};
                mappedItem = {
                    id : parseInt(user.ID),
                    userName: user.Benutzername,
                    email: user.Email,
                    role: user.Rolle
                };
                mapped.push(mappedItem);
            });
            return mapped;
        }

        return service;
    });