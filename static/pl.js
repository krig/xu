function positionArt() {
    if ($(window).height() - $(".playlist_view").height() < 400) {
        var img_width = ((($(window).width() - $(".playlist_view").width()) * 0.5) - 32);
        $("#current_art_img").css('position', 'fixed').css('right', '32px').css('top', '64px');
        if (img_width >= 64) {
            $("#current_art_img").css('width', img_width + 'px').css('max-width', '');
        } else {
            $("#current_art_img").css('position', 'static').css('width', '').css('max-width', '90%');
        }
    } else if ($(window).width() >= 600) {
        $("#current_art_img").css('position', 'static').css('width', '').css('max-width', '540px');
    }
}

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

        $('ol').sortable({
            start: function(event, ui) {
                ui.item.data('start_pos', ui.item.index());
            },
            stop: function(event, ui) {
                $.get('/api/playlist-move/' + ui.item.data('start_pos') + '/' + ui.item.index());
            }
        });
        $('li').dblclick(function() {
            $.get('/api/jump/' + $(this).attr('data-index'));
        });

        positionArt();
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
            }
            if ($('.current_art').get(0) == undefined) {
                $('.current_art').html("<img id='current_art_img' src='/api/arthash/" + np.picture_front + "'>");
            }
            if (wasPlaying != nowPlaying) {
                rebuildPlaylist();

                if (nowPlaying != null) {
                    if ("picture_front" in np) {
                        $('.current_art').html("<img id='current_art_img' src='/api/arthash/" + np.picture_front + "'>");
                    } else {
                        $('.current_art').html("<img id='current_art_img' src='/api/arthash/null'>");
                    }
                } else {
                    $('.current_art').html("<img id='current_art_img' src='/api/arthash/null'>");
                }
            }
        });
    }
    updateNowPlaying();
    setInterval(updateNowPlaying, 1000);

    $(window).resize(positionArt);
});
