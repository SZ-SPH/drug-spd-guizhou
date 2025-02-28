<!--
 * @Descripttion: (入库详情/t_inwarehousedetail)
 * @Author: (admin)
 * @Date: (2025-02-18)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="药品编码 关联 " prop="drugCode">
        <el-input v-model="queryParams.drugCode" placeholder="请输入药品编码 关联 " />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="dateRangeCreateTime" type="datetimerange" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime"
          :shortcuts="dateOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="批号" prop="batchNo">
        <el-input v-model="queryParams.batchNo" placeholder="请输入批号" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <!-- <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['tinwarehousedetail:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['tinwarehousedetail:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['tinwarehousedetail:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['tinwarehousedetail:delete']" plain icon="delete" @click="handleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['tinwarehousedetail:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/TInwarehousedetail/importTemplate"
                  importUrl="/business/TInwarehousedetail/importData" @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
</el-dropdown>
</el-col> -->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport"
          v-hasPermi="['tinwarehousedetail:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <!-- <el-table-column prop="tstars" width="180" label="推送结果" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('tstars')">
            <template #default="scope">
              {{ scope.row.tstars !== null && scope.row.tstars !== '' ? scope.row.tstars : '未推送' }}
            </template>
          </el-table-column> -->
      <el-table-column prop="drugCode" width="200" label="药品编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugCode')" />
      <el-table-column prop="tradeName" width="280" label="药品名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('tradeName')" />
      <el-table-column prop="inwarehouseQty" width="180" label="入库数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('inwarehouseQty')" />
      <el-table-column prop="drugDeptCode" width="180" label="科室编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugDeptCode')" />

      <el-table-column prop="inName" width="180" label="产地" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('inName')" />
      <el-table-column prop="mixBuyPrice" width="180" label="购入价" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('mixBuyPrice')" />
      <el-table-column prop="mixOutPrice" width="180" label="零售价" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('mixOutPrice')" />
      <el-table-column prop="tstars" width="180" label="推送结果" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('tstars')" />

      <el-table-column prop="batchNo" width="180" label="批号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('batchNo')" />
      <el-table-column prop="approveInfo" width="180" label="批准文号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('approveInfo')" />
      <el-table-column prop="valiDate" width="180" label="有效期" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('valiDate')" />
      <el-table-column prop="productDate" width="180" label="生产日期" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('productDate')" />


      <el-table-column prop="specs" width="180" label="规格" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('specs')" />
      <el-table-column prop="retailPrice" width="180" label="参考零售价" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('retailPrice')" />
      <el-table-column prop="wholesalePrice" width="180" label="参考批发价" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('wholesalePrice')" />
      <el-table-column prop="purchasePrice" width="180" label="最新购入价" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('purchasePrice')" />
      <el-table-column prop="packUnit" width="180" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('packUnit')" />
      <el-table-column prop="packQty" width="180" label="包装数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('packQty')" />
      <el-table-column prop="minUnit" width="180" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('minUnit')" />
      <el-table-column prop="producerCode" width="180" label="生产厂家编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('producerCode')" />
      <el-table-column prop="producerName" width="180" label="生产厂家名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('producerName')" />
      <el-table-column prop="storeNum" width="180" label="本科室库存数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('storeNum')" />
      <el-table-column prop="storeTotsum" width="180" label="全院库存总和" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('storeTotsum')" />
      <el-table-column prop="outputSum" width="180" label="全院出库总量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('outputSum')" />
      <el-table-column prop="planNum" width="180" label="计划入库量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('planNum')" />
      <el-table-column prop="planEmpl" width="180" label="计划人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('planEmpl')" />
      <el-table-column prop="planDate" width="180" label="计划日期" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('planDate')" />
      <el-table-column prop="stockNum" width="180" label="采购数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stockNum')" />
      <el-table-column prop="stockEmpl" width="180" label="采购人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stockEmpl')" />
      <el-table-column prop="stockDate" width="180" label="采购日期" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stockDate')" />
      <el-table-column prop="approveEmpl" width="180" label="审批人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('approveEmpl')" />
      <el-table-column prop="approveDate" width="180" label="审批时间" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('approveDate')" />
      <!-- <el-table-column prop="drugDeptCode" width="180" label="科室编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugDeptCode')" /> -->

      <el-table-column prop="createTime" width="180" label="创建时间" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('createTime')" />
      <el-table-column prop="remark" width="180" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('remark')" />
      <el-table-column prop="stockNo" width="180" label="采购流水号" align="center"
        :show-overflow-tooltip="true"></el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="65">
       <template #default="scope">

        </template> 
      </el-table-column> -->
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />


    <el-dialog :title="title" :lock-scroll="false" v-model="open">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12" v-if="opertype != 1">
            <el-form-item label="Id" prop="id">
              <el-input-number v-model.number="form.id" controls-position="right" placeholder="请输入Id"
                :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品编码 关联 " prop="drugCode">
              <el-input v-model="form.drugCode" placeholder="请输入药品编码 关联 " />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库数量" prop="inwarehouseQty">
              <el-input v-model.number="form.inwarehouseQty" placeholder="请输入入库数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker v-model="form.createTime" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库单ID" prop="inwarehouseId">
              <el-input v-model.number="form.inwarehouseId" placeholder="请输入入库单ID" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="流水号" prop="serialNum">
              <el-input v-model="form.serialNum" placeholder="请输入流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批号" prop="batchNo">
              <el-input v-model="form.batchNo" placeholder="请输入批号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批次号 （废弃）" prop="batchId">
              <el-input v-model="form.batchId" placeholder="请输入批次号 （废弃）" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批文信息" prop="approveInfo">
              <el-input v-model="form.approveInfo" placeholder="请输入批文信息" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购单号" prop="purchaseOrderNum">
              <el-input v-model="form.purchaseOrderNum" placeholder="请输入采购单号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产日期" prop="productDate">
              <el-input v-model="form.productDate" placeholder="请输入生产日期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="有效期" prop="valiDate">
              <el-input v-model="form.valiDate" placeholder="请输入有效期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="产地" prop="inName">
              <el-input v-model="form.inName" placeholder="请输入产地" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="MixBuyPrice" prop="mixBuyPrice">
              <el-input v-model="form.mixBuyPrice" placeholder="请输入MixBuyPrice" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="MixOutPrice" prop="mixOutPrice">
              <el-input v-model="form.mixOutPrice" placeholder="请输入MixOutPrice" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="推送状态" prop="tstars">
              <el-input v-model="form.tstars" placeholder="请输入推送状态" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产厂家" prop="productCode">
              <el-input v-model="form.productCode" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="opertype != 3">
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="tinwarehousedetail">
import {
  listTInwarehousedetail, listTInwarehousedetails,
  addTInwarehousedetail, delTInwarehousedetail,
  updateTInwarehousedetail, getTInwarehousedetail,
  clearTInwarehousedetail,
}
  from '@/api/business/tinwarehousedetail.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  drugCode: undefined,
  createTime: undefined,
  batchNo: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'drugDeptCode', label: '科室编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugCode', label: '药品编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'tradeName', label: '药品名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'InwarehouseQty', label: '入库数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'specs', label: '规格', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'retailPrice', label: '参考零售价', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'wholesalePrice', label: '参考批发价', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'purchasePrice', label: '最新购入价', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packUnit', label: '包装单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packQty', label: '包装数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'minUnit', label: '最小单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'producerCode', label: '生产厂家编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'producerName', label: '生产厂家名称', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'storeNum', label: '本科室库存数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'storeTotsum', label: '全院库存总和', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'outputSum', label: '全院出库总量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'planNum', label: '计划入库量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'planEmpl', label: '计划人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'planDate', label: '计划日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockNum', label: '采购数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockEmpl', label: '采购人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockDate', label: '采购日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveEmpl', label: '审批人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveDate', label: '审批时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'batchNo', label: '批号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'approveInfo', label: '批准文号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'valiDate', label: '有效期', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'productDate', label: '生产日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockNo', label: '采购流水号', showOverflowTooltip: true },
])

// const columns = ref([
//   { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
//   { visible: true, align: 'center', type: '', prop: 'drugCode', label: '药品编码 关联 ', showOverflowTooltip: true },
//   { visible: true, align: 'center', type: '', prop: 'inwarehouseQty', label: '入库数量' },
//   { visible: true, align: 'center', type: '', prop: 'remark', label: '备注', showOverflowTooltip: true },
//   { visible: true, align: 'center', type: '', prop: 'createTime', label: '创建时间', showOverflowTooltip: true },
//   { visible: true, align: 'center', type: '', prop: 'inwarehouseId', label: '入库单ID' },
//   { visible: true, align: 'center', type: '', prop: 'serialNum', label: '流水号', showOverflowTooltip: true },
//   { visible: true, align: 'center', type: '', prop: 'batchNo', label: '批号', showOverflowTooltip: true },
//   { visible: false, align: 'center', type: '', prop: 'batchId', label: '批次号 （废弃）', showOverflowTooltip: true },
//   { visible: false, align: 'center', type: '', prop: 'approveInfo', label: '批文信息', showOverflowTooltip: true },
//   { visible: false, align: 'center', type: '', prop: 'purchaseOrderNum', label: '采购单号', showOverflowTooltip: true },
//   { visible: false, align: 'center', type: '', prop: 'productDate', label: '生产日期', showOverflowTooltip: true },
//   { visible: false, align: 'center', type: '', prop: 'valiDate', label: '有效期', showOverflowTooltip: true },
//   { visible: false, align: 'center', type: '', prop: 'inName', label: '产地', showOverflowTooltip: true },
//   { visible: false, align: 'center', type: '', prop: 'mixBuyPrice', label: 'MixBuyPrice' },
//   { visible: false, align: 'center', type: '', prop: 'mixOutPrice', label: 'MixOutPrice' },
//   { visible: false, align: 'center', type: '', prop: 'tstars', label: '推送状态', showOverflowTooltip: true },
//   { visible: false, align: 'center', type: '', prop: 'productCode', label: '生产厂家', showOverflowTooltip: true },
//   //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
// ])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

// 创建时间时间范围
const dateRangeCreateTime = ref([])


var dictParams = [
]


function getList() {
  proxy.addDateRange(queryParams, dateRangeCreateTime.value, 'CreateTime');
  loading.value = true
  listTInwarehousedetails(queryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      dataList.value = data.result
      total.value = data.totalNum
      loading.value = false
    }
  })
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

// 重置查询操作
function resetQuery() {
  // 创建时间时间范围
  dateRangeCreateTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1
  multiple.value = !selection.length;
}
// 自定义排序
function sortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  queryParams.sort = sort
  queryParams.sortType = sortType
  handleQuery()
}

/*************** form操作 ***************/
const formRef = ref()
const title = ref('')
// 操作类型 1、add 2、edit 3、view
const opertype = ref(0)
const open = ref(false)
const state = reactive({
  single: true,
  multiple: true,
  form: {},
  rules: {
  },
  options: {
  }
})

const { form, rules, options, single, multiple } = toRefs(state)

// 关闭dialog
function cancel() {
  open.value = false
  reset()
}

// 重置表单
function reset() {
  form.value = {
    id: null,
    drugCode: null,
    inwarehouseQty: null,
    remark: null,
    createTime: null,
    inwarehouseId: null,
    serialNum: null,
    batchNo: null,
    batchId: null,
    approveInfo: null,
    purchaseOrderNum: null,
    productDate: null,
    valiDate: null,
    inName: null,
    mixBuyPrice: null,
    mixOutPrice: null,
    tstars: null,
    productCode: null,
  };
  proxy.resetForm("formRef")
}

/**
 * 查看
 * @param {*} row
 */
function handlePreview(row) {
  reset()
  const id = row.id
  getTInwarehousedetail(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '查看'
      opertype.value = 3
      form.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function handleAdd() {
  reset();
  open.value = true
  title.value = '添加入库详情'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getTInwarehousedetail(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改入库详情'
      opertype.value = 2

      form.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {

      if (form.value.id != undefined && opertype.value === 2) {
        updateTInwarehousedetail(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addTInwarehousedetail(form.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

// 删除按钮操作
function handleDelete(row) {
  const Ids = row.id || ids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delTInwarehousedetail(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function handleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return clearTInwarehousedetail()
    })
    .then(() => {
      handleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const handleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  getList()
}

// 导出按钮操作
function handleExport() {
  proxy
    .$confirm("是否确认导出入库详情数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/TInwarehousedetail/export', { ...queryParams })
    })
}

handleQuery()
</script>