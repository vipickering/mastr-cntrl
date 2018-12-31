//https://gist.github.com/dougalcampbell/2024272
exports.strencode = function strencode(data) {
    return encodeURIComponent(JSON.stringify(data)).replace(/[!'()*]/g, escape);
};

//Used for updating publish time
exports.strentimecode = function strentimecode(data) {
    return unescape(encodeURIComponent(JSON.stringify(data)));
}
