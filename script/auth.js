const isQuanX = typeof $task !== 'undefined';
let headers = $request.headers;
let u = $request.url.match(/raw\.githubusercontent\.com\/([^/]+)/)?.[1] || '';
let t = storeRead('getGHPATTStr');
if (!t || t === '' || u === '') {
    $done({});
}

let str = u + ':github_pat_' + t;
headers['Authorization'] = 'Basic ' + strCode(str);
$done({ headers });

function storeRead(key) {
    if (isQuanX) {
        return $prefs.valueForKey(key);
    } else {
        return $persistentStore.read(key);
    }
}

function strCode(input) {
    return btoa(unescape(encodeURIComponent(input)));
}