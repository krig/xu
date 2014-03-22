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
            '&nbsp;<a href="#" onclick="$.get(\'/api/play/' + album.index + '\')"><i class="fa fa-play"></i></a>').append(
                '&nbsp;<a href="#" onclick="$.get(\'/api/enqueue/' + album.index + '\')"><i class="fa fa-plus"></i></a>');
    }

    function playAlbum(album) {
        handleAlbum(album);
        $.get('/api/play/' + album.index);
    }

    $("img.lazy").click(function() {
        $.getJSON("/api/album/" + $(this).attr("data-idx"), handleAlbum);
    }).dblclick(function() {
        $.getJSON("/api/album/" + $(this).attr("data-idx"), playAlbum);
    }).mouseover(function() {
        $("#hover").show();
        $.getJSON("/api/album/" + $(this).attr("data-idx"), function(album) {
            $("#hover").html(showAlbum(album));
        });
    }).mouseout(function() {
        $("#hover").hide();
    }).lazyload();

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
