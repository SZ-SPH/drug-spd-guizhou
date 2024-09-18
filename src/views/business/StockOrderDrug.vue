<!--
 * @Descripttion: (备货单药品/StockOrderDrug)
 * @Author: (admin)
 * @Date: (2024-08-27)
-->
<template>
  <div>
    <el-form :model="StockDrugqueryParams" label-position="right" inline ref="StockDrugqueryRef"
      v-show="StockDrugshowSearch" @submit.prevent>
      <el-form-item label="备货单id" prop="stockId">
        <el-input v-model="StockDrugqueryParams.stockId" placeholder="请输入备货单id" />
      </el-form-item>
      <el-form-item label="药品id" prop="drugId">
        <el-input v-model="StockDrugqueryParams.drugId" placeholder="请输入药品id" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="StockDrughandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="StockDrugresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['stockorderdrug:add']" plain icon="plus" @click="StockDrughandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="StockDrugsingle" v-hasPermi="['stockorderdrug:edit']" plain icon="edit"
          @click="StockDrughandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="StockDrugmultiple" v-hasPermi="['stockorderdrug:delete']" plain
          icon="delete" @click="StockDrughandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['stockorderdrug:delete']" plain icon="delete"
          @click="StockDrughandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['stockorderdrug:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/StockOrderDrug/importTemplate"
                  importUrl="/business/StockOrderDrug/importData" @success="StockDrughandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="StockDrughandleExport"
          v-hasPermi="['stockorderdrug:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="StockDrugshowSearch" @queryTable="StockDruggetList"
        :columns="StockDrugcolumns"></right-toolbar>
    </el-row>

    <el-table :data="StockDrugdataList" v-loading="StockDrugloading" ref="StockDrugtable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="StockDrugsortChange"
      @selection-change="StockDrughandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="Id" align="center" v-if="StockDrugcolumns.showColumn('id')" />
      <el-table-column prop="stockId" label="备货单id" align="center" :show-overflow-tooltip="true"
        v-if="StockDrugcolumns.showColumn('stockId')" />
      <el-table-column prop="drugId" label="药品id" align="center" :show-overflow-tooltip="true"
        v-if="StockDrugcolumns.showColumn('drugId')" />
      <el-table-column prop="drugDetails" label="药品信息" align="center" :show-overflow-tooltip="true"
        v-if="StockDrugcolumns.showColumn('drugDetails')" />
      <el-table-column prop="drugQuantity" label="数量" align="center" :show-overflow-tooltip="true"
        v-if="StockDrugcolumns.showColumn('drugQuantity')" />
      <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="StockDrugcolumns.showColumn('remarks')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情"
            @click="StockDrughandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['stockorderdrug:edit']"
            @click="StockDrughandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['stockorderdrug:delete']"
            @click="StockDrughandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="StockDrugtotal" v-model:page="StockDrugqueryParams.pageNum"
      v-model:limit="StockDrugqueryParams.pageSize" @pagination="StockDruggetList" />


    <el-dialog :title="StockDrugtitle" :lock-scroll="false" v-model="StockDrugopen">
      <el-form ref="StockDrugformRef" :model="StockDrugform" :rules="StockDrugrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="Id" prop="id">
              <el-input v-model.number="StockDrugform.id" placeholder="请输入Id" :disabled="StockDrugopertype != 1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备货单id" prop="stockId">
              <el-input v-model="StockDrugform.stockId" placeholder="请输入备货单id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品id" prop="drugId">
              <el-input v-model="StockDrugform.drugId" placeholder="请输入药品id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品信息" prop="drugDetails">
              <el-input v-model="StockDrugform.drugDetails" placeholder="请输入药品信息" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="数量" prop="drugQuantity">
              <el-input v-model="StockDrugform.drugQuantity" placeholder="请输入数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="StockDrugform.remarks" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="StockDrugopertype != 3">
        <el-button text @click="StockDrugcancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="StockDrugsubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="stockorderdrug">
import {
  listStockOrderDrug,
  addStockOrderDrug, delStockOrderDrug,
  updateStockOrderDrug, getStockOrderDrug,
  clearStockOrderDrug,
}
  from '@/api/business/stockorderdrug.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const StockDrugids = ref([])
const StockDrugloading = ref(false)
const StockDrugshowSearch = ref(true)
const StockDrugqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  stockId: undefined,
  drugId: undefined,
})
const StockDrugcolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'stockId', label: '备货单id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugDetails', label: '药品信息', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugQuantity', label: '数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'remarks', label: '备注', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const StockDrugtotal = ref(0)
const StockDrugdataList = ref([])
const StockDrugqueryRef = ref()
const StockDrugdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var StockDrugdictParams = [
]


function StockDruggetList() {
  StockDrugloading.value = true
  listStockOrderDrug(StockDrugqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      StockDrugdataList.value = data.result
      StockDrugtotal.value = data.totalNum
      StockDrugloading.value = false
    }
  })
}

// 查询
function StockDrughandleQuery() {
  StockDrugqueryParams.pageNum = 1
  StockDruggetList()
}

// 重置查询操作
function StockDrugresetQuery() {
  proxy.resetForm("queryRef")
  StockDrughandleQuery()
}
// 多选框选中数据
function StockDrughandleSelectionChange(selection) {
  StockDrugids.value = selection.map((item) => item.id);
  StockDrugsingle.value = selection.length != 1
  StockDrugmultiple.value = !selection.length;
}
// 自定义排序
function StockDrugsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  StockDrugqueryParams.sort = sort
  StockDrugqueryParams.sortType = sortType
  StockDrughandleQuery()
}

/*************** form操作 ***************/
const StockDrugformRef = ref()
const StockDrugtitle = ref('')
// 操作类型 1、add 2、edit 3、view
const StockDrugopertype = ref(0)
const StockDrugopen = ref(false)
const StockDrugstate = reactive({
  StockDrugsingle: true,
  StockDrugmultiple: true,
  StockDrugform: {},
  StockDrugrules: {
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
  },
  StockDrugoptions: {
  }
})

const { StockDrugform, StockDrugrules, StockDrugoptions, StockDrugsingle, StockDrugmultiple } = toRefs(StockDrugstate)

// 关闭dialog
function StockDrugcancel() {
  StockDrugopen.value = false
  StockDrugreset()
}

// 重置表单
function StockDrugreset() {
  StockDrugform.value = {
    id: null,
    stockId: null,
    drugId: null,
    drugDetails: null,
    drugQuantity: null,
    remarks: null,
  };
  proxy.resetForm("StockDrugformRef")
}

/**
 * 查看
 * @param {*} row
 */
function StockDrughandlePreview(row) {
  StockDrugreset()
  const id = row.id
  getStockOrderDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      StockDrugopen.value = true
      StockDrugtitle.value = '查看'
      StockDrugopertype.value = 3
      StockDrugform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function StockDrughandleAdd() {
  StockDrugreset();
  StockDrugopen.value = true
  StockDrugtitle.value = '添加备货单药品'
  StockDrugopertype.value = 1
}
// 修改按钮操作
function StockDrughandleUpdate(row) {
  StockDrugreset()
  const id = row.id || StockDrugids.value
  getStockOrderDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      StockDrugopen.value = true
      StockDrugtitle.value = '修改备货单药品'
      StockDrugopertype.value = 2

      StockDrugform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function StockDrugsubmitForm() {
  proxy.$refs["StockDrugformRef"].validate((valid) => {
    if (valid) {

      if (StockDrugform.value.id != undefined && StockDrugopertype.value === 2) {
        updateStockOrderDrug(StockDrugform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          StockDrugopen.value = false
          StockDruggetList()
        })
      } else {
        addStockOrderDrug(StockDrugform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          StockDrugopen.value = false
          StockDruggetList()
        })
      }
    }
  })
}

// 删除按钮操作
function StockDrughandleDelete(row) {
  const Ids = row.id || StockDrugids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delStockOrderDrug(Ids)
    })
    .then(() => {
      StockDruggetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function StockDrughandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return clearStockOrderDrug()
    })
    .then(() => {
      StockDrughandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const StockDrughandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  StockDruggetList()
}

// 导出按钮操作
function StockDrughandleExport() {
  proxy
    .$confirm("是否确认导出备货单药品数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/StockOrderDrug/export', { ...StockDrugqueryParams })
    })
}

StockDrughandleQuery()
</script>