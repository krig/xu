$(function() {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }

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
        var desc = showAlbum(album);
        $("#info").html(desc).append(
            '&nbsp;<a href="#" onclick="$.get(\'/play/' + album.index + '\')"><i class="fa fa-play"></i></a>').append(
                '&nbsp;<a href="#" onclick="$.get(\'/enqueue/' + album.index + '\')"><i class="fa fa-plus"></i></a>');
    }

    function playAlbum(album) {
        handleAlbum(album);
        $.get('/play/' + album.index);
    }

    $(document).mousemove( function(e) {
        $("#hover").css({'top':e.pageY + 12,'left':e.pageX + 12});
    });

    $("img.lazy").click(function() {
        $.getJSON("/album/" + $(this).attr("data-idx"), handleAlbum);
    }).dblclick(function() {
        $.getJSON("/album/" + $(this).attr("data-idx"), playAlbum);
    }).mouseover(function() {
        $("#hover").show();
        $.getJSON("/album/" + $(this).attr("data-idx"), function(album) {
            $("#hover").html(showAlbum(album));
        });
    }).mouseout(function() {
        $("#hover").hide();
    }).lazyload();

    function updateNowPlaying() {
        $.getJSON("/nowplaying", function(np) {
            $("#nowplaying").text(np.artist + ' - ' + np.title);
        });
    }
    setInterval(updateNowPlaying, 1000);
});
