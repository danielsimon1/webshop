angular.module('app')
    .factory('user', function ($q, $http, md5, $log) {
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
                        $log.error("error adding user: ", response.data);
                        q.reject(response.data);
                    } else {
                        $log.info("user added");
                        q.resolve(response.data);
                    }
                }, function (error) {
                    $log.error("error adding user: ", error);
                    q.reject(error.statusText);
                });
            return q.promise;
        };

        service.login = function (input) {
            var q = $q.defer();
            $http.get('http://localhost:8080/rest/user/get/' + input.userName)
                .then(function (response) {
                    if (response.data == "User konnten nicht geladen werden") {
                        $log.error("login failed - backend or database problem");
                        q.reject(response.data);
                    } else if (response.data.Benutzername == "null") {
                        $log.warn("login failed - username not correct");
                        q.reject("Benutzer existiert nicht!")
                    } else if (response.data.Passwort === input.password) {
                        $log.info("user logged in");
                        // encrypt password with md5 to save it to localstorage later
                        q.resolve({role : response.data.Rolle, id : response.data.ID, password : md5.createHash(response.data.Passwort)});
                    } else {
                        $log.warn("login failed - password is wrong");
                        q.reject("Passwort falsch!");
                    }
                }, function (error) {
                    $log.error("login failed: ", error);
                    q.reject(error.statusText);
                });

            return q.promise;
        };

        service.getAllUsers = function () {
            var q = $q.defer();

            $http.get("http://localhost:8080/rest/users/get")
                .then(function (response) {
                    if (typeof response.data == 'string') {
                        $log.error("error getting all users: ", response.data);
                        q.reject(response.data);
                    } else {
                        $log.info("users loaded");
                        var users = _mapUsers(response.data);
                        q.resolve(users);
                    }
                }, function (error) {
                    $log.error("error getting all users: ", error);
                    q.reject(error);
                });

            return q.promise;
        };


        // send username and get id and role
        // localstorage values can be edited by user
        // prevents that users can access admin sites by changing the role in the localstorage

        service.authenticate = function (userName, md5Password) {
            var q = $q.defer();
            $http.get('http://localhost:8080/rest/user/get/' + userName)
                .then(function (response) {
                    if (response.data == "User konnten nicht geladen werden") {
                        $log.error("authentication failed - backend or database problem");
                        q.reject(response.data);
                    } else if (response.data.Benutzername == "null") {
                        $log.warn("authentication failed - user does not exist");
                        q.reject("Benutzer existiert nicht!");
                    // check if encrypted password from localstorage matches with the password from backend
                    } else if (md5.createHash(response.data.Passwort) === md5Password){
                        $log.info("authentication was successful");
                        q.resolve({role : response.data.Rolle, id : parseInt(response.data.ID), userName : userName, password: md5Password});
                    } else {
                        $log.warn("authentication failed - password wrong");
                        q.reject("Authentifizierung fehlgeschlagen");
                    }
                }, function (error) {
                    $log.warn("authentication failed: ", error);
                    q.reject(error.statusText);
                });

            return q.promise;
        };

        service.deleteUser = function (userName) {
            var q = $q.defer();

            $http.get("http://localhost:8080/rest/user/delete/" + userName)
                .then(function (response) {
                    if (response.data == "User existiert nicht" || response.data == "Hat nicht funktioniert") {
                        $log.error("error deleting user: ", response.data);
                        q.reject(response.data);
                    } else {
                        $log.info("user deleted");
                        q.resolve(response.data);
                    }
                }, function (error) {
                    $log.error("error deleting user: ", error);
                    if (error.statusText){
                        q.reject(error.statusText);
                    } else {
                        q.reject();
                    }
                });

            return q.promise;
        };

        function _mapUsers(input) {
            var mapped = [];

            angular.forEach(input, function (user) {
                var mappedItem = {};
                mappedItem = {
                    id : parseInt(user.ID),
                    userName : user.Benutzername,
                    email : user.Email,
                    role : user.Rolle
                };
                mapped.push(mappedItem);
            });
            return mapped;
        }

        return service;
    });