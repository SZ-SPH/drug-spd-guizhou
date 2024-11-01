import request from '@/utils/request'

/**
 * 盘点明细分页查询
 * @param {查询条件} data
 */
export function listStocktakingItem(query) {
  return request({
    url: 'business/StocktakingItem/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增盘点明细
 * @param data
 */
export function addStocktakingItem(data) {
  return request({
    url: 'business/StocktakingItem',
    method: 'post',
    data: data,
  })
}
/**
 * 修改盘点明细
 * @param data
 */
export function updateStocktakingItem(data) {
  return request({
    url: 'business/StocktakingItem',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取盘点明细详情
 * @param {Id}
 */
export function getStocktakingItem(id) {
  return request({
    url: 'business/StocktakingItem/' + id,
    method: 'get'
  })
}

/**
 * 删除盘点明细
 * @param {主键} pid
 */
export function delStocktakingItem(pid) {
  return request({
    url: 'business/StocktakingItem/delete/' + pid,
    method: 'delete'
  })
}
