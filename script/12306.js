let obj = JSON.parse($response.body);
console.log("响应数据");
console.log($response.body);
let body = '{"code":"00","message":"无广告返回"}';
if (obj?.advertParam?.hasOwnProperty('showSkipBtn')) {
    if (obj.advertParam.showSkipBtn == 1) {
        //0007
        body = '{"code":"00","materialsList":[{"billMaterialsId":"255","filePath":"h","creativeType":1}],"advertParam":{"skipTime":1}}';
    } else {
        //G0054
        body = '{"code":"00","materialsList":[]}';
    }
}
console.log("修改后");
console.log(body);
$done({ body });