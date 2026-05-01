const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/shield/scene/recommend")) {
    //首页工具栏icon角标文字
    if (obj.data?.toolsRecommend?.hasOwnProperty('data')) {
        obj.data.toolsRecommend.data.choiceTools = []; //更多工具icon角标文字

        if (obj.data.toolsRecommend.data.exist_tool?.length > 0) {
            obj.data.toolsRecommend.data.exist_tool = obj.data.toolsRecommend.data.exist_tool.filter(
                (i) => {
                    let delArr = [
                        483 // 扫街榜
                    ];
                    if (delArr.includes(i?.id)) {
                        return false;
                    }
                    i.tips_type = 0;
                    i.tips = ""; //角标文字
                    i.label = "";
                    if (i.id === 121) {
                        i.name = "详细地址";
                        i.schema = "amapuri://webview/amaponline?url=https%3A%2F%2Fits.amap.com%2Falarm%3Fgd_from%3Dalarm&sourceApplication=alarm&hide_title=0";
                        i.icon = "https://img.alicdn.com/imgextra/i3/O1CN01hl4vyb1mvpjXkaK8g_!!6000000005017-2-tps-180-180.png";
                        i.iconV2 = "http://aos-cdn-image.amap.com/opc/file/tools/20250711/131/f7f3cffe-5e04-11f0-a2c0-0605c4c6912b.png?ver=1752203588155";
                    }
                    return true;
                }
            );
        }
    }
} else if (url.includes("/aos/perception/publicTravel/beforeNavi")) {
    // 公交出行 底部卡路里数值
    if (obj?.data?.common_data?.bus_plan_bottom_event?.data?.length > 0) {
        obj.data.common_data.bus_plan_bottom_event.data = [];
    }

    // 公交出行 中转站 卡路里数值
    if (obj?.data?.common_data?.bus_plan_segment_event?.data?.length > 0) {
        obj.data.common_data.bus_plan_segment_event.data = [];
    }

    // 导航选路线页面左上角动图
    if (obj?.data?.front_end?.assistant?.length > 0) {
        obj.data.front_end.assistant = [];
    }
} else if (url.includes("/boss/car/order/content_info")) {
    // 打车页面
    if (obj?.data?.lubanData?.skin?.dataList?.length > 0) {
        // oss营销皮肤
        obj.data.lubanData.skin.dataList = [];
    }
} else if (url.includes("/boss/order_web/friendly_information")) {
    // 打车页面
    const items = ["banners", "carouselTips", "integratedBanners", "integratedTips", "skins", "skinAndTips", "tips"];
    if (obj?.data?.["105"]) {
        for (let i of items) {
            delete obj.data["105"][i];
        }
    }
} else if (url.includes("/bus/plan/integrate")) {
    // 公交列表
    if (obj?.data?.banner_lists?.data?.length > 0) {
        // 公交列表 顶部滚动横图
        obj.data.banner_lists.data = [];
    }
    if (obj?.data?.banner_lists?.tips?.length > 0) {
        obj.data.banner_lists.tips = [];
    }
    if (obj?.data?.mixed_plans?.data?.taxiPlans?.length > 0) {
        // 公交列表 推广打车出行
        obj.data.mixed_plans.data.taxiPlans = [];
    }
} else if (url.includes("/c3frontend/af-hkf/hkf") || url.includes("/c3frontend/af-scenic/scenic") || url.includes("/c3frontend/af-hotel/hotel")) {
    //订火车票/机票、景点门票、酒店
    let isPmt = false;
    let objData = obj.hasOwnProperty('data') ? obj.data : {};
    if (objData.hasOwnProperty('pmt')) {
        isPmt = true;
        objData = obj.data.pmt;
    }

    if (objData.hasOwnProperty('modules')) {
        let delKeys = [
            'CouponBanner', //顶部优惠券横幅
            'CouponFooterStickBanner', //底部横幅
            'CouponWidget', //右下角浮框
            'OperationTile', //轮播图上方入口
            "OperationTopicBanner", //顶部优惠券下方轮播图
            //"nav_bar", //顶部导航栏
            'bottom_declare', //最底部说明图
            'hkfPortalPoiRecommend', //底部酒店推荐
            'hkfProductListNoema', //弹框
        ];
        for (let i of delKeys) {
            if (objData.modules.hasOwnProperty(i)) {
                delete objData.modules[i];
            }
        }
        //顶部导航栏
        if (objData.modules.nav_bar?.hasOwnProperty('data')) {
            let delNKeys = [
                'service_priceRatio', //导航栏右边文字
                'service_zizhi', //导航栏右边文字旁边的文字
            ];
            for (let k of delNKeys) {
                if (objData.modules.nav_bar.data.hasOwnProperty(k)) {
                    delete objData.modules.nav_bar.data[k];
                }
            }
        }

        //酒店热门搜索词
        if (objData.modules.user_filter_card?.data?.hasOwnProperty('sug_items_data')) {
            delete objData.modules.user_filter_card.data.sug_items_data;
        }

        if (objData.modules.hkfScheduleRecommend?.data?.hasOwnProperty('modules')) {
            let delMkeys = [
                'header', //优惠券板块轮播图下方标题
                'classifyLevel2' //交通、景区、酒店选项卡
            ];
            for (let j of delMkeys) {
                if (objData.modules.hkfScheduleRecommend.data.modules.hasOwnProperty(j)) {
                    delete objData.modules.hkfScheduleRecommend.data.modules[j];
                }
            }
        }
        
        //去除景点商品推广
        if (objData.modules.list?.data?.list?.length > 0) {
            for (let l of objData.modules.list.data.list) {
                if (l.data?.product_info?.length > 0) {
                    if (l.data.hasOwnProperty('order_cnt')) {
                        delete l.data.order_cnt;
                    }

                    if (l.data.hasOwnProperty('commonTransferInformation')) {
                        let isDel = false;
                        if (l.data.commonTransferInformation.hasOwnProperty('priceInfo')) {
                            isDel = true;
                            delete l.data.commonTransferInformation.priceInfo;
                        }
                        if (l.data.commonTransferInformation.hasOwnProperty('priceLog')) {
                            isDel = true;
                            delete l.data.commonTransferInformation.priceLog;
                        }
                        if (isDel && Object.keys(l.data.commonTransferInformation).length === 0) {
                            delete l.data.commonTransferInformation;
                        }
                    }
                    l.data.product_info = [];
                }
            }
        }
        
        if (isPmt) {
            obj.data.pmt = objData;
        } else {
            obj.data = objData;
        }
    }
    if (obj?.data?.hasOwnProperty('style')) {
        delete obj.data.style;
    }
    if (obj?.data?.hasOwnProperty('xml')) {
        delete obj.data.xml;
    }
} else if (url.includes("/c3frontend/af-launch/page/main")) {
    // 步行导航结束推广卡片
    if (obj?.data?.modules?.C1EndNaviEngine?.data) {
        obj.data.modules.C1EndNaviEngine.data = {};
    }
} else if (url.includes("/boss/order/car/king_toolbox_info")) {
    // 路线规划页 代驾推广
    if (obj?.data?.tabHomePage?.length > 0) {
        obj.data.tabHomePage = obj.data.tabHomePage.filter(
            (i) => !(
                i?.id === "chauffeur_homepage_king_info"
            )
        );
    }
} else if (url.includes("/faas/amap-navigation/card-service-plan-home") || url.includes("/faas/amap-navigation/card-service-route-plan")) {
    // 路线规划页
    if (obj?.data?.children?.length > 0) {
        obj.data.children = obj.data.children.filter((i) => {
            if (i.hasOwnProperty("schema")) {
                // 有schema参数的为推广
                return false;
            }
            
            let items = [
                "AntForestRideCard", //蚂蚁森林
                "AntForestCard" //蚂蚁森林
            ];
            if (i.hasOwnProperty("componentName")) {
                if (items.includes(i.componentName)) {
                    return false;
                }
                
                let  dataKey = [
                    "c3_hkf_module_hasGoodsInfo", //火车、飞机票
                    "NaviRanking" //各种榜单入口
                ];
                if (i.componentName === "C3OutsideCastCard" && i.cardData?.hasOwnProperty("data_key") && dataKey.includes(i.cardData.data_key)) {
                    return false;
                }
            }
            return true;
        });
    }
} else if (url.includes("/faas/amap-navigation/main-page")) {
    // 首页底部卡片
    if (obj?.data?.cardList?.length > 0) {
        obj.data.cardList = obj.data.cardList.filter(
            (i) =>
                i?.dataKey === "ContinueNavigationCard" || // 继续导航
                i?.dataKey === "FrequentLocation" || // 常去地点
                i?.dataKey === "LoginCard" // 登陆卡片
        );
    }
    if (obj?.data?.mapBizList?.length > 0) {
        obj.data.mapBizList = obj.data.mapBizList.filter(
            (i) => i?.dataKey === "FindCarVirtualCard" // 显示关联车辆位置
        );
    }
} else if (url.includes("/perception/drive/routeInfo")) {
    // 导航详情页
    if (obj?.data?.tbt?.event?.length > 0) {
        obj.data.tbt.event = obj.data.tbt.event.filter((i) => !/ads-\d+/.test(i?.dynamic_id_s));
    }
    if (obj?.data?.front_end) {
        if (obj?.data?.front_end?.guide_tips?.length > 0) {
            // 音乐底栏
            obj.data.front_end.guide_tips = obj.data.front_end.guide_tips.filter((i) => i?.biz_type !== "music");
        }
        if (obj?.data?.front_end?.assistant) {
            // 助手皮肤
            delete obj.data.front_end.assistant;
        }
        if (obj?.data?.front_end?.download?.length > 0) {
            // 导航插播语音广告
            obj.data.front_end.download = obj.data.front_end.download.filter((i) => !/ads-\d+/.test(i?.dynamic_id_s));
        }
    }
} else if (url.includes("/perception/drive/routePlan")) {
    // 路线规划页
    const items = [
        "assistant", // 左上角悬浮动图
        "global_guide_data",
        "route_search",
        "start_button_tips" // 开始导航 悬浮提示 全国车道级
    ];
    if (obj?.data?.front_end) {
        for (let i of items) {
            delete obj.data.front_end[i];
        }
    }
    if (obj?.data?.tbt?.event?.length > 0) {
        // 导航插播语音广告
        obj.data.tbt.event = obj.data.tbt.event.filter((i) => !/ads-\d+/.test(i?.dynamic_id_s));
    }
    if (obj?.data?.front_end?.download?.length > 0) {
        // 导航插播语音广告
        obj.data.front_end.download = obj.data.front_end.download.filter((i) => !/ads-\d+/.test(i?.dynamic_id_s));
    }
} else if (url.includes("/promotion-web/resource")) {
    // 打车页面
    const items = [
        "alpha", // 出行优惠套餐
        "banner",
        "bravo", // 第三方推广 喜马拉雅月卡
        "bubble",
        "charlie", // 横版推广 单单立减 领专属优惠 体验问卷
        "icon",
        "other",
        "popup",
        "push", // 顶部通知 发单立享优惠
        "tips"
    ];
    if (obj?.data) {
        for (let i of items) {
            delete obj.data[i];
        }
    }
} else if (url.includes("/sharedtrip/taxi/order_detail_car_tips")) {
    // 打车页
    if (obj.data?.carTips?.data?.popupInfo) {
        delete obj.data.carTips.data.popupInfo;
    }
} else if (url.includes("/shield/dsp/profile/index/nodefaasv3")) {
    // 我的页面
    if (obj?.data?.cardList?.length > 0) {
        let delArr = [
            "HappyNewYearCard", //新年板块
            "MineGoodsDisplayCard", //语音包推荐
            "MineMemberRecommendTaskCard", //达人任务
            //"MineNewBEntranceCard", //快捷入口
            "MineNewDoubleRowCard", //车辆管理
            "MineNewFootprintCard", //足迹
            "MineNewShopCard", //店铺管理
            "MinePeriodTaskCard", //每日任务
            "MineStatisticCard", //一周成长
            "MineUserBenefitCard", //达人福利任务
            "MineUserEmblemCard", //成就勋章
            "PopularActivitiesCard", //互动专区
            "UserCircleCard" //好友动态
        ];
        obj.data.cardList = obj.data.cardList.filter((i) => {
            switch (i.dataKey) {
                case "MineArrowActionCard":
                    //去除2025入口
                    if (i?.content?.card?.hasOwnProperty("title")) {
                        if (i?.content?.card?.title === "高德2025" || i?.content?.card?.title.includes("真探计划") || i?.content?.card?.title.includes("真探创作者计划")) {
                            delArr.push(i.dataKey);
                        }
                    }
                    break;
                case "MineNewVirtualAssetCard":
                    //去除语音及车标推荐
                    if (i?.content?.ownedList?.length > 0) {
                        for (let j of i.content.ownedList) {
                            if (j.hasOwnProperty("bottomTips")) {
                                delete j.bottomTips;
                            }
                        }
                    }
                    break;
                case "MineNewBEntranceCard":
                    //保留入口
                    if (i?.content?.entranceList?.length > 0) {
                        const entranceDelArr = [
                            3, //我的店铺
                            4, //家人地图
                            //7, //订单
                            8, //收藏
                            9, //地图小程序
                            10, //待评价
                            //14, //工具箱
                            15, //油耗
                            16, //代驾
                            17, //钱包卡券
                            27, //地图共建
                        ];
                        i.content.entranceList = i.content.entranceList.filter((k) => !entranceDelArr.includes(k?.id));
                    }
                    break;
                default:
                    break;
            }

            if (delArr.includes(i?.dataKey)) {
                return false;
            }
            return true;
        });
    }

    if (obj?.data?.tipData) {
        delete obj.data.tipData;
    }
} else if (url.includes("/shield/frogserver/aocs/updatable/")) {
    // 整体图层
    const items = [
        "Naviendpage_Searchwords",
        "SplashScreenControl",
        "TipsTaxiButton", // 选路线页面 打车图标
        "amapCoin",
        "favorites_info", // 收藏夹顶部横图推广
        "feedback_banner", // 店主专属通道
        "footprint", // 足迹
        "his_input_tip",
        "home_business_position_config", // 首页右上角动图
        "hotel_activity",
        "hotel_fillin_opt",
        "hotel_loop",
        //"hotel_portal", // 附近-酒店-页面布局
        "hotel_tipsicon",
        "hotsaleConfig", // 酒店限时抢购
        "landing_page_info", // 发现吃喝玩乐好去处
        "map_weather_switch", // 天气
        //"maplayers", // 图层
        "navi_end", // 导航结束 领油滴
        "nearby_business_popup",
        "nearby_map_entry_guide",
        "nearby_map_pull_down_guide",
        "operation_layer", // 首页右上角图层
        "poi_rec",
        "preword",
        "route_banner", // 搜索路线 免费抽机票
        "routeresult_banner",
        "search_homepage",
        "search_keyword",
        "search_moni",
        "search_perf",
        "search_poi_recommend",
        "search_service_adcode",
        "search_word",
        "sportsGroupConfig",
        "sportsHealthConfig",
        "sportsHomeConfig",
        "sportsRouteConfig",
        "sportsTaskConfig",
        "sports_walk",
        "small_biz_b2b_kb", // 入驻高德
        "small_biz_case", // 推广
        "small_biz_fun",
        "small_biz_index",
        "small_biz_news",
        "splashscreen",
        "splashview_config",
        //"sur_bar", // 十一特惠
        "taxi_activity", // 打车活动
        "testflight_adiu",
        "tf_remind", // tf测试版
        "tips_bar_black_list",
        "vip"
    ];
    if (obj?.data) {
        for (let i of items) {
            if (obj?.data?.[i]) {
                obj.data[i] = {status: 1, version: "", value: ""};
            }
        }
    }
} else if (url.includes("/shield/search/common/coupon/info")) {
    if (obj?.data) {
        obj.data = {};
    }
} else if (url.includes("/shield/search/nearbyrec_smart") || url.includes("/smartui/near_recommend")) {
    // 附近页面、搜索周边
    const items = ["head", "search_hot_words", "feed_rec"];
    if (obj?.data?.modules?.length > 0) {
        obj.data.modules = obj.data.modules.filter((i) => items?.includes(i));
    }
} else if (url.includes("/shield/search/poi/detail")) {
    // 搜索结果 模块详情
    const items = [
        "adv_compliance_info", // 服务提供方
        "adv_gift",
        "adStoreBigBannerModule", //广告横幅（打车券之类）
        "aiAgentFooterBar", //ai客服
        "activityRecommendation", //活动推荐
        "bigListBizRec", // 周边景点推荐 三张景点大图
        "bottomDescription", // 底部描述 高德酒店 全网比价
        "brand_shop_bar",
        "brand_service", // 品牌服务
        "brandAdModule", //底部横幅广告
        "carServiceCard", //车主中心
        "CouponBanner", // 高德红包
        "checkIn",
        "check_in", // 足迹打卡
        "cityCardFeed", // 景点卡片
        // "cityPhoto", // 城市照片
        "city_discount", // 专业老师在线答疑
        "claim", // 立即认领 管理店铺
        "co_branded_card",
        "collector_guide", // 游玩的图文指南
        "common_coupon_bar", // 领券条幅 新客专享 省钱卡
        "common_coupon_card", // 优惠券卡片
        // "companyInfo", // 简介
        "comprehensiveEditEntrance", // 编辑地点信息
        "commonAiAgent", //ai门店助手
        "contributor", // 地点贡献
        "CouponWidget", //右下角小图标
        "cpt_service_shop", //买卖二手房
        "cpt_service_simple", //买卖二手房按钮
        // "crowd_index", // 人流量情况
        "dayTripList", // 热门一日游
        "detail_bottom_shop_service", //买卖二手房
        "discount_commodity", // 优惠团购
        "divergentRecommendModule", // 你可能还喜欢
        "expertNote", //笔记
        "everyOneToSee", // 大家还在看
        "enhanceCustomerServicePoiModule",  //品牌服务专区
        "enhanceCustomerServiceFixedBottom", //品牌服务专区
        "feedback", // 问题反馈
        "first_surround_estate_tab", // 周边小区
        // "floor_guide_second", // 楼层导览
        "footer_tel_button", //右下角电话咨询浮框
        // "gallery_info", // 现场照片
        "gas_station_recommend", //加油站推荐
        "gasStationRecommend", //加油站推荐
        //"governmentInformation",
        "hotInfoList", //左下角浮层
        "halfGalleryInfo", //名称下方画廊
        // "hkfMiniPortal", // 订票页面 飞机 火车 汽车
        "horizontalGoodsShelf",
        "hotPlay", // 热门玩法
        "hot_new_house_estate",
        "hot_shop",
        "hotelCoupon",
        "hotelList", // 热门酒店
        "hotelMustRead", // 订房必读
        // "hotelRooms", // 酒店所有房间
        // "hourHotelRooms", // 钟点房
        // "houseEvaluationInfo", // 小区居住指数
        "houseList",
        "houseOfficeBrandIntroduction",
        "houseOfficeInfo",
        "houseOfficeNotice",
        "houseOfficeService",
        "houseShelf", // 小区在售房源
        "house_apart_info",
        "house_buying_agent",
        "house_coupon",
        "house_cp_clues",
        "house_cpt_coupon",
        "house_cpt_grab",
        "house_price",
        "house_price_v2", // 小区房屋售价
        "house_rent_sale_agency",
        "houseService", //买卖房
        "houseAgentService", //买卖房
        "hospital_strategy", //就医攻略
        // "human_traffic", // 人流量情况 有统计图
        "image_banner",
        "imBottomGuide", //底部客服横幅
        "inviteReview", //邀请评价
        "kaMarketingCampaign", // 附近品牌动态
        "kaProductMixServiceShelf", //骑手送药上门
        "ka_not_enter", // 移动办卡 套餐服务
        "legSameIndustryRecEntrance", // 全城最热景点推荐
        "legal_document", // 房源法律信息
        "listBizRec_1",
        "listBizRec_2", // 周边餐饮
        "matrix_banner", // 高德车服
        "merchantSettlement", // 商家店铺管理
        "membership", // 高德菲住卡 会员项目
        "mini_hook_shelf", // 购票迷你模块
        "movie_info", // 优惠购票 景点宣传片
        "multi_page_anchor", // 二级导航菜单 门票 评论 推荐
        // "navbarMore", // 右上角三点
        "nearbyGoodCar", //热门新车
        "nearbyRecommendModule", // 周边推荐
        "nearby_house",
        "nearby_new_house_estate",
        "nearby_office_estate",
        "nearby_old_sell_estate",
        "nearby_play_rec", // 附近玩乐项目
        "newGuest", // 新客专享
        "newRelatedRecommends", // 探索周边
        "new_operation_banner", // 精选活动 高德的推广
        "newsellhouse",
        // "normal_nav_bar", // 右上角图标 客服 反馈
        "officerenthouse",
        "officesellhouse",
        "official_account", // 其他平台官方账号
        "official_account_hospital", //官方渠道（支付宝小程序）
        "oilPriceSubscription", //油价订阅按钮
        "oldsellhouse",
        // "opentime", // 营业时间
        "operation_banner", // 横版图片推广
        "operator_card",
        "packageShelf", // 附近酒景推荐
        "parentBizRec",
        "parentPoiRecEntrance", // 所在商圈
        "platformCustomerCommonModule", //通用定制推广
        "platformCustomerComplianceInfo", //定制推广下方的说明文字
        "poiDetailWaterFeed", //发现好去处瀑布流
        "poiDetailWaterFeedTitle", //发现好去处
        "poiDetailAQModule", //ai相关
        "poster_banner",
        "poiTipBar",  // 提示栏
        "portal_entrance", // 高德旅游版块 引流到旅游频道
        "poiDetailNewBeltV2", //横幅广告图
        "privateSphereChannel", //门店微信
        // "question_answer_card", // 问问 地点附近的热门问题
        "quickLink", // 地点详情页图标 酒店 景点 热榜
        "quickLinksPortal", //房产频道
        "relatedRecommends", // 附近同类型酒店
        "renthouse",
        "rentSaleHouse", //租售房屋
        "rentsaleagencyv2",
        "rentsaleagencyv3",
        "rentsalehouse",
        "residentialOwners", // 小区业主
        // "roomSelect", // 选择订房日期 悬浮菜单
        "recommend_designer_card", //设计师推荐
        "rec_legal_document", //推荐下方的说明文字
        //"recommend_food", //网友推荐菜
        "relatedPoiList", //猜你想找
        //"societyPublicExperience", //网友互助/地图共建
        "shop_settlement", // 店铺入驻入口
        "shoppingMallEvent", //购物商场活动
        "sameIndustryRecommendModule",
        "sameIndustry2RecommendModule",
        "scenic_coupon", // 优惠券过期提示
        "scenic_filter", // 购票悬浮菜单 可定明日 随时退
        // "scenic_helper", // 景区助手 开放时间 旺季 淡季
        "scenic_lifeservices", // 吃住购娱 餐厅 购物
        "scenic_mustplay", // 必游景点 四张景点大图
        "scenic_play_guide", // 景区攻略 游玩攻略 交通攻略
        "scenic_recommend", // 景点建议
        // "scenic_route_intelligent", // 推荐游玩线路
        // "scenic_ski", // 滑雪攻略 雪道数量 设施及服务
        // "scenic_ticket", // 购票
        // "scenic_ticket_activity", // 购票活动
        "scenic_voice", // 语音讲解 付费的项目
        "searchPlaMap", // 周边推荐
        "second_surround_estate_tab", // 周边房产
        "service_shop", // 中介门店
        "shopBaseCase", // 小区装修案例
        "shopStructGift", // 礼品广告位
        "similarShelfRecommend", //附近推荐门店
        "similarShopRecommend", //附近相似门店推荐
        "smallListBizRec", // 周边热门酒店
        // "surroundFacilityInfo", // 小区周边配套
        "smallOrListBizRec",
        "surroundHouseTab", //周边房源
        "surroundOldSellHouse", // 同城二手房
        "surroundRentHouse", // 附近租房
        "surround_facility",
        "surround_facility_new",
        "surround_house_tab",
        "surround_oldsellhouse",
        "surround_renthouse",
        "surround_rentoffice",
        "surround_selloffice",
        "subscription", // 商家号
        "thirdparty_info", //第三方信息
        "topListRecommendCard", //排行榜
        // "traffic", // 交通出行 地铁站 公交站 停车场
        "travelGuideRec", // 人气景点 路线 购票
        "uploadBar",
        "upload_bar", // 上传照片
        "unionAuthBanner", //联盟授权
        "verification", // 商家已入驻
        "waistRecEntrance", // 更多人气好去处
        "waterFallFeed", // 附近景点瀑布流
        "waterFallFeedTitle", // 更多人气好去处
        "yellowPageAdRecommendModule" // 好物推荐
    ];

    //处理其它推广
    if (obj.data?.modules?.retainInfo?.card_id === "UsedCarRetainQuickAddress") {
        //二手车
        items.push('retainInfo');
    }

    //处理评价
    if (!obj.data?.modules?.combineReviews?.data?.hasOwnProperty("total") || obj.data?.modules?.combineReviews?.data?.total === "") {
        if ((obj.data?.modules?.combineReviews?.data?.evaluation?.hasOwnProperty("score") && obj.data?.modules?.combineReviews?.data?.evaluation?.score === "0.0") || !obj.data?.modules?.combineReviews?.data?.hasOwnProperty("evaluation")) {
            items.push('combineReviews');
        }
    }
    //去除多余的评价按钮
    /*if (obj.data?.modules?.combineReviews?.data?.hasOwnProperty("nav_bar_write_comment")) {
        delete obj.data.modules.combineReviews.data.nav_bar_write_comment; //右上角写评价入口
    }*/
    if (obj.data?.modules?.combineReviews?.data?.hasOwnProperty("write_comment")) {
        delete obj.data.modules.combineReviews.data.write_comment; //评价按钮
    }
    if (obj.data?.modules?.combineReviews?.data?.evaluation?.rating_array?.length > 0) {
        obj.data.modules.combineReviews.data.evaluation.rating_array = obj.data.modules.combineReviews.data.evaluation.rating_array.filter(
            (i) => !(
                i?.rating === "" || //无评分
                i?.rating === 0 ||
                i?.rating === "0.0"
            )
        );
    }

    //处理出行评分
    if (!obj.data?.modules?.evaluateVO?.data?.hasOwnProperty("score") || obj.data?.modules?.evaluateVO?.data?.score === "0.0") {
        items.push('evaluateVO');
    }
    if (obj.data?.modules?.evaluate?.data?.header?.hasOwnProperty("score") && obj.data?.modules?.evaluate?.data?.header?.score === "0.0") {
        items.push('evaluate');
    }

    //处理顶部图片
    if (obj.data?.modules?.attractGalleryInfo?.hasOwnProperty("card_id") && obj.data?.modules?.attractGalleryInfo?.card_id === "AttractGalleryUpload") {
        //删除无图片时展示的上传图片入口
        obj.data.modules.attractGalleryInfo.card_id = 'AttractGalleryUpsssss';
    }
    if (obj.data?.modules?.attractGalleryInfo?.data?.log_data?.common_log?.NOTE) {
        obj.data.modules.attractGalleryInfo.data.log_data.common_log.NOTE = 0;
    }
    if (obj.data?.modules?.attractGalleryInfo?.data?.list?.length > 0) {
        obj.data.modules.attractGalleryInfo.data.list = obj.data.modules.attractGalleryInfo.data.list.filter(
            (i) =>
                !(
                    i?.source === "NOTE" || //去除笔记
                    i?.source === "NOTE_BEST" //精选笔记
                )
        );
    }
    //去除笔记入口
    if (obj.data?.modules?.attractGalleryInfo?.data?.contentMore?.log_data?.common_log?.hasOwnProperty("landingPage") && obj.data.modules.attractGalleryInfo.data.contentMore.log_data.common_log.landingPage === "gumdamNote") {
         delete obj.data.modules.attractGalleryInfo.data.contentMore;
    }

    //处理底部去打车
    if (obj.data?.modules?.traffic?.data?.content?.taxiInfo) {
        delete obj.data.modules.traffic.data.content.taxiInfo;
    }

    //处理详情信息
    if (obj.data?.modules?.baseInfo?.hasOwnProperty('data')) {
        //去除位置旁边的地图icon图标及其它icon图标角标文字
        if (obj.data.modules.baseInfo.data.hasOwnProperty('iconsList') && Array.isArray(obj.data.modules.baseInfo.data.iconsList) && obj.data.modules.baseInfo.data.iconsList.length > 0) {
            obj.data.modules.baseInfo.data.iconsList = obj.data.modules.baseInfo.data.iconsList.filter((i) => {
                if (i.type === 'map' && i.label.includes('地图')) {
                    return false;
                }

                if (i.hasOwnProperty('bubble_text')) {
                    delete i.bubble_text;
                }
                if (i.hasOwnProperty('adorn_icon')) {
                    delete i.adorn_icon;
                }
                return true;
            });
        }

        //去除地点名称旁边的咨询icon图标
        if (obj.data.modules.baseInfo.data.hasOwnProperty('imInfo')) {
            delete obj.data.modules.baseInfo.data.imInfo;
        }

        //去除位置旁边的地图icon图标(旧的样式)
        if (obj.data.modules.baseInfo.data.address_info?.icons?.length > 0) {
            obj.data.modules.baseInfo.data.address_info.icons = obj.data.modules.baseInfo.data.address_info.icons.filter((i) => {
                if (i.type === 'map' && i.label === '地图') {
                    return false;
                }
                return true;
            });

            if (obj.data.modules.baseInfo.data.address_info.iconSort?.length > 0) {
                obj.data.modules.baseInfo.data.address_info.iconSort = obj.data.modules.baseInfo.data.address_info.iconSort.filter((i) => {
                    if (i === 'map') {
                        return false;
                    }
                    return true;
                });
            }
        }
    }

    //处理icon推广
    if (obj.data?.modules?.poiMapModule?.data?.map?.main_point?.hasOwnProperty('dynamic_texture')) {
        if (obj.data.modules.poiMapModule.data.map.main_point.hasOwnProperty('card_id')) {
            obj.data.modules.poiMapModule.data.map.main_point.card_id = 'normal_lottie';
        }
        delete obj.data.modules.poiMapModule.data.map.main_point.dynamic_texture;
    }

    //处理问答
    if (!obj.data.modules.travelGuideAndQa?.data?.questionAndAnswer?.hasOwnProperty('log_param')) {
        items.push('travelGuideAndQa'); //没有提问就去掉问答
    }
    
    //处理底部功能按钮
    let delIcon = [
        //"add",  //新增
        "car", //打车
        "hotel", //酒店
        "markPoint", //打卡
    ];
    if (obj.data?.modules?.poiDetailBottomBar?.data?.items?.length > 0) {
        obj.data.modules.poiDetailBottomBar.data.items = obj.data.modules.poiDetailBottomBar.data.items.filter(
            (i) => {
                return !(i?.hasOwnProperty('key') && delIcon.includes(i.key));
            }
        );
    }
    
    //处理中间商品模块
    if (obj.data?.modules?.commonGoodsShelf?.hasOwnProperty("data")) {
        //处理侧边栏商品类型
        //obj.data.modules.commonGoodsShelf.data.type === "combined" //该类型为侧边栏
        let delTabids = [
            "12603", //火车票
            "20100", //旅游咨询
            "99001", //人气酒店
        ];
        if (obj.data.modules.commonGoodsShelf.data.tabList?.length > 0) {
            obj.data.modules.commonGoodsShelf.data.tabList = obj.data.modules.commonGoodsShelf.data.tabList.filter(
                (i) => {
                    return !(i?.hasOwnProperty('tabId') && delTabids.includes(i.tabId));
                }
            );
        }
        
        if (obj.data.modules.commonGoodsShelf.data.shelfList?.length > 0) {
            obj.data.modules.commonGoodsShelf.data.shelfList = obj.data.modules.commonGoodsShelf.data.shelfList.filter(
                (i) => {
                    return !(i?.data?.meta?.hasOwnProperty('tabId') && delTabids.includes(i.data.meta.tabId));
                }
            );
        }
        
        //非侧边栏商品类型
        let typeItems = [
            "secondHouse", //在售房源
            "rentHouse" //在租房源
        ];
        if (obj.data.modules.commonGoodsShelf.data.filterShelfList?.length > 0) {
            obj.data.modules.commonGoodsShelf.data.filterShelfList = obj.data.modules.commonGoodsShelf.data.filterShelfList.filter(
                (i) => {
                    return !(i?.hasOwnProperty('shelfType') && typeItems.includes(i.shelfType));
                }
            );
        }
    }
    
    //处理中间订购火车票板块
    if(obj?.data?.modules?.commonHkfMiniPortal?.data?.hasOwnProperty('routeType') && obj.data.modules.commonHkfMiniPortal.data.routeType === 'train'){
        items.push('commonHkfMiniPortal'); //去除火车票订购
    }

    if (obj?.data?.modules) {
        for (let i of items) {
            delete obj.data.modules[i];
        }
    }
} else if (url.includes("/shield/search_bff/hotword")) {
    // 搜索框 热榜logo
    if (obj?.data?.headerHotWord?.length > 0) {
        obj.data.headerHotWord = [];
    }

    //搜索框 下方icon图标角标文字
    if (obj?.data?.hotwordWithIcon?.length > 0) {
        for (let i of obj.data.hotwordWithIcon) {
            if (i.hasOwnProperty("cornerText")) {
                i.cornerText = "";
            }
        }
    }
} else if (url.includes("/shield/search_business/process/marketingOperationStructured")) {
    // 详情页 顶部优惠横幅
    if (obj?.data?.tipsOperationLocation) {
        delete obj.data.tipsOperationLocation;
    }
    if (obj?.data?.resourcePlacement) {
        delete obj.data.resourcePlacement;
    }
} else if (url.includes("/shield/search_poi/homepage")) {
    // 首页 搜索框历史记录 推广标签
    if (obj?.history_tags) {
        delete obj.history_tags;
    }
} else if (url.includes("/shield/search_poi/search/sp") || url.includes("/shield/search_poi/mps")) {
    if (obj?.data?.list_data) {
        let list = listHandle(obj.data.list_data.content[0]);
        // 搜索页 顶部卡片
        if (list?.card?.card_id === "SearchCardBrand" && list?.item_type === "brandAdCard") {
            delete list.card;
        }
        if (list?.card?.card_id === "NearbyGroupBuy" && list?.item_type === "toplist") {
            delete list.card;
        }
        if (list?.card?.card_id === "ImageBanner" && list?.item_type === "ImageBanner") {
            delete list.card;
        }
        obj.data.list_data.content[0] = list;
    } else if (obj?.data?.district?.poi_list) {
        // 搜索列表详情页
        let poi = obj.data.district.poi_list[0];
        // 订票横幅
        if (poi?.transportation) {
            delete poi.transportation;
        }
        // 景点门票 酒店特惠 特色美食 休闲玩乐
        if (poi?.feed_rec_tab) {
            delete poi.feed_rec_tab;
        }
    } else if (obj?.data?.modules) {
        if (obj?.data?.modules?.not_parse_result?.data?.list_data) {
            obj.data.modules.not_parse_result.data.list_data.content[0] = listHandle(obj.data.modules.not_parse_result.data.list_data.content[0]);
        }
        if (obj?.data?.modules?.list_data?.data) {
            // 搜索列表
            let list = obj.data.modules.list_data.data;
            if (list?.content?.length > 0) {
                // brandAdCard广告卡片 toplist_al人气榜单 高德指南
                list.content = list.content.filter((i) => !["brandAdCard", "toplist_al"]?.includes(i?.item_type));
            }
        }

        //搜索列表
        if (obj?.data?.modules?.listResult?.data?.list?.length > 0) {
            let items = [
                "RecommendEveryoneSearch" //大家还在搜
            ];
            obj.data.modules.listResult.data.list = obj.data.modules.listResult.data.list.filter((i) => {
                if (i.hasOwnProperty("card_id") && items.includes(i.card_id)) {
                    return false;
                }
                return true;
            });
        }
    }
} else if (url.includes("/shield/search_poi/sug") || url.includes("/shield/search_business/process/middleLayer/sug")) {
    //搜索列表
    if (obj?.tip_list) {
        let newLists = [];
        if (obj?.tip_list?.length > 0) {
            const delArr = ["product_vo", "product_info"];
            for (let item of obj.tip_list) {
                for (let i of delArr) {
                    if (item?.tip?.hasOwnProperty(i)) {
                        delete item.tip[i]; //搜索列表结果下方商品推广
                    }
                }
                //exact_topic_tpp 夹杂其他搜索推荐
                //meta_special 各种榜单入口
                //common_content_toplist 各种榜单入口
                if (
                    ["12"]?.includes(item?.tip?.datatype_spec) ||
                    (item?.tip?.hasOwnProperty("result_type") && ["ad", "poi_ad", "toplist"]?.includes(item?.tip?.result_type)) ||
                    (item?.tip?.hasOwnProperty("task_tag") && ["ad", "exct_query_sug_merge_theme", "query_sug_merge_theme", "sp", "exact_topic_tpp", "meta_special", "common_content_toplist"]?.includes(item?.tip?.task_tag))
                ) {
                    continue;
                } else {
                    newLists.push(item);
                }
            }
            obj.tip_list = newLists;
        }
    } else if (obj?.city_list) {
        let newLists = [];
        if (obj?.city_list?.length > 0) {
            for (let item of obj.city_list) {
                let newTips = [];
                if (item?.tip_list?.length > 0) {
                    for (let ii of item.tip_list) {
                        if (["12"]?.includes(ii?.tip?.datatype_spec)) {
                            continue;
                        } else if (["ad", "poi_ad"]?.includes(ii?.tip?.result_type)) {
                            continue;
                        } else {
                            newTips.push(ii);
                        }
                    }
                    item.tip_list = newTips;
                }
                newLists.push(item);
            }
            obj.city_list = newLists;
        }
    }
} else if (url.includes("/shield/search_poi/tips_operation_location")) {
    // 搜索页面 底部结果上方窄横幅
    if (obj?.data?.coupon) {
        delete obj.data.coupon;
    }
    const items = [
        "belt",
        "common_float_bar",
        "common_image_banner",
        "coupon_discount_float_bar",
        "coupon_float_bar",
        "discount_coupon",
        "image_cover_bar",
        "mood_coupon_banner",
        "operation_brand",
        "promotion_wrap_card",
        "tips_top_banner"
    ];
    if (obj?.data?.modules) {
        for (let i of items) {
            delete obj.data.modules[i];
        }
    }
} else if (url.includes("/valueadded/alimama/splash_screen")) {
    // 开屏广告
    if (obj?.data?.ad?.length > 0) {
        for (let item of obj.data.ad) {
            item.set.setting.display_time = 0;
            item.creative[0].start_time = 3818332800; // Unix 时间戳 2090-12-31 00:00:00
            item.creative[0].end_time = 3818419199; // Unix 时间戳 2090-12-31 23:59:59
        }
    }
} else if (url.includes("/promote/person/homepage")) {
    //达人主页
    //去除多余板块
    let delCard = [
        //"HeaderCard", //头部
        "MemberCenterCard",  //达人中心
        "UserProfileBadgeCard", //成就勋章
        "UserProfileTabContentCard", //动态、赞过、贡献
        "PersonalPageLocationDocumentsCard" //地点档案
    ]
    if (obj?.data?.bizData?.hasOwnProperty('cardData')) {
        for (let i in obj.data.bizData.cardData) {
            if (i === "HeaderCard") {
                if (obj.data.bizData.cardData[i].content?.hasOwnProperty('footprint')) {
                    delete obj.data.bizData.cardData[i].content.footprint;
                }
            }

            if (delCard.includes(i)) {
                delete obj.data.bizData.cardData[i];
            }
        }
    }

    if (obj?.data?.hasOwnProperty('uiData')) {
        if (obj.data.uiData.hasOwnProperty('cardUi')) {
            for (let i in obj.data.uiData.cardUi) {
                if (delCard.includes(i)) {
                    delete obj.data.uiData.cardUi[i];
                }
            }
        }

        if (obj.data.uiData.pageUi?.cardIdList?.length > 0) {
            obj.data.uiData.pageUi.cardIdList = obj.data.uiData.pageUi.cardIdList.filter((i) => {
                if (delCard.includes(i)) {
                    return false;
                }
                return true;
            });
        }
    }
} else if (url.includes("/promote/member/page")) {
    //达人任务页
    if (obj?.data?.bizData?.cardData?.MemberRecommendTaskCard?.content?.taskList?.length > 0) {
        //不需要保留任务中心入口
        obj.data.bizData.cardData.MemberRecommendTaskCard.content = {};
        //下方代码可保留任务中心入口，需注释上一行代码，二选一
        /*let taskListArr = [];
        taskListArr.push(obj.data.bizData.cardData.MemberRecommendTaskCard.content.taskList[0]);
        obj.data.bizData.cardData.MemberRecommendTaskCard.content.taskList = taskListArr;*/
    }
} else if (url.includes("/userview/footprint/v2/detail")) {
    //足迹页处理
    if (obj?.data?.city?.hasOwnProperty('tips')) {
        obj.data.city.tips = [];
    }
} else if (url.includes("/shield/search_business/process/contentDetail")) {
    //居住指数页热门二手房
    if (obj?.data?.hasOwnProperty('hotSecondHouse')) {
        delete obj.data.hotSecondHouse;
    }
} else if (url.includes("/c3frontend/af-nearby/nearby")) {
    //附近页优化
    //去除右下角写笔记浮框
    if (obj?.data?.modules?.hasOwnProperty('contentPoster')) {
        delete obj.data.modules.contentPoster;
    }
} else if (url.includes("/amc/server/conv/raise_list")) {
    //消息列表通知过滤
    if (obj.data?.dataList?.length > 0) {
        /*console.log("**********修改前：**********");
        console.log(JSON.stringify(obj));*/
        
        let idItems = getMsgFilterIds();
        obj.data.dataList = obj.data.dataList.filter((i) => {
            if (i.data?.hasOwnProperty("id") && idItems.includes(i.data.id)) {
                return false;
            }
            return true;
        });

        /*console.log("==========修改后：==========");
        console.log(JSON.stringify(obj));*/
    }
} else if (url.includes("/amc/server/conv/operate")) {
    //消息列表通知过滤
    let msgFilterIds = getMsgFilterIds();
    if (obj.data?.convData?.data?.hasOwnProperty('id')) {
        if (msgFilterIds.includes(obj.data.convData.data.id)) {
            obj = {};
        }
    }
} else if (url.includes("/user/activity/talent/lottery/skuList")) {
    if (obj?.data?.skuList?.length > 0) {
        obj.data.skuList = skuListFilter(obj.data.skuList);
    }
}
$done({ body: JSON.stringify(obj) });

function skuListFilter(skuList) {
    skuList = skuList.filter(
        (i) => !(
            i?.skuInfo?.skuId === 1063 || //实体勋章
            i?.skuInfo?.skuId === 458  //猫冰箱贴
        )
    );
    return skuList;
}

function listHandle(list) {
    // 详情页 底部 房产推广
    if (list?.hookInfo) {
        let hookData = list.hookInfo.data;
        if (hookData?.header) {
            delete hookData.header;
        }
        if (hookData?.house_info) {
            delete hookData.house_info;
        }
    }
    
    // 详情页 底部 订酒店
    if (list?.map_bottom_bar?.hotel) {
        delete list.map_bottom_bar.hotel;
    }
    if (list?.poi?.item_info?.tips_bottombar_button?.hotel) {
        delete list.poi.item_info.tips_bottombar_button.hotel;
    }
    
    // 地图优惠推广
    if (list?.map?.main_point?.hasOwnProperty("dynamic_texture")) {
        delete list.map.main_point.dynamic_texture;
        //改变类型以显示icon图标
        if (list?.map?.main_point?.hasOwnProperty("card_id")) {
            list.map.main_point.card_id = "normal_lottie";
        }
    }
    
    if (list?.tips_operation_info) {
        delete list.tips_operation_info;
    }
    if (list?.bottom?.bottombar_button?.hotel) {
        delete list.bottom.bottombar_button.hotel;
    }
    return list;
}

function getMsgFilterIds() {
    return [
        //"M_100001", //我的反馈
        //"M_100007", //订单提醒
        "M_100009", //高德旺铺
        //"M_100011", //服务通知
        //"M_100012", //交通实况LIVE
        "M_100013", //天气
        //"M_100016", //地点评论
        "M_100021", //数字工厂- 我的个人主页
        "M_100023", //出行侠
        //"M_100032", //高德达人
        "M_100036", //高德运动
        "M_100038", //高德出游服务
        //"M_100044", //通知权限提醒
        "M_100046", //天天领福利
        "M_100050", //高德快报
        "M_100051", //高德·超划算
        "M_100053", //游戏中心
        "M_100059", //高德酒店
        "M_100063", //ai助手
        "M_100065", //打卡消息
        "M_100068", //借钱服务
        "M_100071"  //地图大富翁
    ];
}