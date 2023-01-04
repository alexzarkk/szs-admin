

/* 

    名称
    key
    数据

    name key value

*/

import zz from '@/comm/zz'
import { dept } from '@/comm/dict'
let configKey = ''  // 当前配置的key
let deptId = ''
let originData = null  // 服务端返回的信息
import request from "@/service/request";
let list = []  // 修改的list
const getList = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            request({
                url: '/admin/sys/param/one',
                method: 'POST',
                data: {
                    key: configKey
                }

            }).then(res => {
                console.log("获取到的配置=======", res)
                if (res) {
                    originData = res
                } else {
                    originData = {
                        key: configKey,
                        data: []
                    }
                }
                resolve(originData.data)
            }).catch(err => {
                reject(err)
            })
        }, 1000)
    })
}


// 把当前的list 提交到数据库，每次发生 修改的时候都提交一次
const commitList = (type = 'update') => {
    return new Promise((resolve, reject) => {
        console.log("更新==============", this)
        // console.log("提交的表单=======", list, configKey)
        originData.data = list
        let req = {
            url: '/admin/sys/param/update',
            method: 'POST',
            data: {
                ...originData
            }
        }
        if (!originData._id) {
            req.url = '/admin/sys/param/add'
        }
        request(req).then(res => {
            console.log("update的返回值==========", res)
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
        resolve()
    })
}

const formatObj = (obj) => {
    let keys = Object.keys(obj);
    for (const k of keys) {
        if (obj[k] === undefined) {
            obj[k] = '';
        }
    }
    return obj
}

export const paramsService = {
    page: async (p) => {
        console.log("page======", p)
        configKey = `${p.type}_${p.deptValue[p.deptValue.length - 1]}`
        deptId = `${p.deptValue[0]}`

        let total = 0;
        let result = await getList()
        list = result
        let pageList = result.filter((e, i) => {
            // if (p.name) {
            //     return e.name.includes(p.name);
            // }

            // if (![undefined, null, ""].includes(p.status)) {
            //     return e.status === p.status;
            // }

            total++;

            if (i >= (p.page - 1) * p.size && i < p.page * p.size) {
                return true;
            } else {
                return false;
            }
        });
        return new Promise((resolve, reject) => {
            let pageResult = {
                list: pageList,
                pagination: {
                    page: p.page,
                    size: p.size,
                    total
                }
            }
            resolve(pageResult);
        });
    },
    info: (d) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let item = list.find((e) => e.id == d.id);
                // item.hook = "1,2,3";
                resolve(item);
            }, 1000);
        });
    },
    add: async (d) => {
        console.log("POST[add]", d);
        let id = 1
        if (list.length > 0) {
            id = list[list.length - 1].id
        }
        console.log("添加时的id=======", id)
        id = id + 1
        let now = zz.time2Date(null, 'Y-M-D h:m:s')
        // console.log("createTime=========", now)
        d = formatObj(d)
        list.push({
            ...d,
            id: id,
            createTime: now,
            status: 6,
            deptId: deptId
        });
        commitList('add').then(res => {
            return Promise.resolve();
        })
    },
    delete: async (d) => {
        console.log("POST[delete]", d);
        (d.ids || []).forEach((id) => {
            const index = list.findIndex((e) => e.id == id);
            list.splice(index, 1);
        });
        await commitList('update')  // 删除，也算是更新的一种，更新了list
        return Promise.resolve();
    },
    update: async (d) => {
        console.log("POST[update]", d);
        let item = list.find((e) => e.id == d.id);
        Object.assign(item, d);
        item = formatObj(item)
        console.log('update============object=========', JSON.parse(JSON.stringify(item)));
        await commitList('update')
        return Promise.resolve();
    }
}