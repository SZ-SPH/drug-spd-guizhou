import request from '@/utils/request'

/**
 * 入库单分页查询
 * @param {查询条件} data
 */
export function listWarehouseReceipt(query) {
  return request({
    url: 'business/WarehouseReceipt/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增入库单
 * @param data
 */
export function addWarehouseReceipt(data) {
  return request({
    url: 'business/WarehouseReceipt',
    method: 'post',
    data: data,
  })
}
/**
 * 新增
 * @param data
 */
export function drugAdd(stockid) {
  return request({
    url: 'business/WarehouseReceipt/DrugAdd/' + stockid,
    method: 'get',
    // data: data,
  })
}

/**s
 * 收货
 * @param data
 */
export function sendOutWarehouseReceipt(data) {
  return request({
    url: 'business/WarehouseReceipt/sendOutWarehouseReceipt',
    method: 'post',
    data: data,
  })
}

// SendOutWarehouseReceipt


/**
 * 修改入库单
 * @param data
 */
export function updateWarehouseReceipt(data) {
  return request({
    url: 'business/WarehouseReceipt',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取入库单详情
 * @param {Id}
 */
export function getWarehouseReceipt(id) {
  return request({
    url: 'business/WarehouseReceipt/' + id,
    method: 'get'
  })
}

/**
 * 删除入库单
 * @param {主键} pid
 */
export function delWarehouseReceipt(pid) {
  return request({
    url: 'business/WarehouseReceipt/delete/' + pid,
    method: 'delete'
  })
}
