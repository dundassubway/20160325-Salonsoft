Schemas = {};

Pages = new Mongo.Collection('pages');
Website = new Mongo.Collection('website');
Uploads = new Mongo.Collection('uploads');
Services = new Mongo.Collection('services');
ScheduleStaff = new Mongo.Collection('schedulestaff');
Staff = new Mongo.Collection('staff');
ScheduleStaffResources = new Mongo.Collection('schedulestaffresources');

Schemas.Pages = new SimpleSchema({
    title: {
        type: String,
        label: "The title for this content"
    },
    template: {
        type: String,
        label: "The template to use for this page"
    },
    description: {
        type: String,
        label: "A description of this content"
    },
    premiumContent: {
        type: String,
        label: "The special content people pay for",
        autoform: {
            type: 'markdown'
        }
    },
    order: {
        type: Number,
        label: "Order to show on ToC"
    },
    path: {
        type: String,
        label: "Url path"
    }
});

Pages.attachSchema(Schemas.Pages);

