Meteor.startup(function () {

    GoogleMaps.load();

    Uploader.finished = function (index, file) {

        console.log('index :', index);
        console.log('file :', file);

        if (file.subDirectory === 'logo') {
//            Uploads.insert(file);
            Meteor.call('websiteUpdateLogo', file.url);
        }
        else if (file.subDirectory === 'staff') {
            Session.set('staffPicture', file.url);
        }
        else {
            var img = new Image();
            img.onload = function () {
                var uploadsid;
                var width, height;

                width = this.width;
                height = this.height;
                Uploads.insert(file, function (err, docsInserted) {
                    console.log('just inserted uploads', docsInserted);
                    uploadsid = docsInserted;
                    console.log('width :' + width + '   heitght:' + height + ' id :' + uploadsid);
                    Meteor.call('websiteUpdateImages', file.url, width, height, uploadsid);
                });

                return true;
            };
            img.onerror = function () {
                console.log('failed to load img.');
                return true;
            }
            img.src = file.url;
            console.log('width :' + img.width + ' height :' + img.height);
        }
    }

    Session.set("showLoadingIndicator", true);
    console.log('client startup started');
    var lan = getUserLanguage();
    TAPi18n.setLanguage(lan)
      .done(function () {
          console.log('client startup succeeded.');
          if (lan==='kr')
              accountsUIBootstrap3.setLanguage('ko');
          else if (lan==='cn')
              accountsUIBootstrap3.setLanguage('zh-CN');
          else 
              accountsUIBootstrap3.setLanguage('en');
          Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
          console.log('client startup failed.');
          // Handle the situation
          console.log(error_message);
      });
});

AdminConfig = {
    adminEmails: ['idesign3000@gmail.com'],
    collections:
    {
//        Comments: {}
    }
};