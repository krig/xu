function rebuildPlaylist() {
    $.getJSON("/api/playlist", function(pl) {
        if ("error" in pl) {
            $(".playlist_view").html('<ol></ol>');
            $('.current_art').html("");
            return;
        }

        $(".playlist_view").html('<ol></ol>');
        var lst = $(".playlist_view ol");
        var curr = pl.position;
        $.each(pl.playlist, function(i, entry) {
            var song = "<a href='javascript:;'>" + escapeHtml(getPerformer(entry) + ' - ' + entry.title) + "</a>";
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
    });
}

$(function() {
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
                $("progress").val(np.playtime / np.duration * 100);
            }
            if ($('.current_art').get(0) == undefined) {
                $('.current_art').html("<img src='/api/arthash/" + np.picture_front + "'>");
            }
            if (wasPlaying != nowPlaying) {
                rebuildPlaylist();

                if (nowPlaying != null) {
                    if ("picture_front" in np) {
                        $('.current_art').html("<img src='/api/arthash/" + np.picture_front + "'>");
                    } else {
                        $('.current_art').html("<img src='/api/arthash/null'>");
                    }
                } else {
                    $('.current_art').html("<img src='/api/arthash/null'>");
                }
            }
        });
    }
    updateNowPlaying();
    setInterval(updateNowPlaying, 1000);

});
