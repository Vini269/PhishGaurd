
function extractUrls(text) {
    const regex = /\b(?:https?:\/\/|www\.)[^\s<>"']+/gi;

    const matches = text.match(regex) || [];

    const urls = matches.map(url =>
        url.replace(/[),.!?;:]+$/, "")
    );

    return [...new Set(urls)].slice(0, 50);
}

module.exports = extractUrls;