let headers = $request.headers;

let language = 'enabled, seo, zh-hans';
if (headers.hasOwnProperty("X-Reddit-Translations")) {
    headers['X-Reddit-Translations'] = language;
} else {
    headers['x-reddit-translations'] = language;
}

$done({ headers });
