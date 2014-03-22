$(function() {
    function rebuildPlaylist() {
        $.getJSON("/api/playlist", function(pl) {
            console.log(pl);
            $(".playlist_view").html('<ol></ol>');
            var lst = $(".playlist_view ol");
            var curr = pl.position;
            $.each(pl.playlist, function(i, entry) {
                var song = "<a href='#'>" + escapeHtml(getPerformer(entry) + ' - ' + entry.title) + "</a>";
                if ((i % 2) == 0 && curr == i) {
                    lst.append('<li class="odd current_track" data-index=' + i + '>' + song + '</li>');
                } else if (curr == i) {
                    lst.append('<li class="current_track" data-index=' + i + '>' + song + '</li>');
                } else if ((i % 2) == 0) {
                    lst.append('<li class="odd" data-index=' + i + '>' + song + '</li>');
                } else {
                    lst.append('<li data-index=' + i + '>' + song + '</li>');
                }
            });

            $('li').dblclick(function() {
                $.get('/api/jump/' + $(this).attr('data-index'));
            });

            if (curr != undefined && curr != null) {
                if ('picture_front' in pl.playlist[curr]) {
                    $('.current_art').html("<img src='/api/arthash/" + pl.playlist[curr].picture_front + "'>");
;
                }
            }
        });
    }

    rebuildPlaylist();

    var nowPlaying = null;

    function updateNowPlaying() {
        $.getJSON("/api/current", function(np) {
            var wasPlaying = nowPlaying;
            if ('error' in np) {
                nowPlaying = null;
                $("#nowplaying").html('<i class="fa fa-stop"></i>');
            } else {
                nowPlaying = np.id;
                var song = '<em>' + escapeHtml(getPerformer(np)) + ' - ' + escapeHtml(np.title) + '</em>';
                var statuscls = "fa fa-stop";
                if (np.status == 1) {
                    statuscls = "fa fa-music";
                } else if (np.status == 2) {
                    statuscls = "fa fa-pause";
                }
                $("#nowplaying").html('<i class="' + statuscls + '"></i> ' + song);
            }
            if (wasPlaying != nowPlaying) {
                rebuildPlaylist();
            }
        });
    }
    updateNowPlaying();
    setInterval(updateNowPlaying, 1000);

});
