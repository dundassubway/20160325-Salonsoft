

// in server/publish.js 
Meteor.publish(null, function () {
    return Meteor.roles.find({})
});

Meteor.publish("website", function () {
    return Website.find();
});

Meteor.publish('uploads', function () {
    return Uploads.find();
});

Meteor.publish('services', function () {
    return Services.find();
});

Meteor.publish('schedulestaff', function () {
    return ScheduleStaff.find();
});

Meteor.publish('staff', function () {
    return Staff.find({});
});

Meteor.publish('schedulestaffresources', function () {
    return ScheduleStaffResources.find({});
});