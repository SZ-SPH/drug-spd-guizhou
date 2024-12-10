<!--
 * @Descripttion: (入库计划/PhaInPlan)
 * @Author: (admin)
 * @Date: (2024-11-27)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="入库计划流水号" prop="planNo">
        <el-input v-model="queryParams.planNo" placeholder="请输入入库计划流水号" />
      </el-form-item>
      <el-form-item label="采购单号" prop="billCode">
        <el-input v-model="queryParams.billCode" placeholder="请输入采购单号" />
      </el-form-item>
      <el-form-item label="单据状态 0 计划单，1 采购单" prop="state">
        <el-radio-group v-model="queryParams.state">
          <el-radio>全部</el-radio>
          <el-radio v-for="item in options.stateOptions" :key="item.dictValue"
            :value="item.dictValue">{{ item.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计划类型0手工计划，1警戒线，2消耗，3时间，4日消耗" prop="planType">
        <el-select clearable v-model="queryParams.planType" placeholder="请选择计划类型0手工计划，1警戒线，2消耗，3时间，4日消耗">
          <el-option v-for="item in options.planTypeOptions" :key="item.dictValue" :label="item.dictLabel"
            :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
            <span class="fr" style="color: var(--el-text-color-secondary);">{{ item.dictValue }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室编码" prop="drugDeptCode">
        <el-input v-model="queryParams.drugDeptCode" placeholder="请输入科室编码" />
      </el-form-item>
      <el-form-item label="药品编码" prop="drugCode">
        <el-input v-model="queryParams.drugCode" placeholder="请输入药品编码" />
      </el-form-item>
      <el-form-item label="药品名称" prop="tradeName">
        <el-input v-model="queryParams.tradeName" placeholder="请输入药品名称" />
      </el-form-item>
      <el-form-item label="计划日期">
        <el-date-picker v-model="dateRangePlanDate" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime" :shortcuts="dateOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="采购日期">
        <el-date-picker v-model="dateRangeStockDate" type="datetimerange" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime"
          :shortcuts="dateOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="采购流水号" prop="stockNo">
        <el-input v-model="queryParams.stockNo" placeholder="请输入采购流水号" />
      </el-form-item>
      <el-form-item label="操作日期">
        <el-date-picker v-model="dateRangeOperDate" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
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
        <el-button type="primary" v-hasPermi="['phainplan:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['phainplan:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['phainplan:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['phainplan:delete']" plain icon="delete" @click="handleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['phainplan:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/PhaInPlan/importTemplate" importUrl="/business/PhaInPlan/importData"
                  @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['phainplan:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="planNo" label="入库计划流水号" align="center" v-if="columns.showColumn('planNo')" />
      <el-table-column prop="billCode" label="采购单号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('billCode')" />
      <el-table-column prop="state" label="单据状态 0 计划单，1 采购单" align="center" v-if="columns.showColumn('state')">
        <template #default="scope">
          <dict-tag :options="options.stateOptions" :value="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column prop="planType" label="计划类型0手工计划，1警戒线，2消耗，3时间，4日消耗" align="center"
        v-if="columns.showColumn('planType')">
        <template #default="scope">
          <dict-tag :options="options.planTypeOptions" :value="scope.row.planType" />
        </template>
      </el-table-column>
      <el-table-column prop="drugDeptCode" label="科室编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugDeptCode')" />
      <el-table-column prop="drugCode" label="药品编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugCode')" />
      <el-table-column prop="tradeName" label="药品名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('tradeName')" />
      <el-table-column prop="specs" label="规格" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('specs')" />
      <el-table-column prop="retailPrice" label="参考零售价" align="center" v-if="columns.showColumn('retailPrice')" />
      <el-table-column prop="wholesalePrice" label="参考批发价" align="center" v-if="columns.showColumn('wholesalePrice')" />
      <el-table-column prop="purchasePrice" label="最新购入价" align="center" v-if="columns.showColumn('purchasePrice')" />
      <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('packUnit')" />
      <el-table-column prop="packQty" label="包装数量" align="center" v-if="columns.showColumn('packQty')" />
      <el-table-column prop="minUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('minUnit')" />
      <el-table-column prop="producerCode" label="生产厂家编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('producerCode')" />
      <el-table-column prop="producerName" label="生产厂家名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('producerName')" />
      <el-table-column prop="storeNum" label="本科室库存数量" align="center" v-if="columns.showColumn('storeNum')" />
      <el-table-column prop="storeTotsum" label="全院库存总和" align="center" v-if="columns.showColumn('storeTotsum')" />
      <el-table-column prop="outputSum" label="全院出库总量" align="center" v-if="columns.showColumn('outputSum')" />
      <el-table-column prop="planNum" label="计划入库量" align="center" v-if="columns.showColumn('planNum')" />
      <el-table-column prop="planEmpl" label="计划人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('planEmpl')" />
      <el-table-column prop="planDate" label="计划日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('planDate')" />
      <el-table-column prop="stockEmpl" label="采购人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stockEmpl')" />
      <el-table-column prop="stockDate" label="采购日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stockDate')" />
      <el-table-column prop="stockNo" label="采购流水号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stockNo')" />
      <el-table-column prop="replacePlanNo" label="作废、替代计划单流水号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('replacePlanNo')" />
      <el-table-column prop="mark" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('mark')" />
      <el-table-column prop="operCode" label="操作员" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('operCode')" />
      <el-table-column prop="operDate" label="操作日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('operDate')" />
      <el-table-column prop="extendField" label="扩展字段" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('extendField')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['phainplan:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['phainplan:delete']"
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
            <el-form-item label="入库计划流水号" prop="planNo">
              <el-input v-model="form.planNo" placeholder="请输入入库计划流水号" :disabled="opertype != 1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购单号" prop="billCode">
              <el-input v-model="form.billCode" placeholder="请输入采购单号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="单据状态 0 计划单，1 采购单" prop="state">
              <el-radio-group v-model="form.state">
                <el-radio v-for="item in options.stateOptions" :key="item.dictValue" :value="item.dictValue">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="计划类型0手工计划，1警戒线，2消耗，3时间，4日消耗" prop="planType">
              <el-select v-model="form.planType" placeholder="请选择计划类型0手工计划，1警戒线，2消耗，3时间，4日消耗">
                <el-option v-for="item in options.planTypeOptions" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="科室编码" prop="drugDeptCode">
              <el-input v-model="form.drugDeptCode" placeholder="请输入科室编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品编码" prop="drugCode">
              <el-input v-model="form.drugCode" placeholder="请输入药品编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品名称" prop="tradeName">
              <el-input v-model="form.tradeName" placeholder="请输入药品名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="规格" prop="specs">
              <el-input v-model="form.specs" placeholder="请输入规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="参考零售价" prop="retailPrice">
              <el-input v-model="form.retailPrice" placeholder="请输入参考零售价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="参考批发价" prop="wholesalePrice">
              <el-input v-model="form.wholesalePrice" placeholder="请输入参考批发价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最新购入价" prop="purchasePrice">
              <el-input v-model="form.purchasePrice" placeholder="请输入最新购入价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装单位" prop="packUnit">
              <el-input v-model="form.packUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装数量" prop="packQty">
              <el-input v-model="form.packQty" placeholder="请输入包装数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最小单位" prop="minUnit">
              <el-input v-model="form.minUnit" placeholder="请输入最小单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产厂家编码" prop="producerCode">
              <el-input v-model="form.producerCode" placeholder="请输入生产厂家编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产厂家名称" prop="producerName">
              <el-input v-model="form.producerName" placeholder="请输入生产厂家名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="本科室库存数量" prop="storeNum">
              <el-input v-model="form.storeNum" placeholder="请输入本科室库存数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="全院库存总和" prop="storeTotsum">
              <el-input v-model="form.storeTotsum" placeholder="请输入全院库存总和" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="全院出库总量" prop="outputSum">
              <el-input v-model="form.outputSum" placeholder="请输入全院出库总量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="计划入库量" prop="planNum">
              <el-input v-model="form.planNum" placeholder="请输入计划入库量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="计划人" prop="planEmpl">
              <el-input v-model="form.planEmpl" placeholder="请输入计划人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="计划日期" prop="planDate">
              <el-date-picker v-model="form.planDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购人" prop="stockEmpl">
              <el-input v-model="form.stockEmpl" placeholder="请输入采购人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购日期" prop="stockDate">
              <el-date-picker v-model="form.stockDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购流水号" prop="stockNo">
              <el-input v-model="form.stockNo" placeholder="请输入采购流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="作废、替代计划单流水号" prop="replacePlanNo">
              <el-input v-model="form.replacePlanNo" placeholder="请输入作废、替代计划单流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="mark">
              <el-input v-model="form.mark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="操作员" prop="operCode">
              <el-input v-model="form.operCode" placeholder="请输入操作员" />
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
            <el-form-item label="扩展字段" prop="extendField">
              <el-input v-model="form.extendField" placeholder="请输入扩展字段" />
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

<script setup name="phainplan">
import {
  listPhaInPlan,
  addPhaInPlan, delPhaInPlan,
  updatePhaInPlan, getPhaInPlan,
  clearPhaInPlan,
}
  from '@/api/business/phainplan.js'
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
  planNo: undefined,
  billCode: undefined,
  state: undefined,
  planType: undefined,
  drugDeptCode: undefined,
  drugCode: undefined,
  tradeName: undefined,
  planDate: undefined,
  stockDate: undefined,
  stockNo: undefined,
  operDate: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'planNo', label: '入库计划流水号' },
  { visible: true, align: 'center', type: '', prop: 'billCode', label: '采购单号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'state', label: '单据状态 0 计划单，1 采购单', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'planType', label: '计划类型0手工计划，1警戒线，2消耗，3时间，4日消耗', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugDeptCode', label: '科室编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugCode', label: '药品编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'tradeName', label: '药品名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'specs', label: '规格', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'retailPrice', label: '参考零售价' },
  { visible: false, align: 'center', type: '', prop: 'wholesalePrice', label: '参考批发价' },
  { visible: false, align: 'center', type: '', prop: 'purchasePrice', label: '最新购入价' },
  { visible: false, align: 'center', type: '', prop: 'packUnit', label: '包装单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packQty', label: '包装数量' },
  { visible: false, align: 'center', type: '', prop: 'minUnit', label: '最小单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'producerCode', label: '生产厂家编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'producerName', label: '生产厂家名称', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'storeNum', label: '本科室库存数量' },
  { visible: false, align: 'center', type: '', prop: 'storeTotsum', label: '全院库存总和' },
  { visible: false, align: 'center', type: '', prop: 'outputSum', label: '全院出库总量' },
  { visible: false, align: 'center', type: '', prop: 'planNum', label: '计划入库量' },
  { visible: false, align: 'center', type: '', prop: 'planEmpl', label: '计划人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'planDate', label: '计划日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockEmpl', label: '采购人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockDate', label: '采购日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockNo', label: '采购流水号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'replacePlanNo', label: '作废、替代计划单流水号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'mark', label: '备注', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'operCode', label: '操作员', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'operDate', label: '操作日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'extendField', label: '扩展字段', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

// 计划日期时间范围
const dateRangePlanDate = ref([])

// 采购日期时间范围
const dateRangeStockDate = ref([])

// 操作日期时间范围
const dateRangeOperDate = ref([])


var dictParams = [
]


function getList() {
  proxy.addDateRange(queryParams, dateRangePlanDate.value, 'PlanDate');
  proxy.addDateRange(queryParams, dateRangeStockDate.value, 'StockDate');
  proxy.addDateRange(queryParams, dateRangeOperDate.value, 'OperDate');
  loading.value = true
  listPhaInPlan(queryParams).then(res => {
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
  // 计划日期时间范围
  dateRangePlanDate.value = []
  // 采购日期时间范围
  dateRangeStockDate.value = []
  // 操作日期时间范围
  dateRangeOperDate.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.planNo);
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
    planNo: [{ required: true, message: "入库计划流水号不能为空", trigger: "blur" }],
    billCode: [{ required: true, message: "采购单号不能为空", trigger: "blur" }],
    drugDeptCode: [{ required: true, message: "科室编码不能为空", trigger: "blur" }],
    drugCode: [{ required: true, message: "药品编码不能为空", trigger: "blur" }],
  },
  options: {
    // 单据状态 0 计划单，1 采购单 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
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
    planNo: null,
    billCode: null,
    state: null,
    planType: null,
    drugDeptCode: null,
    drugCode: null,
    tradeName: null,
    specs: null,
    retailPrice: null,
    wholesalePrice: null,
    purchasePrice: null,
    packUnit: null,
    packQty: null,
    minUnit: null,
    producerCode: null,
    producerName: null,
    storeNum: null,
    storeTotsum: null,
    outputSum: null,
    planNum: null,
    planEmpl: null,
    planDate: null,
    stockEmpl: null,
    stockDate: null,
    stockNo: null,
    replacePlanNo: null,
    mark: null,
    operCode: null,
    operDate: null,
    extendField: null,
  };
  proxy.resetForm("formRef")
}

/**
 * 查看
 * @param {*} row
 */
function handlePreview(row) {
  reset()
  const id = row.planNo
  getPhaInPlan(id).then((res) => {
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
  title.value = '添加入库计划'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.planNo || ids.value
  getPhaInPlan(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改入库计划'
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

      if (form.value.planNo != undefined && opertype.value === 2) {
        updatePhaInPlan(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addPhaInPlan(form.value).then((res) => {
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
  const Ids = row.planNo || ids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delPhaInPlan(Ids)
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
      return clearPhaInPlan()
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
    .$confirm("是否确认导出入库计划数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/PhaInPlan/export', { ...queryParams })
    })
}

handleQuery()
</script>