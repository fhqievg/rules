if (!$response.body) $done({});

let ua = $request.headers["User-Agent"];
if (ua.includes("AMap") || ua.includes("Cainiao") || ua.includes("MovieApp")) {
    try {
        let obj = JSON.parse($response.body);
        obj = {}
        $done({ body: JSON.stringify(obj) });
    } catch (err) {
        let amdc = 'e30=';
        $done({ body: amdc });
    }
}else{
    $done({});
}
