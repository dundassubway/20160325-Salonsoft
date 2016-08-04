getUserLanguage = function () {
    var lan = localStorage.getItem("language");
    console.log('localStorage', lan);
    Session.set('language', lan);
    if (lan == 'Chinese') return 'cn';
    else if (lan == 'Korean') return 'kr';
    else return "en";
};

setUserLanguage=function(lan) {
    Session.set("showLoadingIndicator", true);

    TAPi18n.setLanguage(lan)
      .done(function () {
         
          Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
          // Handle the situation
          console.log(error_message);
      });
}

Template.profile.helpers({
    username: function () {
        console.log('username', Meteor.user().profile.name);
        if (Meteor.user()) {
            return Meteor.user().profile.name;
            //return Meteor.user().emails[0].address;
        }
        else {
            return "anonymous internet user";
        }
    },
    inputName: function () {
        return Meteor.user().profile.name;
    },
    inputUsername: function () {
        return Meteor.user().username;
    },
    inputEmail: function () {
        return Meteor.user().emails[0].address;
    },
    inputTel: function () {
        return Meteor.user().profile.tel;
    },
    genderCheckedM: function () {
        return Meteor.user().profile.gender == 'male' ? 'checked' : '';
    },
    genderCheckedF: function () {
        return Meteor.user().profile.gender == 'female' ? 'checked' : '';
    },
    genderCheckedN: function () {
        return Meteor.user().profile.gender == 'neither' ? 'checked' : '';
    }
});

Template.navbar.helpers({
    language: function () {
        if (!Session.get('language')) Session.set('language', 'English');
        return Session.get('language');
    }
});

Template.profile.events({
    'submit .js-profile': function (event) {
        event.preventDefault();
        console.log("event", event.target.inputName.value);
        var gender = $('input:radio[name="inlineRadioOptions"]:checked').val();
        //            console.log("gender", gender);
        //            console.log("name", inputName);
        //            console.log("tel", inputTel);

        Meteor.users.update({
            _id: Meteor.userId()
        },
        { $set: { "profile.name": event.target.inputName.value, "profile.tel": event.target.inputTel.value, "profile.gender": gender } });
        return false;
    }
});

Template.navbar.events({
    'click .js-english': function (event) {
        event.preventDefault();
        Session.set('language', 'English');
        localStorage.setItem('language', 'English');
        setUserLanguage('en');
        accountsUIBootstrap3.setLanguage('en');
        console.log("english clicked");
    },
    'click .js-korean': function (event) {
        event.preventDefault();
        Session.set('language', 'Korean');
        localStorage.setItem('language', 'Korean');
        setUserLanguage('kr');
        accountsUIBootstrap3.setLanguage('ko');
        console.log("korean clicked");
    },
    'click .js-chinese': function (event) {
        event.preventDefault();
        Session.set('language', 'Chinese');
        localStorage.setItem('language', 'Chinese');
        setUserLanguage('cn');
        accountsUIBootstrap3.setLanguage('zh-CN');
        console.log("chinese clicked");
    }
});

Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-edit-profile': function (event) {
        Router.go('/profile/' + Meteor.userId());

        console.log("edit profile clicked");
        console.log("userid", Meteor.userId());
    }
});



Accounts.ui.config({
    requestPermissions: {
        google:
        ['https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/tasks'],
        forceApprovalPrompt: true
    },
    forceApprovalPrompt: { google: true },
    requestOfflineToken: { google: true },
    passwordSignupFields: 'EMAIL_ONLY',
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'name',
        fieldLabel: 'Name',
        inputType: 'text',
        visible: true,
        validate: function (value, errorFunction) {
            if (!value) {
                errorFunction("Please write your name");
                return false;
            } else {
                return true;
            }
        }
    }, {
        fieldName: 'tel',
        fieldLabel: 'Mobile Number',
        inputType: 'text',
        visible: true,
    }, {
        fieldName: 'gender',
        showFieldLabel: false,      // If true, fieldLabel will be shown before radio group
        fieldLabel: 'Gender',
        inputType: 'radio',
        radioLayout: 'vertical',    // It can be 'inline' or 'vertical'
        data: [{                    // Array of radio options, all properties are required
            id: 1,                  // id suffix of the radio element
            label: 'Male',          // label for the radio element
            value: 'male'              // value of the radio element, this will be saved.
        }, {
            id: 2,
            label: 'Female',
            value: 'female',
            checked: 'checked'
        }, {
            id: 2,
            label: 'Neither',
            value: 'neither',
        }],
        visible: true
    }, {
        fieldName: 'country',
        fieldLabel: 'Country',
        inputType: 'select',
        showFieldLabel: true,
        empty: 'Please select your country of residence',
        data: [{
            id: 1,
            label: 'Canada',
            value: 'ca'
        }, {
            id: 2,
            label: 'United States',
            value: 'us',
        }],
        visible: true
    }]
});

Meteor.logout(function (e) {
    if (e) {
        console.log("Could not log the user out")
    } else {
        //            window.location.replace('https://accounts.google.com/Logout');
    }
});