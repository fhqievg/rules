if (!$response.body) $done({});
let obj = JSON.parse($response.body);

const isEnableRelatedCommunities = false; //是否启用相关社区
const isEnableTopPost = true; //是否显示置顶贴

//首页相关
//最新列表
if (obj.data?.homeV3?.elements?.edges?.length > 0) {
    obj.data.homeV3.elements.edges = adDataFilter(obj.data.homeV3.elements.edges);
}
//新闻列表
if (obj.data?.newsV3?.elements?.edges?.length > 0) {
    obj.data.newsV3.elements.edges = adDataFilter(obj.data.newsV3.elements.edges);
}
//热门列表
if (obj.data?.popularV3?.elements?.edges?.length > 0) {
    obj.data.popularV3.elements.edges = adDataFilter(obj.data.popularV3.elements.edges);
}

//社区相关
//主页列表
if (obj.data?.subredditV3?.elements?.edges?.length > 0) {
    obj.data.subredditV3.elements.edges = obj.data.subredditV3.elements.edges.filter((i) => {
        if (checkIsAd(i)) {
            return false;
        }

        //相关社区模块处理
        if (i?.node?.hasOwnProperty('model') && i.node.model === 'related_community_recommendations') {
            return isEnableRelatedCommunities;
        }
        return true;
    });
}
//置顶贴处理
if (obj.data?.subredditInfoByName?.highlightedPosts?.length > 0) {
    if (!isEnableTopPost) {
        obj.data.subredditInfoByName.highlightedPosts = [];
    }
}

//帖子详情
if (obj.data?.postsInfoByIds?.length > 0) {
    obj.data.postsInfoByIds = obj.data.postsInfoByIds.filter(
        (i) =>
            !(i?.hasOwnProperty("adSupplementaryTextRichtext"))
    );
}
if (obj.data?.postInfoById?.pdpCommentsAds?.adPosts?.length > 0) {
    obj.data.postInfoById.pdpCommentsAds.adPosts = [];
}

$done({ body: JSON.stringify(obj) });

function adDataFilter(list) {
    return list.filter((i) => {
        return !checkIsAd(i);
    });
}

//校验是否是推广
function checkIsAd(item, key = 'node') {
    return (item.hasOwnProperty(key) && item[key].hasOwnProperty('adPayload') && item[key].adPayload !== null);
}