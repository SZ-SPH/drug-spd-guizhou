<!--
 * @Descripttion: (厂家和供应商/CompanyInfo)
 * @Author: (admin)
 * @Date: (2024-11-27)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="公司编码" prop="facCode">
        <el-input v-model="queryParams.facCode" placeholder="请输入公司编码" />
      </el-form-item>
      <el-form-item label="公司名称" prop="facName">
        <el-input v-model="queryParams.facName" placeholder="请输入公司名称" />
      </el-form-item>
      <el-form-item label="拼音码" prop="spellCode">
        <el-input v-model="queryParams.spellCode" placeholder="请输入拼音码" />
      </el-form-item>
      <el-form-item label="五笔码" prop="wbCode">
        <el-input v-model="queryParams.wbCode" placeholder="请输入五笔码" />
      </el-form-item>
      <el-form-item label="自定义码" prop="customCode">
        <el-input v-model="queryParams.customCode" placeholder="请输入自定义码" />
      </el-form-item>
      <el-form-item label="公司类别" prop="companyType">
        <el-select clearable v-model="queryParams.companyType" placeholder="请选择公司类别">
          <el-option v-for="item in options.companyTypeOptions" :key="item.dictValue" :label="item.dictLabel"
            :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
            <!-- <span class="fr" style="color: var(--el-text-color-secondary);">{{ item.dictValue }}</span> -->
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="queryParams.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="有效性 0 无效 1 有效" prop="validFlag">
        <el-input v-model="queryParams.validFlag" placeholder="请输入有效性 0 无效 1 有效" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['companyinfo:add']" plain icon="plus" @click="CompanyInfoTongbu">
          同步
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['companyinfo:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['companyinfo:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['companyinfo:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['companyinfo:delete']" plain icon="delete" @click="handleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['companyinfo:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/CompanyInfo/importTemplate"
                  importUrl="/business/CompanyInfo/importData" @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
</el-dropdown>
</el-col>
<el-col :span="1.5">
  <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['companyinfo:export']">
    {{ $t('btn.export') }}
  </el-button>
</el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="facCode" label="公司编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('facCode')" />
      <el-table-column prop="facName" label="公司名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('facName')" />
      <el-table-column prop="address" label="公司地址" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('address')" />
      <el-table-column prop="relation" label="联系方式" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('relation')" />
      <el-table-column prop="gmpInfo" label="GMP信息" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('gmpInfo')" />
      <el-table-column prop="gspInfo" label="GSP信息" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('gspInfo')" />
      <el-table-column prop="spellCode" label="拼音码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('spellCode')" />
      <el-table-column prop="wbCode" label="五笔码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('wbCode')" />
      <el-table-column prop="customCode" label="自定义码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('customCode')" />
      <el-table-column prop="companyType" label="公司类别" align="center" v-if="columns.showColumn('companyType')">
        <template #default="scope">
          <dict-tag :options="options.companyTypeOptions" :value="scope.row.companyType" />
        </template>
      </el-table-column>
      <el-table-column prop="openBank" label="开户银行" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('openBank')" />
      <el-table-column prop="openAccounts" label="开户账号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('openAccounts')" />
      <el-table-column prop="actualRate" label="政策扣率" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('actualRate')" />
      <el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('remark')" />
      <el-table-column prop="operCode" label="操作员编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('operCode')" />
      <el-table-column prop="operDate" label="操作日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('operDate')" />
      <el-table-column prop="validFlag" label="有效性 0 无效 1 有效" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('validFlag')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <!-- <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['companyinfo:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['companyinfo:delete']"
            @click="handleDelete(scope.row)"></el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
    <el-dialog :title="title" :lock-scroll="false" v-model="open">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="公司编码" prop="facCode">
              <el-input v-model="form.facCode" placeholder="请输入公司编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="公司名称" prop="facName">
              <el-input v-model="form.facName" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="公司地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入公司地址" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="联系方式" prop="relation">
              <el-input v-model="form.relation" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="GMP信息" prop="gmpInfo">
              <el-input v-model="form.gmpInfo" placeholder="请输入GMP信息" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="GSP信息" prop="gspInfo">
              <el-input v-model="form.gspInfo" placeholder="请输入GSP信息" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="拼音码" prop="spellCode">
              <el-input v-model="form.spellCode" placeholder="请输入拼音码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="五笔码" prop="wbCode">
              <el-input v-model="form.wbCode" placeholder="请输入五笔码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="自定义码" prop="customCode">
              <el-input v-model="form.customCode" placeholder="请输入自定义码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="公司类别" prop="companyType">
              <el-select v-model="form.companyType" placeholder="请选择公司类别">
                <el-option v-for="item in options.companyTypeOptions" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="开户银行" prop="openBank">
              <el-input v-model="form.openBank" placeholder="请输入开户银行" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="开户账号" prop="openAccounts">
              <el-input v-model="form.openAccounts" placeholder="请输入开户账号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="政策扣率" prop="actualRate">
              <el-input v-model="form.actualRate" placeholder="请输入政策扣率" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="操作员编码" prop="operCode">
              <el-input v-model="form.operCode" placeholder="请输入操作员编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="操作日期" prop="operDate">
              <el-date-picker v-model="form.operDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="有效性 0 无效 1 有效" prop="validFlag">
              <el-input v-model="form.validFlag" placeholder="请输入有效性 0 无效 1 有效" />
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

<script setup name="companyinfo">
import {
  listCompanyInfo,
  addCompanyInfo, delCompanyInfo,
  updateCompanyInfo, getCompanyInfo,
  clearCompanyInfo, TongBu,
}
  from '@/api/guiz/companyinfo.js'
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
  facCode: undefined,
  facName: undefined,
  spellCode: undefined,
  wbCode: undefined,
  customCode: undefined,
  companyType: undefined,
  remark: undefined,
  validFlag: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'facCode', label: '公司编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'facName', label: '公司名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'address', label: '公司地址', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'relation', label: '联系方式', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'gmpInfo', label: 'GMP信息', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'gspInfo', label: 'GSP信息', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'spellCode', label: '拼音码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'wbCode', label: '五笔码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'customCode', label: '自定义码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: 'dict', prop: 'companyType', label: '公司类别', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'openBank', label: '开户银行', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'openAccounts', label: '开户账号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'actualRate', label: '政策扣率', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'remark', label: '备注', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'operCode', label: '操作员编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'operDate', label: '操作日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'validFlag', label: '有效性 0 无效 1 有效', showOverflowTooltip: true },
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
  listCompanyInfo(queryParams).then(res => {
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
    companyTypeOptions: [{ dictLabel: '生产厂家', dictValue: '0' }, { dictLabel: '供销商', dictValue: '1' }],
    // 公司类别：0－生产厂家，1－供销商 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    // companyTypeOptions: [
    //   { dictLabel: '生产厂家', dictValue: '0' },
    //   { dictLabel: '供销商', dictValue: '1' }
    // ],
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
    facCode: null,
    facName: null,
    address: null,
    relation: null,
    gmpInfo: null,
    gspInfo: null,
    spellCode: null,
    wbCode: null,
    customCode: null,
    companyType: null,
    openBank: null,
    openAccounts: null,
    actualRate: null,
    remark: null,
    operCode: null,
    operDate: null,
    validFlag: null,
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
  getCompanyInfo(id).then((res) => {
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
  title.value = '添加厂家和供应商'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getCompanyInfo(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改厂家和供应商'
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
        updateCompanyInfo(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCompanyInfo(form.value).then((res) => {
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
      return delCompanyInfo(Ids)
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
      return clearCompanyInfo()
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
    .$confirm("是否确认导出厂家和供应商数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/CompanyInfo/export', { ...queryParams })
    })
}

handleQuery()

function CompanyInfoTongbu() {
  proxy.$modal.loading("请稍等")
  TongBu().then((res) => {

    proxy.$modal.closeLoading()
    if (res.data == "true") {
      proxy.$modal.msgSuccess("同步成功")
      getList()
    } else {
      proxy.$modal.msgError("出现错误请联系开发人员")
    }
  })
}
</script>