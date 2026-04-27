if (!$response.body) $done({});
let obj = JSON.parse($response.body);

//首页列表
if (obj.data?.homeV3?.elements?.edges?.length > 0) {
    obj.data.homeV3.elements.edges = obj.data.homeV3.elements.edges.filter((i) => {
        return !(i?.node?.hasOwnProperty('adPayload') && i.node.adPayload !== null);
    });
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