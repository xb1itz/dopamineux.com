'use strict';

var muzli = angular.module('muzli', [

    //Third party modules
    'ui.router',
    'ui.bootstrap',
    'ngWebSocket',

]);

//Disable autoscroll to anchor points when switching states
muzli.value('$anchorScroll', angular.noop);

//Initial applicaton config
muzli.config(['$httpProvider', '$locationProvider', 'settings',
    function($httpProvider, $locationProvider, settings) {

        // Intercept template URL and add anticache patameters
        $httpProvider.interceptors.push(['$q', '$injector', '$rootScope',
            function ($q, $injector, $rootScope) {
                return {
                    'request': function(config) {

                        if (config.url.indexOf('api') === 0) {
                            config.url = settings.apiUrl + config.url;
                        }

                        if (config.url.indexOf('views') !== -1) {
                            config.url = config.url + '?v=' + settings.version;
                        }

                        return config || $q.when(config);
                    },

                    'response': function(response) {

                        var deferred = $q.defer();
                        var type = response.headers()['content-type'] || '';

                        if (type.indexOf('json') > -1 && response.data.hasOwnProperty('success')) {

                            if (response.data.success) {

                                if (response.data.data) {
                                    response.data = response.data.data;
                                }

                                return response;

                            } else {

                                console.error(response.config.url, response.data);
                                return $q.reject(response);
                            }

                        } else {
                            return response;
                        }

                    },

                    'responseError': function(response) {

                        var $state = $injector.get('$state');
                        // var userService = $injector.get('userService');

                        switch (response.status) {

                            //If user not authorised
                            case 401:                                
                                // userService.setUserLoggedOut(); 
                                $state.go('login');
                                console.info('User not authorised');
                                break;

                            //If resource not found (or wrong brand is selected)
                            case 404:
                                $state.go('^');
                                console.info('Resource not found')
                                break;

                            //410 response means session was destroyed intentionaly and complete reload is required
                            case 410:
                                window.location = '/';
                                break;

                            //If any other error status
                            default: 
                                console.error(response);

                        }

                        return $q.reject(response);
                    }
                };
            }
        ]);

        //Enable credentials for CORS api calls
        $httpProvider.defaults.withCredentials = true;

        //Remove hash from URL
        $locationProvider.html5Mode(true);

        //Log version
        console.info('Current version: ' + settings.version);

    }
]);

// Load global user settings
muzli.run(['$rootScope', '$q', '$state', '$stateParams', '$timeout', '$websocket', 'trackingService', 'settings',
    function($rootScope, $q, $state, $stateParams, $timeout, $websocket, trackingService, settings) {

        var websocket;

        //Initial globals
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $state.params;

            console.log('State changed to: ' + toState.name);
        });


        //Connect websocket to receive most live updates
        websocket = $websocket(settings.wsUrl);

        websocket.onOpen(function() {
            console.log('WS connection established');
        });

        websocket.onMessage(function(message) {

            var messageData = JSON.parse(message.data);

            if (messageData.type === 'newPost') {
                $rootScope.$broadcast('newPost', messageData);
            };
        });

        websocket.onError(function(error) {
            console.error(error);
        });

        websocket.onClose(function(error) {
            console.log('WS connection closed');
        });



        //Global method to change page title
        $rootScope.setPageTitle = function (title) {

            $rootScope.pageTitle = title;

            $timeout(function() {
                trackingService.ga.trackPageView($state.current.name);
            });
        };

    }
]);

/*======================================================
=            Bootstrap Angular App manually            =
======================================================*/
angular.element().ready(function() {
    angular.bootstrap(document, ['muzli']);
});
angular.module('muzli').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        //Redirect to index state from any invalid stare
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: '/',
                controller: 'indexController',
                templateUrl: 'views/posts.html'
            })
            .state('feed', {
                url: '/{feed}',
                controller: 'indexController',
                templateUrl: 'views/posts.html'
            })

    }
]);

angular.module('muzli').constant('settings', {
	apiUrl: 'http://52.28.154.213:1080/',
	wsUrl: 'ws://52.28.154.213:1080/',
	rootPath: '/dogos/',
    version: '1.0.1',
    tracker: {
    	GA_TRACKING_CODE: '',
    	INTERCOM_TOKEN: '',
    }
});