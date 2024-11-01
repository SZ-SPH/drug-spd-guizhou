<!--
 * @Descripttion: (盘点单/T_STOCKTAKING)
 * @Author: (admin)
 * @Date: (2024-10-30)
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
        <el-button type="primary" v-hasPermi="['stocktaking:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['stocktaking:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['stocktaking:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['stocktaking:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="操作" align="center" width="90">
        <template #default="scope">
          <el-button text @click="rowClick(scope.row)">{{ $t('btn.details') }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" align="center" v-if="columns.showColumn('id')" />
      <el-table-column prop="stokingNo" label="盘点单号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stokingNo')" />
      <el-table-column prop="generateTime" label="生成时间" :show-overflow-tooltip="true"
        v-if="columns.showColumn('generateTime')" />
      <el-table-column prop="generateMan" label="生成人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('generateMan')" />
      <!-- <el-table-column prop="state" label="状态 暂未启用留空" align="center" v-if="columns.showColumn('state')">
        <template #default="scope">
          <dict-tag :options="options.stateOptions" :value="scope.row.state" />
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true"
        v-if="columns.showColumn('createTime')" />
      <el-table-column prop="updateTime" label="修改时间" :show-overflow-tooltip="true"
        v-if="columns.showColumn('updateTime')" /> -->
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['stocktaking:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['stocktaking:delete']"
            @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <el-drawer v-model="drawer" size="50%" direction="rtl">
      <el-table :data="stocktakingItemList" header-row-class-name="text-navy">
        <el-table-column label="序号" type="index" width="80" />
        <!-- <el-table-column prop="id" label="ID" /> -->
        <el-table-column prop="tracingcodePrefix" label="追溯码前八位识别码" />
        <!-- DrugName	DrugQty	StocktakingQty	DrugSpec	DrugCategory	DrugMnemonicCode	BatchNo	BatchNum -->
        <el-table-column prop="drugName" label="药品名称" />
        <el-table-column prop="drugQty" label="库存数量" />
        <el-table-column prop="stocktakingQty" label="盘点数量" />
        <el-table-column prop="drugSpec" label="药品规格" />
        <el-table-column prop="drugCategory" label="药品类型" />
        <el-table-column prop="drugMnemonicCode" label="药品助记码" />
        <el-table-column prop="batchNo" label="批号" />
        <el-table-column prop="batchNum" label="批次号" />
      </el-table>
    </el-drawer>

    <el-dialog :title="title" :lock-scroll="false" v-model="open" :fullscreen="fullScreen">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12" v-if="opertype != 1">
            <el-form-item label="ID" prop="id">
              <el-input-number v-model.number="form.id" controls-position="right" placeholder="请输入ID"
                :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="盘点单号" prop="stokingNo">
              <el-input v-model="form.stokingNo" placeholder="请输入盘点单号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生成时间" prop="generateTime">
              <el-date-picker v-model="form.generateTime" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生成人" prop="generateMan">
              <el-input v-model="form.generateMan" placeholder="请输入生成人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="状态 暂未启用留空" prop="state">
              <el-radio-group v-model="form.state">
                <el-radio v-for="item in options.stateOptions" :key="item.dictValue" :value="item.dictValue">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker v-model="form.createTime" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="修改时间" prop="updateTime">
              <el-date-picker v-model="form.updateTime" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">盘点明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddStocktakingItem">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteStocktakingItem">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" icon="FullScreen" @click="fullScreen = !fullScreen">{{ fullScreen ? '退出全屏' : '全屏'
              }}</el-button>
          </el-col>
        </el-row>
        <el-table :data="stocktakingItemList" :row-class-name="rowStocktakingItemIndex"
          @selection-change="handleStocktakingItemSelectionChange" ref="StocktakingItemRef">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="追溯码前八位识别码" align="center" prop="tracingcodePrefix">
            <template #default="scope">
              <el-input v-model="scope.row.tracingcodePrefix" placeholder="请输入追溯码前八位识别码" />
            </template>
          </el-table-column>
          <el-table-column label="追溯码" align="center" prop="tracingcode">
            <template #default="scope">
              <el-input v-model="scope.row.tracingcode" placeholder="请输入追溯码" />
            </template>
          </el-table-column>
          <el-table-column label="企业ID" align="center" prop="entId">
            <template #default="scope">
              <el-input v-model="scope.row.entId" placeholder="请输入企业ID" />
            </template>
          </el-table-column>
          <el-table-column label="生产企业名称" align="center" prop="entName">
            <template #default="scope">
              <el-input v-model="scope.row.entName" placeholder="请输入生产企业名称" />
            </template>
          </el-table-column>
          <el-table-column label="药品名称" align="center" prop="physicName">
            <template #default="scope">
              <el-input v-model="scope.row.physicName" placeholder="请输入药品名称" />
            </template>
          </el-table-column>
          <el-table-column label="药品类型" prop="physicType">
            <template #default="scope">
              <el-select v-model="scope.row.physicType" placeholder="请选择药品类型">
                <el-option v-for="item in options.physicTypeOptions" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="包装规格" align="center" prop="pkgSpec">
            <template #default="scope">
              <el-input v-model="scope.row.pkgSpec" placeholder="请输入包装规格" />
            </template>
          </el-table-column>
          <el-table-column label="制剂规格" align="center" prop="prepnSpec">
            <template #default="scope">
              <el-input v-model="scope.row.prepnSpec" placeholder="请输入制剂规格" />
            </template>
          </el-table-column>
          <el-table-column label="制剂剂型描述" align="center" prop="prepnTypeDesc">
            <template #default="scope">
              <el-input v-model="scope.row.prepnTypeDesc" placeholder="请输入制剂剂型描述" />
            </template>
          </el-table-column>
          <el-table-column label="批准文号" align="center" prop="approvalNum">
            <template #default="scope">
              <el-input v-model="scope.row.approvalNum" placeholder="请输入批准文号" />
            </template>
          </el-table-column>
          <el-table-column label="效期" align="center" prop="expire">
            <template #default="scope">
              <el-input v-model="scope.row.expire" placeholder="请输入效期" />
            </template>
          </el-table-column>
          <el-table-column label="有效期至" align="center" prop="expireDate">
            <template #default="scope">
              <el-date-picker clearable v-model="scope.row.expireDate" type="date"
                placeholder="选择日期时间"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="生产日期" align="center" prop="productDate">
            <template #default="scope">
              <el-date-picker clearable v-model="scope.row.productDate" type="date"
                placeholder="选择日期时间"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="最小包装单位数量" align="center" prop="pkgAmount">
            <template #default="scope">
              <el-input v-model="scope.row.pkgAmount" placeholder="请输入最小包装单位数量" />
            </template>
          </el-table-column>
          <el-table-column label="药品ID" align="center" prop="drugId">
            <template #default="scope">
              <el-input v-model="scope.row.drugId" placeholder="请输入药品ID" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime">
            <template #default="scope">
              <el-date-picker clearable v-model="scope.row.createTime" type="date"
                placeholder="选择日期时间"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="修改时间" align="center" prop="updateTime">
            <template #default="scope">
              <el-date-picker clearable v-model="scope.row.updateTime" type="date"
                placeholder="选择日期时间"></el-date-picker>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer v-if="opertype != 3">
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="stocktaking">
import {
  listStocktaking,
  addStocktaking, delStocktaking,
  updateStocktaking, getStocktaking,
}
  from '@/api/business/stocktaking.js'
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
  { visible: true, align: 'center', type: '', prop: 'id', label: 'ID' },
  { visible: true, align: 'center', type: '', prop: 'stokingNo', label: '盘点单号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'generateTime', label: '生成时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'generateMan', label: '生成人', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'state', label: '状态 暂未启用留空', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'createTime', label: '创建时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'updateTime', label: '修改时间', showOverflowTooltip: true },
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
  listStocktaking(queryParams).then(res => {
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
    // 状态 暂未启用留空 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    stateOptions: [],
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
    stokingNo: null,
    generateTime: null,
    generateMan: null,
    state: null,
    createTime: null,
    updateTime: null,
  };
  stocktakingItemList.value = []
  proxy.resetForm("formRef")
}


// 添加按钮操作
function handleAdd() {
  addStocktaking().then((res) => {
    getList()
    proxy.$modal.msgSuccess("新增成功")
  })
  // proxy
  //   .$confirm('是否确认生成盘点单？', "警告", {
  //     confirmButtonText: proxy.$t('common.ok'),
  //     cancelButtonText: proxy.$t('common.cancel'),
  //     type: "warning",
  //   })
  //   .then(function () {
  //     addStocktaking().then((res) => {
  //     })
  //   })
  //   .then(() => {
  //     getList()
  //     proxy.$modal.msgSuccess("新增成功")
  //   })
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getStocktaking(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改盘点单'
      opertype.value = 2

      form.value = {
        ...data,
      }
      stocktakingItemList.value = res.data.stocktakingItemNav
    }
  })
}

// 添加&修改 表单提交
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {

      form.value.stocktakingItemNav = stocktakingItemList.value
      if (form.value.id != undefined && opertype.value === 2) {
        updateStocktaking(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addStocktaking(form.value).then((res) => {
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
      return delStocktaking(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}



// 导出按钮操作
function handleExport() {
  proxy
    .$confirm("是否确认导出盘点单数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/Stocktaking/export', { ...queryParams })
    })
}

/*********************盘点明细子表信息*************************/
const stocktakingItemList = ref([])
const checkedStocktakingItem = ref([])
const fullScreen = ref(false)
const drawer = ref(false)

/** 盘点明细序号 */
function rowStocktakingItemIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 盘点明细添加按钮操作 */
function handleAddStocktakingItem() {
  let obj = {};
  //下面的代码自己设置默认值
  //obj.tracingcodePrefix = null;
  //obj.tracingcode = null;
  //obj.entId = null;
  //obj.entName = null;
  //obj.physicName = null;
  //obj.physicType = null;
  //obj.pkgSpec = null;
  //obj.prepnSpec = null;
  //obj.prepnTypeDesc = null;
  //obj.approvalNum = null;
  //obj.expire = null;
  //obj.expireDate = null;
  //obj.productDate = null;
  //obj.pkgAmount = null;
  //obj.drugId = null;
  //obj.createTime = null;
  //obj.updateTime = null;
  stocktakingItemList.value.push(obj);
}

/** 复选框选中数据 */
function handleStocktakingItemSelectionChange(selection) {
  checkedStocktakingItem.value = selection.map(item => item.index)
}

/** 盘点明细删除按钮操作 */
function handleDeleteStocktakingItem() {
  if (checkedStocktakingItem.value.length == 0) {
    proxy.$modal.msgError('请先选择要删除的盘点明细数据')
  } else {
    const StocktakingItems = stocktakingItemList.value;
    const checkedStocktakingItems = checkedStocktakingItem.value;
    stocktakingItemList.value = StocktakingItems.filter(function (item) {
      return checkedStocktakingItems.indexOf(item.index) == -1
    });
  }
}

/** 盘点明细详情 */
function rowClick(row) {
  const id = row.id || ids.value
  getStocktaking(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      drawer.value = true
      stocktakingItemList.value = data.stocktakingItemNav
    }
  })
}
handleQuery()
</script>