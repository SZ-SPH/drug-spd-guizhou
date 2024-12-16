<!--
 * @Descripttion: (科室/Departments)
 * @Author: (admin)
 * @Date: (2024-11-27)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="科室编码" prop="deptCode">
        <el-input v-model="queryParams.deptCode" placeholder="请输入科室编码" />
      </el-form-item>
      <el-form-item label="科室名称" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入科室名称" />
      </el-form-item>
      <el-form-item label="科室拼音码" prop="spellCode">
        <el-input v-model="queryParams.spellCode" placeholder="请输入科室拼音码" />
      </el-form-item>
      <el-form-item label="科室五笔码" prop="wbCode">
        <el-input v-model="queryParams.wbCode" placeholder="请输入科室五笔码" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['phaout:add']" plain icon="plus" @click="DepartmentsTongbu">
          同步
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['departments:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['departments:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['departments:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['departments:delete']" plain icon="delete" @click="handleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['departments:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/Departments/importTemplate"
                  importUrl="/business/Departments/importData" @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
</el-dropdown>
</el-col>
<el-col :span="1.5">
  <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['departments:export']">
    {{ $t('btn.export') }}
  </el-button>
</el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="deptCode" label="科室编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('deptCode')" />
      <el-table-column prop="deptEname" label="科室英文" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('deptEname')" />
      <el-table-column prop="deptName" label="科室名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('deptName')" />
      <el-table-column prop="spellCode" label="科室拼音码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('spellCode')" />
      <el-table-column prop="wbCode" label="科室五笔码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('wbCode')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['departments:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['departments:delete']"
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
            <el-form-item label="科室编码" prop="deptCode">
              <el-input v-model="form.deptCode" placeholder="请输入科室编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="科室英文" prop="deptEname">
              <el-input v-model="form.deptEname" placeholder="请输入科室英文" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="科室名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入科室名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="科室拼音码" prop="spellCode">
              <el-input v-model="form.spellCode" placeholder="请输入科室拼音码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="科室五笔码" prop="wbCode">
              <el-input v-model="form.wbCode" placeholder="请输入科室五笔码" />
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

<script setup name="departments">
import {
  listDepartments,
  addDepartments, delDepartments,
  updateDepartments, getDepartments,
  clearDepartments, Tongbu,
}
  from '@/api/business/departments.js'
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
  deptCode: undefined,
  deptName: undefined,
  spellCode: undefined,
  wbCode: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'deptCode', label: '科室编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'deptEname', label: '科室英文', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'deptName', label: '科室名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'spellCode', label: '科室拼音码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'wbCode', label: '科室五笔码', showOverflowTooltip: true },
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
  listDepartments(queryParams).then(res => {
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
    deptCode: null,
    deptEname: null,
    deptName: null,
    spellCode: null,
    wbCode: null,
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
  getDepartments(id).then((res) => {
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
  title.value = '添加科室'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getDepartments(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改科室'
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
        updateDepartments(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDepartments(form.value).then((res) => {
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
      return delDepartments(Ids)
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
      return clearDepartments()
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
    .$confirm("是否确认导出科室数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/Departments/export', { ...queryParams })
    })
}

handleQuery()

function DepartmentsTongbu() {
  Tongbu().then((res) => {


  })
}
</script>