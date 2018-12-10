//https://gist.github.com/dougalcampbell/2024272
exports.strencode = function strencode(data) {
    return encodeURIComponent(JSON.stringify(data)).replace(/[!'()*]/g, escape);
};
