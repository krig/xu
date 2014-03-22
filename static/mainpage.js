$(function() {

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
            } else if (np.status == 1) {
                $("#nowplaying").html('<i class="fa fa-music"></i> ' + np.artist + ' - <em>' + np.title + '</em>');
            } else if (np.status == 2) {
                $("#nowplaying").html('<i class="fa fa-pause"></i> ' + np.artist + ' - <em>' + np.title + '</em>');
            } else {
                $("#nowplaying").html('<i class="fa fa-stop"></i> ' + np.artist + ' - <em>' + np.title + '</em>');
            }
        });
    }
    setInterval(updateNowPlaying, 1000);
});
