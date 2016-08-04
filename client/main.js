Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('website', {
        to: "main"
    });
});

Router.route('/appointment', function () {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('appointment', {
        to: "main"
    });
});

Router.route('/adm', function () {
    this.render('adm-navbar', {
        to: "navbar"
    });
    this.render('website', {
        to: "main"
    });
});


Router.route('/adm/staff', function () {

    this.render('adm-navbar', {
        to: "navbar"
    });
    this.render('staff', {
        to: "main"
    });
});

Router.route('/adm/schedule', function () {
    this.render('adm-navbar', {
        to: "navbar"
    });
    this.render('schedule', {
        to: "main"
    });
});

Router.route('/profile/:_id', function () {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('profile', {
        to: "main",
        data: function () {
            return Meteor.userId();
        }
    });
});

Router.route('/adm/website', function () {
    this.render('adm-navbar', {
        to: "navbar"
    });
    this.render('webmanage', {
        to: "main",
        data: function () {
            return {
                uploads: Uploads.find()
            };
        }
    });
});

// On the Client
Comments.ui.config({
    limit: 5,
    loadMoreCount: 10,
    template: 'bootstrap', // or ionic, semantic-ui
    defaultAvatar: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
    markdown: false
});

Comments.config({
    replies: true,
    anonymous: false,
    anonymousSalt: 'AndrewKim',
    mediaAnalyzers: [Comments.analyzers.image],
    publishUserFields: { profile: 1, emails: 1, username: 1 }
});


