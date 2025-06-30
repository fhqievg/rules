if ($request.url.includes("/admin/service/registration/validateDevice")) {
  if ($response.statusCode != 200) {
    $done({
      status: "HTTP/1.1 200 OK",
      headers: $response.headers,
      body: '{"cacheExpirationDays":999,"resultCode":"GOOD","message":"Device Valid"}'
    });
  } else {
    $done({});
  }
} else {
  $done({});
}