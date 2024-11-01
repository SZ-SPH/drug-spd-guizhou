<!--
 * @Descripttion: (库存/stock)
 * @Author: (admin)
 * @Date: (2024-09-26)
-->
<template>
  <div>
    <el-form :model="stockqueryParams" label-position="right" inline ref="stockqueryRef" v-show="stockshowSearch"
      @submit.prevent>
      <el-form-item label="药品" prop="drugId">
        <el-input v-model.number="stockqueryParams.drugId" placeholder="请输入药品" />
      </el-form-item>
      <el-form-item label="批号" prop="batchON">
        <el-input v-model="stockqueryParams.batchON" placeholder="请输入批号" />
      </el-form-item>
      <el-form-item label="批次号" prop="batchNum">
        <el-input v-model.number="stockqueryParams.batchNum" placeholder="请输入批次号" />
      </el-form-item>
      <el-form-item label="库房" prop="warehouseID">
        <el-input v-model.number="stockqueryParams.warehouseID" placeholder="请输入库房" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="stockhandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="stockstockresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['stock:add']" plain icon="plus" @click="stockhandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="stocksingle" v-hasPermi="['stock:edit']" plain icon="edit"
          @click="stockhandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="stockmultiple" v-hasPermi="['stock:delete']" plain icon="delete"
          @click="stockhandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['stock:delete']" plain icon="delete" @click="stockhandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['stock:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/Stock/importTemplate" importUrl="/business/Stock/importData"
                  @success="stockhandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="stockhandleExport" v-hasPermi="['stock:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="stockshowSearch" @queryTable="stockgetList"
        :stockcolumns="stockcolumns"></right-toolbar>
    </el-row>

    <el-table :data="stockdataList" v-loading="stockloading" ref="table" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="stocksortChange"
      @selection-change="stockhandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="Id" align="center" v-if="stockcolumns.showColumn('id')" />
      <!-- <el-table-column prop="drugId" label="药品" align="center" v-if="stockcolumns.showColumn('drugId')" /> -->
      <el-table-column prop="drugName" label="药品名称" align="center" :show-overflow-tooltip="true"
        v-if="stockcolumns.showColumn('drugName')" />
      <el-table-column prop="drugMnemonicCode" label="药品助记码" :show-overflow-tooltip="true" align="center"
        v-if="stockcolumns.showColumn('drugMnemonicCode')" />
      <el-table-column prop="drugSpecifications" label="药品规格" align="center"
        v-if="stockcolumns.showColumn('drugSpecifications')" />
      <el-table-column prop="drugCategory" label="药品类别" align="center" v-if="stockcolumns.showColumn('drugCategory')" />
      <el-table-column prop="drugqty" label="药品数量" align="center" v-if="stockcolumns.showColumn('drugqty')" />
      <el-table-column prop="purchasePrice" label="购入价" align="center"
        v-if="stockcolumns.showColumn('purchasePrice')" />
      <el-table-column prop="retailPrice" label="零售价" align="center" v-if="stockcolumns.showColumn('retailPrice')" />
      <el-table-column prop="inventoryQuantity" label="库存量" align="center" :show-overflow-tooltip="true"
        v-if="stockcolumns.showColumn('inventoryQuantity')" />
      <el-table-column prop="deQuantity" label="预扣数量" align="center" :show-overflow-tooltip="true"
        v-if="stockcolumns.showColumn('deQuantity')" />
      <el-table-column prop="actualStock" label="库存（库存量-预扣）" align="center" :show-overflow-tooltip="true"
        v-if="stockcolumns.showColumn('actualStock')" />
      <el-table-column prop="sUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="stockcolumns.showColumn('sUnit')" />
      <el-table-column prop="packqty" label="包装数量" align="center" v-if="stockcolumns.showColumn('packqty')" />
      <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="stockcolumns.showColumn('packUnit')" />
      <el-table-column prop="batchON" label="批号" align="center" :show-overflow-tooltip="true"
        v-if="stockcolumns.showColumn('batchON')" />
      <el-table-column prop="batchNum" label="批次号" align="center" v-if="stockcolumns.showColumn('batchNum')" />
      <el-table-column prop="warehouseID" label="库房" align="center" v-if="stockcolumns.showColumn('warehouseID')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" stocktitle="详情"
            @click="stockhandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" stocktitle="编辑" v-hasPermi="['stock:edit']"
            @click="stockhandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" stocktitle="删除" v-hasPermi="['stock:delete']"
            @click="stockhandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="stocktotal" v-model:page="stockqueryParams.pageNum" v-model:limit="stockqueryParams.pageSize"
      @pagination="stockgetList" />


    <el-dialog :stocktitle="stocktitle" :lock-scroll="false" v-model="stockopen">
      <el-form ref="stockformRef" :model="stockform" :rules="stockrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12" v-if="stockopertype != 1">
            <el-form-item label="Id" prop="id">
              <el-input-number v-model.number="stockform.id" controls-position="right" placeholder="请输入Id"
                :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品" prop="drugId">
              <el-input v-model.number="stockform.drugId" placeholder="请输入药品" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品数量" prop="drugqty">
              <el-input v-model.number="stockform.drugqty" placeholder="请输入药品数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="购入价" prop="purchasePrice">
              <el-input v-model="stockform.purchasePrice" placeholder="请输入购入价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="零售价" prop="retailPrice">
              <el-input v-model="stockform.retailPrice" placeholder="请输入零售价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="库存量" prop="inventoryQuantity">
              <el-input v-model="stockform.inventoryQuantity" placeholder="请输入库存量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="预扣数量" prop="deQuantity">
              <el-input v-model="stockform.deQuantity" placeholder="请输入预扣数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="库存（库存量-预扣）" prop="actualStock">
              <el-input v-model="stockform.actualStock" placeholder="请输入库存（库存量-预扣）" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最小单位" prop="sUnit">
              <el-input v-model="stockform.sUnit" placeholder="请输入最小单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装数量" prop="packqty">
              <el-input v-model.number="stockform.packqty" placeholder="请输入包装数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装单位" prop="packUnit">
              <el-input v-model="stockform.packUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批号" prop="batchON">
              <el-input v-model="stockform.batchON" placeholder="请输入批号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批次号" prop="batchNum">
              <el-input v-model.number="stockform.batchNum" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="库房" prop="warehouseID">
              <el-input v-model.number="stockform.warehouseID" placeholder="请输入库房" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="stockopertype != 3">
        <el-button text @click="stockcancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="stocksubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="stock">
import {
  listStock,
  addStock, delStock,
  updateStock, getStock,
  clearStock,
}
  from '@/api/business/stock.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const stockids = ref([])
const stockloading = ref(false)
const stockshowSearch = ref(true)
const stockqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'Id',
  sortType: 'asc',
  drugId: undefined,
  batchON: undefined,
  batchNum: undefined,
  warehouseID: undefined,
})
const stockcolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品' },
  { visible: true, align: 'center', type: '', prop: 'drugName', label: '药品名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugMnemonicCode', label: '药品助记码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugSpecifications', label: '药品规格' },
  { visible: true, align: 'center', type: '', prop: 'drugCategory', label: '药品类别' },
  { visible: true, align: 'center', type: '', prop: 'drugqty', label: '药品数量' },
  { visible: true, align: 'center', type: '', prop: 'purchasePrice', label: '购入价' },
  { visible: true, align: 'center', type: '', prop: 'retailPrice', label: '零售价' },
  { visible: true, align: 'center', type: '', prop: 'inventoryQuantity', label: '库存量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'deQuantity', label: '预扣数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'actualStock', label: '库存（库存量-预扣）', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'sUnit', label: '最小单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packqty', label: '包装数量' },
  { visible: false, align: 'center', type: '', prop: 'packUnit', label: '包装单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'batchON', label: '批号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'batchNum', label: '批次号' },
  { visible: false, align: 'center', type: '', prop: 'warehouseID', label: '库房' },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const stocktotal = ref(0)
const stockdataList = ref([])
const stockqueryRef = ref()
const stockdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var stockdictParams = [
]


function stockgetList() {
  stockloading.value = true
  listStock(stockqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      stockdataList.value = data.result
      stocktotal.value = data.totalNum
      stockloading.value = false
    }
  })
}

// 查询
function stockhandleQuery() {
  stockqueryParams.pageNum = 1
  stockgetList()
}

// 重置查询操作
function stockstockresetQuery() {
  proxy.resetForm("stockqueryRef")
  stockhandleQuery()
}
// 多选框选中数据
function stockhandleSelectionChange(selection) {
  stockids.value = selection.map((item) => item.id);
  stocksingle.value = selection.length != 1
  stockmultiple.value = !selection.length;
}
// 自定义排序
function stocksortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  stockqueryParams.sort = sort
  stockqueryParams.sortType = sortType
  stockhandleQuery()
}

/*************** form操作 ***************/
const stockformRef = ref()
const stocktitle = ref('')
// 操作类型 1、add 2、edit 3、view
const stockopertype = ref(0)
const stockopen = ref(false)
const stockstate = reactive({
  stocksingle: true,
  stockmultiple: true,
  stockform: {},
  stockrules: {
  },
  stockoptions: {
  }
})

const { stockform, stockrules, stockoptions, stocksingle, stockmultiple } = toRefs(stockstate)

// 关闭dialog
function stockcancel() {
  stockopen.value = false
  stockreset()
}

// 重置表单
function stockreset() {
  stockform.value = {
    id: null,
    drugId: null,
    drugqty: null,
    purchasePrice: null,
    retailPrice: null,
    inventoryQuantity: null,
    deQuantity: null,
    actualStock: null,
    sUnit: null,
    packqty: null,
    packUnit: null,
    batchON: null,
    batchNum: null,
    warehouseID: null,
  };
  proxy.resetForm("stockformRef")
}

/**
 * 查看
 * @param {*} row
 */
function stockhandlePreview(row) {
  stockreset()
  const id = row.id
  getStock(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      stockopen.value = true
      stocktitle.value = '查看'
      stockopertype.value = 3
      stockform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function stockhandleAdd() {
  stockreset();
  stockopen.value = true
  stocktitle.value = '添加库存'
  stockopertype.value = 1
}
// 修改按钮操作
function stockhandleUpdate(row) {
  stockreset()
  const id = row.id || stockids.value
  getStock(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      stockopen.value = true
      stocktitle.value = '修改库存'
      stockopertype.value = 2

      stockform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function stocksubmitForm() {
  proxy.$refs["stockformRef"].validate((valid) => {
    if (valid) {

      if (stockform.value.id != undefined && stockopertype.value === 2) {
        updateStock(stockform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          stockopen.value = false
          stockgetList()
        })
      } else {
        addStock(stockform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          stockopen.value = false
          stockgetList()
        })
      }
    }
  })
}

// 删除按钮操作
function stockhandleDelete(row) {
  const stockids = row.id || stockids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + stockids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      stockcancelButtonText: proxy.$t('common.stockcancel'),
      type: "warning",
    })
    .then(function () {
      return delStock(stockids)
    })
    .then(() => {
      stockgetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function stockhandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      stockcancelButtonText: proxy.$t('common.stockcancel'),
      type: "warning",
    })
    .then(function () {
      return clearStock()
    })
    .then(() => {
      stockhandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const stockhandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  stockgetList()
}

// 导出按钮操作
function stockhandleExport() {
  proxy
    .$confirm("是否确认导出库存数据项?", "警告", {
      confirmButtonText: "确定",
      stockcancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/Stock/export', { ...stockqueryParams })
    })
}

stockhandleQuery()
</script>