<!--
 * @Descripttion: (送货单/DeliveryOrder)
 * @Author: (admin)
 * @Date: (2024-08-27)
-->
<template>
  <div>

    <div>
      <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
        <el-form-item label="备货单" prop="stockId">
          <el-input v-model="queryParams.stockId" placeholder="请输入备货单" />
        </el-form-item>
        <el-form-item label="药品id" prop="drugId">
          <el-input v-model="queryParams.drugId" placeholder="请输入药品id" />
        </el-form-item>
        <el-form-item>
          <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <!-- 工具区域 -->
      <el-row :gutter="15" class="mb10">
        <el-col :span="1.5">
          <el-button type="primary" v-hasPermi="['deliveryorder:add']" plain icon="plus" @click="handleAdd">
            {{ $t('btn.add') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" :disabled="single" v-hasPermi="['deliveryorder:edit']" plain icon="edit"
            @click="handleUpdate">
            {{ $t('btn.edit') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" :disabled="multiple" v-hasPermi="['deliveryorder:delete']" plain icon="delete"
            @click="handleDelete">
            {{ $t('btn.delete') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" v-hasPermi="['deliveryorder:delete']" plain icon="delete" @click="handleClear">
            {{ $t('btn.clean') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-dropdown trigger="click" v-hasPermi="['deliveryorder:import']">
            <el-button type="primary" plain icon="Upload">
              {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="upload">
                  <importData templateUrl="business/DeliveryOrder/importTemplate"
                    importUrl="/business/DeliveryOrder/importData" @success="handleFileSuccess"></importData>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['deliveryorder:export']">
            {{ $t('btn.export') }}
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
      </el-row>

      <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
        highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="id" label="Id" align="center" v-if="columns.showColumn('id')" />
        <el-table-column prop="stockId" label="备货单" align="center" :show-overflow-tooltip="true"
          v-if="columns.showColumn('stockId')" />
        <el-table-column prop="drugId" label="药品id" align="center" :show-overflow-tooltip="true"
          v-if="columns.showColumn('drugId')" />
        <el-table-column prop="deliveryTime" label="送货药品" align="center" :show-overflow-tooltip="true"
          v-if="columns.showColumn('deliveryTime')" />
        <el-table-column prop="deliveryDetails" label="单据详情" align="center" :show-overflow-tooltip="true"
          v-if="columns.showColumn('deliveryDetails')" />
        <el-table-column prop="deliveryHospital" label="配送医院" align="center" :show-overflow-tooltip="true"
          v-if="columns.showColumn('deliveryHospital')" />
        <el-table-column prop="deliveryAddress" label="配送地址" align="center" :show-overflow-tooltip="true"
          v-if="columns.showColumn('deliveryAddress')" />
        <el-table-column prop="deliveryPerson" label="配送人" align="center" :show-overflow-tooltip="true"
          v-if="columns.showColumn('deliveryPerson')" />
        <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
          v-if="columns.showColumn('remarks')" />
        <el-table-column prop="states" label="状态" align="center" v-if="columns.showColumn('states')">
          <template #default="scope">
            <dict-tag :options="options.statesOptions" :value="scope.row.states" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" :show-overflow-tooltip="true"
          v-if="columns.showColumn('createTime')" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
            <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['deliveryorder:edit']"
              @click="handleUpdate(scope.row)"></el-button>
            <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['deliveryorder:delete']"
              @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
        @pagination="getList" />


    </div>
    <div>
      <el-form :model="DeliveryDrugqueryParams" label-position="right" inline ref="DeliveryDrugqueryRef"
        v-show="DeliveryDrugshowSearch" @submit.prevent>
        <el-form-item label="DeliveryId" prop="deliveryId">
          <el-input v-model="DeliveryDrugqueryParams.deliveryId" placeholder="请输入DeliveryId" />
        </el-form-item>
        <el-form-item label="药品id" prop="drugId">
          <el-input v-model="DeliveryDrugqueryParams.drugId" placeholder="请输入药品id" />
        </el-form-item>
        <el-form-item>
          <el-button :disabled="queryParams.receiptId == 0" type="primary" v-hasPermi="['inwarehousing:add']" plain
            icon="plus" @click="OpenDrughandleAdd">
            添加明细
          </el-button>
          <el-button icon="search" type="primary" @click="DeliveryDrughandleQuery">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="DeliveryDrugresetQuery">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <!-- 工具区域 -->
      <el-row :gutter="15" class="mb10">
        <el-col :span="1.5">
          <el-button type="primary" v-hasPermi="['deliveryorderdrug:add']" plain icon="plus"
            @click="DeliveryDrughandleAdd">
            {{ $t('btn.add') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" :disabled="DeliveryDrugsingle" v-hasPermi="['deliveryorderdrug:edit']" plain
            icon="edit" @click="DeliveryDrughandleUpdate">
            {{ $t('btn.edit') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" :disabled="DeliveryDrugmultiple" v-hasPermi="['deliveryorderdrug:delete']" plain
            icon="delete" @click="DeliveryDrughandleDelete">
            {{ $t('btn.delete') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" v-hasPermi="['deliveryorderdrug:delete']" plain icon="delete"
            @click="DeliveryDrughandleClear">
            {{ $t('btn.clean') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-dropdown trigger="click" v-hasPermi="['deliveryorderdrug:import']">
            <el-button type="primary" plain icon="Upload">
              {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="upload">
                  <importData templateUrl="business/DeliveryOrderDrug/importTemplate"
                    importUrl="/business/DeliveryOrderDrug/importData" @success="DeliveryDrughandleFileSuccess">
                  </importData>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="download" @click="DeliveryDrughandleExport"
            v-hasPermi="['deliveryorderdrug:export']">
            {{ $t('btn.export') }}
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="DeliveryDrugshowSearch" @queryTable="DeliveryDruggetList"
          :columns="DeliveryDrugcolumns"></right-toolbar>
      </el-row>

      <el-table :data="DeliveryDrugdataList" v-loading="DeliveryDrugloading" ref="DeliveryDrugtable" border
        header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="DeliveryDrugsortChange"
        @selection-change="DeliveryDrughandleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="id" label="Id" align="center" v-if="DeliveryDrugcolumns.showColumn('id')" />
        <el-table-column prop="deliveryId" label="DeliveryId" align="center" :show-overflow-tooltip="true"
          v-if="DeliveryDrugcolumns.showColumn('deliveryId')" />
        <el-table-column prop="drugId" label="药品id" align="center" :show-overflow-tooltip="true"
          v-if="DeliveryDrugcolumns.showColumn('drugId')" />
        <el-table-column prop="drugDetails" label="药品信息" align="center" :show-overflow-tooltip="true"
          v-if="DeliveryDrugcolumns.showColumn('drugDetails')" />
        <el-table-column prop="drugQuantity" label="数量" align="center" :show-overflow-tooltip="true"
          v-if="DeliveryDrugcolumns.showColumn('drugQuantity')" />
        <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
          v-if="DeliveryDrugcolumns.showColumn('remarks')" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" size="small" icon="view" title="详情"
              @click="DeliveryDrughandlePreview(scope.row)"></el-button>
            <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['deliveryorderdrug:edit']"
              @click="DeliveryDrughandleUpdate(scope.row)"></el-button>
            <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['deliveryorderdrug:delete']"
              @click="DeliveryDrughandleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="DeliveryDrugtotal" v-model:page="DeliveryDrugqueryParams.pageNum"
        v-model:limit="DeliveryDrugqueryParams.pageSize" @pagination="DeliveryDruggetList" />

      <el-dialog :title="title" :lock-scroll="false" v-model="open">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
          <el-row :gutter="20">

            <el-col :lg="12">
              <el-form-item label="Id" prop="id">
                <el-input v-model.number="form.id" placeholder="请输入Id" :disabled="opertype != 1" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="备货单" prop="stockId">
                <el-input v-model="form.stockId" placeholder="请输入备货单" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="药品id" prop="drugId">
                <el-input v-model="form.drugId" placeholder="请输入药品id" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="送货药品" prop="deliveryTime">
                <el-input v-model="form.deliveryTime" placeholder="请输入送货药品" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="单据详情" prop="deliveryDetails">
                <el-input v-model="form.deliveryDetails" placeholder="请输入单据详情" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="配送医院" prop="deliveryHospital">
                <el-input v-model="form.deliveryHospital" placeholder="请输入配送医院" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="配送地址" prop="deliveryAddress">
                <el-input v-model="form.deliveryAddress" placeholder="请输入配送地址" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="配送人" prop="deliveryPerson">
                <el-input v-model="form.deliveryPerson" placeholder="请输入配送人" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="form.remarks" placeholder="请输入备注" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="状态" prop="states">
                <el-radio-group v-model="form.states">
                  <el-radio v-for="item in options.statesOptions" :key="item.dictValue" :value="item.dictValue">
                    {{ item.dictLabel }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="创建时间" prop="createTime">
                <el-input v-model="form.createTime" placeholder="请输入创建时间" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer v-if="opertype != 3">
          <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
        </template>
      </el-dialog>

      <el-dialog :title="DeliveryDrugtitle" :lock-scroll="false" v-model="DeliveryDrugopen">
        <el-form ref="DeliveryDrugformRef" :model="DeliveryDrugform" :rules="DeliveryDrugrules" label-width="100px">
          <el-row :gutter="20">

            <el-col :lg="12">
              <el-form-item label="Id" prop="id">
                <el-input v-model.number="DeliveryDrugform.id" placeholder="请输入Id"
                  :disabled="DeliveryDrugopertype != 1" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="DeliveryId" prop="deliveryId">
                <el-input v-model="DeliveryDrugform.deliveryId" placeholder="请输入DeliveryId" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="药品id" prop="drugId">
                <el-input v-model="DeliveryDrugform.drugId" placeholder="请输入药品id" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="药品信息" prop="drugDetails">
                <el-input v-model="DeliveryDrugform.drugDetails" placeholder="请输入药品信息" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="数量" prop="drugQuantity">
                <el-input v-model="DeliveryDrugform.drugQuantity" placeholder="请输入数量" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="DeliveryDrugform.remarks" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer v-if="DeliveryDrugopertype != 3">
          <el-button text @click="DeliveryDrugcancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="DeliveryDrugsubmitForm">{{ $t('btn.submit') }}</el-button>
        </template>
      </el-dialog>
      <!-- 药品选择 -->
      <el-dialog :title="title" :lock-scroll="false" v-model="Drugopen">
        <el-form :model="DrugqueryParams" label-position="right" inline ref="DrugqueryRef" v-show="DrugshowSearch"
          @submit.prevent>
          <el-form-item label="药品名称" prop="drugName">
            <el-input v-model="DrugqueryParams.drugName" placeholder="请输入药品名称" />
          </el-form-item>
          <el-form-item label="药品编号" prop="drugCode">
            <el-input v-model="DrugqueryParams.drugCode" placeholder="请输入药品编号" />
          </el-form-item>
          <el-form-item label="药品助记码" prop="drugMnemonicCode">
            <el-input v-model="DrugqueryParams.drugMnemonicCode" placeholder="请输入药品助记码" />
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="DrughandleQuery">{{ $t('btn.search') }}</el-button>
            <el-button icon="refresh" @click="DrugresetQuery">{{ $t('btn.reset') }}</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="DrugdataList" v-loading="Drugloading" ref="Drugtable" border
          header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="DrugsortChange"
          @selection-change="DrughandleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="drugId" label="drugId" align="center" v-if="Drugcolumns.showColumn('drugId')" />
          <el-table-column prop="drugName" label="药品名称" align="center" :show-overflow-tooltip="true"
            v-if="Drugcolumns.showColumn('drugName')" />
          <el-table-column prop="drugCode" label="药品编号" align="center" :show-overflow-tooltip="true"
            v-if="Drugcolumns.showColumn('drugCode')" />
          <el-table-column prop="drugMnemonicCode" label="药品助记码" align="center" :show-overflow-tooltip="true"
            v-if="Drugcolumns.showColumn('drugMnemonicCode')" />
          <el-table-column prop="drugSpecifications" label="药品规格" align="center" :show-overflow-tooltip="true"
            v-if="Drugcolumns.showColumn('drugSpecifications')" />
          <el-table-column prop="drugCategory" label="药品类别" align="center" :show-overflow-tooltip="true"
            v-if="Drugcolumns.showColumn('drugCategory')" />
          <el-table-column prop="drugVarietyName" label="药品品种名称" align="center" :show-overflow-tooltip="true"
            v-if="Drugcolumns.showColumn('drugVarietyName')" />
          <el-table-column prop="drugClassification" label="药物分类" align="center" :show-overflow-tooltip="true"
            v-if="Drugcolumns.showColumn('drugClassification')" />
          <el-table-column prop="tracingSourceCode" label="溯源码" align="center" :show-overflow-tooltip="true"
            v-if="Drugcolumns.showColumn('tracingSourceCode')" />
          <el-table-column prop="drugBatchNumber" label="批号" align="center" :show-overflow-tooltip="true"
            v-if="Drugcolumns.showColumn('drugBatchNumber')" />

        </el-table>
        <pagination :total="Drugtotal" v-model:page="DrugqueryParams.pageNum" v-model:limit="DrugqueryParams.pageSize"
          @pagination="DruggetList" />
        <template #footer v-if="Drugopertype != 3">
          <el-button text @click="Drugcancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="DrugsubmitForm">{{ $t('btn.submit') }}</el-button>
        </template>

      </el-dialog>

    </div>


  </div>

</template>

<script setup name="deliveryorder">
import {
  listDeliveryOrder,
  addDeliveryOrder, delDeliveryOrder,
  updateDeliveryOrder, getDeliveryOrder,
  clearDeliveryOrder,
}
  from '@/api/business/deliveryorder.js'
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
  stockId: undefined,
  drugId: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'stockId', label: '备货单', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'deliveryTime', label: '送货药品', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'deliveryDetails', label: '单据详情', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'deliveryHospital', label: '配送医院', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'deliveryAddress', label: '配送地址', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'deliveryPerson', label: '配送人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'remarks', label: '备注', showOverflowTooltip: true },
  { visible: false, align: 'center', type: 'dict', prop: 'states', label: '状态', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'createTime', label: '创建时间', showOverflowTooltip: true },
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
  listDeliveryOrder(queryParams).then(res => {
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
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
  },
  options: {
    // 状态 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    statesOptions: [],
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
    stockId: null,
    drugId: null,
    deliveryTime: null,
    deliveryDetails: null,
    deliveryHospital: null,
    deliveryAddress: null,
    deliveryPerson: null,
    remarks: null,
    states: null,
    createTime: null,
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
  getDeliveryOrder(id).then((res) => {
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
  title.value = '添加送货单'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getDeliveryOrder(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改送货单'
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
        updateDeliveryOrder(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDeliveryOrder(form.value).then((res) => {
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
      return delDeliveryOrder(Ids)
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
      return clearDeliveryOrder()
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
    .$confirm("是否确认导出送货单数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/DeliveryOrder/export', { ...queryParams })
    })
}

handleQuery()


import {
  listDeliveryOrderDrug,
  addDeliveryOrderDrug, delDeliveryOrderDrug,
  updateDeliveryOrderDrug, getDeliveryOrderDrug,
  clearDeliveryOrderDrug,
}
  from '@/api/business/deliveryorderdrug.js'
// import importData from '@/components/ImportData'
// const { proxy } = getCurrentInstance()
const DeliveryDrugids = ref([])
const DeliveryDrugloading = ref(false)
const DeliveryDrugshowSearch = ref(true)
const DeliveryDrugqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  deliveryId: undefined,
  drugId: undefined,
})
const DeliveryDrugcolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'deliveryId', label: 'DeliveryId', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugDetails', label: '药品信息', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugQuantity', label: '数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'remarks', label: '备注', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const DeliveryDrugtotal = ref(0)
const DeliveryDrugdataList = ref([])
const DeliveryDrugqueryRef = ref()
const DeliveryDrugdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var DeliveryDrugdictParams = [
]


function DeliveryDruggetList() {
  DeliveryDrugloading.value = true
  listDeliveryOrderDrug(DeliveryDrugqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      DeliveryDrugdataList.value = data.result
      DeliveryDrugtotal.value = data.totalNum
      DeliveryDrugloading.value = false
    }
  })
}

// 查询
function DeliveryDrughandleQuery() {
  DeliveryDrugqueryParams.pageNum = 1
  DeliveryDruggetList()
}

// 重置查询操作
function DeliveryDrugresetQuery() {
  proxy.resetForm("DeliveryDrugqueryRef")
  DeliveryDrughandleQuery()
}
// 多选框选中数据
function DeliveryDrughandleSelectionChange(selection) {
  DeliveryDrugids.value = selection.map((item) => item.id);
  DeliveryDrugsingle.value = selection.length != 1
  DeliveryDrugmultiple.value = !selection.length;
}
// 自定义排序
function DeliveryDrugsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  DeliveryDrugqueryParams.sort = sort
  DeliveryDrugqueryParams.sortType = sortType
  DeliveryDrughandleQuery()
}

/*************** form操作 ***************/
const DeliveryDrugformRef = ref()
const DeliveryDrugtitle = ref('')
// 操作类型 1、add 2、edit 3、view
const DeliveryDrugopertype = ref(0)
const DeliveryDrugopen = ref(false)
const DeliveryDrugstate = reactive({
  DeliveryDrugsingle: true,
  DeliveryDrugmultiple: true,
  DeliveryDrugform: {},
  DeliveryDrugrules: {
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
  },
  DeliveryDrugoptions: {
  }
})

const { DeliveryDrugform, DeliveryDrugrules, DeliveryDrugoptions, DeliveryDrugsingle, DeliveryDrugmultiple } = toRefs(DeliveryDrugstate)

// 关闭dialog
function DeliveryDrugcancel() {
  DeliveryDrugopen.value = false
  DeliveryDrugreset()
}

// 重置表单
function DeliveryDrugreset() {
  DeliveryDrugform.value = {
    id: null,
    deliveryId: null,
    drugId: null,
    drugDetails: null,
    drugQuantity: null,
    remarks: null,
  };
  proxy.resetForm("DeliveryDrugformRef")
}

/**
 * 查看
 * @param {*} row
 */
function DeliveryDrughandlePreview(row) {
  DeliveryDrugreset()
  const id = row.id
  getDeliveryOrderDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      DeliveryDrugopen.value = true
      DeliveryDrugtitle.value = '查看'
      DeliveryDrugopertype.value = 3
      DeliveryDrugform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function DeliveryDrughandleAdd() {
  DeliveryDrugreset();
  DeliveryDrugopen.value = true
  DeliveryDrugtitle.value = '添加送货单药品'
  DeliveryDrugopertype.value = 1
}
// 修改按钮操作
function DeliveryDrughandleUpdate(row) {
  DeliveryDrugreset()
  const id = row.id || DeliveryDrugids.value
  getDeliveryOrderDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      DeliveryDrugopen.value = true
      DeliveryDrugtitle.value = '修改送货单药品'
      DeliveryDrugopertype.value = 2

      DeliveryDrugform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function DeliveryDrugsubmitForm() {
  proxy.$refs["DeliveryDrugformRef"].validate((valid) => {
    if (valid) {

      if (DeliveryDrugform.value.id != undefined && DeliveryDrugopertype.value === 2) {
        updateDeliveryOrderDrug(DeliveryDrugform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          DeliveryDrugopen.value = false
          DeliveryDruggetList()
        })
      } else {
        addDeliveryOrderDrug(DeliveryDrugform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          DeliveryDrugopen.value = false
          DeliveryDruggetList()
        })
      }
    }
  })
}

// 删除按钮操作
function DeliveryDrughandleDelete(row) {
  const Ids = row.id || DeliveryDrugids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delDeliveryOrderDrug(Ids)
    })
    .then(() => {
      DeliveryDruggetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function DeliveryDrughandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return clearDeliveryOrderDrug()
    })
    .then(() => {
      DeliveryDrughandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const DeliveryDrughandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  DeliveryDruggetList()
}

// 导出按钮操作
function DeliveryDrughandleExport() {
  proxy
    .$confirm("是否确认导出送货单药品数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/DeliveryOrderDrug/export', { ...DeliveryDrugqueryParams })
    })
}

DeliveryDrughandleQuery()


function OpenDrughandleAdd() {

  if (ids.value.length == 1) {
    Drugreset();
    Drugopen.value = true
    Drugtitle.value = '添加送货信息'
    Drugopertype.value = 1
    console.log(ids.value[0])
  }
  else {
    alert("请选择一个送货单")
  }
}









import {
  listInWarehousing,
  addInWarehousing, delInWarehousing,
  updateInWarehousing, getInWarehousing,
  getcodedetail
}
  from '@/api/business/inwarehousing.js'
const Drugids = ref([])
const Drugloading = ref(false)
const DrugshowSearch = ref(true)
const DrugqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  drugId: undefined,
  drugCode: undefined,
  tracingSourceCode: undefined,
  batchNumber: undefined,
  receiptId: 0,
})
const Drugcolumns = ref([
  { visible: false, align: 'center', type: '', prop: 'id', label: 'id' },
  { visible: false, align: 'center', type: '', prop: 'drugId', label: '药品id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugName', label: '入库药品名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'codeCount', label: '药品数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugCode', label: '药品编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'tracingSourceCode', label: '药品溯源码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'batchNumber', label: '药品批号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'inventoryQuantity', label: '药品入库数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugSpecifications', label: '药品规格', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'receiptId', label: '入库单据id' },
  { visible: true, align: 'center', type: '', prop: 'manufacturerId', label: '生产厂家' },
  { visible: true, align: 'center', type: '', prop: 'exprie', label: '有效期' },
  { visible: true, align: 'center', type: '', prop: 'price', label: '价格' },
  { visible: true, align: 'center', type: '', prop: 'locationNumber', label: '货位号' },
  { visible: true, align: 'center', type: '', prop: 'dateOfManufacture', label: '生产日期' },
  { visible: true, align: 'center', type: '', prop: 'minunit', label: '最小单位' },

  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const Drugtotal = ref(0)
const DrugdataList = ref([])
const DrugdrugdataList = ref([])

const DrugqueryRef = ref()
const DrugdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

var DrugdictParams = [
]

function DruggetList() {
  Drugloading.value = true
  listInWarehousing(DrugqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      DrugdataList.value = data.result
      Drugtotal.value = data.totalNum
      Drugloading.value = false
    }
  })
}

// 查询
function DrughandleQuery() {
  DrugqueryParams.pageNum = 1
  DruggetList()
}

// 重置查询操作
function DrugresetQuery() {
  proxy.resetForm("DrugqueryRef")
  DrughandleQuery()
}
// 自定义排序
function DrugsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  DrugqueryParams.sort = sort
  DrugqueryParams.sortType = sortType
  DrughandleQuery()
}

/*************** form操作 ***************/
const DrugformRef = ref()
const Drugtitle = ref('')
// 操作类型 1、add 2、edit 3、view
const Drugopertype = ref(0)
const Drugopen = ref(false)
const Drugstate = reactive({
  Drugsingle: true,
  Drugmultiple: true,
  Drugform: {},
  Drugrules: {
    // id: [{ required: true, message: "id不能为空", trigger: "blur", type: "number" }],
  },
  Drugoptions: {
  }
})

const { Drugform, Drugrules, Drugoptions, Drugsingle, Drugmultiple } = toRefs(Drugstate)

// 关闭dialog
function Drugcancel() {
  Drugopen.value = false
  Drugreset()
}

// 重置表单
function Drugreset() {
  Drugform.value = {
    id: null,
    drugId: null,
    drugCode: null,
    tracingSourceCode: null,
    batchNumber: null,
    inventoryQuantity: null,
    drugSpecifications: null,
    receiptId: null,
    manufacturerId: null,
    exprie: null,
    price: null,
    locationNumber: null,
    dateOfManufacture: null,
    minunit: null,
  }
  proxy.resetForm("DrugformRef")
}

/**
 * 查看
 * @param {*} row
 */
function DrughandlePreview(row) {
  Drugreset()
  const id = row.id
  getInWarehousing(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Drugopen.value = true
      Drugtitle.value = '查看'
      Drugopertype.value = 3
      Drugform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function DrughandleAdd() {
  Drugreset();
  Drugopen.value = true
  Drugtitle.value = '添加入库信息'
  Drugopertype.value = 1
  DrugresetQuery()

}

function Drughandleopenadd(row) {
  //打开界面
}


// 修改按钮操作
function DrughandleUpdate(row) {
  Drugreset()
  const id = row.id || ids.value
  getInWarehousing(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Drugopen.value = true
      Drugtitle.value = '修改入库信息'
      Drugopertype.value = 2

      Drugform.value = {
        ...data,
      }
    }
  })
}


// 删除按钮操作
function DrughandleDelete(row) {
  const Ids = row.id || Drugids.value
  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delInWarehousing(Ids)
    })
    .then(() => {
      DruggetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}



// 导出按钮操作
function DrughandleExport() {
  proxy
    .$confirm("是否确认导出入库信息数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/InWarehousing/export', { ...DrugqueryParams })
    })
}

DrughandleQuery()
</script>