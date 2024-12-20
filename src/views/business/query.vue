<!--
 * @Descripttion: (药品基础信息/DRUG)
 * @Author: (admin)
 * @Date: (2024-06-25)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['drug:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['drug:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange">
      <el-table-column prop="drugId" label="id" align="center" v-if="columns.showColumn('drugId')" />
      <el-table-column prop="drugName" label="药品名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugName')" />
      <el-table-column prop="drugCode" label="药品编号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugCode')" />
      <el-table-column prop="drugMnemonicCode" label="药品助记码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugMnemonicCode')" />
      <el-table-column prop="drugSpecifications" label="药品规格" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugSpecifications')" />
      <el-table-column prop="drugCategory" label="药品类别" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugCategory')" />
      <el-table-column prop="drugVarietyName" label="药品品种名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugVarietyName')" />
      <el-table-column prop="drugClassification" label="药物分类" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugClassification')" />
      <el-table-column prop="tracingSourceCode" label="溯源码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('tracingSourceCode')" />
      <el-table-column prop="drugBatchNumber" label="批号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugBatchNumber')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['drug:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['drug:delete']"
            @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
    <!-- 联动数据 -->
    <el-table :data="tabe2Data" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row :height="300" @sort-change="sortChange">
      <el-table-column prop="drugName" label="操作人" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-link type="primary">{{ scope.row.operator }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="时间" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="drugMnemonicCode" label="作业跟踪" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          <div class="action">
            <div class="state"
              :class="scope.row.state == 0 ? 'bg-info' : scope.row.state == 1 ? 'bg-success' : 'bg-error'"></div>
            <el-link type="primary">{{ scope.row.action }}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="detail" label="详细信息" :show-overflow-tooltip="true" />
    </el-table>

    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :title="title" :lock-scroll="false" v-model="open">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="id" prop="drugId">
              <el-input v-model.number="form.drugId" placeholder="请输入id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品名称" prop="drugName">
              <el-input v-model="form.drugName" placeholder="请输入药品名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品编号" prop="drugCode">
              <el-input v-model="form.drugCode" placeholder="请输入药品编号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品助记码" prop="drugMnemonicCode">
              <el-input v-model="form.drugMnemonicCode" placeholder="请输入药品助记码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品规格" prop="drugSpecifications">
              <el-input v-model="form.drugSpecifications" placeholder="请输入药品规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品类别" prop="drugCategory">
              <el-input v-model="form.drugCategory" placeholder="请输入药品类别" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品品种名称" prop="drugVarietyName">
              <el-input v-model="form.drugVarietyName" placeholder="请输入药品品种名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药物分类" prop="drugClassification">
              <el-input v-model="form.drugClassification" placeholder="请输入药物分类" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="溯源码" prop="tracingSourceCode">
              <el-input v-model="form.tracingSourceCode" placeholder="请输入溯源码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批号" prop="drugBatchNumber">
              <el-input v-model="form.drugBatchNumber" placeholder="请输入批号" />
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

<script setup name="drug">
import {
  listDrug,
  addDrug, delDrug,
  updateDrug, getDrug,
}
  from '@/api/business/drug.js'
const { proxy } = getCurrentInstance()
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'drugId', label: 'id' },
  { visible: true, align: 'center', type: '', prop: 'drugName', label: '药品名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugCode', label: '药品编号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugMnemonicCode', label: '药品助记码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugSpecifications', label: '药品规格', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugCategory', label: '药品类别', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugVarietyName', label: '药品品种名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugClassification', label: '药物分类', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'tracingSourceCode', label: '溯源码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'drugBatchNumber', label: '批号', showOverflowTooltip: true },
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
  listDrug(queryParams).then(res => {
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
    drugId: null,
    drugName: null,
    drugCode: null,
    drugMnemonicCode: null,
    drugSpecifications: null,
    drugCategory: null,
    drugVarietyName: null,
    drugClassification: null,
    tracingSourceCode: null,
    drugBatchNumber: null,
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
  getDrug(id).then((res) => {
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
  title.value = '添加药品基础信息'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改药品基础信息'
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
        updateDrug(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDrug(form.value).then((res) => {
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
      return delDrug(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}



// 导出按钮操作
function handleExport() {
  proxy
    .$confirm("是否确认导出药品基础信息数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/Drug/export', { ...queryParams })
    })
}

handleQuery()
</script>