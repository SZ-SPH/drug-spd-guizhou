<!--
 * @Descripttion: (出库单/OutOrder)
 * @Author: (admin)
 * @Date: (2024-09-27)
-->
<template>
  <div>
    <el-form :model="OutOrderqueryParams" label-position="right" inline ref="OutOrderqueryRef"
      v-show="OutOrderhandleshowSearch" @submit.prevent>
      <el-form-item label="出库单据" prop="outOrderCode">
        <el-input v-model="OutOrderqueryParams.outOrderCode" placeholder="请输入出库单据" />
      </el-form-item>
      <el-form-item label="领取部门" prop="inpharmacyId">
        <el-input v-model.number="OutOrderqueryParams.inpharmacyId" placeholder="请输入领取部门" />
      </el-form-item>
      <el-form-item label="领取人" prop="useReceive">
        <el-input v-model="OutOrderqueryParams.useReceive" placeholder="请输入领取人" />
      </el-form-item>
      <el-form-item label="发出出库" prop="outWarehouseID">
        <el-input v-model.number="OutOrderqueryParams.outWarehouseID" placeholder="请输入发出出库" />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="OutOrderdateRangeTimes" type="datetimerange" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :default-time="OutOrderdefaultTime"
          :shortcuts="dateOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="OutOrderqueryParams.remarks" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="OutOrderhandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="OutOrderhandleresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['outorder:add']" plain icon="plus" @click="OutOrderhandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="OutOrdersingle" v-hasPermi="['outorder:edit']" plain icon="edit"
          @click="OutOrderhandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="OutOrdermultiple" v-hasPermi="['outorder:delete']" plain icon="delete"
          @click="OutOrderhandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['outorder:delete']" plain icon="delete" @click="OutOrderhandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['outorder:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/OutOrder/importTemplate" importUrl="/business/OutOrder/importData"
                  @success="OutOrderhandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="OutOrderhandleExport" v-hasPermi="['outorder:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="OutOrderhandleshowSearch" @queryTable="OutOrdergetList"
        :columns="OutOrdercolumns"></right-toolbar>
    </el-row>

    <el-table :data="OutOrderdataList" v-loading="OutOrderloading" ref="OutOrdertable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="OutOrdersortChange"
      @selection-change="OutOrderhandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="Id" align="center" v-if="OutOrdercolumns.showColumn('id')" />
      <el-table-column prop="outOrderCode" label="出库单据" align="center" :show-overflow-tooltip="true"
        v-if="OutOrdercolumns.showColumn('outOrderCode')" />
      <el-table-column prop="inpharmacyId" label="领取部门" align="center"
        v-if="OutOrdercolumns.showColumn('inpharmacyId')" />
      <el-table-column prop="useReceive" label="领取人" align="center" :show-overflow-tooltip="true"
        v-if="OutOrdercolumns.showColumn('useReceive')" />
      <el-table-column prop="outWarehouseID" label="发出出库" align="center"
        v-if="OutOrdercolumns.showColumn('outWarehouseID')" />
      <el-table-column prop="times" label="时间" :show-overflow-tooltip="true"
        v-if="OutOrdercolumns.showColumn('times')" />
      <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="OutOrdercolumns.showColumn('remarks')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" OutOrdertitle="详情"
            @click="OutOrderhandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" OutOrdertitle="编辑" v-hasPermi="['outorder:edit']"
            @click="OutOrderhandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" OutOrdertitle="删除" v-hasPermi="['outorder:delete']"
            @click="OutOrderhandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="OutOrdertotal" v-model:page="OutOrderqueryParams.pageNum"
      v-model:limit="OutOrderqueryParams.pageSize" @pagination="OutOrdergetList" />


    <el-dialog :title="OutOrdertitle" :lock-scroll="false" v-model="OutOrderOutOrder">
      <el-form ref="OutOrderformRef" :model="OutOrderform" :rules="OutOrderrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12" v-if="OutOrderopertype != 1">
            <el-form-item label="Id" prop="id">
              <el-input-number v-model.number="OutOrderform.id" controls-position="right" placeholder="请输入Id"
                :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库单据" prop="outOrderCode">
              <el-input v-model="OutOrderform.outOrderCode" placeholder="请输入出库单据" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="领取部门" prop="inpharmacyId">
              <el-input v-model.number="OutOrderform.inpharmacyId" placeholder="请输入领取部门" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="领取人" prop="useReceive">
              <el-input v-model="OutOrderform.useReceive" placeholder="请输入领取人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="发出出库" prop="outWarehouseID">
              <el-input v-model.number="OutOrderform.outWarehouseID" placeholder="请输入发出出库" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="时间" prop="times">
              <el-date-picker v-model="OutOrderform.times" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="OutOrderform.remarks" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="OutOrderopertype != 3">
        <el-button text @click="OutOrdercancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="OutOrdersubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="outorder">
import {
  listOutOrder,
  addOutOrder, delOutOrder,
  updateOutOrder, getOutOrder,
  clearOutOrder,
}
  from '@/api/business/outorder.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const OutOrderids = ref([])
const OutOrderloading = ref(false)
const OutOrderhandleshowSearch = ref(true)
const OutOrderqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'Id',
  sortType: 'asc',
  outOrderCode: undefined,
  inpharmacyId: undefined,
  useReceive: undefined,
  outWarehouseID: undefined,
  times: undefined,
  remarks: undefined,
})
const OutOrdercolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'outOrderCode', label: '出库单据', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'inpharmacyId', label: '领取部门' },
  { visible: true, align: 'center', type: '', prop: 'useReceive', label: '领取人', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'outWarehouseID', label: '发出出库' },
  { visible: true, align: 'center', type: '', prop: 'times', label: '时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'remarks', label: '备注', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const OutOrdertotal = ref(0)
const OutOrderdataList = ref([])
const OutOrderqueryRef = ref()
const OutOrderdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

// 时间时间范围
const OutOrderdateRangeTimes = ref([])


var OutOrderdictParams = [
]


function OutOrdergetList() {
  proxy.addDateRange(OutOrderqueryParams, OutOrderdateRangeTimes.value, 'Times');
  OutOrderloading.value = true
  listOutOrder(OutOrderqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      OutOrderdataList.value = data.result
      OutOrdertotal.value = data.totalNum
      OutOrderloading.value = false
    }
  })
}

// 查询
function OutOrderhandleQuery() {
  OutOrderqueryParams.pageNum = 1
  OutOrdergetList()
}

// 重置查询操作
function OutOrderhandleresetQuery() {
  // 时间时间范围
  OutOrderdateRangeTimes.value = []
  proxy.resetForm("OutOrderqueryRef")
  OutOrderhandleQuery()
}
// 多选框选中数据
function OutOrderhandleSelectionChange(selection) {
  OutOrderids.value = selection.map((item) => item.id);
  OutOrdersingle.value = selection.length != 1
  OutOrdermultiple.value = !selection.length;
}
// 自定义排序
function OutOrdersortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  OutOrderqueryParams.sort = sort
  OutOrderqueryParams.sortType = sortType
  OutOrderhandleQuery()
}

/*************** form操作 ***************/
const OutOrderformRef = ref()
const OutOrdertitle = ref('')
// 操作类型 1、add 2、edit 3、view
const OutOrderopertype = ref(0)
const OutOrderOutOrder = ref(false)
const OutOrderstate = reactive({
  OutOrdersingle: true,
  OutOrdermultiple: true,
  OutOrderform: {},
  OutOrderrules: {
  },
  OutOrderoptions: {
  }
})

const { OutOrderform, OutOrderrules, OutOrderoptions, OutOrdersingle, OutOrdermultiple } = toRefs(OutOrderstate)

// 关闭dialog
function OutOrdercancel() {
  OutOrderOutOrder.value = false
  OutOrderreset()
}

// 重置表单
function OutOrderreset() {
  OutOrderform.value = {
    id: null,
    outOrderCode: null,
    inpharmacyId: null,
    useReceive: null,
    outWarehouseID: null,
    times: null,
    remarks: null,
  };
  proxy.resetForm("OutOrderformRef")
}

/**
 * 查看
 * @param {*} row
 */
function OutOrderhandlePreview(row) {
  OutOrderreset()
  const id = row.id
  getOutOrder(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      OutOrderOutOrder.value = true
      OutOrdertitle.value = '查看'
      OutOrderopertype.value = 3
      OutOrderform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function OutOrderhandleAdd() {
  OutOrderreset();
  OutOrderOutOrder.value = true
  OutOrdertitle.value = '添加出库单'
  OutOrderopertype.value = 1
}
// 修改按钮操作
function OutOrderhandleUpdate(row) {
  OutOrderreset()
  const id = row.id || OutOrderids.value
  getOutOrder(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      OutOrderOutOrder.value = true
      OutOrdertitle.value = '修改出库单'
      OutOrderopertype.value = 2

      OutOrderform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function OutOrdersubmitForm() {
  proxy.$refs["OutOrderformRef"].validate((valid) => {
    if (valid) {

      if (OutOrderform.value.id != undefined && OutOrderopertype.value === 2) {
        updateOutOrder(OutOrderform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          OutOrderOutOrder.value = false
          OutOrdergetList()
        })
      } else {
        addOutOrder(OutOrderform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          OutOrderOutOrder.value = false
          OutOrdergetList()
        })
      }
    }
  })
}

// 删除按钮操作
function OutOrderhandleDelete(row) {
  const OutOrderids = row.id || OutOrderids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + OutOrderids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      OutOrdercancelButtonText: proxy.$t('common.OutOrdercancel'),
      type: "warning",
    })
    .then(function () {
      return delOutOrder(OutOrderids)
    })
    .then(() => {
      OutOrdergetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function OutOrderhandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      OutOrdercancelButtonText: proxy.$t('common.OutOrdercancel'),
      type: "warning",
    })
    .then(function () {
      return clearOutOrder()
    })
    .then(() => {
      OutOrderhandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const OutOrderhandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  OutOrdergetList()
}

// 导出按钮操作
function OutOrderhandleExport() {
  proxy
    .$confirm("是否确认导出出库单数据项?", "警告", {
      confirmButtonText: "确定",
      OutOrdercancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/OutOrder/export', { ...OutOrderqueryParams })
    })
}

OutOrderhandleQuery()
</script>