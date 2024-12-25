<!--
 * @Descripttion: (库存/PhaStorage)
 * @Author: (admin)
 * @Date: (2024-11-27)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="库存科室" prop="drugDeptCode">
        <el-input v-model="queryParams.drugDeptCode" placeholder="请输入库存科室" />
      </el-form-item>
      <el-form-item label="药品编码" prop="drugCode">
        <el-input v-model="queryParams.drugCode" placeholder="请输入药品编码" />
      </el-form-item>
      <el-form-item label="药品商品名" prop="tradeName">
        <el-input v-model="queryParams.tradeName" placeholder="请输入药品商品名" />
      </el-form-item>
      <el-form-item label="药品类别" prop="drugType">
        <el-select clearable v-model="queryParams.drugType" placeholder="请选择药品类别">
          <el-option v-for="item in options.drugTypeOptions" :key="item.dictValue" :label="item.dictLabel"
            :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
            <span class="fr" style="color: var(--el-text-color-secondary);">{{ item.dictValue }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="货位码" prop="placeCode">
        <el-input v-model="queryParams.placeCode" placeholder="请输入货位码" />
      </el-form-item>
      <el-form-item label="生产厂家" prop="producerCode">
        <el-input v-model="queryParams.producerCode" placeholder="请输入生产厂家" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['phaout:add']" plain icon="plus" @click="PhaStorageTongbu">
          同步
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['phastorage:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['phastorage:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['phastorage:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['phastorage:delete']" plain icon="delete" @click="handleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['phastorage:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/PhaStorage/importTemplate" importUrl="/business/PhaStorage/importData"
                  @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
</el-dropdown>
</el-col>
<el-col :span="1.5">
  <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['phastorage:export']">
    {{ $t('btn.export') }}
  </el-button>
</el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="drugDeptCode" label="库存科室" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugDeptCode')" />
      <el-table-column prop="drugCode" label="药品编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugCode')" />
      <el-table-column prop="tradeName" label="药品商品名" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('tradeName')" />
      <el-table-column prop="specs" label="规格" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('specs')" />
      <el-table-column prop="drugType" label="药品类别" align="center" v-if="columns.showColumn('drugType')">
        <template #default="scope">
          <dict-tag :options="options.drugTypeOptions" :value="scope.row.drugType" />
        </template>
      </el-table-column>
      <el-table-column prop="drugQuality" label="药品性质" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugQuality')" />
      <el-table-column prop="retailPrice" label="参考零售价" align="center" v-if="columns.showColumn('retailPrice')" />
      <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('packUnit')" />
      <el-table-column prop="packQty" label="包装数" align="center" v-if="columns.showColumn('packQty')" />
      <el-table-column prop="minUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('minUnit')" />
      <el-table-column prop="validDate" label="有效期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('validDate')" />
      <el-table-column prop="storeSum" label="库存数量" align="center" v-if="columns.showColumn('storeSum')" />
      <el-table-column prop="storeCost" label="库存金额" align="center" v-if="columns.showColumn('storeCost')" />
      <el-table-column prop="preSum" label="预扣库存数量" align="center" v-if="columns.showColumn('preSum')" />
      <el-table-column prop="preCost" label="预扣库存金额" align="center" v-if="columns.showColumn('preCost')" />
      <el-table-column prop="lowSum" label="最低库存量" align="center" v-if="columns.showColumn('lowSum')" />
      <el-table-column prop="topSum" label="最高库存量" align="center" v-if="columns.showColumn('topSum')" />
      <el-table-column prop="placeCode" label="货位码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('placeCode')" />
      <el-table-column prop="dailtycheckFlag" label="日盘点标志" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('dailtycheckFlag')" />
      <el-table-column prop="groupCode" label="批次号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('groupCode')" />
      <el-table-column prop="batchNo" label="批号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('batchNo')" />
      <el-table-column prop="producerCode" label="生产厂家" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('producerCode')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['phastorage:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['phastorage:delete']"
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
            <el-form-item label="库存科室" prop="drugDeptCode">
              <el-input v-model="form.drugDeptCode" placeholder="请输入库存科室" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品编码" prop="drugCode">
              <el-input v-model="form.drugCode" placeholder="请输入药品编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品商品名" prop="tradeName">
              <el-input v-model="form.tradeName" placeholder="请输入药品商品名" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="规格" prop="specs">
              <el-input v-model="form.specs" placeholder="请输入规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品类别" prop="drugType">
              <el-select v-model="form.drugType" placeholder="请选择药品类别">
                <el-option v-for="item in options.drugTypeOptions" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品性质" prop="drugQuality">
              <el-input v-model="form.drugQuality" placeholder="请输入药品性质" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="参考零售价" prop="retailPrice">
              <el-input v-model="form.retailPrice" placeholder="请输入参考零售价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装单位" prop="packUnit">
              <el-input v-model="form.packUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装数" prop="packQty">
              <el-input v-model.number="form.packQty" placeholder="请输入包装数" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最小单位" prop="minUnit">
              <el-input v-model="form.minUnit" placeholder="请输入最小单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="有效期" prop="validDate">
              <el-date-picker v-model="form.validDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="库存数量" prop="storeSum">
              <el-input v-model="form.storeSum" placeholder="请输入库存数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="库存金额" prop="storeCost">
              <el-input v-model="form.storeCost" placeholder="请输入库存金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="预扣库存数量" prop="preSum">
              <el-input v-model="form.preSum" placeholder="请输入预扣库存数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="预扣库存金额" prop="preCost">
              <el-input v-model="form.preCost" placeholder="请输入预扣库存金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最低库存量" prop="lowSum">
              <el-input v-model="form.lowSum" placeholder="请输入最低库存量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最高库存量" prop="topSum">
              <el-input v-model="form.topSum" placeholder="请输入最高库存量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="货位码" prop="placeCode">
              <el-input v-model="form.placeCode" placeholder="请输入货位码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="日盘点标志" prop="dailtycheckFlag">
              <el-input v-model="form.dailtycheckFlag" placeholder="请输入日盘点标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批次号" prop="groupCode">
              <el-input v-model="form.groupCode" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批号" prop="batchNo">
              <el-input v-model="form.batchNo" placeholder="请输入批号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产厂家" prop="producerCode">
              <el-input v-model="form.producerCode" placeholder="请输入生产厂家" />
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

<script setup name="phastorage">
import {
  listPhaStorage,
  addPhaStorage, delPhaStorage,
  updatePhaStorage, getPhaStorage,
  clearPhaStorage, TongBu,
}
  from '@/api/business/phastorage.js'
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
  drugDeptCode: undefined,
  drugCode: undefined,
  tradeName: undefined,
  drugType: undefined,
  placeCode: undefined,
  producerCode: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'drugDeptCode', label: '库存科室', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugCode', label: '药品编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'tradeName', label: '药品商品名', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'specs', label: '规格', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'drugType', label: '药品类别', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugQuality', label: '药品性质', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'retailPrice', label: '参考零售价' },
  { visible: true, align: 'center', type: '', prop: 'packUnit', label: '包装单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packQty', label: '包装数' },
  { visible: false, align: 'center', type: '', prop: 'minUnit', label: '最小单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'validDate', label: '有效期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'storeSum', label: '库存数量' },
  { visible: false, align: 'center', type: '', prop: 'storeCost', label: '库存金额' },
  { visible: false, align: 'center', type: '', prop: 'preSum', label: '预扣库存数量' },
  { visible: false, align: 'center', type: '', prop: 'preCost', label: '预扣库存金额' },
  { visible: false, align: 'center', type: '', prop: 'lowSum', label: '最低库存量' },
  { visible: false, align: 'center', type: '', prop: 'topSum', label: '最高库存量' },
  { visible: false, align: 'center', type: '', prop: 'placeCode', label: '货位码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'dailtycheckFlag', label: '日盘点标志', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'groupCode', label: '批次号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'batchNo', label: '批号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'producerCode', label: '生产厂家', showOverflowTooltip: true },
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
  listPhaStorage(queryParams).then(res => {
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
    drugDeptCode: [{ required: true, message: "库存科室不能为空", trigger: "blur" }],
    drugCode: [{ required: true, message: "药品编码不能为空", trigger: "blur" }],
    tradeName: [{ required: true, message: "药品商品名不能为空", trigger: "blur" }],
    groupCode: [{ required: true, message: "批次号不能为空", trigger: "blur" }],
    producerCode: [{ required: true, message: "生产厂家不能为空", trigger: "blur" }],
  },
  options: {
    // 药品类别 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    drugTypeOptions: [],
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
    drugDeptCode: null,
    drugCode: null,
    tradeName: null,
    specs: null,
    drugType: null,
    drugQuality: null,
    retailPrice: null,
    packUnit: null,
    packQty: null,
    minUnit: null,
    validDate: null,
    storeSum: null,
    storeCost: null,
    preSum: null,
    preCost: null,
    lowSum: null,
    topSum: null,
    placeCode: null,
    dailtycheckFlag: null,
    groupCode: null,
    batchNo: null,
    producerCode: null,
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
  getPhaStorage(id).then((res) => {
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
  getPhaStorage(id).then((res) => {
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
        updatePhaStorage(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addPhaStorage(form.value).then((res) => {
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
      return delPhaStorage(Ids)
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
      return clearPhaStorage()
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
      await proxy.downFile('/business/PhaStorage/export', { ...queryParams })
    })
}

handleQuery()
function PhaStorageTongbu() {
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