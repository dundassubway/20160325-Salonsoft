Meteor.startup(function () {
    process.env.MAIL_URL = 'smtp://postmaster@sandbox8e4320693d0a490dabd3675c83a67582.mailgun.org:72f3bcf4d0ed3439d677237a69d32030@smtp.mailgun.org:587';

    UploadServer.init({
        tmpDir: /*process.env.PWD + */'/.uploads/tmp',
        uploadDir: /*process.env.PWD +*/ '/.uploads/',
        checkCreateDirectories: true,
        validateRequest: function (req) {
//            console.log('request reading :', req);
        },
        getDirectory: function (fileInfo, formData) {
            if (formData && formData.directoryName != null) {
                return formData.directoryName;
            }
            return "";
        },
        getFileName: function (fileInfo, formData) {
            if (formData && formData.prefix != null) {
                return formData.prefix + '_' + fileInfo.name;
            }
            return fileInfo.name;
        },
        finished: function (fileInfo, formData) {
            console.log('upload finished !!');
            console.log('fileInfo :', fileInfo);
        //    imageMagick.resize({
        //        width: 960,
        //        height: 600,
        //        srcPath: fileInfo.url,
        //        dstPath: fileInfo.baseUrl + '/images/resized/' + fileInfo.name
        //}, finish);
            if (formData && formData._id != null) {
                console.log('finished *******');
                console.log('formData :', formData);
            }
        }
    });

    if (!Website.findOne()) {
        Website.insert({ name: "Salon Soft" });
    }
});

Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false
});

Accounts.emailTemplates.siteName = "SalonSoft";
Accounts.emailTemplates.from = "SalonSoft <idesign3000@gmail.com>";

Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "[SalonSoft] Verify Your Email Address";
    },
    text(user, url) {
        let emailAddress = user.emails[0].address,
            urlWithoutHash = url.replace('#/', ''),
            supportEmail = "support@SalonSoft.com",
            emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${url}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

        return emailBody;
    }
};


Accounts.validateLoginAttempt(function (attempt) {
    console.log("attempt :", attempt);
    if (attempt.error) {
        var reason = attempt.error.reason;

        if (reason === "User not found" || reason === "Incorrect password")
            throw new Meteor.Error(403, "Login forbidden");
    }
    if (attempt.user.services.google) {
        if (user.roles.length > 0) {
            // Need _id of existing user record so this call must come 
            // after `Accounts.createUser` or `Accounts.onCreate` 
            Roles.addUsersToRoles(id, user.roles, 'default-group');
        }
    }
    else if (attempt.user.services.facebook) {
    }
    else if (attempt.user.emails[0].verified !== true) {
        attempt.allowed = false;
        throw new Meteor.Error(403, "Email Verification Needed.");
    }
    return attempt.allowed;
});

Accounts.validateLoginAttempt(function (attempt) {
    if (!attempt.allowed)
        return false;
    // Possibly denies the access...
    if (attempt.user && attempt.user.failedLogins >= 10) // CHANGE ME!
        throw new Meteor.Error(403, "Account locked!");
    return true;
});

Accounts.onLogin(function (attempt) {
    // Resets the number of failed login attempts
    Meteor.users.update(attempt.user._id, { $set: { failedLogins: 0 } });
});

Accounts.onLoginFailure(function (attempt) {
    if (attempt.user && attempt.error.reason === "Login forbidden") {
        // Increments the number of failed login attempts
        Meteor.users.update(attempt.user._id, { $inc: { failedLogins: 1 } });
    }
});

Uploads.allow({
    insert: function (userId, doc) {
//        console.log('doc :', doc);
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return true
    }
});

