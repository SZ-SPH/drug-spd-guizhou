<!--
 * @Descripttion: (库存/stock)
 * @Author: (admin)
 * @Date: (2024-09-26)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="药品" prop="drugId">
        <el-input v-model.number="queryParams.drugId" placeholder="请输入药品" />
      </el-form-item>
      <el-form-item label="批号" prop="batchON">
        <el-input v-model="queryParams.batchON" placeholder="请输入批号" />
      </el-form-item>
      <el-form-item label="批次号" prop="batchNum">
        <el-input v-model.number="queryParams.batchNum" placeholder="请输入批次号" />
      </el-form-item>
      <el-form-item label="库房" prop="warehouseID">
        <el-input v-model.number="queryParams.warehouseID" placeholder="请输入库房" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['stock:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['stock:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['stock:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['stock:delete']" plain icon="delete" @click="handleClear">
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
                  @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['stock:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="Id" align="center" v-if="columns.showColumn('id')" />
      <el-table-column prop="drugId" label="药品" align="center" v-if="columns.showColumn('drugId')" />
      <el-table-column prop="drugqty" label="药品数量" align="center" v-if="columns.showColumn('drugqty')" />
      <el-table-column prop="purchasePrice" label="购入价" align="center" v-if="columns.showColumn('purchasePrice')" />
      <el-table-column prop="retailPrice" label="零售价" align="center" v-if="columns.showColumn('retailPrice')" />
      <el-table-column prop="inventoryQuantity" label="库存量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('inventoryQuantity')" />
      <el-table-column prop="deQuantity" label="预扣数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('deQuantity')" />
      <el-table-column prop="actualStock" label="库存（库存量-预扣）" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('actualStock')" />
      <el-table-column prop="sUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('sUnit')" />
      <el-table-column prop="packqty" label="包装数量" align="center" v-if="columns.showColumn('packqty')" />
      <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('packUnit')" />
      <el-table-column prop="batchON" label="批号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('batchON')" />
      <el-table-column prop="batchNum" label="批次号" align="center" v-if="columns.showColumn('batchNum')" />
      <el-table-column prop="warehouseID" label="库房" align="center" v-if="columns.showColumn('warehouseID')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['stock:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['stock:delete']"
            @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
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
            <el-form-item label="药品" prop="drugId">
              <el-input v-model.number="form.drugId" placeholder="请输入药品" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品数量" prop="drugqty">
              <el-input v-model.number="form.drugqty" placeholder="请输入药品数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="购入价" prop="purchasePrice">
              <el-input v-model="form.purchasePrice" placeholder="请输入购入价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="零售价" prop="retailPrice">
              <el-input v-model="form.retailPrice" placeholder="请输入零售价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="库存量" prop="inventoryQuantity">
              <el-input v-model="form.inventoryQuantity" placeholder="请输入库存量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="预扣数量" prop="deQuantity">
              <el-input v-model="form.deQuantity" placeholder="请输入预扣数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="库存（库存量-预扣）" prop="actualStock">
              <el-input v-model="form.actualStock" placeholder="请输入库存（库存量-预扣）" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最小单位" prop="sUnit">
              <el-input v-model="form.sUnit" placeholder="请输入最小单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装数量" prop="packqty">
              <el-input v-model.number="form.packqty" placeholder="请输入包装数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装单位" prop="packUnit">
              <el-input v-model="form.packUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批号" prop="batchON">
              <el-input v-model="form.batchON" placeholder="请输入批号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批次号" prop="batchNum">
              <el-input v-model.number="form.batchNum" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="库房" prop="warehouseID">
              <el-input v-model.number="form.warehouseID" placeholder="请输入库房" />
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
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'Id',
  sortType: 'asc',
  drugId: undefined,
  batchON: undefined,
  batchNum: undefined,
  warehouseID: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品' },
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
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var dictParams = [
]


function getList() {
  loading.value = true
  listStock(queryParams).then(res => {
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
  proxy.resetForm("formRef")
}

/**
 * 查看
 * @param {*} row
 */
function handlePreview(row) {
  reset()
  const id = row.id
  getStock(id).then((res) => {
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
  title.value = '添加库存'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getStock(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改库存'
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
        updateStock(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addStock(form.value).then((res) => {
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
      return delStock(Ids)
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
      return clearStock()
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
    .$confirm("是否确认导出库存数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/Stock/export', { ...queryParams })
    })
}

handleQuery()
</script>