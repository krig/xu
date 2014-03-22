$(function() {
    $.getJSON("/api/playlist", function(pl) {
        $(".playlist_view").html('<ol></ol>');
        var lst = $(".playlist_view ol");
        var curr = pl.position;
        $.each(pl.playlist, function(i, entry) {
            if (curr == i) {
                lst.append('<li class="current_track">' + escapeHtml(entry.artist) + ' - ' + escapeHtml(entry.title) + '</li>');
            } else {
                lst.append('<li>' + escapeHtml(entry.artist) + ' - ' + escapeHtml(entry.title) + '</li>');
            }
        });
    });
});
