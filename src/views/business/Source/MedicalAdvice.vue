<!--
 * @Descripttion: (医嘱/MEDICAL_ADVICE)
 * @Author: (admin)
 * @Date: (2024-09-14)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="病患号" prop="ipiRegistrationId">
        <el-input v-model="queryParams.ipiRegistrationId" placeholder="请输入病患号" />
      </el-form-item>
      <el-form-item label="药品id" prop="drugId">
        <el-input v-model.number="queryParams.drugId" placeholder="请输入药品id" />
      </el-form-item>
      <el-form-item label="开单医生" prop="employeeName">
        <el-input v-model="queryParams.employeeName" placeholder="请输入开单医生" />
      </el-form-item>
      <el-form-item label="开单科室名称" prop="departmentChinese Name">
        <el-input v-model="queryParams.departmentChineseName" placeholder="请输入开单科室名称" />
      </el-form-item>
      <el-form-item label="住院号" prop="ipiReaistrationNo">
        <el-input v-model="queryParams.ipiReaistrationNo" placeholder="请输入住院号" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['medicaladvice:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['medicaladvice:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['medicaladvice:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['medicaladvice:delete']" plain icon="delete" @click="handleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['medicaladvice:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/MedicalAdvice/importTemplate"
                  importUrl="/business/MedicalAdvice/importData" @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['medicaladvice:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="orderId" label="id" align="center" v-if="columns.showColumn('orderId')" />
      <el-table-column prop="ipiRegistrationId" label="病患号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('ipiRegistrationId')" />
      <el-table-column prop="drugId" label="药品id" align="center" v-if="columns.showColumn('drugId')" />
      <el-table-column prop="totalQty" label="药品数量" align="center" v-if="columns.showColumn('totalQty')" />
      <el-table-column prop="orderedDoctorId" label="开单医生id" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('orderedDoctorId')" />
      <el-table-column prop="employeeName" label="开单医生" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('employeeName')" />
      <el-table-column prop="assignDrugSeq" label="HIS医嘱号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('assignDrugSeq')" />
      <el-table-column prop="orderedDeptId" label="开单科室id" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('orderedDeptId')" />
      <el-table-column prop="departmentChinese Name" label="开单科室名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('departmentChinese Name')" />
      <el-table-column prop="ipiReaistrationNo" label="住院号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('ipiReaistrationNo')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['medicaladvice:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['medicaladvice:delete']"
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
            <el-form-item label="id" prop="orderId">
              <el-input v-model.number="form.orderId" placeholder="请输入id" :disabled="opertype != 1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="病患号" prop="ipiRegistrationId">
              <el-input v-model="form.ipiRegistrationId" placeholder="请输入病患号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品id" prop="drugId">
              <el-input v-model.number="form.drugId" placeholder="请输入药品id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品数量" prop="totalQty">
              <el-input v-model.number="form.totalQty" placeholder="请输入药品数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="开单医生id" prop="orderedDoctorId">
              <el-input v-model="form.orderedDoctorId" placeholder="请输入开单医生id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="开单医生" prop="employeeName">
              <el-input v-model="form.employeeName" placeholder="请输入开单医生" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="HIS医嘱号" prop="assignDrugSeq">
              <el-input v-model="form.assignDrugSeq" placeholder="请输入HIS医嘱号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="开单科室id" prop="orderedDeptId">
              <el-input v-model="form.orderedDeptId" placeholder="请输入开单科室id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="开单科室名称" prop="departmentChinese Name">
              <el-input v-model="form.departmentChineseName" placeholder="请输入开单科室名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="住院号" prop="ipiReaistrationNo">
              <el-input v-model="form.ipiReaistrationNo" placeholder="请输入住院号" />
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

<script setup name="medicaladvice">
import {
  listMedicalAdvice,
  addMedicalAdvice, delMedicalAdvice,
  updateMedicalAdvice, getMedicalAdvice,
  clearMedicalAdvice,
}
  from '@/api/business/medicaladvice.js'
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
  ipiRegistrationId: undefined,
  drugId: undefined,
  employeeName: undefined,
  departmentChineseName: undefined,
  ipiReaistrationNo: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'orderId', label: 'id' },
  { visible: true, align: 'center', type: '', prop: 'ipiRegistrationId', label: '病患号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品id' },
  { visible: true, align: 'center', type: '', prop: 'totalQty', label: '药品数量' },
  { visible: true, align: 'center', type: '', prop: 'orderedDoctorId', label: '开单医生id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'employeeName', label: '开单医生', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'assignDrugSeq', label: 'HIS医嘱号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'orderedDeptId', label: '开单科室id', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'departmentChineseName', label: '开单科室名称', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'ipiReaistrationNo', label: '住院号', showOverflowTooltip: true },
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
  listMedicalAdvice(queryParams).then(res => {
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
  ids.value = selection.map((item) => item.orderId);
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
    orderId: [{ required: true, message: "id不能为空", trigger: "blur", type: "number" }],
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
    orderId: null,
    ipiRegistrationId: null,
    drugId: null,
    totalQty: null,
    orderedDoctorId: null,
    employeeName: null,
    assignDrugSeq: null,
    orderedDeptId: null,
    departmentChineseName: null,
    ipiReaistrationNo: null,
  };
  proxy.resetForm("formRef")
}

/**
 * 查看
 * @param {*} row
 */
function handlePreview(row) {
  reset()
  const id = row.orderId
  getMedicalAdvice(id).then((res) => {
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
  title.value = '添加医嘱'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.orderId || ids.value
  getMedicalAdvice(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改医嘱'
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

      if (form.value.orderId != undefined && opertype.value === 2) {
        updateMedicalAdvice(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addMedicalAdvice(form.value).then((res) => {
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
  const Ids = row.orderId || ids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delMedicalAdvice(Ids)
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
      return clearMedicalAdvice()
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
    .$confirm("是否确认导出医嘱数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/MedicalAdvice/export', { ...queryParams })
    })
}

handleQuery()
</script>