globalThis.getHeaders = function () {
    const loginUrl = 'https://u.shytkjgs.com/user/v1/account/login';
    const opt = {
        method: 'POST',
        headers: {
            'User-Agent': 'okhttp/4.10.0',
            'platform': '1',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            device: '24250683a3bdb3f118dff25ba4b1cba1a'
        })
    };
    const res = JSON.parse(request(loginUrl, opt));
    const token = res?.data?.token || res?.token || '';
    return {
        'User-Agent': 'okhttp/4.10.0',
        'platform': '1',
        'authorization': token,
        'Content-Type': 'application/json'
    };
};

var rule = {
    author: '星芽短剧',
    title: '星芽短剧',
    类型: '影视',
    host: 'https://app.whjzjx.cn',
    headers: getHeaders(),
    编码: 'utf-8',
    timeout: 8000,
    homeUrl: '/cloud/v2/theater/home_page?theater_class_id=1&type=1&class2_ids=0&page_num=1&page_size=24',
    url: '/cloud/v2/theater/home_page?theater_class_id=1&type=1&class2_ids=0&page_num=fypage&page_size=24',
    detailUrl: '',
    searchUrl: '/v3/search',
    searchable: 1,
    quickSearch: 1,
    filterable: 0,
    class_name: '推荐',
    class_url: '1',
    play_parse: true,
    lazy: `js:
if (/\\.(m3u8|mp4)/.test(input)) {
    input = { jx: 0, parse: 0, url: input }
} else {
    input = { jx: 0, parse: 1, url: input }
}`,
    一级: `js:
let kjson = JSON.parse(request(input, {headers: getHeaders()}));
let list = kjson.data.list || [];
list.sort((a, b) => (b.theater.publish_time || 0) - (a.theater.publish_time || 0));
VODS = [];
list.forEach(it => {
    VODS.push({
        vod_name: it.theater.title,
        vod_pic: it.theater.cover_url,
        vod_remarks: it.theater.total + '集',
        vod_id: 'https://app.whjzjx.cn/v2/theater_parent/detail?theater_parent_id=' + it.theater.id
    });
});
`,
    二级: `js:
let kjson = JSON.parse(request(input, {headers: getHeaders()}));
let kplist = (kjson.data.theaters || []).map(it => it.num + '$' + it.son_video_url);
VOD = {
    vod_id: input,
    vod_name: kjson.data.title,
    vod_pic: kjson.data.cover_url,
    type_name: (kjson.data.desc_tags || []).join('|'),
    vod_remarks: kjson.data.total + '集',
    vod_director: '星芽短剧',
    vod_actor: kjson.data.filing || '',
    vod_content: kjson.data.introduction || '',
    vod_play_from: '星芽',
    vod_play_url: kplist.join('#')
};
`,
    搜索: `js:
let kjson = JSON.parse(request(input, {
    headers: getHeaders(),
    method: 'POST',
    body: JSON.stringify({ text: KEY })
}));
let list = kjson.data.theater.search_data || [];
list.sort((a, b) => (b.publish_time || 0) - (a.publish_time || 0));
VODS = [];
list.forEach(it => {
    VODS.push({
        vod_name: it.title,
        vod_pic: it.cover_url,
        vod_remarks: it.total + '集',
        vod_id: 'https://app.whjzjx.cn/v2/theater_parent/detail?theater_parent_id=' + it.id
    });
});
`
};
