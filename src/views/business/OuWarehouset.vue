<!--
 * @Descripttion: (出库/OuWarehouset)
 * @Author: (admin)
 * @Date: (2024-09-26)
-->
<template>
  <div>
    <el-form :model="OutqueryParams" label-position="right" inline ref="OutqueryRef" v-show="OutshowSearch"
      @submit.prevent>
      <el-form-item label="药品" prop="drugId">
        <el-input v-model.number="OutqueryParams.drugId" placeholder="请输入药品" />
      </el-form-item>
      <el-form-item label="出库房" prop="outWarehouseID">
        <el-input v-model.number="OutqueryParams.outWarehouseID" placeholder="请输入出库房" />
      </el-form-item>
      <el-form-item label="入药房" prop="inpharmacyId">
        <el-input v-model.number="OutqueryParams.inpharmacyId" placeholder="请输入入药房" />
      </el-form-item>
      <el-form-item label="数量" prop="qty">
        <el-input v-model="OutqueryParams.qty" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="申请计划" prop="pharmacyId">
        <el-input v-model.number="OutqueryParams.pharmacyId" placeholder="请输入申请计划" />
      </el-form-item>
      <el-form-item label="出库单" prop="outorderID">
        <el-input v-model.number="OutqueryParams.outorderID" placeholder="请输入出库单" />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="OutdateRangeTimes" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss" :default-time="OutdefaultTime" :shortcuts="dateOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="OuthandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="OutresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['ouwarehouset:add']" plain icon="plus" @click="OuthandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="Outsingle" v-hasPermi="['ouwarehouset:edit']" plain icon="edit"
          @click="OuthandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="Outmultiple" v-hasPermi="['ouwarehouset:delete']" plain icon="delete"
          @click="OuthandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['ouwarehouset:delete']" plain icon="delete" @click="OuthandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['ouwarehouset:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/OuWarehouset/importTemplate"
                  importUrl="/business/OuWarehouset/importData" @success="OuthandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="OuthandleExport" v-hasPermi="['ouwarehouset:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="OutshowSearch" @queryTable="OutgetList" :columns="Outcolumns"></right-toolbar>
    </el-row>

    <el-table :data="OutdataList" v-loading="Outloading" ref="Outtable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="OutsortChange"
      @selection-change="OuthandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="Id" align="center" v-if="Outcolumns.showColumn('id')" />
      <el-table-column prop="drugId" label="药品" align="center" v-if="Outcolumns.showColumn('drugId')" />
      <el-table-column prop="outWarehouseID" label="出库房" align="center"
        v-if="Outcolumns.showColumn('outWarehouseID')" />
      <el-table-column prop="outorderID" label="出库单" align="center" v-if="Outcolumns.showColumn('outorderID')" />
      <el-table-column prop="inpharmacyId" label="入药房" align="center" v-if="Outcolumns.showColumn('inpharmacyId')" />
      <el-table-column prop="qty" label="数量" align="center" v-if="Outcolumns.showColumn('qty')" />
      <el-table-column prop="pharmacyId" label="申请计划" align="center" v-if="Outcolumns.showColumn('pharmacyId')" />
      <el-table-column prop="times" label="时间" :show-overflow-tooltip="true" v-if="Outcolumns.showColumn('times')" />
      <el-table-column prop="drugname" label="药品名称" align="center" :show-overflow-tooltip="true"
        v-if="Outcolumns.showColumn('drugname')" />
      <el-table-column prop="drugSpecifications" label="规格" align="center" :show-overflow-tooltip="true"
        v-if="Outcolumns.showColumn('drugSpecifications')" />
      <el-table-column prop="minunit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="Outcolumns.showColumn('minunit')" />
      <el-table-column prop="buyprice" label="购入价" align="center" v-if="Outcolumns.showColumn('buyprice')" />
      <el-table-column prop="allbuyprice" label="购入金额" align="center" v-if="Outcolumns.showColumn('allbuyprice')" />
      <el-table-column prop="retailPrice" label="零售价" align="center" v-if="Outcolumns.showColumn('retailPrice')" />
      <el-table-column prop="allRetailPrice" label="售价金额" align="center"
        v-if="Outcolumns.showColumn('allRetailPrice')" />
      <el-table-column prop="manufacturerId" label="生产厂家" align="center"
        v-if="Outcolumns.showColumn('manufacturerId')" />
      <el-table-column prop="batchNumber" label="批号" align="center" :show-overflow-tooltip="true"
        v-if="Outcolumns.showColumn('batchNumber')" />
      <el-table-column prop="exprie" label="有效期" align="center" :show-overflow-tooltip="true"
        v-if="Outcolumns.showColumn('exprie')" />
      <el-table-column prop="locationNumber" label="货位号" align="center" :show-overflow-tooltip="true"
        v-if="Outcolumns.showColumn('locationNumber')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" Outtitle="详情"
            @click="OuthandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" Outtitle="编辑" v-hasPermi="['ouwarehouset:edit']"
            @click="OuthandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" Outtitle="删除" v-hasPermi="['ouwarehouset:delete']"
            @click="OuthandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="Outtotal" v-model:page="OutqueryParams.pageNum" v-model:limit="OutqueryParams.pageSize"
      @pagination="OutgetList" />


    <el-dialog :Outtitle="Outtitle" :lock-scroll="false" v-model="Outopen">
      <el-form ref="OutformRef" :model="Outform" :rules="Outrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="Id" prop="id">
              <el-input v-model.number="Outform.id" placeholder="请输入Id" :disabled="opertype != 1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品" prop="drugId">
              <el-input v-model.number="Outform.drugId" placeholder="请输入药品" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库房" prop="outWarehouseID">
              <el-input v-model.number="Outform.outWarehouseID" placeholder="请输入出库房" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入药房" prop="inpharmacyId">
              <el-input v-model.number="Outform.inpharmacyId" placeholder="请输入入药房" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="数量" prop="qty">
              <el-input v-model="Outform.qty" placeholder="请输入数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请计划" prop="pharmacyId">
              <el-input v-model.number="Outform.pharmacyId" placeholder="请输入申请计划" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="时间" prop="times">
              <el-date-picker v-model="Outform.times" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品名称" prop="drugname">
              <el-input v-model="Outform.drugname" placeholder="请输入药品名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="规格" prop="drugSpecifications">
              <el-input v-model="Outform.drugSpecifications" placeholder="请输入规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最小单位" prop="minunit">
              <el-input v-model="Outform.minunit" placeholder="请输入最小单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="购入价" prop="buyprice">
              <el-input v-model="Outform.buyprice" placeholder="请输入购入价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="购入金额" prop="allbuyprice">
              <el-input v-model="Outform.allbuyprice" placeholder="请输入购入金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="零售价" prop="retailPrice">
              <el-input v-model="Outform.retailPrice" placeholder="请输入零售价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="售价金额" prop="allRetailPrice">
              <el-input v-model="Outform.allRetailPrice" placeholder="请输入售价金额" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="出库单" prop="outorderID">
              <el-input v-model="Outform.outorderID" placeholder="请输入出库单" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="生产厂家" prop="manufacturerId">
              <el-input v-model.number="Outform.manufacturerId" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批号" prop="batchNumber">
              <el-input v-model="Outform.batchNumber" placeholder="请输入批号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="有效期" prop="exprie">
              <el-input v-model="Outform.exprie" placeholder="请输入有效期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="货位号" prop="locationNumber">
              <el-input v-model="Outform.locationNumber" placeholder="请输入货位号" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="Outopertype != 3">
        <el-button text @click="Outcancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="OutsubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ouwarehouset">
import {
  listOuWarehouset,
  addOuWarehouset, delOuWarehouset,
  updateOuWarehouset, getOuWarehouset,
  clearOuWarehouset,
}
  from '@/api/business/ouwarehouset.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const Outids = ref([])
const Outloading = ref(false)
const OutshowSearch = ref(true)
const OutqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'Id',
  sortType: 'asc',
  drugId: undefined,
  outWarehouseID: undefined,
  inpharmacyId: undefined,
  qty: undefined,
  pharmacyId: undefined,
  times: undefined,
  outorderID: undefined,
})
const Outcolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品' },
  { visible: true, align: 'center', type: '', prop: 'outWarehouseID', label: '出库房' },
  { visible: true, align: 'center', type: '', prop: 'inpharmacyId', label: '入药房' },
  { visible: true, align: 'center', type: '', prop: 'qty', label: '数量' },
  { visible: true, align: 'center', type: '', prop: 'pharmacyId', label: '申请计划' },
  { visible: true, align: 'center', type: '', prop: 'times', label: '时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugname', label: '药品名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugSpecifications', label: '规格', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'minunit', label: '最小单位', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'buyprice', label: '购入价' },
  { visible: true, align: 'center', type: '', prop: 'allbuyprice', label: '购入金额' },
  { visible: true, align: 'center', type: '', prop: 'retailPrice', label: '零售价' },
  { visible: true, align: 'center', type: '', prop: 'allRetailPrice', label: '售价金额' },
  { visible: true, align: 'center', type: '', prop: 'manufacturerId', label: '生产厂家' },
  { visible: true, align: 'center', type: '', prop: 'batchNumber', label: '批号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'exprie', label: '有效期', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'locationNumber', laboel: '货位号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'outorderID', label: '出库单', showOverflowTooltip: true },

  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const Outtotal = ref(0)
const OutdataList = ref([])
const OutqueryRef = ref()
const OutdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

// 时间时间范围
const OutdateRangeTimes = ref([])


var OutdictParams = [
]


function OutgetList() {
  proxy.addDateRange(OutqueryParams, OutdateRangeTimes.value, 'Times');
  Outloading.value = true
  listOuWarehouset(OutqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      OutdataList.value = data.result
      Outtotal.value = data.totalNum
      Outloading.value = false
    }
  })
}

// 查询
function OuthandleQuery() {
  OutqueryParams.pageNum = 1
  OutgetList()
}

// 重置查询操作
function OutresetQuery() {
  // 时间时间范围
  OutdateRangeTimes.value = []
  proxy.resetForm("OutqueryRef")
  OuthandleQuery()
}
// 多选框选中数据
function OuthandleSelectionChange(selection) {
  Outids.value = selection.map((item) => item.id);
  Outsingle.value = selection.length != 1
  Outmultiple.value = !selection.length;
}
// 自定义排序
function OutsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  OutqueryParams.sort = sort
  OutqueryParams.sortType = sortType
  OuthandleQuery()
}

/*************** form操作 ***************/
const OutformRef = ref()
const Outtitle = ref('')
// 操作类型 1、add 2、edit 3、view
const Outopertype = ref(0)
const Outopen = ref(false)
const Outstate = reactive({
  Outsingle: true,
  Outmultiple: true,
  Outform: {},
  Outrules: {
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
  },
  Outoptions: {
  }
})

const { Outform, Outrules, Outoptions, Outsingle, Outmultiple } = toRefs(Outstate)

// 关闭dialog
function Outcancel() {
  Outopen.value = false
  Outreset()
}

// 重置表单
function Outreset() {
  Outform.value = {
    id: null,
    drugId: null,
    outWarehouseID: null,
    inpharmacyId: null,
    qty: null,
    pharmacyId: null,
    times: null,
    drugname: null,
    drugSpecifications: null,
    minunit: null,
    buyprice: null,
    allbuyprice: null,
    retailPrice: null,
    allRetailPrice: null,
    manufacturerId: null,
    batchNumber: null,
    exprie: null,
    locationNumber: null,
    outorderID: null,
  };
  proxy.resetForm("OutformRef")
}

/**
 * 查看
 * @param {*} row
 */
function OuthandlePreview(row) {
  reset()
  const id = row.id
  getOuWarehouset(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Outopen.value = true
      Outtitle.value = '查看'
      Outopertype.value = 3
      Outform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function OuthandleAdd() {
  reset();
  Outopen.value = true
  Outtitle.value = '添加出库'
  Outopertype.value = 1
}
// 修改按钮操作
function OuthandleUpdate(row) {
  reset()
  const id = row.id || Outids.value
  getOuWarehouset(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Outopen.value = true
      Outtitle.value = '修改出库'
      Outopertype.value = 2

      Outform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function OutsubmitForm() {
  proxy.$refs["OutformRef"].validate((valid) => {
    if (valid) {

      if (Outform.value.id != undefined && Outopertype.value === 2) {
        updateOuWarehouset(Outform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          Outopen.value = false
          OutgetList()
        })
      } else {
        addOuWarehouset(Outform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          Outopen.value = false
          OutgetList()
        })
      }
    }
  })
}

// 删除按钮操作
function OuthandleDelete(row) {
  const Outids = row.id || Outids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Outids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      OutcancelButtonText: proxy.$t('common.Outcancel'),
      type: "warning",
    })
    .then(function () {
      return delOuWarehouset(Outids)
    })
    .then(() => {
      OutgetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function OuthandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      OutcancelButtonText: proxy.$t('common.Outcancel'),
      type: "warning",
    })
    .then(function () {
      return clearOuWarehouset()
    })
    .then(() => {
      OuthandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const OuthandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  OutgetList()
}

// 导出按钮操作
function OuthandleExport() {
  proxy
    .$confirm("是否确认导出出库数据项?", "警告", {
      confirmButtonText: "确定",
      OutcancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/OuWarehouset/export', { ...OutqueryParams })
    })
}

OuthandleQuery()
</script>