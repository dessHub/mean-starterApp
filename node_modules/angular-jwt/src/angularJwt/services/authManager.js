angular.module('angular-jwt.authManager', [])
  .provider('authManager', function() {

    this.$get = function($rootScope, $location, jwtHelper, jwtInterceptor, jwtOptions) {

      var config = jwtOptions.getConfig();

      $rootScope.isAuthenticated = false;

      function authenticate() {
        $rootScope.isAuthenticated = true;
      }

      function unauthenticate() {
        $rootScope.isAuthenticated = false;
      }

      function checkAuthOnRefresh() {
        $rootScope.$on('$locationChangeStart', function() {
          var token = config.tokenGetter();
          if (token) {
            if (!jwtHelper.isTokenExpired(token)) {
              authenticate();
            }
          }
        });
      }
      
      function redirectWhenUnauthenticated() {
        $rootScope.$on('unauthenticated', function() {
          config.unauthenticatedRedirector($location);
          unauthenticate();
        });
      }

      return {
        authenticate: authenticate,
        unauthenticate: unauthenticate,
        checkAuthOnRefresh: checkAuthOnRefresh,
        redirectWhenUnauthenticated: redirectWhenUnauthenticated
      }
    }
  });