const url = $request.url;
let obj = JSON.parse($response.body);
const apiUrl = "/api.caiyunapp.com";
const wrapperUrl = "/wrapper.cyapi.cn";

if (url.includes("/v3/config")) {
    //搜索建议
    if(obj?.search_suggestions) {
        obj.search_suggestions = [];
    }
} else if (url.includes("/v1/activity")) {
    if (url.includes("&type_id=A03&")) {
      // 底栏控制项目 主页图标 天气助手 彩云ai
      if (obj?.interval) {
        obj.interval = 2592000; // 30天===2592000秒
      }
      if (obj?.activities?.length > 0) {
        if (url.includes(apiUrl)) {
            for (let item of obj.activities) {
              if (item?.name && item?.type && item?.feature) {
                item.feature = false;
              }
            }
        } else if (url.includes(wrapperUrl)) {
            obj.activities = [];
        }
      }
    } else {
        // 其他请求
        if (url.includes(apiUrl)) {
            obj = { status: "ok", activities: [{ items: [] }] }
        } else if (url.includes(wrapperUrl)) {
            if (!url.includes("&type_id=P04&")) {
                //不处理节假日
                obj = { status: "ok", activities: [] };
            }
        }
    }
}

$done({ body: JSON.stringify(obj) });