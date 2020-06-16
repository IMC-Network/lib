$(function() {
    setInterval(function() {
        $(".video-js .vjs-big-play-button").attr("title", "Play");
        $(".video-js .vjs-picture-in-picture-control").attr("title", "Toggle picture-in-picture mode");
        $(".video-js .vjs-fullscreen-control").attr("title", "Toggle fullscreen");
    });
});