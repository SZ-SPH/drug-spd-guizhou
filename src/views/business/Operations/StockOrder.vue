<!--
 * @Descripttion: (送货单/StockOrder)
 * @Author: (admin)
 * @Date: (2024-08-27)
-->
<template>
  <div>

    <div>
      <el-form :model="PlanDrugsqueryParams" label-position="right" inline ref="PlanDrugsqueryRef"
        v-show="PlanDrugsshowSearch" @submit.prevent>
        <el-form-item label="送货计划" prop="planId">
          <el-input v-model="PlanDrugsqueryParams.planId" placeholder="请输入送货计划" />
        </el-form-item>
        <el-form-item label="药品" prop="drugId">
          <el-input v-model="PlanDrugsqueryParams.drugId" placeholder="请输入药品" />
        </el-form-item>
        <el-form-item>
          <el-button icon="search" type="primary" @click="PlanDrugshandleQuery">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="PlanDrugsresetQuery">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <!-- 工具区域 -->
      <el-row :gutter="15" class="mb10">
        <el-col :span="1.5">
          <el-button type="warning" plain icon="download" @click="StockDrugshandleAdd"
            v-hasPermi="['inventoryplandrugs:export']">
            添加送货
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="download" @click="PlanDrugshandleExport"
            v-hasPermi="['inventoryplandrugs:export']">
            {{ $t('btn.export') }}
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="PlanDrugsshowSearch" @queryTable="PlanDrugsgetList"
          :columns="PlanDrugscolumns"></right-toolbar>
      </el-row>

      <el-table :data="PlanDrugsdataList" v-loading="PlanDrugsloading" ref="PlanDrugstable" border
        header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="PlanDrugssortChange"
        @selection-change="PlanDrugshandleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="id" label="Id" align="center" v-if="PlanDrugscolumns.showColumn('id')" />
        <el-table-column prop="planId" label="送货计划id" align="center" :show-overflow-tooltip="true"
          v-if="PlanDrugscolumns.showColumn('planId')" />
        <el-table-column prop="drugId" label="药品id" align="center" :show-overflow-tooltip="true"
          v-if="PlanDrugscolumns.showColumn('drugId')" />
        <el-table-column prop="drugDetails" label="药品信息" align="center" :show-overflow-tooltip="true"
          v-if="PlanDrugscolumns.showColumn('drugDetails')" />
        <el-table-column prop="drugQuantity" label="数量" align="center" :show-overflow-tooltip="true"
          v-if="PlanDrugscolumns.showColumn('drugQuantity')">
          <template #default="{ row }">
            <el-input v-model="row.drugQuantity" size="small" @blur="DrugQuantityChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
          v-if="PlanDrugscolumns.showColumn('remarks')" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" size="small" icon="view" title="详情"
              @click="PlanDrugshandlePreview(scope.row)"></el-button>
            <!-- <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['inventoryplandrugs:edit']"
            @click="PlanDrugshandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['inventoryplandrugs:delete']"
            @click="PlanDrugshandleDelete(scope.row)"></el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="PlanDrugstotal" v-model:page="PlanDrugsqueryParams.pageNum"
        v-model:limit="PlanDrugsqueryParams.pageSize" @pagination="PlanDrugsgetList" />


      <el-dialog :title="PlanDrugstitle" :lock-scroll="false" v-model="PlanDrugsopen">
        <el-form ref="PlanDrugsformRef" :model="PlanDrugsform" :rules="PlanDrugsrules" label-width="100px">
          <el-row :gutter="20">

            <el-col :lg="12">
              <el-form-item label="Id" prop="id">
                <el-input v-model.number="PlanDrugsform.id" placeholder="请输入Id" :disabled="PlanDrugsopertype != 1" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="送货计划id" prop="planId">
                <el-input v-model="PlanDrugsform.planId" placeholder="请输入送货计划id" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="药品id" prop="drugId">
                <el-input v-model="PlanDrugsform.drugId" placeholder="请输入药品id" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="药品信息" prop="drugDetails">
                <el-input v-model="PlanDrugsform.drugDetails" placeholder="请输入药品信息" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="数量" prop="drugQuantity">
                <el-input v-model="PlanDrugsform.drugQuantity" placeholder="请输入数量" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="PlanDrugsform.remarks" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer v-if="PlanDrugsopertype != 3">
          <el-button text @click="PlanDrugscancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="PlanDrugssubmitForm">{{ $t('btn.submit') }}</el-button>
        </template>
      </el-dialog>
    </div>
    <div class="table-content">
      <div class="table-item1">
        <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
          <!-- <el-form-item label="送货单id" prop="receiptId">
          <el-input v-model.number="queryParams.receiptId" placeholder="请输入送货单id" />
        </el-form-item> -->
          <!-- <el-form-item label="药品id" prop="drugId">
            <el-input v-model.number="queryParams.drugId" placeholder="请输入药品id" />
          </el-form-item> -->
          <el-form-item label="送货单编号" prop="DeliveryHospital">
            <el-input v-model="queryParams.DeliveryHospital" placeholder="请输入送货单编号" />
          </el-form-item>
          <el-form-item label="配送地址" prop="deliveryAddress">
            <el-input v-model="queryParams.deliveryAddress" placeholder="请输入配送地址" />
          </el-form-item>
          <!-- <el-form-item label="配送时间" prop="deliveryTime">
          <el-input v-model="queryParams.deliveryTime" placeholder="请输入配送时间" />
        </el-form-item> -->
          <el-form-item>
            <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
            <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
          </el-form-item>
        </el-form>
        <!-- 工具区域 -->
        <el-row :gutter="15" class="mb10">
          <el-col :span="1.5">
            <el-button type="primary" v-hasPermi="['warehousereceipt:add']" plain icon="plus" @click="addReceipt">
              发送
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" v-hasPermi="['stockorder:add']" plain icon="plus" @click="handleAdd">
              {{ $t('btn.add') }}
            </el-button>
          </el-col>
          <!-- <el-col :span="1.5">
          <el-button type="success" :disabled="single" v-hasPermi="['stockorder:edit']" plain icon="edit"
            @click="handleUpdate">
            {{ $t('btn.edit') }}
          </el-button>addReceipt
        </el-col> -->
          <el-col :span="1.5">
            <el-button type="danger" :disabled="multiple" v-hasPermi="['stockorder:delete']" plain icon="delete"
              @click="handleDelete">
              {{ $t('btn.delete') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" v-hasPermi="['stockorder:delete']" plain icon="delete" @click="handleClear">
              {{ $t('btn.clean') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-dropdown trigger="click" v-hasPermi="['stockorder:import']">
              <el-button type="primary" plain icon="Upload">
                {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="upload">
                    <importData templateUrl="business/StockOrder/importTemplate"
                      importUrl="/business/StockOrder/importData" @success="handleFileSuccess"></importData>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['stockorder:export']">
              {{ $t('btn.export') }}
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>
        <el-table @row-dblclick="StockDrugdatalist" :data="dataList" v-loading="loading" ref="table" border
          header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="sortChange"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="Id" align="center" v-if="columns.showColumn('id')" />
          <el-table-column prop="receiptId" label="送货单id" align="center" v-if="columns.showColumn('receiptId')" />
          <el-table-column prop="drugId" label="药品id" align="center" v-if="columns.showColumn('drugId')" />
          <el-table-column prop="deliveryHospital" label="送货单编号" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('deliveryHospital')" />
          <el-table-column prop="deliveryQuantity" label="配送数量" align="center"
            v-if="columns.showColumn('deliveryQuantity')" />

          <el-table-column prop="deliveryAddress" label="配送地址" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('deliveryAddress')" />
          <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('remarks')" />
          <el-table-column prop="deliveryTime" label="配送时间" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('deliveryTime')" />
          <el-table-column prop="deliveryPerson" label="配送人" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('deliveryPerson')" />
          <el-table-column label="操作" width="160">
            <template #default="scope">
              <el-button type="primary" size="small" icon="view" title="详情"
                @click="handlePreview(scope.row)"></el-button>
              <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['stockorder:edit']"
                @click="handleUpdate(scope.row)"></el-button>
              <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['stockorder:delete']"
                @click="handleDelete(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
          @pagination="getList" />
        <el-dialog :title="title" :lock-scroll="false" v-model="open">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-row :gutter="20">

              <!-- <el-col :lg="12">
              <el-form-item label="Id" prop="id">
                <el-input v-model.number="form.id" placeholder="请输入Id" :disabled="opertype != 1" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="送货单id" prop="receiptId">
                <el-input v-model.number="form.receiptId" placeholder="请输入送货单id" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="药品id" prop="drugId">
                <el-input v-model.number="form.drugId" placeholder="请输入药品id" />
              </el-form-item>
            </el-col> -->

              <el-col :lg="12">
                <el-form-item label="送货单编号" prop="deliveryHospital">
                  <el-input v-model="form.deliveryHospital" placeholder="请输入送货单编号" />
                </el-form-item>
              </el-col>
              <el-col :lg="12">
                <el-form-item label="配送数量" prop="deliveryQuantity">
                  <el-input v-model.number="form.deliveryQuantity" placeholder="请输入配送数量" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="配送地址" prop="deliveryAddress">
                  <el-input v-model="form.deliveryAddress" placeholder="请输入配送地址" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="备注" prop="remarks">
                  <el-input v-model="form.remarks" placeholder="请输入备注" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="配送时间" prop="deliveryTime">
                  <el-input v-model="form.deliveryTime" placeholder="请输入配送时间" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="配送人" prop="deliveryPerson">
                  <el-input v-model="form.deliveryPerson" placeholder="请输入配送人" />
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
      <div class="table-item2">
        <el-form :model="StockDrugqueryParams" label-position="right" inline ref="StockDrugqueryRef"
          v-show="StockDrugshowSearch" @submit.prevent>
          <!-- <el-form-item label="送货单id" prop="stockId">
          <el-input v-model="StockDrugqueryParams.stockId" placeholder="请输入送货单id" />
        </el-form-item>
        <el-form-item label="药品id" prop="drugId">
          <el-input v-model="StockDrugqueryParams.drugId" placeholder="请输入药品id" />
        </el-form-item> -->
          <el-form-item>
            <el-button :disabled="queryParams.receiptId == 0" type="primary" v-hasPermi="['inwarehousing:add']" plain>
              <!-- 添加明细 -->
            </el-button>
            <!-- <el-button icon="search" type="primary" @click="StockDrughandleQuery">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="StockDrugresetQuery">{{ $t('btn.reset') }}</el-button> -->
          </el-form-item>
        </el-form>
        <!-- 工具区域 -->
        <el-row :gutter="15" class="mb10">
          <el-col :span="1.5">
            <el-button type="danger" :disabled="StockDrugmultiple" v-hasPermi="['stockorderdrug:delete']" plain
              icon="delete" @click="StockDrughandleDelete">
              {{ $t('btn.delete') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="download" @click="StockDrughandleExport"
              v-hasPermi="['stockorderdrug:export']">
              {{ $t('btn.export') }}
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="StockDrugshowSearch" @queryTable="StockDruggetList"
            :columns="StockDrugcolumns"></right-toolbar>
        </el-row>
        <el-table :data="StockDrugdataList" v-loading="StockDrugloading" ref="StockDrugtable" border
          header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="StockDrugsortChange"
          @selection-change="StockDrughandleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="Id" align="center" v-if="StockDrugcolumns.showColumn('id')" />
          <el-table-column prop="stockId" label="送货单id" align="center" :show-overflow-tooltip="true"
            v-if="StockDrugcolumns.showColumn('stockId')" />
          <el-table-column prop="drugId" label="药品id" align="center" :show-overflow-tooltip="true"
            v-if="StockDrugcolumns.showColumn('drugId')" />
          <el-table-column prop="drugDetails" label="药品信息" align="center" :show-overflow-tooltip="true"
            v-if="StockDrugcolumns.showColumn('drugDetails')" />
          <el-table-column prop="drugQuantity" label="数量" align="center" :show-overflow-tooltip="true"
            v-if="StockDrugcolumns.showColumn('drugQuantity')">
            <template #default="{ row }">
              <el-input v-model="row.drugQuantity" size="small" @blur="DrugQuantityChange(row)" />
            </template></el-table-column>
          <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
            v-if="StockDrugcolumns.showColumn('remarks')" />
          <el-table-column label="操作" width="160">
            <template #default="scope">
              <el-button type="primary" size="small" icon="view" title="详情"
                @click="StockDrughandlePreview(scope.row)"></el-button>
              <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['stockorderdrug:edit']"
                @click="StockDrughandleUpdate(scope.row)"></el-button>
              <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['stockorderdrug:delete']"
                @click="StockDrughandleDelete(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="StockDrugtotal" v-model:page="StockDrugqueryParams.pageNum"
          v-model:limit="StockDrugqueryParams.pageSize" @pagination="StockDruggetList" />

        <el-dialog :title="StockDrugtitle" :lock-scroll="false" v-model="StockDrugopen">
          <el-form ref="StockDrugformRef" :model="StockDrugform" :rules="StockDrugrules" label-width="100px">
            <el-row :gutter="20">

              <el-col :lg="12">
                <el-form-item label="Id" prop="id">
                  <el-input v-model.number="StockDrugform.id" placeholder="请输入Id" :disabled="StockDrugopertype != 1" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="送货单id" prop="stockId">
                  <el-input v-model="StockDrugform.stockId" placeholder="请输入送货单id" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="药品id" prop="drugId">
                  <el-input v-model="StockDrugform.drugId" placeholder="请输入药品id" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="药品信息" prop="drugDetails">
                  <el-input v-model="StockDrugform.drugDetails" placeholder="请输入药品信息" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="数量" prop="drugQuantity">
                  <el-input v-model="StockDrugform.drugQuantity" placeholder="请输入数量" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="备注" prop="remarks">
                  <el-input v-model="StockDrugform.remarks" placeholder="请输入备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <template #footer v-if="StockDrugopertype != 3">
            <el-button text @click="StockDrugcancel">{{ $t('btn.cancel') }}</el-button>
            <el-button type="primary" @click="StockDrugsubmitForm">{{ $t('btn.submit') }}</el-button>
          </template>
        </el-dialog>
      </div>
    </div>
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

</template>

<script setup name="stockorder">
import {
  listStockOrder,
  addStockOrder, delStockOrder,
  updateStockOrder, getStockOrder,
  clearStockOrder,
}
  from '@/api/business/stockorder.js'
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
  receiptId: undefined,
  drugId: undefined,
  deliveryHospital: undefined,
  deliveryAddress: undefined,
  deliveryTime: undefined,
})
const columns = ref([
  { visible: false, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: false, align: 'center', type: '', prop: 'receiptId', label: '送货单id' },
  { visible: false, align: 'center', type: '', prop: 'drugId', label: '药品id' },
  { visible: true, align: 'center', type: '', prop: 'deliveryHospital', label: '送货单编号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'deliveryQuantity', label: '配送数量' },
  { visible: true, align: 'center', type: '', prop: 'deliveryAddress', label: '配送地址', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'remarks', label: '备注', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'deliveryTime', label: '配送时间', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'deliveryPerson', label: '配送人', showOverflowTooltip: true },
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
  listStockOrder(queryParams).then(res => {
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
const stockorderdate = ref([])
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1
  multiple.value = !selection.length;

  stockorderdate.value = selection.map((item, index) => {
    return {
      Id: item.id,
      ReceiptId: item.receiptId,
      DrugId: item.drugId,
      DeliveryTime: item.deliveryTime,
      DeliveryQuantity: item.deliveryQuantity,
      DeliveryHospital: item.deliveryHospital,
      DeliveryAddress: item.deliveryAddress,
      DeliveryPerson: item.deliveryPerson,
      Remarks: item.remarks
    }
  })


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
    receiptId: null,
    drugId: null,
    deliveryQuantity: null,
    deliveryHospital: null,
    deliveryAddress: null,
    remarks: null,
    deliveryTime: null,
    deliveryPerson: null,
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
  getStockOrder(id).then((res) => {
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
  getStockOrder(id).then((res) => {
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
        updateStockOrder(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addStockOrder(form.value).then((res) => {
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
      return delStockOrder(Ids)
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
      return clearStockOrder()
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
      await proxy.downFile('/business/StockOrder/export', { ...queryParams })
    })
}

handleQuery()


import {
  listStockOrderDrug,
  addStockOrderDrug, delStockOrderDrug,
  updateStockOrderDrug, getStockOrderDrug,
  clearStockOrderDrug,
}
  from '@/api/business/stockorderdrug.js'
// import importData from '@/components/ImportData'
// const { proxy } = getCurrentInstance()
const StockDrugids = ref([])
const StockDrugloading = ref(false)
const StockDrugshowSearch = ref(true)
const StockDrugqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  stockId: 0,
  drugId: undefined,
})
const StockDrugcolumns = ref([
  { visible: false, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: false, align: 'center', type: '', prop: 'stockId', label: '送货单id', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'drugId', label: '药品id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugDetails', label: '药品信息', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugQuantity', label: '数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'remarks', label: '备注', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const StockDrugtotal = ref(0)
const StockDrugdataList = ref([])
const StockDrugqueryRef = ref()
const StockDrugdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var StockDrugdictParams = [
]


function StockDruggetList() {
  StockDrugloading.value = true
  listStockOrderDrug(StockDrugqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      StockDrugdataList.value = data.result
      StockDrugtotal.value = data.totalNum
      StockDrugloading.value = false
    }
  })
}

// 查询
function StockDrughandleQuery() {
  StockDrugqueryParams.pageNum = 1
  StockDruggetList()
}

// 重置查询操作
function StockDrugresetQuery() {
  proxy.resetForm("queryRef")
  StockDrughandleQuery()
}
// 多选框选中数据
function StockDrughandleSelectionChange(selection) {
  StockDrugids.value = selection.map((item) => item.id);
  StockDrugsingle.value = selection.length != 1
  StockDrugmultiple.value = !selection.length;
}
// 自定义排序
function StockDrugsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  StockDrugqueryParams.sort = sort
  StockDrugqueryParams.sortType = sortType
  StockDrughandleQuery()
}

/*************** form操作 ***************/
const StockDrugformRef = ref()
const StockDrugtitle = ref('')
// 操作类型 1、add 2、edit 3、view
const StockDrugopertype = ref(0)
const StockDrugopen = ref(false)
const StockDrugstate = reactive({
  StockDrugsingle: true,
  StockDrugmultiple: true,
  StockDrugform: {},
  StockDrugrules: {
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
  },
  StockDrugoptions: {
  }
})

const { StockDrugform, StockDrugrules, StockDrugoptions, StockDrugsingle, StockDrugmultiple } = toRefs(StockDrugstate)

// 关闭dialog
function StockDrugcancel() {
  StockDrugopen.value = false
  StockDrugreset()
}

// 重置表单
function StockDrugreset() {
  StockDrugform.value = {
    id: null,
    stockId: null,
    drugId: null,
    drugDetails: null,
    drugQuantity: null,
    remarks: null,
  };
  proxy.resetForm("StockDrugformRef")
}

/**
 * 查看
 * @param {*} row
 */
function StockDrughandlePreview(row) {
  StockDrugreset()
  const id = row.id
  getStockOrderDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      StockDrugopen.value = true
      StockDrugtitle.value = '查看'
      StockDrugopertype.value = 3
      StockDrugform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function StockDrughandleAdd() {
  StockDrugreset();
  StockDrugopen.value = true
  StockDrugtitle.value = '添加送货单药品'
  StockDrugopertype.value = 1
}
// 修改按钮操作
function StockDrughandleUpdate(row) {
  StockDrugreset()
  const id = row.id || StockDrugids.value
  getStockOrderDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      StockDrugopen.value = true
      StockDrugtitle.value = '修改送货单药品'
      StockDrugopertype.value = 2

      StockDrugform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function StockDrugsubmitForm() {
  proxy.$refs["StockDrugformRef"].validate((valid) => {
    if (valid) {

      if (StockDrugform.value.id != undefined && StockDrugopertype.value === 2) {
        updateStockOrderDrug(StockDrugform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          StockDrugopen.value = false
          StockDruggetList()
        })
      } else {
        addStockOrderDrug(StockDrugform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          StockDrugopen.value = false
          StockDruggetList()
        })
      }
    }
  })
}

// 删除按钮操作
function StockDrughandleDelete(row) {
  const Ids = row.id || StockDrugids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delStockOrderDrug(Ids)
    })
    .then(() => {
      StockDruggetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function StockDrughandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return clearStockOrderDrug()
    })
    .then(() => {
      StockDrughandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const StockDrughandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  StockDruggetList()
}

// 导出按钮操作
function StockDrughandleExport() {
  proxy
    .$confirm("是否确认导出送货单药品数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/StockOrderDrug/export', { ...StockDrugqueryParams })
    })
}

StockDrughandleQuery()



import {
  listDrug,
  addDrug, delDrug,
  updateDrug, getDrug,
}
  from '@/api/business/drug.js'
// import Index from '../index.vue';
// import { id } from 'element-plus/es/locale';
// const { proxy } = getCurrentInstance()
const Drugids = ref([])
const Drugloading = ref(false)
const DrugshowSearch = ref(true)
const DrugqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  drugName: undefined,
  drugCode: undefined,
  drugMnemonicCode: undefined,
})
const Drugcolumns = ref([
  { visible: false, align: 'center', type: '', prop: 'drugId', label: 'drugId' },
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
const Drugtotal = ref(0)
const DrugdataList = ref([])
const DrugqueryRef = ref()
const DrugdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])
const Drugopen = ref(false)

var DrugdictParams = [
]


function DruggetList() {
  Drugloading.value = true
  listDrug(DrugqueryParams).then(res => {
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

// 多选框选中数据
function DrughandleSelectionChange(selection) {
  Drugids.value = selection.map((item) => item.drugId);
  Drugsingle.value = selection.length != 1
  Drugmultiple.value = !selection.length;

  StockDrugsData.value = selection.map((item, index) => {
    return {

      StockId: item.stockId,
      DrugId: item.drugId,
      DrugDetails: item.drugDetails,
      DrugQuantity: item.drugQuantity,
      Remarks: item.remarks

    };
  });
}
// 自定义排序
function DrugsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (Drugcolumn.prop != null && Drugcolumn.order != null) {
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

const Drugstate = reactive({
  Drugsingle: true,
  Drugmultiple: true,
  Drugform: {},
  Drugrules: {
  },
  Drugoptions: {
  }
})

const { Drugform, Drugrules, Drugoptions, Drugsingle, Drugmultiple } = toRefs(Drugstate)
const FictitiousDrugData = ref([]);
// 关闭dialog
function Drugcancel() {
  Drugopen.value = false
  Drugreset()
}

// 重置表单
function Drugreset() {
  Drugform.value = {
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
  proxy.resetForm("DrugformRef")
}

/**
 * 查看
 * @param {*} row
 */
function DrughandlePreview(row) {
  // debugger

  Drugreset()
  const id = row.drugId
  getDrug(id).then((res) => {
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
  Drugtitle.value = '添加药品基础信息'
  Drugopertype.value = 1
}
// 修改按钮操作
function DrughandleUpdate(row) {
  Drugreset()
  const id = row.drugId || Drugids.value
  getDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Drugopen.value = true
      Drugtitle.value = '修改药品基础信息'
      Drugopertype.value = 2
      Drugform.value = {
        ...data,
      }
    }
  })
}
const StockDrugsData = ref([])
// 添加&修改 表单提交
function DrugsubmitForm() {
  console.log(StockDrugsData)
  addStockOrderDrug(StockDrugsData.value).then((res) => {
    proxy.$modal.msgSuccess("新增成功")
    Drugopen.value = false
    StockDruggetList()
  })
}

// 删除按钮操作
function DrughandleDelete(row) {
  const Ids = row.drugId || Drugids.value

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
      DruggetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function DrughandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return clearDrug()
    })
    .then(() => {
      DrughandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const DrughandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  DruggetList()
}


// 导出按钮操作
function DrughandleExport() {
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

DrughandleQuery()
function OpenDrughandleAdd() {
  if (ids.value.length == 1) {
    Drugreset();
    Drugopen.value = true
    Drugtitle.value = '添加送货信息'
    Drugopertype.value = 1
  }
  else {
    alert("请选择一个送货单")
  }
}



//发送
function DeliveryhandleAdd() {
  // StockDrugids.value
  if (ids.value.length > 0) {
    proxy
      .$confirm('是否送货' + ids.value.length + '个单？', "警告", {
        confirmButtonText: proxy.$t('common.ok'),
        cancelButtonText: proxy.$t('common.cancel'),
        type: "warning",
      })
      .then(function () {
        // 修改状态 送货单新增加语句
        stockorderdate.value.forEach(element => {
          element.Remarks = '已送货'
        });
        console.log(stockorderdate.value)
        // updateStockOrder(stockorderdate.value).then((res) => {
        //   proxy.$modal.msgSuccess("发送成功")
        //   getList()
        // })

      })
  } else {
    alert("请选择最少一个送货单")
  }

}

function AllDeliveryhandleAdd() {
  proxy
    .$confirm('是否一键送货' + ids.value.length + '个单？默认药品为最大数量', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
}


//双击更新数据
function StockDrugdatalist(row) {
  console.log("双击行数据", row)
  StockDrugqueryParams.stockId = row.id
  StockDruggetList()
}

function DrugQuantityChange(row) {
  // console.log(row)
  //进行修改操作进行保存
  // PlanDrugsform.value = row
  // if (PlanDrugsform.value.id != undefined) {
  //   updateInventoryPlanDrugs(PlanDrugsform.value).then((res) => {
  //     proxy.$modal.msgSuccess("修改成功")
  //     PlanDrugsopen.value = false
  //     PlanDrugsgetList()
  //   })
  // }
}




import {
  listInventoryPlanDrugs,
  addInventoryPlanDrugs, delInventoryPlanDrugs,
  updateInventoryPlanDrugs, getInventoryPlanDrugs,
  clearInventoryPlanDrugs,
}
  from '@/api/business/inventoryplandrugs.js'
// import InventoryPlanDrugs from './InventoryPlanDrugs.vue';
// import { fi } from 'element-plus/es/locale';
// import importData from '@/components/ImportData'
// const { proxy } = getCurrentInstance()
const PlanDrugsids = ref([])
const PlanDrugsloading = ref(false)
const PlanDrugsshowSearch = ref(true)
const PlanDrugsqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  planId: undefined,
  drugId: undefined,
})
const PlanDrugscolumns = ref([
  { visible: false, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'planId', label: '送货计划id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugDetails', label: '药品信息', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugQuantity', label: '数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'remarks', label: '备注', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const PlanDrugstotal = ref(0)
const PlanDrugsdataList = ref([])
const PlanDrugsqueryRef = ref()
const PlanDrugsdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var PlanDrugsdictParams = [
]


function PlanDrugsgetList() {
  PlanDrugsloading.value = true
  listInventoryPlanDrugs(PlanDrugsqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      PlanDrugsdataList.value = data.result
      PlanDrugstotal.value = data.totalNum
      PlanDrugsloading.value = false
    }
  })
}

// 查询
function PlanDrugshandleQuery() {
  PlanDrugsqueryParams.pageNum = 1
  PlanDrugsgetList()
}

// 重置查询操作
function PlanDrugsresetQuery() {
  proxy.resetForm("queryRef")
  PlanDrugshandleQuery()
}
const AllStockDrugsData = ref([])

// 多选框选中数据
function PlanDrugshandleSelectionChange(selection) {
  PlanDrugsids.value = selection.map((item) => item.id);
  PlanDrugssingle.value = selection.length != 1
  PlanDrugsmultiple.value = !selection.length;
  AllStockDrugsData.value = selection.map((item, index) => {
    return {
      StockId: ids.value[0],
      DrugId: item.drugId,
      DrugDetails: item.drugDetails,
      DrugQuantity: item.drugQuantity,
      Remarks: item.remarks
    };
  })
}
// 自定义排序
function PlanDrugssortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  PlanDrugsqueryParams.sort = sort
  PlanDrugsqueryParams.sortType = sortType
  PlanDrugshandleQuery()
}

/*************** form操作 ***************/
const PlanDrugsformRef = ref()
const PlanDrugstitle = ref('')
// 操作类型 1、add 2、edit 3、view
const PlanDrugsopertype = ref(0)
const PlanDrugsopen = ref(false)
const PlanDrugsstate = reactive({
  PlanDrugssingle: true,
  PlanDrugsmultiple: true,
  PlanDrugsform: {},
  PlanDrugsrules: {
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
  },
  PlanDrugsoptions: {
  }
})

const { PlanDrugsform, PlanDrugsrules, PlanDrugsoptions, PlanDrugssingle, PlanDrugsmultiple } = toRefs(PlanDrugsstate)

// 关闭dialog
function PlanDrugscancel() {
  PlanDrugsopen.value = false
  PlanDrugsreset()
}

// 重置表单
function PlanDrugsreset() {
  PlanDrugsform.value = {
    id: null,
    planId: null,
    drugId: null,
    drugDetails: null,
    drugQuantity: null,
    remarks: null,
  };
  proxy.resetForm("PlanDrugsformRef")
}

/**
 * 查看
 * @param {*} row
 */
function PlanDrugshandlePreview(row) {
  PlanDrugsreset()
  const id = row.id
  getInventoryPlanDrugs(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      PlanDrugsopen.value = true
      PlanDrugstitle.value = '查看'
      PlanDrugsopertype.value = 3
      PlanDrugsform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function PlanDrugshandleAdd() {
  PlanDrugsreset();
  PlanDrugsopen.value = true
  PlanDrugstitle.value = '添加送货计划药品'
  PlanDrugsopertype.value = 1
}
// 修改按钮操作
function PlanDrugshandleUpdate(row) {
  PlanDrugsreset()
  const id = row.id || PlanDrugsids.value
  getInventoryPlanDrugs(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      PlanDrugsopen.value = true
      PlanDrugstitle.value = '修改送货计划药品'
      PlanDrugsopertype.value = 2

      PlanDrugsform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function PlanDrugssubmitForm() {
  proxy.$refs["PlanDrugsformRef"].validate((valid) => {
    if (valid) {

      if (PlanDrugsform.value.id != undefined && PlanDrugsopertype.value === 2) {
        updateInventoryPlanDrugs(PlanDrugsform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          PlanDrugsopen.value = false
          PlanDrugsgetList()
        })
      } else {
        addInventoryPlanDrugs(PlanDrugsform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          PlanDrugsopen.value = false
          PlanDrugsgetList()
        })
      }
    }
  })
}

// 删除按钮操作
function PlanDrugshandleDelete(row) {
  const Ids = row.id || PlanDrugsids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delInventoryPlanDrugs(Ids)
    })
    .then(() => {
      PlanDrugsgetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function PlanDrugshandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return clearInventoryPlanDrugs()
    })
    .then(() => {
      PlanDrugshandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const PlanDrugshandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  PlanDrugsgetList()
}

// 导出按钮操作
function PlanDrugshandleExport() {
  proxy
    .$confirm("是否确认导出送货计划药品数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/InventoryPlanDrugs/export', { ...PlanDrugsqueryParams })
    })
}

function PlanDrugshandleDrugQuantityChange(row) {
  // console.log(row)
  //进行修改操作进行保存
  PlanDrugsform.value = row
  if (PlanDrugsform.value.id != undefined) {
    updateInventoryPlanDrugs(PlanDrugsform.value).then((res) => {
      proxy.$modal.msgSuccess("修改成功")
      PlanDrugsopen.value = false
      PlanDrugsgetList()
    })
  }

}

//审核
function ToExaminehandleAdd() {
  if (ids.value.length > 0) {
    proxy
      .$confirm('是否审核' + ids.value.length + '个送货计划？', "警告", {
        confirmButtonText: proxy.$t('common.ok'),
        cancelButtonText: proxy.$t('common.cancel'),
        type: "warning",
      })
      .then(function () {
        plandata.value.forEach(element => {
          element.States = '已审核'
        });
        console.log(plandata.value)
        updateInventoryPlan(plandata.value).then((res) => {
          proxy.$modal.msgSuccess("审核成功")
          // PlanDrugsopen.value = false
          getList()
        })
      })
  } else {
    alert("请选择最少一个送货计划")
  }


}
//发送
function SendOuthandleAdd() {
  if (ids.value.length > 0) {
    proxy
      .$confirm('是否发送' + ids.value.length + '个送货计划？', "警告", {
        confirmButtonText: proxy.$t('common.ok'),
        cancelButtonText: proxy.$t('common.cancel'),
        type: "warning",
      })
      .then(function () {
        // 修改状态 并且执行送货单新增加语句
        plandata.value.forEach(element => {
          element.States = '已发送'
        });
        console.log(plandata.value)
        updateInventoryPlan(plandata.value).then((res) => {
          proxy.$modal.msgSuccess("发送成功")
          getList()
        })

      })
  } else {
    alert("请选择最少一个送货计划")
  }

}

PlanDrugshandleQuery()


function StockDrugshandleAdd() {
  if (ids.value.length == 1) {
    if (PlanDrugsids.value.length > 0) {
      proxy
        .$confirm('是否加入' + PlanDrugsids.value.length + '个药品送货？', "警告", {
          confirmButtonText: proxy.$t('common.ok'),
          cancelButtonText: proxy.$t('common.cancel'),
          type: "warning",
        })
        .then(function () {
          // console.log(AllStockDrugsData.value)
          addStockOrderDrug(AllStockDrugsData.value).then((res) => {
            proxy.$modal.msgSuccess("发送成功")
            // Drugopen.value = false
            // StockDruggetList()
          })
        })
      //新增语句 至药品表 同时调用存储过程 添加到送货单
    }
    else {
      alert("请选择送货药品")
    }
  }
  else {
    alert("请选择一个送货单")
  }
}

import {
  listWarehouseReceipt,
  addWarehouseReceipt, delWarehouseReceipt, drugAdd,
  updateWarehouseReceipt, getWarehouseReceipt,
}
  from '@/api/business/warehousereceipt.js'

const receiptData = {};
const dateRange = new Date().toLocaleString()

import useUserStore from "@/store/modules/user";
// import { id } from 'element-plus/es/locale';

var userId = useUserStore().userId;
var userInfo = useUserStore().userInfo;
//{"userId":1,"userName":"admin","nickName":"管理员","userType":"0","avatar":"","email":"","phonenumber":"","sex":0,"status":0,"delFlag":0,"loginIP":"127.0.0.1","loginDate":"2023-07-25 16:58:43","deptId":0,"deptName":null,"roleIds":[1],"postIds":null,"roles":[{"roleId":1,"roleName":"超级管理员","roleKey":"admin","roleSort":1,"status":0,"delFlag":0,"dataScope":1,"menuCheckStrictly":true,"deptCheckStrictly":false,"menuIds":null,"deptIds":null,"userNum":0,"createBy":"admin","createTime":"2023-07-12 18:19:06","updateTime":null,"remark":"超级管理员"}],"welcomeMessage":"早上好","welcomeContent":"忙碌了一周，停一停脚步！","createBy":"","createTime":"2023-07-26 09:59:39","updateTime":null,"remark":"管理员"}

// 昵称
var nickName = useUserStore().name;
function addReceipt() {

  if (ids.value.length == 1) {
    // receiptData.ReceiptCode = ""
    // receiptData.StorageTime = dateRange
    // receiptData.CreationTime = dateRange
    // receiptData.Creator = nickName
    // receiptData.ChangeTime = dateRange
    // receiptData.ModifiedBy = nickName
    // receiptData.State = "未推送"
    receiptData.value = {
      state: "未推送",
      receiptId: 0,
      receiptCode: "",
      storageTime: dateRange,
      creationTime: dateRange,
      creator: nickName,
      changeTime: dateRange,
      modifiedBy: nickName,
    };
    console.log(receiptData.value)
    addWarehouseReceipt(receiptData.value).then((res) => {
      proxy.$modal.msgSuccess("发送成功")
      addInwarehousingDrug()
    })
    //新增语句 至药品表 同时调用存储过程 添加到送货单
  } else {
    alert("请选择一个送货单")
  }

}
//药品
function addInwarehousingDrug() {
  if (ids.value.length == 1) {
    drugAdd(ids.value[0]).then((res) => {
      proxy.$modal.msgSuccess("发送成功")
    })
  }
}
</script>

<style scoped>
.table-content {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.table-item1 {
  width: 20%;
  flex: 1;
}

.table-item2 {
  width: 70%;
  flex: 1;
}

.tb3 {
  margin-top: 42px;
}
</style>