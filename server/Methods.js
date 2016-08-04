Meteor.methods({
    removeAppointment: function (id) {
        ScheduleStaff.remove({ _id: id });
    },
    addAppointment: function (appointment) {
        ScheduleStaff.insert(appointment);
    },
    updateAppointment: function (appointment){
        ScheduleStaff.upsert({_id:appointment._id}, appointment);
    },
    addRole: function () {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
            return;
        }
        let userId = Meteor.userId();
        console.log('adduserstoroles :', userId);
        Roles.addUsersToRoles(userId, 'admin', Roles.GLOBAL_GROUP);
        return;
    },
    uploadWebsite: function (wbsite) {
        if (!Meteor.userId()) return;
        if (!Website.findOne())
            Website.insert({
                'userId': userId,
                'name': wbsite.name
            });
    },
    'deleteFile': function (_id) {
        //        check(_id, String);

        var upload = Uploads.findOne(_id);
        if (upload == null) {
            throw new Meteor.Error(404, 'Upload not found'); // maybe some other code
        }

        Website.update({}, { $pull: { image: { uploadsid: _id } } });

        UploadServer.delete(upload.path);
        Uploads.remove(_id);
    },
    'websiteUpdateLogo': function (url) {
        var id = Website.findOne()._id;
        console.log('id :', id);
        Website.upsert({ _id: id }, { $set: { logosrc: url } });
    },
    'WebManageUpdate': function (descrip, addr, tel, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday) {

        console.log('webpage upsert.');
        var id = Website.findOne()._id;
        Website.upsert({ _id: id }, {
            $set: {
                descrip: descrip, address: addr, tel: tel,
                Monday: Monday, Tuesday: Tuesday,
                Wednesday: Wednesday, Thursday: Thursday,
                Friday: Friday, Saturday: Saturday, Sunday: Sunday
            }
        });
    },
    'websiteUpdateImages': function (url, width, height, uploadsid) {
        var id = Website.findOne()._id;
        console.log('id :', id);
        Website.upsert({ _id: id }, { $push: { image: { src: url, w: width, h: height, uploadsid: uploadsid } } });
    },
    'ServiceAdd': function (id, name, price, time, desc) {
        if (!id)
            Services.insert({ sname: name, price: price, time: time, desc: desc });
        else
            Services.update({ _id: id }, { sname: name, price: price, time: time, desc: desc });
    },
    'ServiceRemove': function (id) {
        Services.remove({ _id: id });
    },
    'insertStaff': function (name, pic, prof, services, schedule, color) {
        console.log('insertStaff started.');
        Staff.insert({
            'name': name,
            'picSrc': pic,
            'profile': prof,
            'services': services,
            'schedule': schedule,
            'color':color
        })
    },
    'updateStaff': function (id, name, pic, prof, services, schedule, color) {
        console.log('updateStaff started.');
        Staff.update({ _id: id },
            {
                'name': name,
                'picSrc': pic,
                'profile': prof,
                'services': services,
                'schedule': schedule,
                'color':color
            });
    },
    'removeStaff': function (id) {
        Staff.remove({ _id: id });
    }
});
