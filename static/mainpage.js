function playAlbum(index) {
    $.get("/api/play/" + index, function() {
        $("#overlay").html('<div style="font-size: 32px">Playing...</div>');
    });
}

function enqueueAlbum(index) {
    $.get("/api/enqueue/" + index, function() {
        $("#overlay").html('<div style="font-size: 32px">Enqueued!</div>');
    });
}

$(function() {
    var cachebust = Math.random()*10000000000000000;

    function showAlbum(album) {
        if ("error" in album) {
            return "<b>Error: " + escapeHtml(album.error) + "</b>";
        } else if (album.tracks.length == 0) {
            return "<b>Album " + escapeHtml(album.album) + " has no tracks!</b>";
        } else {
            var tracks = album.tracks;
            if (tracks[0].artist != null) {
                return escapeHtml(tracks[0].artist + " - " + tracks[0].album);
            } else {
                return escapeHtml(tracks[0].collection + " - " + tracks[0].album);
            }
        }
    }

    function handleAlbum(album) {
        $("#overlay").html(
            '&nbsp;<a href="javascript:;" onclick="playAlbum(' + album.index + ');"><i class="fa fa-5x fa-play"></i></a>').append(
                '&nbsp;<a href="javascript:;" onclick="enqueueAlbum(' + album.index + ');"><i class="fa fa-5x fa-plus"></i></a>');
    }

    function playAlbum(album) {
        handleAlbum(album);
        $.get('/api/play/' + album.index);
    }

    $("#overlay").mouseleave(function() {
        $(this).hide();
        $("#hover").hide();
    });

    function updateNowPlaying() {
        $.getJSON("/api/current", function(np) {
            if ('error' in np) {
                $("#nowplaying").html('<i class="fa fa-stop"></i>');
                $("#pausebutton").html('<i class="fa fa-2x fa-stop fa-fw"></i>');
                document.title = "XUB: Not playing";
            } else {
                var song = '<em>' + escapeHtml(getPerformer(np)) + ' - ' + escapeHtml(np.title) + '</em>';
                var statuscls = "fa fa-stop";
                var pbtn = 'fa fa-2x fa-stop fa-fw';
                if (np.status == 1) {
                    statuscls = "fa fa-music";
                    pbtn = 'fa fa-2x fa-pause fa-fw';
                } else if (np.status == 2) {
                    statuscls = "fa fa-pause";
                    pbtn = 'fa fa-2x fa-play fa-fw';
                }
                $("#nowplaying").html('<i class="' + statuscls + '"></i> ' + song);
                $("progress").val(np.playtime / np.duration * 100);
                $("#pausebutton").html('<i class="' + pbtn + '"></i>');

                document.title = "XUB: " + escapeHtml(np.title) + " (" + Math.round(np.playtime / np.duration * 100) + "%)";
            }
        });
    }
    updateNowPlaying();
    setInterval(updateNowPlaying, 1000);

    function onMouseEnterAlbum() {
        if ($("#overlay").length == 0) {
            var ol = $(this).parent().add("div");
            ol.attr("id", "overlay");
            ol.show();
        } else {
            $("#overlay").appendTo($(this).parent()).show();
        }
        $.getJSON("/api/album/" + $(this).attr("data-idx"), handleAlbum);
        $("#hover").show();
        $.getJSON("/api/album/" + $(this).attr("data-idx"), function(album) {
            $("#hover").html(showAlbum(album));
        });
    }

    function handleQueryAllAlbums(data) {
        var num_albums = data.num_albums;
        var imgs = '';
        var pre = "<div class=\"wrap\"><img src=\"static/blank.png\" data-idx=\"";
        var mid = "\" data-original=\"/api/art/";
        var post = "?" + cachebust + "\" class=\"lazy\" width=\"150\" height=\"150\"></div>";
        for (var i = 0; i < num_albums; i++) {
            imgs += pre + i + mid + i + post;
        }
        $(".albums").html(imgs);
        $("img.lazy").mouseenter(onMouseEnterAlbum).lazyload();
    }

    function handleQueryResult(data) {
        var albums = data.result;
        var imgs = '';
        var pre = "<div class=\"wrap\"><img src=\"static/blank.png\" data-idx=\"";
        var mid = "\" data-original=\"/api/art/";
        var post = "?" + cachebust + "\" class=\"lazy\" width=\"150\" height=\"150\"></div>";
        $.each(albums, function(index, value) {
            imgs += pre + value + mid + value + post;
        });
        $("#overlay").appendTo($("body"));
        $(".albums").html(imgs);
        $("img.lazy").mouseenter(onMouseEnterAlbum).lazyload();
    }

    function queryDo(what, query, replace) {
        if (replace == undefined) {
            replace = "replace";
        }

        var whatenc = encodeURIComponent(what);
        var qenc = encodeURIComponent(query);

        if (trim(what) == "byalbum") {
            if (replace == "replace") {
                history.replaceState({"what": what, "s": query}, "xub :: albums by album", "/?what=byalbum");
            } else if (replace == "push") {
                history.pushState({"what": what, "s": query}, "xub :: albums by album", "/?what=byalbum");
            }
            $.getJSON("/api/query/by_album", handleQueryResult);
        } else if (trim(what) == "newest") {
            if (replace == "replace") {
                history.replaceState({"what": what, "s": query}, "xub :: albums by lmod", "/?what=newest");
            } else if (replace == "push") {
                history.pushState({"what": what, "s": query}, "xub :: albums by lmod", "/?what=newest");
            }
            $.getJSON("/api/query/by_lmod", handleQueryResult);
        } else if (trim(what) == "byartist") {
            if (replace == "replace") {
                history.replaceState({"what": what, "s": query}, "xub :: albums", "/?what=byartist");
            } else if (replace == "push") {
                history.pushState({"what": what, "s": query}, "xub :: albums", "/?what=byartist");
            }
            $.getJSON("/api/num_albums", handleQueryAllAlbums);
        } else if (trim(query) == "") {
            queryDo("newest", "", replace);
        } else {
            if (replace == "replace") {
                history.replaceState({"what": what, "s": query}, "xub :: " + query, "/?s=" + qenc + "&what=" + whatenc);
            } else if (replace == "push") {
                history.pushState({"what": what, "s": query}, "xub :: " + query, "/?s=" + qenc + "&what=" + whatenc);
            }
            $.getJSON("/api/query/" + whatenc + "/" + qenc,
                      handleQueryResult);
        }
    }

    var newSearch = false;

    $("#searchbutton").click(function() {
        newSearch = true;
        $("#search").slideDown(200);
        $("#searchbar").focus();
    });

    $("#searchbar").keyup(function() {
        var searchWhat = $("#searchwhat :selected").text();
        var searchFor = $(this).val();
        var replace = "replace";
        if (newSearch) {
            newSearch = false;
            replace = "push";
        }
        queryDo(searchWhat, searchFor, replace);
    });

    $("#searchform").submit(function(event) {
        var searchWhat = $("#searchwhat :selected").text();
        var searchFor = $("#searchbar").val();
        queryDo(searchWhat, searchFor, "push");
        $("#search").hide();
        event.preventDefault();
    });

    $(document).mouseup(function (e) {
        var container = $("#search");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }
    });

    window.onpopstate = function(event) {
        if (event.state != null && "s" in event.state) {
            queryDo(event.state.what, event.state.s, "none");
        }
	};

    var what = $.getUrlVar("what", "albums");
    var q = $.getUrlVar("s", "");
    queryDo(what, q, "replace");
});
