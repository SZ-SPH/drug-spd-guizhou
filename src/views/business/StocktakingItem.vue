<!--
 * @Descripttion: (盘点明细/T_STOCKTAKING_ITEM)
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
        <el-button type="primary" v-hasPermi="['stocktakingitem:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange">
      <el-table-column prop="id" label="ID" align="center" v-if="columns.showColumn('id')" />
      <el-table-column prop="tracingcodePrefix" label="追溯码前八位识别码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('tracingcodePrefix')" />
      <el-table-column prop="tracingcode" label="追溯码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('tracingcode')" />
      <el-table-column prop="entId" label="企业ID" align="center" v-if="columns.showColumn('entId')" />
      <el-table-column prop="entName" label="生产企业名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('entName')" />
      <el-table-column prop="physicName" label="药品名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('physicName')" />
      <el-table-column prop="physicType" label="药品类型" align="center" v-if="columns.showColumn('physicType')">
        <template #default="scope">
          <dict-tag :options="options.physicTypeOptions" :value="scope.row.physicType" />
        </template>
      </el-table-column>
      <el-table-column prop="pkgSpec" label="包装规格" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('pkgSpec')" />
      <el-table-column prop="prepnSpec" label="制剂规格" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('prepnSpec')" />
      <el-table-column prop="prepnTypeDesc" label="制剂剂型描述" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('prepnTypeDesc')" />
      <el-table-column prop="approvalNum" label="批准文号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('approvalNum')" />
      <el-table-column prop="expire" label="效期" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('expire')" />
      <el-table-column prop="expireDate" label="有效期至" :show-overflow-tooltip="true"
        v-if="columns.showColumn('expireDate')" />
      <el-table-column prop="productDate" label="生产日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('productDate')" />
      <el-table-column prop="pkgAmount" label="最小包装单位数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('pkgAmount')" />
      <el-table-column prop="drugId" label="药品ID" align="center" v-if="columns.showColumn('drugId')" />
      <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true"
        v-if="columns.showColumn('createTime')" />
      <el-table-column prop="updateTime" label="修改时间" :show-overflow-tooltip="true"
        v-if="columns.showColumn('updateTime')" />
      <el-table-column prop="stockMainId" label="盘点单号主表ID" align="center" v-if="columns.showColumn('stockMainId')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['stocktakingitem:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['stocktakingitem:delete']"
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
            <el-form-item label="ID" prop="id">
              <el-input-number v-model.number="form.id" controls-position="right" placeholder="请输入ID"
                :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="追溯码前八位识别码" prop="tracingcodePrefix">
              <el-input v-model="form.tracingcodePrefix" placeholder="请输入追溯码前八位识别码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="追溯码" prop="tracingcode">
              <el-input v-model="form.tracingcode" placeholder="请输入追溯码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="企业ID" prop="entId">
              <el-input v-model.number="form.entId" placeholder="请输入企业ID" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产企业名称" prop="entName">
              <el-input v-model="form.entName" placeholder="请输入生产企业名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品名称" prop="physicName">
              <el-input v-model="form.physicName" placeholder="请输入药品名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品类型" prop="physicType">
              <el-select v-model="form.physicType" placeholder="请选择药品类型">
                <el-option v-for="item in options.physicTypeOptions" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装规格" prop="pkgSpec">
              <el-input v-model="form.pkgSpec" placeholder="请输入包装规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="制剂规格" prop="prepnSpec">
              <el-input v-model="form.prepnSpec" placeholder="请输入制剂规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="制剂剂型描述" prop="prepnTypeDesc">
              <el-input v-model="form.prepnTypeDesc" placeholder="请输入制剂剂型描述" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批准文号" prop="approvalNum">
              <el-input v-model="form.approvalNum" placeholder="请输入批准文号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="效期" prop="expire">
              <el-input v-model="form.expire" placeholder="请输入效期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="有效期至" prop="expireDate">
              <el-date-picker v-model="form.expireDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产日期" prop="productDate">
              <el-date-picker v-model="form.productDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最小包装单位数量" prop="pkgAmount">
              <el-input v-model="form.pkgAmount" placeholder="请输入最小包装单位数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品ID" prop="drugId">
              <el-input v-model.number="form.drugId" placeholder="请输入药品ID" />
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

          <el-col :lg="12">
            <el-form-item label="盘点单号主表ID" prop="stockMainId">
              <el-input v-model.number="form.stockMainId" placeholder="请输入盘点单号主表ID" />
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

<script setup name="stocktakingitem">
import {
  listStocktakingItem,
  addStocktakingItem, delStocktakingItem,
  updateStocktakingItem, getStocktakingItem,
}
  from '@/api/business/stocktakingitem.js'
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
  { visible: true, align: 'center', type: '', prop: 'tracingcodePrefix', label: '追溯码前八位识别码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'tracingcode', label: '追溯码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'entId', label: '企业ID' },
  { visible: true, align: 'center', type: '', prop: 'entName', label: '生产企业名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'physicName', label: '药品名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'physicType', label: '药品类型', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'pkgSpec', label: '包装规格', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'prepnSpec', label: '制剂规格', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'prepnTypeDesc', label: '制剂剂型描述', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approvalNum', label: '批准文号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'expire', label: '效期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'expireDate', label: '有效期至', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'productDate', label: '生产日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'pkgAmount', label: '最小包装单位数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'drugId', label: '药品ID' },
  { visible: false, align: 'center', type: '', prop: 'createTime', label: '创建时间', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'updateTime', label: '修改时间', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockMainId', label: '盘点单号主表ID' },
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
  listStocktakingItem(queryParams).then(res => {
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
    // 药品类型 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    physicTypeOptions: [],
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
    tracingcodePrefix: null,
    tracingcode: null,
    entId: null,
    entName: null,
    physicName: null,
    physicType: null,
    pkgSpec: null,
    prepnSpec: null,
    prepnTypeDesc: null,
    approvalNum: null,
    expire: null,
    expireDate: null,
    productDate: null,
    pkgAmount: null,
    drugId: null,
    createTime: null,
    updateTime: null,
    stockMainId: null,
  };
  proxy.resetForm("formRef")
}


// 添加按钮操作
function handleAdd() {
  reset();
  open.value = true
  title.value = '添加盘点明细'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getStocktakingItem(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改盘点明细'
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
        updateStocktakingItem(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addStocktakingItem(form.value).then((res) => {
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
      return delStocktakingItem(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}




handleQuery()
</script>