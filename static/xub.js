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
    var desc = '&nbsp;' + showAlbum(album);
    $("#info").html('&nbsp;').append(
        '&nbsp;<a href="#" onclick="$.get(\'/api/play/' + album.index + '\')"><i class="fa fa-play"></i></a>').append(
            '&nbsp;<a href="#" onclick="$.get(\'/api/enqueue/' + album.index + '\')"><i class="fa fa-plus"></i></a>').append(desc);
}

function playAlbum(album) {
    handleAlbum(album);
    $.get('/api/play/' + album.index);
}


