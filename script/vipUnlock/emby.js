if ($request.url.indexOf("mb3admin.com/admin/service/registration/validateDevice") != -1) {
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
