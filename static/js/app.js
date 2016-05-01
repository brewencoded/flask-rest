(function() {

    // Components

    // Pages
    var Index = Vue.extend({
        template: '#index',
        props: ['storage']
    });

    var Navigation = Vue.extend({
        template: '#navigation',
        props: ['storage'],
        methods: {
            logOut: function (e) {
                e.preventDefault();
                this.storage.userLoggedIn = false;
                this.storage.user.data.articles = [];
                delete window.localStorage.webToken;
                delete window.localStorage.webUser;

                router.go('/');
            }
        }
    });

    var Profile = Vue.extend({
        template: '#profile',
        props: ['storage']
    });

    var Articles = Vue.extend({
        template: '#articles',
        props: ['storage'],
        data: function () {
            return {
                title: '',
                body: ''
            };
        },
        methods: {
            addArticle: function (e) {
                e.preventDefault();
                var component = this;
                Vue.http.post('/api/v1/articles', {
                    email: window.localStorage.webUser,
                    title: component.title,
                    body: component.body
                },
                {
                    headers: {
                        'Authorization': 'Token ' + window.localStorage.webToken
                    }
                })
                .then(function(response) {
                    if(response.data.id) {
                        component.storage.user.data.articles.push(
                            {
                                id: response.data.id,
                                title: response.data.title,
                                body: response.data.body,
                                created_at: response.data.created_at
                            }
                        );
                    component.title = '';
                    component.body = '';
                    }
                },
                function (error) {

                });
            }
        }
    });

    var Article = Vue.extend({
        template: '#article',
        props: ['storage'],
        route: {
            data: function (transition) {
                var articles = this.storage.user.data.articles;
                var index = null;
                for(var i in articles) {
                    if(articles[i].id == transition.to.params.id) {
                        index = i;
                        break;
                    }
                }
                this.article = this.storage.user.data.articles[i];
                transition.next();
            }
        },
        data: function () {
            return {
                article: {}
            };
        }
    });

    var About = Vue.extend({
        template: '#about'
    });

    var Login = Vue.extend({
        template: '#login',
        props: ['storage'],
        data: function () {
            return {
                email: '',
                password: '',
                error: false
            };
        },
        methods: {
            login: function (e) {
                e.preventDefault();
                var component = this;
                Vue.http.get('/api/v1/users/token', {}, {
                    headers: {
                        'Authorization': 'Basic ' + window.btoa(component.email + ':' + component.password)
                    }
                })
                .then(function(response) {
                    if(response.data.token) {
                        window.localStorage.webToken = response.data.token;
                        window.localStorage.webUser = component.email;
                        component.error = false;
                        Vue.http.get('/api/v1/articles', {
                            email: window.localStorage.webUser
                        })
                        .then(function(response) {
                            if(response.data && response.data.length > 0) {
                                component.storage.user.data.articles = response.data;
                                router.go('/profile');
                            }
                        },
                        function(error) {
                            console.log(error);
                        });

                    } else {
                        component.error = true;
                    }
                },
                function (error) {
                    console.log('token retrieval failed');
                });
            }
        }
    });

    var Register = Vue.extend({
        template: '#register',
        data: function () {
            return {
                name: '',
                email: '',
                password: '',
                error: false
            };
        },
        methods: {
            register: function (e) {
                e.preventDefault();
                var component = this;
                Vue.http.post('/api/v1/user', {
                    name: component.name,
                    email: component.email,
                    password: component.password
                })
                .then(function (response) {
                    if(response.data.message == 'User created') {
                        Vue.http.get('/api/v1/users/token', {
                            email: component.email,
                            password: component.password
                        })
                        .then(function(response) {
                            if(response.data.name) {
                                window.localStorage.webToken = response.data.token;
                                window.localStorage.webUser = component.email;
                                component.error = false;
                                router.go('/profile');
                            } else {
                                component.error = true;
                            }
                        },
                        function (error) {
                            console.log('token retrieval failed');
                        });
                    } else {
                        console.log('the api may have changed');
                    }
                },
                function (error) {
                    console.log(error);
                });
            }
        }
    });

    var NotFound = Vue.extend({
        template: '#not-found'
    });

    // Router
    var Root = Vue.extend({
        beforeCompile: function () {
            var component = this;
            // make sure token is still valid and if it is, get user data
            Vue.http.get('/api/v1/users/token',
            {},
            {
                headers: {
                    'Authorization': 'Token ' + window.localStorage.webToken
                }
            })
            .then(function (response) {
                if(response.data.token) {
                    router.app.storage.userLoggedIn = true;
                    Vue.http.get('/api/v1/articles', {
                        email: window.localStorage.webUser
                    })
                    .then(function(response) {
                        if(response.data && response.data.length > 0) {
                            component.storage.user.data.articles = response.data;
                        }
                    },
                    function(error) {
                        console.log(error);
                    });
                }
            },
            function (error) {
                console.log(error);
                console.log('logged out')
            });
        },
        data: function () {
            return {
                storage: {
                    user: {
                        info: {
                            name: 'test testerson'
                        },
                        data: {
                            articles: [
                            ]
                        }
                    },
                    userLoggedIn: false
                }
            };
        },
        components: {
            navigation: Navigation
        }
    });

    var router = new VueRouter({
        hashbang: false,
        history: true
    });

    router.beforeEach(function (transition) {
        if (transition.to.auth || transition.to.path === '/') {
            // check if has token
            if(window.localStorage.webToken) {
                // make sure token is still valid and if it is, get user data
                Vue.http.get('/api/v1/user', {
                    email: window.localStorage.webUser
                },
                {
                    headers: {
                        'Authorization': 'Token ' + window.localStorage.webToken
                    }
                })
                .then(function (response) {
                    if(response.data.name) {
                        if(!router.app.storage.userLoggedIn) {
                            router.app.storage.userLoggedIn = true;
                        }

                        if(transition.to.path === '/') {
                            transition.redirect('/profile');
                        } else {
                            transition.next();
                        }
                    } else {
                        delete window.localStorage.webToken;
                        delete window.localStorage.webUser;
                        if(router.app.storage.userLoggedIn) {
                            router.app.storage.userLoggedIn = false;
                        }

                        transition.redirect('/login');
                    }

                },
                function (error) {
                    console.log(error);
                    console.log('logged out')
                });
            } else {
                transition.next();
            }
        } else {
            transition.next()
        }
    });

    router.map({
        '/': {
            name: 'index',
            component: Index
        },
        '/about': {
            name: 'about',
            component: About
        },
        '/articles': {
            name: 'articles',
            component: Articles,
            auth: true
        },
        '/article/:id': {
            name: 'article',
            component: Article,
            auth: true
        },
        '/login': {
                name: 'login',
                component: Login
        },
        '/register': {
            name: 'register',
            component: Register
        },
        '/404': {
            name: '404',
            component: NotFound
        },
        '/profile': {
            name: 'profile',
            component: Profile,
            auth: true
        }
    });

    router.start(Root, '#app');
})();
