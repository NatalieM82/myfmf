/**
 * Created by nataliebarnatan on 14/05/2016.
 */
Parse.initialize('myFMFAppId','myFMFMasterKey');
Parse.serverURL = '//fmf-parse-server.herokuapp.com/parse';

var module = angular.module('myFMFApp', ['ngMaterial', 'ngRoute']);

module.config(function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'loginCtrl'
        })
        .when('/userCreation', {
            templateUrl: '/views/userCreation.html',
            controller: 'userCreationCtrl'
        })
        // .when('/tags/:tagId', {
        //     templateUrl: '/partials/template2.html',
        //     controller:  'ctrl2'
        // })
        // .when('/another', {
        //     templateUrl: '/partials/template1.html',
        //     controller:  'ctrl1'
        // })
        .otherwise({ redirectTo: '/login' });
});



module.controller('mainCtrl', function ($scope, $http,  $timeout, $mdSidenav, $rootScope, $location) {
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
        return $mdSidenav('right').isOpen();
    };

    $scope.$on('$routeChangeStart', function(next, current) {
        $rootScope.currentUser();
    });

    function buildToggler(navID) {
        return function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    console.log("toggle " + navID + " is done");
                });
        }
    }

    $scope.close = function () {
        $mdSidenav('right').close()
            .then(function () {
                console.log("close RIGHT is done");
            });
    };

    $rootScope.currentUser = function(){
        $rootScope.loggedUser = Parse.User.current();
        console.log($rootScope.loggedUser);

        if($rootScope.loggedUser) {
            $location.path('/userCreation');

            return true;
        }
        else {
            $location.path('/login');
            return false;
        }


    }

    $scope.logOut = function(){
        $scope.close();
        Parse.User.logOut().then(function(){
            $rootScope.currentUser();
            $location.path('/login');
            $scope.$apply();
        });
    }
});


module.controller('loginCtrl', function ($scope, $http, $rootScope, $location) {
    $scope.message = 'login';
    var vm = this;

    $scope.signUpMode = false;

    $scope.user = {};

    $scope.signUp = function(){
        console.log($scope.user);
        var user = new Parse.User();
        user.set("username", $scope.user.email);
        user.set("password", $scope.user.password);
        user.set("email", $scope.user.email);
        user.set("fullName", $scope.user.name);

        user.signUp(null, {
            success: function(user) {
                // Hooray! Let them use the app now.
                console.log('yay');
                $scope.currentUser();
                $location.path('/userCreation');
                $scope.$apply();
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }



    $scope.logIn = function() {
        console.log($scope.user);
        Parse.User.logIn($scope.user.email, $scope.user.password, {
            success: function(user) {
                // Do stuff after successful login.
                console.log('yay! connected' + JSON.stringify(user));
                $location.path('/userCreation');
                $scope.$apply();
            },
            error: function(user, error) {
                // The login failed. Check error to see why.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }



});

module.controller('userCreationCtrl', function ($scope, $http, $rootScope) {
    $scope.creationStep = 1;
    $rootScope.PageTitle = 'יצירת פרופיל';

    $rootScope.loggedUser.fetch().then(function (user) {
        $scope.userName = user.get('fullName');
        console.log($scope.userName);
    });


});