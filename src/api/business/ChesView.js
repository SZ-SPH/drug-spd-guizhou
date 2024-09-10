import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 码信息分页查询
 * @param {查询条件} data
 */
export function listChesView(query) {
	return request({
		url: 'business/ChesView/list',
		method: 'get',
		params: query,
	})
}

/**
 * 新增码信息
 * @param data
 */
export function addChesView(data) {
	return request({
		url: 'business/ChesView',
		method: 'post',
		data: data,
	})
}
/**
 * 修改码信息
 * @param data
 */
export function updateChesView(data) {
	return request({
		url: 'business/ChesView',
		method: 'PUT',
		data: data,
	})
}
/**
 * 获取码信息详情
 * @param {Id}
 */
export function getChesView(id) {
	return request({
		url: 'business/ChesView/' + id,
		method: 'get'
	})
}

/**
 * 删除码信息
 * @param {主键} pid
 */
export function delChesView(pid) {
	return request({
		url: 'business/ChesView/delete/' + pid,
		method: 'delete'
	})
}
// 清空码信息
export function clearChesView() {
	return request({
		url: 'business/ChesView/clean',
		method: 'delete'
	})
}
// 导出码信息
export async function exportChesView(query) {
	await downFile('business/ChesView/export', { ...query })
}
