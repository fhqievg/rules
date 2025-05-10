const url = $request.url;
if (!$response.body) $done({});
let obj = {};
try {
    obj = JSON.parse($response.body);
} catch (err) {
    $done({body: JSON.stringify(obj)});
}
    
if (url.includes("/mtop.cainiao.app.e2e.engine.page.fetch.cn")) {
    if (obj?.data?.hasOwnProperty('data')) {
        let delArr = [
            "activity", //活动
            "asset" ,
            "banner",   //底部图
            "content",
            "wallet", //钱包
            "vip"
        ]
        for (let i of delArr) {
            if (obj.data.data.hasOwnProperty(i)) {
                obj.data.data[i].config = {};
                obj.data.data[i].data = {};
                obj.data.data[i].event = {};
            }
        }
        
        //处理导入包裹
        if (obj.data.data.hasOwnProperty('packageArea')) {
            if (obj.data.data.packageArea.data?.data?.hasOwnProperty('importPackageIcon')) {
                obj.data.data.packageArea.data.data.importPackageIcon = '';
            }
        }

        //处理订单模块
        if (obj.data.data.hasOwnProperty('order')) {
            if (obj.data.data.order?.data?.data?.items?.length > 0) {
                obj.data.data.order.data.data.items = obj.data.data.order.data.data.items.filter(
                    (i) => !(
                        i?.type === "gouwu" || //购物订单
                        i?.type === "huishou"  //回收订单
                    )
                );
            }
        }
    }
} else if (url.includes("/mtop.cainiao.app.e2e.engine.page.fetch")) {
    //tab处理
    let tabArr = [
        "2240",   //首页
        //"2242",   //发现
        //"2247",   //寄件券
        "2248",   //消息
        "2249"    //我的
    ]
    let newTabObj = {};
    for (let i in tabArr) {
        if (obj?.data?.data?.hasOwnProperty(tabArr[i])) {
            if (obj.data.data[tabArr[i]].hasOwnProperty('position')) {
                obj.data.data[tabArr[i]].position = i.toString();
                newTabObj[tabArr[i]] = obj.data.data[tabArr[i]];
            }
        }
    }
    if (Object.keys(newTabObj).length > 0) {
        obj.data.data = newTabObj;
    }

    //处理首页顶部搜索框文本
    if (obj?.data?.data?.data?.mainSearch?.bizData?.hasOwnProperty('searchContents')) {
        obj.data.data.data.mainSearch.bizData.searchContents = [];
    }
    //顶部icon及中间的新用户专区
    if (obj?.data?.data?.data?.operationList?.length > 0) {
        obj.data.data.data.operationList = obj.data.data.data.operationList.filter((i) => {
            if (i?.type === "new_user_award") {
                return false;
            }

            if (i?.type === "kingkong") {
                i.bizData.items = i?.bizData?.items?.filter(
                    (j) => !(
                        j?.key === "exchange_old_things" //物换物
                    )
                );
            }
            return true;
        });
    }
} else if (url.includes("/mtop.cainiao.guoguo.nbnetflow.ads.show")) {
    // 我的页面
    // 22533 提示授权
    // 29338 寄件会员
    // 29339 裹酱积分
    // 33927 绿色能量
    // 36649 回收旧物
    // 35783 出库码页面推广
    if (obj?.data?.result?.length > 0) {
        obj.data.result = obj.data.result.filter(
            (i) =>
                !(
                    i?.materialContentMapper?.adItemDetail ||
                    i?.materialContentMapper?.title?.includes("无法展示淘宝包裹") ||
                    (i?.materialContentMapper?.bgImg && i?.materialContentMapper?.advRecGmtModifiedTime) ||
                    ["entertainment", "kuaishou_banner"].includes(i?.materialContentMapper?.group_id) ||
                    ["22533", "29338", "29339", "32103", "33927", "35783", "36649"].includes(i.id) ||
                    (i?.materialContentMapper?.group_id?.includes("common_header_banner") && ["event_kuaishoubanner", "event_qingyoubanner"].includes(i?.materialContentMapper?.ut_event_name)) ||
                    (i?.materialContentMapper?.group_id?.includes("interests") && ["event_jijianhuiyuan", "event_guojiangjifeng", "event_greenhome"].includes(i?.materialContentMapper?.ut_event_name))
                )
        );
        for (let i of obj.data.result) {
            if (i?.materialContentMapper?.show_tips_content) {
                // 清空红点标记
                i.materialContentMapper.show_tips_content = "";
            }
        }
    }
} else if (url.includes("/mtop.cainiao.guoguo.nbnetflow.ads.mshow")) {
    // 首页
    if (obj.data) {
        const item = [
            "10", // 物流详情页 底部横图
            "498", // 物流详情页 左上角
            "328", // 3位数为家乡版本
            "366",
            "369",
            "615",
            "616",
            "618",
            "727",
            "793", // 支付宝 小程序 搜索框
            "954", // 支付宝 小程序 置顶图标
            "1017", //关联淘宝
            "1255", //关联快手
            "1308", // 支付宝 小程序 横图
            "1316", // 头部 banner
            "1332", // 我的页面 横图
            "1340", // 查快递 小妙招
            "1371", //绑定快手
            "1391", // 支付宝 小程序 寄包裹
            "1410", // 导入拼多多、抖音快递
            "1428", // 幸运号
            //"1429", //展示离线页面～
            "1438", //授权其他人查看商品
            "1524", // 抽现金
            "1525", // 幸运包裹
            "1563", //首页左上角tips
            "1638", //为你精选了一些商品
            "1692", //其它提示
            "1827",
            "1893", //授权其它平台取件
            "2087"
        ];
        for (let i of item) {
            if (obj.data?.[i]) {
                delete obj.data[i];
            }
        }

        //寄件tab 按钮处理
        let key = "2090";
        if (obj?.data?.hasOwnProperty(key)) {
            if (obj.data[key].length > 0) {
                obj.data[key] = obj.data[key].filter((i) => {
                    if (i?.materialContentMapper?.hasOwnProperty('buttonClickUrl')) {
                        i.materialContentMapper.buttonClickUrl = '';
                    }
                    if (i?.materialContentMapper?.hasOwnProperty('buttonText')) {
                        i.materialContentMapper.buttonText = '';
                    }
                    return true;
                });
            }
        }
    }
} else if (url.includes("nbfriend.msg.conversation.list.new.query.cn")) {
    //消息列表
    if (obj?.data?.data?.length > 0) {
        for (let i of obj.data.data) {
            if (i.hasOwnProperty('convShowType') && i.convShowType === "NORMAL_MSG") {
                if (i.hasOwnProperty('conversationVOList') && i.conversationVOList.length > 0) {
                    i.conversationVOList = i.conversationVOList.filter((j) => j?.conversationId?.includes("logistic_message"));
                }
            }
        }
    }
} else if (url.includes("/mtop.cainiao.nbpresentation.pickup.empty.page.get") || url.includes("/mtop.cainiao.bffengine.pickup.empty.page.get")) {
    // 取件页面
    if (obj?.data?.result) {
        let ggContent = obj.data.result.content;
        if (ggContent?.middle?.length > 0) {
            ggContent.middle = ggContent.middle.filter(
                (i) =>
                    ![
                        "guoguo_pickup_empty_page_relation_add", // 添加亲友
                        "guoguo_pickup_helper_feedback", // 反馈组件
                        "guoguo_pickup_helper_tip_view" // 取件小助手
                    ]?.includes(i?.template?.name)
            );
        }
    }
} else if (url.includes("/mtop.cainiao.nbpresentation.protocol.homepage.get")) {
    // 首页
    if (obj?.data?.result?.dataList?.length > 0) {
        let newLists = [];
        for (let item of obj.data.result.dataList) {
            if (item?.type?.includes("kingkong")) {
                if (item?.bizData?.items?.length > 0) {
                    for (let i of item.bizData.items) {
                        i.rightIcon = null;
                        i.bubbleText = null;
                    }
                }
            } else if (item?.type?.includes("icons_scroll")) {
                // 顶部图标
                if (item?.bizData?.items?.length > 0) {
                    let newBizs = [];
                    for (let i of item.bizData.items) {
                        const lists = [
                            "618cjhb", // 超级红包
                            "bgxq", // 包裹星球
                            "cncy", // 填字赚现金
                            "cngy", // 免费领水果
                            "cngreen", // 绿色家园
                            "cnhs", // 菜鸟回收
                            "gjjf", // 裹酱积分
                            "jkymd", // 集卡赢免单
                            "ljjq", // 领寄件券
                            "ttlhb", // 天天领红包
                            "xybg", // 幸运包裹
                            "cnhs" //回收
                        ];
                        if (lists?.includes(i?.key)) {
                            continue;
                        }
                        newBizs.push(i);
                    }
                    item.bizData.items = newBizs;
                    for (let i of item.bizData.items) {
                        i.rightIcon = null;
                        i.bubbleText = null;
                    }
                }
            } else if (item?.type?.includes("banner_area")) {
                // 新人福利 幸运抽奖
                continue;
            } else if (item?.type?.includes("promotion")) {
                // 促销活动
                continue;
            } else if (item?.type?.includes("todo_list")) {
                // 果酱过期
                continue;
            }
            newLists.push(item);
        }
        obj.data.result.dataList = newLists;
    }
}

$done({body: JSON.stringify(obj)});