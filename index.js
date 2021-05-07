document.addEventListener('DOMContentLoaded', init, false);

function init() {

    pongImage = document.getElementById("pong");

    tetrisImage = document.getElementById("tetris");

    ///Load gif on hover otherwise show static image

    pongImage.addEventListener("mouseover", loadGifPong, false);

    pongImage.addEventListener("mouseout", loadImagePong, false);

    function loadGifPong() {

        pongImage.src = 'imagens/Pongnew.gif'
    };

    function loadImagePong() {
        pongImage.src = 'imagens/pongnew2.png'
    }

    tetrisImage.addEventListener("mouseover", loadGifTetris, false);

    tetrisImage.addEventListener("mouseout", loadImageTetris, false);

    function loadGifTetris() {
        tetrisImage.src = 'imagens/Tetrisnew.gif'

    }

    function loadImageTetris() {
        tetrisImage.src = 'imagens/tetrisnew2.png'
    }




























}
