<!--
 * @Descripttion: (出库/OuWarehouset)
 * @Author: (admin)
 * @Date: (2024-09-26)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="药品" prop="drugId">
        <el-input v-model.number="queryParams.drugId" placeholder="请输入药品" />
      </el-form-item>
      <el-form-item label="出库房" prop="outWarehouseID">
        <el-input v-model.number="queryParams.outWarehouseID" placeholder="请输入出库房" />
      </el-form-item>
      <el-form-item label="入药房" prop="inpharmacyId">
        <el-input v-model.number="queryParams.inpharmacyId" placeholder="请输入入药房" />
      </el-form-item>
      <el-form-item label="数量" prop="qty">
        <el-input v-model="queryParams.qty" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="申请计划" prop="pharmacyId">
        <el-input v-model.number="queryParams.pharmacyId" placeholder="请输入申请计划" />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="dateRangeTimes" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime" :shortcuts="dateOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['ouwarehouset:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['ouwarehouset:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['ouwarehouset:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['ouwarehouset:delete']" plain icon="delete" @click="handleClear">
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
                  importUrl="/business/OuWarehouset/importData" @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['ouwarehouset:export']">
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
      <el-table-column prop="outWarehouseID" label="出库房" align="center" v-if="columns.showColumn('outWarehouseID')" />
      <el-table-column prop="inpharmacyId" label="入药房" align="center" v-if="columns.showColumn('inpharmacyId')" />
      <el-table-column prop="qty" label="数量" align="center" v-if="columns.showColumn('qty')" />
      <el-table-column prop="pharmacyId" label="申请计划" align="center" v-if="columns.showColumn('pharmacyId')" />
      <el-table-column prop="times" label="时间" :show-overflow-tooltip="true" v-if="columns.showColumn('times')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['ouwarehouset:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['ouwarehouset:delete']"
            @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />


    <el-dialog :title="title" :lock-scroll="false" v-model="open">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="Id" prop="id">
              <el-input v-model.number="form.id" placeholder="请输入Id" :disabled="opertype != 1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品" prop="drugId">
              <el-input v-model.number="form.drugId" placeholder="请输入药品" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库房" prop="outWarehouseID">
              <el-input v-model.number="form.outWarehouseID" placeholder="请输入出库房" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入药房" prop="inpharmacyId">
              <el-input v-model.number="form.inpharmacyId" placeholder="请输入入药房" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="数量" prop="qty">
              <el-input v-model="form.qty" placeholder="请输入数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请计划" prop="pharmacyId">
              <el-input v-model.number="form.pharmacyId" placeholder="请输入申请计划" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="时间" prop="times">
              <el-date-picker v-model="form.times" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
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
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
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
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品' },
  { visible: true, align: 'center', type: '', prop: 'outWarehouseID', label: '出库房' },
  { visible: true, align: 'center', type: '', prop: 'inpharmacyId', label: '入药房' },
  { visible: true, align: 'center', type: '', prop: 'qty', label: '数量' },
  { visible: true, align: 'center', type: '', prop: 'pharmacyId', label: '申请计划' },
  { visible: true, align: 'center', type: '', prop: 'times', label: '时间', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

// 时间时间范围
const dateRangeTimes = ref([])


var dictParams = [
]


function getList() {
  proxy.addDateRange(queryParams, dateRangeTimes.value, 'Times');
  loading.value = true
  listOuWarehouset(queryParams).then(res => {
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
  // 时间时间范围
  dateRangeTimes.value = []
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
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
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
    outWarehouseID: null,
    inpharmacyId: null,
    qty: null,
    pharmacyId: null,
    times: null,
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
  getOuWarehouset(id).then((res) => {
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
  title.value = '添加出库'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getOuWarehouset(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改出库'
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
        updateOuWarehouset(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addOuWarehouset(form.value).then((res) => {
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
      return delOuWarehouset(Ids)
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
      return clearOuWarehouset()
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
    .$confirm("是否确认导出出库数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/OuWarehouset/export', { ...queryParams })
    })
}

handleQuery()
</script>