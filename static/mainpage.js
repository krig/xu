$(function() {
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
            '&nbsp;<a href="#" onclick="$.get(\'/api/play/' + album.index + '\')"><i class="fa fa-3x fa-play"></i></a>').append(
                '&nbsp;<a href="#" onclick="$.get(\'/api/enqueue/' + album.index + '\')"><i class="fa fa-3x fa-plus"></i></a>');
    }

    function playAlbum(album) {
        handleAlbum(album);
        $.get('/api/play/' + album.index);
    }

    $("img.lazy").click(function() {
    }).dblclick(function() {
        $.getJSON("/api/album/" + $(this).attr("data-idx"), playAlbum);
    }).mouseenter(function() {
        $("#overlay").appendTo($(this).parent()).fadeIn();//.css("display", "block");
        $.getJSON("/api/album/" + $(this).attr("data-idx"), handleAlbum);
        $("#hover").show();
        $.getJSON("/api/album/" + $(this).attr("data-idx"), function(album) {
            $("#hover").html(showAlbum(album));
        });
    }).lazyload();

    $("#overlay").mouseleave(function() {
        $(this).hide();
        $("#hover").hide();
    });

    function updateNowPlaying() {
        $.getJSON("/api/current", function(np) {
            if ('error' in np) {
                $("#nowplaying").html('<i class="fa fa-stop"></i>');
            } else {
                var song = '<em>' + escapeHtml(getPerformer(np)) + ' - ' + escapeHtml(np.title) + '</em>';
                var statuscls = "fa fa-stop";
                if (np.status == 1) {
                    statuscls = "fa fa-music";
                } else if (np.status == 2) {
                    statuscls = "fa fa-pause";
                }
                $("#nowplaying").html('<i class="' + statuscls + '"></i> ' + song);
            }
        });
    }
    updateNowPlaying();
    setInterval(updateNowPlaying, 1000);
});
