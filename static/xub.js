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

    function handleAlbum(album) {
        if ("error" in album) {
            $("#info").html("<b>Error: " + escapeHtml(album.error) + "</b>");
        } else if (album.tracks.length == 0) {
            $("#info").html("<b>Album " + escapeHtml(album.album) + " has no tracks!</b>");
        } else {
            var tracks = album.tracks;
            if (tracks[0].artist != null) {
                $("#info").html(escapeHtml(tracks[0].artist + " - " + tracks[0].album));
            } else {
                $("#info").html(escapeHtml(tracks[0].collection + " - " + tracks[0].album));
            }
            $("#info").append('&nbsp;<a href="#" onclick="$.get(\'/play/' + album.index + '\')"><i class="fa fa-play"></i></a>');
            $("#info").append('&nbsp;<a href="#" onclick="$.get(\'/enqueue/' + album.index + '\')"><i class="fa fa-plus"></i></a>');
        }
    }

    $("img.lazy").click(function() {
        $.getJSON("/album/" + $(this).attr("data-idx"), handleAlbum);
    });
    $("img.lazy").lazyload();
});
