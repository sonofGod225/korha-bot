window.extAsyncInit = function () {

    console.log("facebook sdk loaded")
    var psid;
    MessengerExtensions.getUserID(function success(uids) {
        console.log(uids);
        psid = uids.psid;
    }, function error(err) {

    });

    $('.closelessonwindow').click(function () {
        var lessonId = $('#lesson_id').val();
        var gradeid = $('#grade_id').val();
        var courseid = $('#course_id').val();
        var chapterid = $('#chapter_id').val();
        $.ajax({
            url: '/botsendquiz/lesson/'+psid+"/"+ lessonId+"/"+gradeid+"/"+courseid+"/"+chapterid,
            type: 'get',
            success: function () {
                MessengerExtensions.requestCloseBrowser(function success() {

                }, function error(err) {

                });
            },
            error: function () {
                MessengerExtensions.requestCloseBrowser(function success() {

                }, function error(err) {

                });
            }
        })
    })
};