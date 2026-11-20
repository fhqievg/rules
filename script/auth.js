const isQuanX = typeof $task !== 'undefined';
let headers = $request.headers;
let u = $request.url.match(/raw\.githubusercontent\.com\/([^/]+)/)?.[1] || '';
let t = storeRead('getGHPATTStr');
if (!t || t === '' || u === '') {
    $done({});
    return;
}

let prefix = t.indexOf('github_pat') === -1 ? 'github_pat_' : '';
let str = u + ':' + prefix + t;
headers['Authorization'] = 'Basic ' + strCode(str);
$done({ headers });

function storeRead(key) {
    return isQuanX ? $prefs.valueForKey(key) : $persistentStore.read(key);
}

function strCode(input) {
    return btoa(unescape(encodeURIComponent(input)));
}