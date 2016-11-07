window.extAsyncInit = function () {
    var psid;
    MessengerExtensions.getUserID(function success(uids) {
        psid = uids.psid;
    }, function error(err) {

    });
};