

/* 

    名称
    key
    数据

    name key value

*/

import zz from '@/comm/zz'
import { dept } from '@/comm/dict'

console.log("获取到的部门信息", dept.list)
let newList = zz.deepTree(dept.list)
console.log("==============", newList)


let list = [
    {
        id: 1,
        title: '轮播图A',
        remark: '备注',
        isShow: false, // 是否加入轮播图展示
        cover: '', // 轮播图封面
        pagePath: '',
        pageParams: '',
        deptId: 330000,
        status: 6
    },
    {
        id: 2,
        title: '轮播图A',
        remark: '备注',
        isShow: false, // 是否加入轮播图展示
        cover: '', // 轮播图封面
        pagePath: '',
        pageParams: '',
        deptId: 330000,
        status: 6
    },
    {
        id: 3,
        title: '轮播图A',
        remark: '备注',
        isShow: false, // 是否加入轮播图展示
        cover: '', // 轮播图封面
        pagePath: '',
        pageParams: '',
        deptId: 330000,
        status: 6
    },
    {
        id: 4,
        title: '轮播图A',
        remark: '备注',
        isShow: false, // 是否加入轮播图展示
        cover: '', // 轮播图封面
        pagePath: '',
        pageParams: '',
        deptId: 330000,
        status: 6
    }
]

const getList = () => {
    // 拼接Key，banner_deptId 
    // banner_330000
    return new Promise((resolve, reject) => {
        console.log("getList==========", list)
        // 
        // this.$service.





        resolve(list)
    })
}


// 把当前的list 提交到数据库，每次发生 修改的时候都提交一次
const commitList = () => {
    console.log("提交的表单=======", list)
}


export const paramsService = {


    page: async (p) => {
        console.log(p);
        let total = 0;
        let result = await getList()
        let pageList = result.filter((e, i) => {
            // if (p.name) {
            //     return e.name.includes(p.name);
            // }

            // if (![undefined, null, ""].includes(p.status)) {
            //     return e.status === p.status;
            // }

            // total++;

            if (i >= (p.page - 1) * p.size && i < p.page * p.size) {
                return true;
            } else {
                return false;
            }
        });

        console.log('pageLis============', pageList);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let pageResult = {
                    list: pageList,
                    pagination: {
                        page: p.page,
                        size: p.size,
                        total
                    }
                }
                console.log("分页返回值========", pageResult)
                resolve(pageResult);
            }, 500);
        });
    },
    info: (d) => {
        console.log("GET[info]", d);
        return new Promise((resolve) => {
            setTimeout(() => {
                let item = list.find((e) => e.id == d.id);
                item.hook = "1,2,3";
                resolve(item);
            }, 1000);
        });
    },
    add: (d) => {
        console.log("POST[add]", d);
        let id = list[list.length - 1].id
        let now = zz.time2Date(null, 'Y-M-D h:m:s')
        console.log("createTime=========", now)
        list.push({
            ...d,
            id: id++,
            createTime: now
        });
        commitList()
        return Promise.resolve();
    },
    delete: (d) => {
        console.log("POST[delete]", d);
        (d.ids || []).forEach((id) => {
            const index = list.findIndex((e) => e.id == id);
            list.splice(index, 1);
        });
        return Promise.resolve();
    },
    update: (d) => {
        console.log("POST[update]", d);
        let item = list.find((e) => e.id == d.id);
        Object.assign(item, d);
        return Promise.resolve();
    }
}