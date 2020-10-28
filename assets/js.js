var jukeboxHero = {
    // initial functions and variables
    initBox: function () {
        // ======== INITIAL SETUP FOR JUKEBOX =========
        var vidID = $("#jukebox-options li:first-of-type").attr("data-vid-id");
        // setup buttons and page for jukebox
        jukeboxHero.setButtons(vidID);
        // if view all module exists, copy information into container for use
        if ($("#jukebox-view-all").length) {
            jukeboxHero.setupViewAll();
            // if visible Video Slider exists, init
            if (!$("jukebox-view-all.popup").length) {
                jukeboxHero.slickThisSlider();
            }
        }
        // setup initial video player with first video on page    
        var totalItems = $("#jukebox-options li").length;
        var player = "";
        var buttonID = $("#jukebox-options li:first-of-type").attr("data-vid-num");
        var options = {
            width: '100%',
            responsive: true,
            id: vidID
        };
        player = new Vimeo.Player('jukebox-player', options);

        // setting player id to contain the current video and button number for ref later
        $("#jukebox-player").attr("data-current", vidID).attr("data-num", buttonID);

        // ======= onClick and on video end functions ===========    
        // user clicks on a link in banner/hero to load video 
        $("#jukebox-options .banner-play").on("click", function (i) {
            // send ga event
            $(this).parent().addClass("playing");
            var getVid = $(this).parent().parent().attr("data-vid-id");
            var buttonNum = $(this).attr('data-item');
            jukeboxHero.openVideoPlayer(player, getVid, buttonNum);
        });
        // view all popup box link clicked to open
        $("#jukebox-options .view-all-link").on("click", function (i) {
            // send ga event       
            jukeboxHero.openViewAllPop();
        });
        // view all video click
        $(document).on("click", "#jukebox-view-all .video-play", function (i) {
            i.preventDefault();
            $("body").addClass("view-all-player");
            // send ga event   
            if ($("#jukebox-view-all.popup").length) {
                jukeboxHero.closeVAPopup("slow");
            }
            $(this).addClass("playing");
            var getVid = $(this).attr("data-vid-id");
            var buttonNum = $(this).attr('data-num');
            jukeboxHero.openVideoPlayer(player, getVid, buttonNum);
        });
        // user closed video player popup
        $("body").on("click", ".close-popup", function (e) {
            player.pause();
            var pauseValue = $("#jukebox-options").attr("data-pause");
            var i = $("#jukebox-player").attr("data-num");
            var btnLabel = $("#jukebox-item-" + i + " span").text();
            $("#jukebox-item-" + i)
                .attr("data-cur-label", btnLabel)
                .addClass("currently-paused");
            $("#jukebox-item-" + i + " span").text(pauseValue);

            if ($("#video-complement-slider").length) {
                btnLabel = $("#video-complement-slider .video-play[data-num='" + i + "']")
                    .find(".card-details")
                    .find("p.start-watching")
                    .find("span").text();
                $("#video-complement-slider .video-play[data-num='" + i + "']")
                    .attr("data-cur-label", btnLabel)
                    .addClass("currently-paused")
                    .find(".card-details")
                    .find("p.start-watching")
                    .find("span")
                    .text(pauseValue);
            }

            $("#jukebox-player").addClass("paused").css("opacity", "0");
            jukeboxHero.closePopup();
            $("body").removeClass("up-next");
        });
        // up-next or play has been cancelled
        $("#jukebox-options .cancel").on("click", function (i) {
            // stop auto play
            // send ga event
            $("body").removeClass("up-next");
            jukeboxHero.closePopup();
        })
        // user closes view all
        $("body").on("click", ".close-va-popup", function (e) {
            jukeboxHero.closeVAPopup("fast");
        });
        // WHEN VIDEO FINISHES PLAYING     
        player.on('ended', function () {
            jukeboxHero.closePopup();
            var watchedText = $("#jukebox-options").attr("data-play-cookie");
            var watchedItem = $("#jukebox-player").attr("data-current");
            var buttonNum = $("#jukebox-player").attr("data-num");
            var curButton = parseInt($("#jukebox-player").attr("data-num"));
            var nextButton = curButton + 1;
            var setBG = "";
            // change button text
            $("#jukebox-item-" + buttonNum).addClass("watched").find("span").text(watchedText);
            // change related button text if view all exists
            if ($("#jukebox-view-all").length) {
                $("#jukebox-view-all .video-play[data-num='" + buttonNum + "']")
                    .addClass("watched")
                    .find(".card-details")
                    .find("p.start-watching")
                    .find("span")
                    .text(watchedText);
            }
            // set cookie as video has been watched
            jukeboxHero.setCookie(watchedItem, 1);

            // cycle the next video, if at the end, start at 1
            if ($("#jukebox-options.hero").length) {
                if (!$("body.view-all-player").length) {
                    $("body").addClass("up-next");
                    $("#jukebox-options li.active").removeClass("active").removeClass("up-next");
                    if (totalItems >= 2) {
                        if (nextButton > totalItems) {
                            // go to the first item and start playlist over            
                            setBG = $("#jukebox-options li:first-of-type").attr("data-hero");
                            $("#jukebox-options li:first-of-type").addClass("active").addClass("up-next");
                        }
                        else {
                            // go to the next video in the list
                            var getThisItem = "#jukebox-options li:nth-of-type(" + nextButton + ")";
                            setBG = $(getThisItem).attr("data-hero");
                            $(getThisItem).addClass("active").addClass("up-next");
                        }

                        // changing out the hero image to reflect next video
                        var getThisImage = "url(" + setBG + ")";
                        $("#jukebox-options")
                            .css("background-repeat", "no-repeat")
                            .css("background-position-x", '100vw')
                            .css("background-image", getThisImage);
                        $("#jukebox-options").animate({
                            'background-position-x': '0vw'
                        }, 550, 'linear');
                        setTimeout(function () {
                            $(".banner").css("background-image", getThisImage);
                        }, 550);

                        // auto player triggered unless cancel is pressed
                        $("#jukebox-options li.active div.play-area").addClass("playing");
                        var getVid = $("#jukebox-options li.active").attr("data-vid-id");
                        buttonNum = $("#jukebox-options li.active").attr('data-vid-num');
                        setTimeout(function () {
                            if ($("body.up-next").length) {
                                jukeboxHero.openVideoPlayer(player, getVid, buttonNum);
                            }
                        }, 8000);
                    }
                }
            }

            $("body").removeClass("view-all-player");
        });
    },
    // initiate setup for buttons and hero
    setButtons: function (initID) {
        // THIS SETS UP BUTTONS FOR FIRST TIME
        var i = 1;
        var playBtn = $("#jukebox-options").attr("data-play-btn");
        var playBtnVst = $("#jukebox-options").attr("data-play-cookie");
        var activeSet = 0;

        $("#jukebox-options li").each(function () {
            var getVid = $(this).attr("data-vid-id");
            var setBG = $(this).attr("data-hero");
            $(this).attr("data-vid-num", i);

            $(this).find(".play-area").find(".banner-play")
                .attr("id", "jukebox-item-" + i)
                .attr("data-item", i);
            var returnThis = jukeboxHero.readCookie(getVid);

            if (returnThis === "1") {
                $("#jukebox-item-" + i + " span").text(playBtnVst);
                $(this).removeClass("active");
            } else {
                $("#jukebox-item-" + i + " span").text(playBtn);
                if ($("body#home").length) {
                    if (activeSet === 0) {
                        $(this).addClass("active");
                        activeSet = 1;
                        if (i !== 1) {
                            var getThisImage = "url(" + setBG + ")";
                            $("#jukebox-options")
                                .css("background-repeat", "no-repeat")
                                .css("background-position-x", '100vw')
                                .css("background-image", getThisImage);
                            $("#jukebox-options").animate({
                                'background-position-x': '0vw'
                            }, 550, 'linear');
                            setTimeout(function () {
                                $(".banner").css("background-image", getThisImage);
                            }, 550);
                        }

                    }
                }
            }
            i++;
        });

        if (activeSet === 0) {
            console.log("no active found");
            $("#jukebox-options li:first-of-type").addClass("active");
        }
    },
    // initiate setup for the visible view all slider
    setupViewAll: function () {
        $("#jukebox-options li").each(function () {
            var thisVidID = $(this).attr("data-vid-id");
            var thisThumb = $(this).attr("data-thumb");
            var buttonID = $(this).find(".play-area").find("button").attr('data-item');
            var buttonText = $(this).find(".play-area").find("button").find("span").text();
            var appendThis = '<div class="li-mock"><div class="card-holder"><button class="video-play" data-vid-id = "' + thisVidID + '" data-num="' + buttonID + '">';
            appendThis = appendThis + '<div class="image-holder"><img src="' + thisThumb + '" alt=""></div>';
            appendThis = appendThis + '<div class="card-details">';
            appendThis = appendThis + '<h4>' + $(this).find("h1").text() + '</h4>';
            appendThis = appendThis + '<p>' + $(this).find("h2").text() + '</p>';
            appendThis = appendThis + '<p class="hidden start-watching">' + $(this).find("p").text() + '<span>' + buttonText + '</span></p>';
            appendThis = appendThis + '</div><i class="overlay" aria-hidden="true"></i></button></div></div>';
            $("#video-complement-slider").append(appendThis);
        });
    },
    // when user is done watching video, set cookie
    setCookie: function (thisVideo, days) {
        // SET VIDEO COOKIE FOR USER
        console.log("cookie set");
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        console.log(expires);
        document.cookie = "jb-" + thisVideo + "= 1" + expires + "; path=/";
    },
    // when loading check to see if cookie exists
    readCookie: function (thisVideo) {
        // READING COOKIES SET FOR EACH VIDEO
        console.log("read cookie");
        var value = "; " + document.cookie;
        var name = "jb-" + thisVideo;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    },
    // close video popup and pause video
    closePopup: function () {
        // CLOSE VIDEO PLAYER SCREEN
        $("#jukebox-options li").removeClass("up-next");
        $("body").removeClass("up-next");
        $('#video-player-wrapper').hide();
        $('#video-player-overlay').fadeOut();
        $('div.play-area').removeClass('playing');
        $('.video-play.playing').removeClass('playing');
    },
    // play video in popup
    openVideoPlayer: function (player, getVid, buttonNum) {
        console.log("video player open called");
        var playSpeed = 500;
        var currentVideo = $("#jukebox-player").attr("data-current");
        var currentId = $("#jukebox-player").attr("data-num");

        $("#jukebox-player").css("opacity", "0");

        if (getVid === currentVideo) {
            // if player was last paused
            console.log("running paused");
            $("#jukebox-player").removeClass("paused");
            setTimeout(function () {
                jukeboxHero.buildWindow();
                $("#jukebox-player").animate({
                    'opacity': '1'
                }, 550, 'linear');
                console.log("playing");
                player.play();
            }, playSpeed);
        }
        else {
            var resetLabel = $("#jukebox-item-" + currentId).attr("data-cur-label");
            $("#jukebox-item-" + currentId)
                .removeClass("currently-paused")
                .attr("data-cur-label", "").find("span").text(resetLabel);
            $("#video-complement-slider .video-play[data-num='" + currentId + "']")
                .attr("data-cur-label", '')
                .removeClass("currently-paused")
                .find(".card-details")
                .find("p.start-watching")
                .find("span")
                .text(resetLabel);

            // loading new video
            console.log(getVid + " " + buttonNum);
            $("#jukebox-player").attr("data-current", getVid).attr("data-num", buttonNum);

            setTimeout(function () {
                jukeboxHero.buildWindow();
                player.loadVideo(getVid).then(function (id) {
                    $("#jukebox-player").animate({
                        'opacity': '1'
                    }, 550, 'linear');
                    // the video successfully loaded
                    player.play();
                });
            }, playSpeed);
        }
    },
    // build the player window popup
    buildWindow: function () {
        $('#video-player-wrapper .close-popup').remove();
        $('#video-player-overlay').show();
        $('#video-player-wrapper').show();
        $("#jukebox-player").parent().prepend('<button class="close-popup" aria-label="Close Popup"><svg width="24" height="22" viewBox="0 0 24 22" xmlns="http://www.w3.org/2000/svg"> <path d="M1.845 0L1 .845 11.155 11 1 21.155l.845.845L12 11.845 22.155 22l.845-.845L12.845 11 23 .845 22.155 0 12 10.155z" fill-rule="nonzero" stroke="#FFF" fill="#FFF"></path></svg></a>');
    },
    // close view all popup
    closeVAPopup: function (thisSpeed) {
        // CLOSE VIDEO PLAYER SCREEN
        $('jukebox-view-all').hide();
        $('#view-all-wrapper').hide();
        if (thisSpeed === "fast") {
            $('#view-all-overlay').fadeOut();
        } else {
            $("#view-all-overlay").css("z-index:1;");
            setTimeout(function () {
                $('#view-all-overlay').fadeOut();
                $("#view-all-overlay").css("z-index:1000;");
            }, 500);
        }
    },
    // open view all
    openViewAllPop: function () {
        $("#jukebox-view-all").css("opacity", "0");
        setTimeout(function () {
            $('#view-all-wrapper .close-va-popup').remove();
            $('#jukebox-view-all').show();
            $('#view-all-overlay').show();
            $('#view-all-wrapper').show();
            $("#view-all-wrapper").prepend('<button class="close-va-popup" aria-label="Close Popup"><svg width="24" height="22" viewBox="0 0 24 22" xmlns="http://www.w3.org/2000/svg"> <path d="M1.845 0L1 .845 11.155 11 1 21.155l.845.845L12 11.845 22.155 22l.845-.845L12.845 11 23 .845 22.155 0 12 10.155z" fill-rule="nonzero" stroke="#FFF" fill="#FFF"></path> </svg></a>');
            if ($("#video-complement-slider.slick-initialized").length) {
                $('#video-complement-slider').slick('unslick');
            }
            jukeboxHero.slickThisSlider();

            $("#jukebox-view-all").animate({
                'opacity': '1'
            }, 550, 'linear');
            $("#jukebox-view-all").focus();
        }, 550);
    },
    // initiate slick on slider
    slickThisSlider: function () {
        $('#video-complement-slider').slick({
            dots: false,
            infinite: false,
            slidesToShow: 3,
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                    },
                },
                {
                    breakpoint: 550,
                    settings: {
                        slidesToShow: 1,
                    }
                }
            ]
        });
    }
};


//==================
// on load
//==================
$(function () {
    if ($("#jukebox-options").length) {
        // init jukebox
        jukeboxHero.initBox();
    }
});
