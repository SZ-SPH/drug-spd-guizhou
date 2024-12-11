<!--
 * @Descripttion: (入库计划/PhaInPlan)
 * @Author: (admin)
 * @Date: (2024-11-27)
-->
<template>
  <div>
    <el-form :model="PhaInPlanqueryParams" label-position="right" inline ref="PhaInPlanqueryRef"
      v-show="PhaInPlanshowSearch" @submit.prevent>
      <el-form-item label="入库计划流水号" prop="planNo">
        <el-input v-model="PhaInPlanqueryParams.planNo" placeholder="请输入入库计划流水号" />
      </el-form-item>
      <el-form-item label="采购单号" prop="billCode">
        <el-input v-model="PhaInPlanqueryParams.billCode" placeholder="请输入采购单号" />
      </el-form-item>
      <el-form-item label="单据状态" prop="state">
        <el-radio-group v-model="PhaInPlanqueryParams.state">
          <el-radio>全部</el-radio>
          <el-radio v-for="item in PhaInPlanoptions.statePhaInPlanoptions" :key="item.dictValue"
            :value="item.dictValue">{{ item.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计划类型" prop="planType">
        <el-select clearable v-model="PhaInPlanqueryParams.planType" placeholder="请选择计划类型">
          <el-option v-for="item in PhaInPlanoptions.planTypePhaInPlanoptions" :key="item.dictValue"
            :label="item.dictLabel" :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
            <span class="fr" style="color: var(--el-text-color-secondary);">{{ item.dictValue }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室编码" prop="drugDeptCode">
        <el-input v-model="PhaInPlanqueryParams.drugDeptCode" placeholder="请输入科室编码" />
      </el-form-item>
      <el-form-item label="药品编码" prop="drugCode">
        <el-input v-model="PhaInPlanqueryParams.drugCode" placeholder="请输入药品编码" />
      </el-form-item>
      <el-form-item label="药品名称" prop="tradeName">
        <el-input v-model="PhaInPlanqueryParams.tradeName" placeholder="请输入药品名称" />
      </el-form-item>
      <el-form-item label="计划日期">
        <el-date-picker v-model="PhaInPlandateRangePlanDate" type="datetimerange" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :default-time="PhaInPlandefaultTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="采购日期">
        <el-date-picker v-model="PhaInPlandateRangeStockDate" type="datetimerange" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :default-time="PhaInPlandefaultTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="采购流水号" prop="stockNo">
        <el-input v-model="PhaInPlanqueryParams.stockNo" placeholder="请输入采购流水号" />
      </el-form-item>
      <el-form-item label="操作日期">
        <el-date-picker v-model="PhaInPlandateRangeOperDate" type="datetimerange" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :default-time="PhaInPlandefaultTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="PhaInPlanhandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="PhaInPlanresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['phainplan:add']" plain icon="plus" @click="PhaInPlanhandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="PhaInPlansingle" v-hasPermi="['phainplan:edit']" plain icon="edit"
          @click="PhaInPlanhandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="PhaInPlanmultiple" v-hasPermi="['phainplan:delete']" plain icon="delete"
          @click="PhaInPlanhandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['phainplan:delete']" plain icon="delete" @click="PhaInPlanhandleClear">
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
                  @success="PhaInPlanhandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="PhaInPlanhandleExport"
          v-hasPermi="['phainplan:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="PhaInPlanshowSearch" @queryTable="PhaInPlangetList"
        :columns="PhaInPlancolumns"></right-toolbar>
    </el-row>

    <el-table :data="PhaInPlandataList" v-loading="PhaInPlanloading" ref="PhaInPlantable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="PhaInPlansortChange"
      @selection-change="PhaInPlanhandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="planNo" label="入库计划流水号" align="center" v-if="PhaInPlancolumns.showColumn('planNo')" />
      <el-table-column prop="billCode" label="采购单号" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('billCode')" />
      <el-table-column prop="state" label="单据状态" align="center" v-if="PhaInPlancolumns.showColumn('state')">
        <template #default="scope">
          <dict-tag :options="PhaInPlanoptions.statePhaInPlanoptions" :value="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column prop="planType" label="计划类型" align="center" v-if="PhaInPlancolumns.showColumn('planType')">
        <template #default="scope">
          <dict-tag :options="PhaInPlanoptions.planTypePhaInPlanoptions" :value="scope.row.planType" />
        </template>
      </el-table-column>
      <el-table-column prop="drugDeptCode" label="科室编码" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('drugDeptCode')" />
      <el-table-column prop="drugCode" label="药品编码" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('drugCode')" />
      <el-table-column prop="tradeName" label="药品名称" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('tradeName')" />
      <el-table-column prop="specs" label="规格" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('specs')" />
      <el-table-column prop="retailPrice" label="参考零售价" align="center"
        v-if="PhaInPlancolumns.showColumn('retailPrice')" />
      <el-table-column prop="wholesalePrice" label="参考批发价" align="center"
        v-if="PhaInPlancolumns.showColumn('wholesalePrice')" />
      <el-table-column prop="purchasePrice" label="最新购入价" align="center"
        v-if="PhaInPlancolumns.showColumn('purchasePrice')" />
      <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('packUnit')" />
      <el-table-column prop="packQty" label="包装数量" align="center" v-if="PhaInPlancolumns.showColumn('packQty')" />
      <el-table-column prop="minUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('minUnit')" />
      <el-table-column prop="producerCode" label="生产厂家编码" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('producerCode')" />
      <el-table-column prop="producerName" label="生产厂家名称" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('producerName')" />
      <el-table-column prop="storeNum" label="本科室库存数量" align="center" v-if="PhaInPlancolumns.showColumn('storeNum')" />
      <el-table-column prop="storeTotsum" label="全院库存总和" align="center"
        v-if="PhaInPlancolumns.showColumn('storeTotsum')" />
      <el-table-column prop="outputSum" label="全院出库总量" align="center" v-if="PhaInPlancolumns.showColumn('outputSum')" />
      <el-table-column prop="planNum" label="计划入库量" align="center" v-if="PhaInPlancolumns.showColumn('planNum')" />
      <el-table-column prop="planEmpl" label="计划人" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('planEmpl')" />
      <el-table-column prop="planDate" label="计划日期" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('planDate')" />
      <el-table-column prop="stockEmpl" label="采购人" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('stockEmpl')" />
      <el-table-column prop="stockDate" label="采购日期" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('stockDate')" />
      <el-table-column prop="stockNo" label="采购流水号" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('stockNo')" />
      <el-table-column prop="replacePlanNo" label="作废、替代计划单流水号" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('replacePlanNo')" />
      <el-table-column prop="mark" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('mark')" />
      <el-table-column prop="operCode" label="操作员" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('operCode')" />
      <el-table-column prop="operDate" label="操作日期" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('operDate')" />
      <el-table-column prop="extendField" label="扩展字段" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('extendField')" />
      <el-table-column prop="stockNum" label="库存数量" align="center" :show-overflow-tooltip="true"
        v-if="PhaInPlancolumns.showColumn('stockNum')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" PhaInPlantitle="详情"
            @click="PhaInPlanhandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" PhaInPlantitle="编辑" v-hasPermi="['phainplan:edit']"
            @click="PhaInPlanhandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" PhaInPlantitle="删除" v-hasPermi="['phainplan:delete']"
            @click="PhaInPlanhandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="PhaInPlantotal" v-model:page="PhaInPlanqueryParams.pageNum"
      v-model:limit="PhaInPlanqueryParams.pageSize" @pagination="PhaInPlangetList" />


    <el-dialog :PhaInPlantitle="PhaInPlantitle" :lock-scroll="false" v-model="PhaInPlanopen">
      <el-form ref="PhaInPlanformRef" :model="PhaInPlanform" :PhaInPlanrules="PhaInPlanrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="入库计划流水号" prop="planNo">
              <el-input v-model="PhaInPlanform.planNo" placeholder="请输入入库计划流水号" :disabled="PhaInPlanopertype != 1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购单号" prop="billCode">
              <el-input v-model="PhaInPlanform.billCode" placeholder="请输入采购单号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="单据状态" prop="state">
              <el-radio-group v-model="PhaInPlanform.state">
                <el-radio v-for="item in PhaInPlanoptions.statePhaInPlanoptions" :key="item.dictValue"
                  :value="item.dictValue">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="计划类型" prop="planType">
              <el-select v-model="PhaInPlanform.planType" placeholder="请选择计划类型">
                <el-option v-for="item in PhaInPlanoptions.planTypePhaInPlanoptions" :key="item.dictValue"
                  :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="科室编码" prop="drugDeptCode">
              <el-input v-model="PhaInPlanform.drugDeptCode" placeholder="请输入科室编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品编码" prop="drugCode">
              <el-input v-model="PhaInPlanform.drugCode" placeholder="请输入药品编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品名称" prop="tradeName">
              <el-input v-model="PhaInPlanform.tradeName" placeholder="请输入药品名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="规格" prop="specs">
              <el-input v-model="PhaInPlanform.specs" placeholder="请输入规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="参考零售价" prop="retailPrice">
              <el-input v-model="PhaInPlanform.retailPrice" placeholder="请输入参考零售价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="参考批发价" prop="wholesalePrice">
              <el-input v-model="PhaInPlanform.wholesalePrice" placeholder="请输入参考批发价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最新购入价" prop="purchasePrice">
              <el-input v-model="PhaInPlanform.purchasePrice" placeholder="请输入最新购入价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装单位" prop="packUnit">
              <el-input v-model="PhaInPlanform.packUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装数量" prop="packQty">
              <el-input v-model="PhaInPlanform.packQty" placeholder="请输入包装数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最小单位" prop="minUnit">
              <el-input v-model="PhaInPlanform.minUnit" placeholder="请输入最小单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产厂家编码" prop="producerCode">
              <el-input v-model="PhaInPlanform.producerCode" placeholder="请输入生产厂家编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产厂家名称" prop="producerName">
              <el-input v-model="PhaInPlanform.producerName" placeholder="请输入生产厂家名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="本科室库存数量" prop="storeNum">
              <el-input v-model="PhaInPlanform.storeNum" placeholder="请输入本科室库存数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="全院库存总和" prop="storeTotsum">
              <el-input v-model="PhaInPlanform.storeTotsum" placeholder="请输入全院库存总和" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="全院出库总量" prop="outputSum">
              <el-input v-model="PhaInPlanform.outputSum" placeholder="请输入全院出库总量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="计划入库量" prop="planNum">
              <el-input v-model="PhaInPlanform.planNum" placeholder="请输入计划入库量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="计划人" prop="planEmpl">
              <el-input v-model="PhaInPlanform.planEmpl" placeholder="请输入计划人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="计划日期" prop="planDate">
              <el-date-picker v-model="PhaInPlanform.planDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购人" prop="stockEmpl">
              <el-input v-model="PhaInPlanform.stockEmpl" placeholder="请输入采购人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购日期" prop="stockDate">
              <el-date-picker v-model="PhaInPlanform.stockDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购流水号" prop="stockNo">
              <el-input v-model="PhaInPlanform.stockNo" placeholder="请输入采购流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="作废、替代计划单流水号" prop="replacePlanNo">
              <el-input v-model="PhaInPlanform.replacePlanNo" placeholder="请输入作废、替代计划单流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="mark">
              <el-input v-model="PhaInPlanform.mark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="操作员" prop="operCode">
              <el-input v-model="PhaInPlanform.operCode" placeholder="请输入操作员" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="操作日期" prop="operDate">
              <el-date-picker v-model="PhaInPlanform.operDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="库存数量" prop="stockNum">
              <el-input v-model="PhaInPlanform.stockNum" placeholder="请输入库存数量" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="扩展字段" prop="extendField">
              <el-input v-model="PhaInPlanform.extendField" placeholder="请输入扩展字段" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="PhaInPlanopertype != 3">
        <el-button text @click="PhaInPlancancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="PhaInPlansubmitForm">{{ $t('btn.submit') }}</el-button>
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
const PhaInPlanids = ref([])
const PhaInPlanloading = ref(false)
const PhaInPlanshowSearch = ref(true)
const PhaInPlanqueryParams = reactive({
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
const PhaInPlancolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'planNo', label: '入库计划流水号' },
  { visible: true, align: 'center', type: '', prop: 'billCode', label: '采购单号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'state', label: '单据状态', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'planType', label: '计划类型', showOverflowTooltip: true },
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
  { visible: false, align: 'center', type: '', prop: 'stockNum', label: '库存数量', showOverflowTooltip: true },

  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const PhaInPlantotal = ref(0)
const PhaInPlandataList = ref([])
const PhaInPlanqueryRef = ref()
const PhaInPlandefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

// 计划日期时间范围
const PhaInPlandateRangePlanDate = ref([])

// 采购日期时间范围
const PhaInPlandateRangeStockDate = ref([])

// 操作日期时间范围
const PhaInPlandateRangeOperDate = ref([])


var PhaInPlandictParams = [
]


function PhaInPlangetList() {
  proxy.addDateRange(PhaInPlanqueryParams, PhaInPlandateRangePlanDate.value, 'PlanDate');
  proxy.addDateRange(PhaInPlanqueryParams, PhaInPlandateRangeStockDate.value, 'StockDate');
  proxy.addDateRange(PhaInPlanqueryParams, PhaInPlandateRangeOperDate.value, 'OperDate');
  PhaInPlanloading.value = true
  listPhaInPlan(PhaInPlanqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      PhaInPlandataList.value = data.result
      PhaInPlantotal.value = data.totalNum
      PhaInPlanloading.value = false
    }
  })
}

// 查询
function PhaInPlanhandleQuery() {
  PhaInPlanqueryParams.pageNum = 1
  PhaInPlangetList()
}

// 重置查询操作
function PhaInPlanresetQuery() {
  // 计划日期时间范围
  PhaInPlandateRangePlanDate.value = []
  // 采购日期时间范围
  PhaInPlandateRangeStockDate.value = []
  // 操作日期时间范围
  PhaInPlandateRangeOperDate.value = []
  proxy.resetForm("PhaInPlanqueryRef")
  PhaInPlanhandleQuery()
}
// 多选框选中数据
function PhaInPlanhandleSelectionChange(selection) {
  PhaInPlanids.value = selection.map((item) => item.planNo);
  PhaInPlansingle.value = selection.length != 1
  PhaInPlanmultiple.value = !selection.length;
}
// 自定义排序
function PhaInPlansortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  PhaInPlanqueryParams.sort = sort
  PhaInPlanqueryParams.sortType = sortType
  PhaInPlanhandleQuery()
}

/*************** form操作 ***************/
const PhaInPlanformRef = ref()
const PhaInPlantitle = ref('')
// 操作类型 1、add 2、edit 3、view
const PhaInPlanopertype = ref(0)
const PhaInPlanopen = ref(false)
const PhaInPlanstate = reactive({
  PhaInPlansingle: true,
  PhaInPlanmultiple: true,
  PhaInPlanform: {},
  PhaInPlanrules: {
    planNo: [{ required: true, message: "入库计划流水号不能为空", trigger: "blur" }],
    billCode: [{ required: true, message: "采购单号不能为空", trigger: "blur" }],
    drugDeptCode: [{ required: true, message: "科室编码不能为空", trigger: "blur" }],
    drugCode: [{ required: true, message: "药品编码不能为空", trigger: "blur" }],
  },
  PhaInPlanoptions: {
    statePhaInPlanoptions: [{ dictLabel: '计划单', dictValue: '0' }, { dictLabel: '采购单', dictValue: '1' }],
    planTypePhaInPlanoptions: [{ dictLabel: '手工计划', dictValue: '0' },
    { dictLabel: '警戒线', dictValue: '1' },
    { dictLabel: '消耗', dictValue: '2' },
    { dictLabel: '时间', dictValue: '3' },
    { dictLabel: '日消耗', dictValue: '4' }]
  }
})

const { PhaInPlanform, PhaInPlanrules, PhaInPlanoptions, PhaInPlansingle, PhaInPlanmultiple } = toRefs(PhaInPlanstate)

// 关闭dialog
function PhaInPlancancel() {
  PhaInPlanopen.value = false
  PhaInPlanreset()
}

// 重置表单
function PhaInPlanreset() {
  PhaInPlanform.value = {
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
    stockNum: null
  };
  proxy.resetForm("PhaInPlanformRef")
}

/**
 * 查看
 * @param {*} row
 */
function PhaInPlanhandlePreview(row) {
  PhaInPlanreset()
  const id = row.planNo
  getPhaInPlan(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      PhaInPlanopen.value = true
      PhaInPlantitle.value = '查看'
      PhaInPlanopertype.value = 3
      PhaInPlanform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function PhaInPlanhandleAdd() {
  PhaInPlanreset();
  PhaInPlanopen.value = true
  PhaInPlantitle.value = '添加入库计划'
  PhaInPlanopertype.value = 1
}
// 修改按钮操作
function PhaInPlanhandleUpdate(row) {
  PhaInPlanreset()
  const id = row.planNo || PhaInPlanids.value
  getPhaInPlan(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      PhaInPlanopen.value = true
      PhaInPlantitle.value = '修改入库计划'
      PhaInPlanopertype.value = 2

      PhaInPlanform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function PhaInPlansubmitForm() {
  proxy.$refs["PhaInPlanformRef"].validate((valid) => {
    if (valid) {

      if (PhaInPlanform.value.planNo != undefined && PhaInPlanopertype.value === 2) {
        updatePhaInPlan(PhaInPlanform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          PhaInPlanopen.value = false
          PhaInPlangetList()
        })
      } else {
        addPhaInPlan(PhaInPlanform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          PhaInPlanopen.value = false
          PhaInPlangetList()
        })
      }
    }
  })
}

// 删除按钮操作
function PhaInPlanhandleDelete(row) {
  const PhaInPlanids = row.planNo || PhaInPlanids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + PhaInPlanids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      PhaInPlancancelButtonText: proxy.$t('common.PhaInPlancancel'),
      type: "warning",
    })
    .then(function () {
      return delPhaInPlan(PhaInPlanids)
    })
    .then(() => {
      PhaInPlangetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function PhaInPlanhandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      PhaInPlancancelButtonText: proxy.$t('common.PhaInPlancancel'),
      type: "warning",
    })
    .then(function () {
      return clearPhaInPlan()
    })
    .then(() => {
      PhaInPlanhandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const PhaInPlanhandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  PhaInPlangetList()
}

// 导出按钮操作
function PhaInPlanhandleExport() {
  proxy
    .$confirm("是否确认导出入库计划数据项?", "警告", {
      confirmButtonText: "确定",
      PhaInPlancancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/PhaInPlan/export', { ...PhaInPlanqueryParams })
    })
}

PhaInPlanhandleQuery()
</script>