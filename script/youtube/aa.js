let url = $request.url
let headers = $request.headers
let body = $response.body
if (!body) $done({})

if (url.match(/action_set/)) {
    let new_setting = JSON.parse(body)
    $done({ response: { body: body, headers: { "Content-Type": "application/json" } } })
}
$done({})
