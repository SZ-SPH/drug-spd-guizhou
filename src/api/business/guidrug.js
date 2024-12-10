import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 药品分页查询
 * @param {查询条件} data
 */
export function listGuiDrug(query) {
  return request({
    url: 'business/GuiDrug/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增药品
 * @param data
 */
export function addGuiDrug(data) {
  return request({
    url: 'business/GuiDrug',
    method: 'post',
    data: data,
  })
}
/**
 * 修改药品
 * @param data
 */
export function updateGuiDrug(data) {
  return request({
    url: 'business/GuiDrug',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取药品详情
 * @param {Id}
 */
export function getGuiDrug(id) {
  return request({
    url: 'business/GuiDrug/' + id,
    method: 'get'
  })
}

/**
 * 删除药品
 * @param {主键} pid
 */
export function delGuiDrug(pid) {
  return request({
    url: 'business/GuiDrug/delete/' + pid,
    method: 'delete'
  })
}
// 清空药品
export function clearGuiDrug() {
  return request({
    url: 'business/GuiDrug/clean',
    method: 'delete'
  })
}
// 导出药品
export async function exportGuiDrug(query) {
  await downFile('business/GuiDrug/export', { ...query })
}
