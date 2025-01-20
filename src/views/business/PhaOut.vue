<!--
 * @Descripttion: (出库记录/PhaOut)
 * @Author: (admin)
 * @Date: (2024-11-27)
-->
<template>
  <div>
    <el-form :model="PhaOutqueryParams" label-position="right" inline ref="PhaOutqueryRef" v-show="PhaOutshowSearch"
      @submit.prevent>
      <el-form-item label="出库科室编码" prop="drugDeptCode">
        <el-input v-model="PhaOutqueryParams.drugDeptCode" placeholder="请输入出库科室编码" />
      </el-form-item>
      <el-form-item label="出库单流水号" prop="outBillCode">
        <el-input v-model.number="PhaOutqueryParams.outBillCode" placeholder="请输入出库单流水号" />
      </el-form-item>
      <el-form-item label="序号" prop="serialCode">
        <el-input v-model.number="PhaOutqueryParams.serialCode" placeholder="请输入序号" />
      </el-form-item>
      <el-form-item label="批次号" prop="groupCode">
        <el-input v-model="PhaOutqueryParams.groupCode" placeholder="请输入批次号" />
      </el-form-item>
      <el-form-item label="出库单据号" prop="outListCode">
        <el-input v-model="PhaOutqueryParams.outListCode" placeholder="请输入出库单据号" />
      </el-form-item>
      <el-form-item label="出库类型" prop="outType">
        <el-select clearable v-model="PhaOutqueryParams.outType" placeholder="请选择出库类型">
          <el-option v-for="item in PhaOutoptions.outTypePhaOutoptions" :key="item.dictValue" :label="item.dictLabel"
            :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
            <span class="fr" style="color: var(--el-text-color-secondary);">{{ item.dictValue }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出库分类" prop="class3MeaningCode">
        <el-input v-model="PhaOutqueryParams.class3MeaningCode" placeholder="请输入出库分类" />
      </el-form-item>
      <el-form-item label="入库单号" prop="inBillCode">
        <el-input v-model.number="PhaOutqueryParams.inBillCode" placeholder="请输入入库单号" />
      </el-form-item>
      <el-form-item label="入库单序号" prop="inSerialCode">
        <el-input v-model.number="PhaOutqueryParams.inSerialCode" placeholder="请输入入库单序号" />
      </el-form-item>
      <el-form-item label="入库单据号" prop="inListCode">
        <el-input v-model="PhaOutqueryParams.inListCode" placeholder="请输入入库单据号" />
      </el-form-item>
      <el-form-item label="药品编码" prop="drugCode">
        <el-input v-model="PhaOutqueryParams.drugCode" placeholder="请输入药品编码" />
      </el-form-item>
      <el-form-item label="药品商品名" prop="tradeName">
        <el-input v-model="PhaOutqueryParams.tradeName" placeholder="请输入药品商品名" />
      </el-form-item>
      <el-form-item label="药品类别" prop="drugType">
        <el-select clearable v-model="PhaOutqueryParams.drugType" placeholder="请选择药品类别">
          <el-option v-for="item in PhaOutoptions.drugTypePhaOutoptions" :key="item.dictValue" :label="item.dictLabel"
            :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
            <span class="fr" style="color: var(--el-text-color-secondary);">{{ item.dictValue }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生产厂家" prop="producerCode">
        <el-input v-model="PhaOutqueryParams.producerCode" placeholder="请输入生产厂家" />
      </el-form-item>
      <el-form-item label="供货单位代码" prop="companyCode">
        <el-input v-model="PhaOutqueryParams.companyCode" placeholder="请输入供货单位代码" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="PhaOuthandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="PhaOutresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['phaout:add']" plain icon="plus" @click="PhaOutTongBu">
          同步
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['phaout:add']" plain icon="plus" @click="PhaOuthandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="PhaOutsingle" v-hasPermi="['phaout:edit']" plain icon="edit"
          @click="PhaOuthandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="PhaOutmultiple" v-hasPermi="['phaout:delete']" plain icon="delete"
          @click="PhaOuthandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['phaout:delete']" plain icon="delete" @click="PhaOuthandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['phaout:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/PhaOut/importTemplate" importUrl="/business/PhaOut/importData"
                  @success="PhaOuthandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
</el-dropdown>
</el-col>
<el-col :span="1.5">
  <el-button type="warning" plain icon="download" @click="PhaOuthandleExport" v-hasPermi="['phaout:export']">
    {{ $t('btn.export') }}
  </el-button>
</el-col> -->
      <right-toolbar v-model:showSearch="PhaOutshowSearch" @queryTable="PhaOutgetList"
        :columns="PhaOutcolumns"></right-toolbar>
    </el-row>

    <el-table :data="PhaOutdataList" v-loading="PhaOutloading" ref="PhaOuttable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="PhaOutsortChange"
      @selection-change="PhaOuthandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="drugDeptCode" label="出库科室编码" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('drugDeptCode')" />
      <el-table-column prop="outBillCode" label="出库单流水号" align="center"
        v-if="PhaOutcolumns.showColumn('outBillCode')" />
      <el-table-column prop="serialCode" label="序号" align="center" v-if="PhaOutcolumns.showColumn('serialCode')" />
      <el-table-column prop="groupCode" label="批次号" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('groupCode')" />
      <el-table-column prop="outListCode" label="出库单据号" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('outListCode')" />
      <el-table-column prop="outType" label="出库类型" align="center" v-if="PhaOutcolumns.showColumn('outType')">
        <template #default="scope">
          <dict-tag :options="PhaOutoptions.outTypePhaOutoptions" :value="scope.row.outType" />
        </template>
      </el-table-column>
      <el-table-column prop="class3MeaningCode" label="出库分类" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('class3MeaningCode')">
        <template #default="scope">
          <dict-tag :options="PhaOutoptions.outTypePhaOutoptions" :value="scope.row.outType" />
        </template>
      </el-table-column>
      <el-table-column prop="inBillCode" label="入库单号" align="center" v-if="PhaOutcolumns.showColumn('inBillCode')" />
      <el-table-column prop="inSerialCode" label="入库单序号" align="center"
        v-if="PhaOutcolumns.showColumn('inSerialCode')" />
      <el-table-column prop="inListCode" label="入库单据号" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('inListCode')" />
      <el-table-column prop="drugCode" label="药品编码" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('drugCode')" />
      <el-table-column prop="tradeName" label="药品商品名" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('tradeName')" />
      <el-table-column prop="drugType" label="药品类别" align="center" v-if="PhaOutcolumns.showColumn('drugType')">
        <!-- <template #default="scope">
          <dict-tag :options="PhaOutoptions.drugTypePhaOutoptions" :value="scope.row.drugType" />
        </template> -->
      </el-table-column>
      <el-table-column prop="drugQuality" label="药品性质" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('drugQuality')" />
      <el-table-column prop="specs" label="规格" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('specs')" />
      <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('packUnit')" />
      <el-table-column prop="packQty" label="包装数" align="center" v-if="PhaOutcolumns.showColumn('packQty')" />
      <el-table-column prop="minUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('minUnit')" />
      <el-table-column prop="showFlag" label="显示的单位标记" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('showFlag')" />
      <el-table-column prop="showUnit" label="显示的单位" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('showUnit')" />
      <el-table-column prop="batchNo" label="批号" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('batchNo')" />
      <el-table-column prop="validDate" label="有效期" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('validDate')" />
      <el-table-column prop="producerCode" label="生产厂家" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('producerCode')" />
      <el-table-column prop="companyCode" label="供货单位代码" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('companyCode')" />
      <el-table-column prop="retailPrice" label="零售价" align="center" v-if="PhaOutcolumns.showColumn('retailPrice')" />
      <el-table-column prop="wholesalePrice" label="批发价" align="center"
        v-if="PhaOutcolumns.showColumn('wholesalePrice')" />
      <el-table-column prop="purchasePrice" label="购入价" align="center"
        v-if="PhaOutcolumns.showColumn('purchasePrice')" />
      <el-table-column prop="outNum" label="出库数量" align="center" v-if="PhaOutcolumns.showColumn('outNum')" />
      <el-table-column prop="saleCost" label="零售金额" align="center" v-if="PhaOutcolumns.showColumn('saleCost')" />
      <el-table-column prop="tradeCost" label="批发金额" align="center" v-if="PhaOutcolumns.showColumn('tradeCost')" />
      <el-table-column prop="approveCost" label="购入金额" align="center" v-if="PhaOutcolumns.showColumn('approveCost')" />
      <el-table-column prop="storeNum" label="出库后库存数量" align="center" v-if="PhaOutcolumns.showColumn('storeNum')" />
      <el-table-column prop="storeCost" label="出库后库存总金额" align="center" v-if="PhaOutcolumns.showColumn('storeCost')" />
      <el-table-column prop="specialFlag" label="特殊标记" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('specialFlag')" />
      <el-table-column prop="outState" label="出库状态" align="center" v-if="PhaOutcolumns.showColumn('outState')">
        <template #default="scope">
          <dict-tag :options="PhaOutoptions.outStatePhaOutoptions" :value="scope.row.outState" />
        </template>
      </el-table-column>
      <el-table-column prop="applyNum" label="申请出库量" align="center" v-if="PhaOutcolumns.showColumn('applyNum')" />
      <el-table-column prop="applyOpercode" label="申请出库人" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('applyOpercode')" />
      <el-table-column prop="applyDate" label="申请出库日期" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('applyDate')" />
      <el-table-column prop="examNum" label="审批数量" align="center" v-if="PhaOutcolumns.showColumn('examNum')" />
      <el-table-column prop="examOpercode" label="审批人" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('examOpercode')" />
      <el-table-column prop="examDate" label="审批日期" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('examDate')" />
      <el-table-column prop="approveOpercode" label="核准人" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('approveOpercode')" />
      <el-table-column prop="approveDate" label="核准日期" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('approveDate')" />
      <el-table-column prop="placeCode" label="货位号" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('placeCode')" />
      <el-table-column prop="returnNum" label="退库数量" align="center" v-if="PhaOutcolumns.showColumn('returnNum')" />
      <el-table-column prop="drugedBill" label="摆药单号" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('drugedBill')" />
      <el-table-column prop="medId" label="制剂序号" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('medId')" />
      <el-table-column prop="drugStorageCode" label="领药单位编码" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('drugStorageCode')" />
      <el-table-column prop="recipeNo" label="处方号" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('recipeNo')" />
      <el-table-column prop="sequenceNo" label="处方流水号" align="center" v-if="PhaOutcolumns.showColumn('sequenceNo')" />
      <el-table-column prop="signPerson" label="签字人" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('signPerson')" />
      <el-table-column prop="getPerson" label="领药人" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('getPerson')" />
      <el-table-column prop="strikeFlag" label="冲账标志" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('strikeFlag')" />
      <el-table-column prop="mark" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('mark')" />
      <el-table-column prop="operCode" label="操作员" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('operCode')" />
      <el-table-column prop="operDate" label="操作日期" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('operDate')" />
      <el-table-column prop="arkFlag" label="是否药房向药柜出库记录" align="center" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('arkFlag')" />
      <el-table-column prop="arkBillCode" label="药柜发药出库单流水号" align="center"
        v-if="PhaOutcolumns.showColumn('arkBillCode')" />
      <el-table-column prop="outDate" label="出库记录发生时间" :show-overflow-tooltip="true"
        v-if="PhaOutcolumns.showColumn('outDate')" />
      <el-table-column prop="applyNumber" label="申请单流水号" align="center"
        v-if="PhaOutcolumns.showColumn('applyNumber')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情"
            @click="PhaOuthandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['phaout:edit']"
            @click="PhaOuthandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['phaout:delete']"
            @click="PhaOuthandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="PhaOuttotal" v-model:page="PhaOutqueryParams.pageNum" v-model:limit="PhaOutqueryParams.pageSize"
      @pagination="PhaOutgetList" />


    <el-dialog :title="PhaOuttitle" :lock-scroll="false" v-model="PhaOutopen">
      <el-form ref="PhaOutformRef" :model="PhaOutform" :rules="PhaOutrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="出库科室编码" prop="drugDeptCode">
              <el-input v-model="PhaOutform.drugDeptCode" placeholder="请输入出库科室编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库单流水号" prop="outBillCode">
              <el-input v-model.number="PhaOutform.outBillCode" placeholder="请输入出库单流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="序号" prop="serialCode">
              <el-input v-model.number="PhaOutform.serialCode" placeholder="请输入序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批次号" prop="groupCode">
              <el-input v-model="PhaOutform.groupCode" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库单据号" prop="outListCode">
              <el-input v-model="PhaOutform.outListCode" placeholder="请输入出库单据号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库类型" prop="outType">
              <el-select v-model="PhaOutform.outType" placeholder="请选择出库类型">
                <el-option v-for="item in PhaOutoptions.outTypePhaOutoptions" :key="item.dictValue"
                  :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库分类" prop="class3MeaningCode">
              <el-input v-model="PhaOutform.class3MeaningCode" placeholder="请输入出库分类" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库单号" prop="inBillCode">
              <el-input v-model.number="PhaOutform.inBillCode" placeholder="请输入入库单号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库单序号" prop="inSerialCode">
              <el-input v-model.number="PhaOutform.inSerialCode" placeholder="请输入入库单序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库单据号" prop="inListCode">
              <el-input v-model="PhaOutform.inListCode" placeholder="请输入入库单据号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品编码" prop="drugCode">
              <el-input v-model="PhaOutform.drugCode" placeholder="请输入药品编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品商品名" prop="tradeName">
              <el-input v-model="PhaOutform.tradeName" placeholder="请输入药品商品名" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品类别" prop="drugType">
              <el-select v-model="PhaOutform.drugType" placeholder="请选择药品类别">
                <el-option v-for="item in PhaOutoptions.drugTypePhaOutoptions" :key="item.dictValue"
                  :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品性质" prop="drugQuality">
              <el-input v-model="PhaOutform.drugQuality" placeholder="请输入药品性质" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="规格" prop="specs">
              <el-input v-model="PhaOutform.specs" placeholder="请输入规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装单位" prop="packUnit">
              <el-input v-model="PhaOutform.packUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装数" prop="packQty">
              <el-input v-model.number="PhaOutform.packQty" placeholder="请输入包装数" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最小单位" prop="minUnit">
              <el-input v-model="PhaOutform.minUnit" placeholder="请输入最小单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="显示的单位标记" prop="showFlag">
              <el-input v-model="PhaOutform.showFlag" placeholder="请输入显示的单位标记" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="显示的单位" prop="showUnit">
              <el-input v-model="PhaOutform.showUnit" placeholder="请输入显示的单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批号" prop="batchNo">
              <el-input v-model="PhaOutform.batchNo" placeholder="请输入批号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="有效期" prop="validDate">
              <el-date-picker v-model="PhaOutform.validDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产厂家" prop="producerCode">
              <el-input v-model="PhaOutform.producerCode" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="供货单位代码" prop="companyCode">
              <el-input v-model="PhaOutform.companyCode" placeholder="请输入供货单位代码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="零售价" prop="retailPrice">
              <el-input v-model="PhaOutform.retailPrice" placeholder="请输入零售价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批发价" prop="wholesalePrice">
              <el-input v-model="PhaOutform.wholesalePrice" placeholder="请输入批发价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="购入价" prop="purchasePrice">
              <el-input v-model="PhaOutform.purchasePrice" placeholder="请输入购入价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库数量" prop="outNum">
              <el-input v-model="PhaOutform.outNum" placeholder="请输入出库数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="零售金额" prop="saleCost">
              <el-input v-model="PhaOutform.saleCost" placeholder="请输入零售金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批发金额" prop="tradeCost">
              <el-input v-model="PhaOutform.tradeCost" placeholder="请输入批发金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="购入金额" prop="approveCost">
              <el-input v-model="PhaOutform.approveCost" placeholder="请输入购入金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库后库存数量" prop="storeNum">
              <el-input v-model="PhaOutform.storeNum" placeholder="请输入出库后库存数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库后库存总金额" prop="storeCost">
              <el-input v-model="PhaOutform.storeCost" placeholder="请输入出库后库存总金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="特殊标记" prop="specialFlag">
              <el-input v-model="PhaOutform.specialFlag" placeholder="请输入特殊标记" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库状态" prop="outState">
              <el-radio-group v-model="PhaOutform.outState">
                <el-radio v-for="item in PhaOutoptions.outStatePhaOutoptions" :key="item.dictValue"
                  :value="item.dictValue">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请出库量" prop="applyNum">
              <el-input v-model="PhaOutform.applyNum" placeholder="请输入申请出库量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请出库人" prop="applyOpercode">
              <el-input v-model="PhaOutform.applyOpercode" placeholder="请输入申请出库人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请出库日期" prop="applyDate">
              <el-date-picker v-model="PhaOutform.applyDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="审批数量" prop="examNum">
              <el-input v-model="PhaOutform.examNum" placeholder="请输入审批数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="审批人" prop="examOpercode">
              <el-input v-model="PhaOutform.examOpercode" placeholder="请输入审批人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="审批日期" prop="examDate">
              <el-date-picker v-model="PhaOutform.examDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="核准人" prop="approveOpercode">
              <el-input v-model="PhaOutform.approveOpercode" placeholder="请输入核准人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="核准日期" prop="approveDate">
              <el-date-picker v-model="PhaOutform.approveDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="货位号" prop="placeCode">
              <el-input v-model="PhaOutform.placeCode" placeholder="请输入货位号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="退库数量" prop="returnNum">
              <el-input v-model="PhaOutform.returnNum" placeholder="请输入退库数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="摆药单号" prop="drugedBill">
              <el-input v-model="PhaOutform.drugedBill" placeholder="请输入摆药单号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="制剂序号" prop="medId">
              <el-input v-model="PhaOutform.medId" placeholder="请输入制剂序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="领药单位编码" prop="drugStorageCode">
              <el-input v-model="PhaOutform.drugStorageCode" placeholder="请输入领药单位编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="处方号" prop="recipeNo">
              <el-input v-model="PhaOutform.recipeNo" placeholder="请输入处方号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="处方流水号" prop="sequenceNo">
              <el-input v-model.number="PhaOutform.sequenceNo" placeholder="请输入处方流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="签字人" prop="signPerson">
              <el-input v-model="PhaOutform.signPerson" placeholder="请输入签字人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="领药人" prop="getPerson">
              <el-input v-model="PhaOutform.getPerson" placeholder="请输入领药人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="冲账标志" prop="strikeFlag">
              <el-input v-model="PhaOutform.strikeFlag" placeholder="请输入冲账标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="mark">
              <el-input v-model="PhaOutform.mark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="操作员" prop="operCode">
              <el-input v-model="PhaOutform.operCode" placeholder="请输入操作员" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="操作日期" prop="operDate">
              <el-date-picker v-model="PhaOutform.operDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="是否药房向药柜出库记录" prop="arkFlag">
              <el-input v-model="PhaOutform.arkFlag" placeholder="请输入是否药房向药柜出库记录" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药柜发药出库单流水号" prop="arkBillCode">
              <el-input v-model.number="PhaOutform.arkBillCode" placeholder="请输入药柜发药出库单流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库记录发生时间" prop="outDate">
              <el-date-picker v-model="PhaOutform.outDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请单流水号" prop="applyNumber">
              <el-input v-model.number="PhaOutform.applyNumber" placeholder="请输入申请单流水号" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="PhaOutopertype != 3">
        <el-button text @click="PhaOutcancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="PhaOutsubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="phaout">
//#region 出库
import {
  listPhaOut,
  addPhaOut, delPhaOut,
  updatePhaOut, getPhaOut,
  clearPhaOut, TongBu,
}
  from '@/api/business/phaout.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const PhaOutids = ref([])
const PhaOutloading = ref(false)
const PhaOutshowSearch = ref(true)
const PhaOutqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  drugDeptCode: undefined,
  outBillCode: undefined,
  serialCode: undefined,
  groupCode: undefined,
  outListCode: undefined,
  outType: undefined,
  class3MeaningCode: undefined,
  inBillCode: undefined,
  inSerialCode: undefined,
  inListCode: undefined,
  drugCode: undefined,
  tradeName: undefined,
  drugType: undefined,
  producerCode: undefined,
  companyCode: undefined,
})
const PhaOutcolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'drugDeptCode', label: '出库科室编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'outBillCode', label: '出库单流水号' },
  { visible: true, align: 'center', type: '', prop: 'serialCode', label: '序号' },
  { visible: true, align: 'center', type: '', prop: 'groupCode', label: '批次号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'outListCode', label: '出库单据号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'outType', label: '出库类型', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'class3MeaningCode', label: '出库分类', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'inBillCode', label: '入库单号' },
  { visible: false, align: 'center', type: '', prop: 'inSerialCode', label: '入库单序号' },
  { visible: false, align: 'center', type: '', prop: 'inListCode', label: '入库单据号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'drugCode', label: '药品编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'tradeName', label: '药品商品名', showOverflowTooltip: true },
  { visible: false, align: 'center', type: 'dict', prop: 'drugType', label: '药品类别', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'drugQuality', label: '药品性质', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'specs', label: '规格', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packUnit', label: '包装单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packQty', label: '包装数' },
  { visible: false, align: 'center', type: '', prop: 'minUnit', label: '最小单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'showFlag', label: '显示的单位标记', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'showUnit', label: '显示的单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'batchNo', label: '批号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'validDate', label: '有效期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'producerCode', label: '生产厂家', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'companyCode', label: '供货单位代码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'retailPrice', label: '零售价' },
  { visible: false, align: 'center', type: '', prop: 'wholesalePrice', label: '批发价' },
  { visible: false, align: 'center', type: '', prop: 'purchasePrice', label: '购入价' },
  { visible: false, align: 'center', type: '', prop: 'outNum', label: '出库数量' },
  { visible: false, align: 'center', type: '', prop: 'saleCost', label: '零售金额' },
  { visible: false, align: 'center', type: '', prop: 'tradeCost', label: '批发金额' },
  { visible: false, align: 'center', type: '', prop: 'approveCost', label: '购入金额' },
  { visible: false, align: 'center', type: '', prop: 'storeNum', label: '出库后库存数量' },
  { visible: false, align: 'center', type: '', prop: 'storeCost', label: '出库后库存总金额' },
  { visible: false, align: 'center', type: '', prop: 'specialFlag', label: '特殊标记', showOverflowTooltip: true },
  { visible: false, align: 'center', type: 'dict', prop: 'outState', label: '出库状态', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'applyNum', label: '申请出库量' },
  { visible: false, align: 'center', type: '', prop: 'applyOpercode', label: '申请出库人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'applyDate', label: '申请出库日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'examNum', label: '审批数量' },
  { visible: false, align: 'center', type: '', prop: 'examOpercode', label: '审批人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'examDate', label: '审批日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveOpercode', label: '核准人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveDate', label: '核准日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'placeCode', label: '货位号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'returnNum', label: '退库数量' },
  { visible: false, align: 'center', type: '', prop: 'drugedBill', label: '摆药单号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'medId', label: '制剂序号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'drugStorageCode', label: '领药单位编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'recipeNo', label: '处方号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'sequenceNo', label: '处方流水号' },
  { visible: false, align: 'center', type: '', prop: 'signPerson', label: '签字人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'getPerson', label: '领药人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'strikeFlag', label: '冲账标志', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'mark', label: '备注', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'operCode', label: '操作员', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'operDate', label: '操作日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'arkFlag', label: '是否药房向药柜出库记录', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'arkBillCode', label: '药柜发药出库单流水号' },
  { visible: false, align: 'center', type: '', prop: 'outDate', label: '出库记录发生时间', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'applyNumber', label: '申请单流水号' },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const PhaOuttotal = ref(0)
const PhaOutdataList = ref([])
const PhaOutqueryRef = ref()
const PhaOutdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var PhaOutdictParams = [
]


function PhaOutgetList() {
  PhaOutloading.value = true
  listPhaOut(PhaOutqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      PhaOutdataList.value = data.result
      PhaOuttotal.value = data.totalNum
      PhaOutloading.value = false
    }
  })
}

// 查询
function PhaOuthandleQuery() {
  PhaOutqueryParams.pageNum = 1
  PhaOutgetList()
}

// 重置查询操作
function PhaOutresetQuery() {
  proxy.resetForm("PhaOutqueryRef")
  PhaOuthandleQuery()
}
// 多选框选中数据
function PhaOuthandleSelectionChange(selection) {
  PhaOutids.value = selection.map((item) => item.id);
  PhaOutsingle.value = selection.length != 1
  PhaOutmultiple.value = !selection.length;
}
// 自定义排序
function PhaOutsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  PhaOutqueryParams.sort = sort
  PhaOutqueryParams.sortType = sortType
  PhaOuthandleQuery()
}

/*************** form操作 ***************/
const PhaOutformRef = ref()
const PhaOuttitle = ref('')
// 操作类型 1、add 2、edit 3、view
const PhaOutopertype = ref(0)
const PhaOutopen = ref(false)
const PhaOutstate = reactive({
  PhaOutsingle: true,
  PhaOutmultiple: true,
  PhaOutform: {},
  PhaOutrules: {
  },
  PhaOutoptions: {
    // 出库类型 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    outTypePhaOutoptions: [{ dictValue: "1", dictLabel: '一般出库' },
    { dictValue: "20", dictLabel: '科室借药' },
    { dictValue: "26", dictLabel: '特殊出库' },
    { dictValue: 'G1', dictLabel: '个人借药' },
    { dictValue: 'K3', dictLabel: '出库退药' },
    { dictValue: "2", dictLabel: '出库审批' },
    { dictValue: "27", dictLabel: '科室还药' },
    { dictValue: 'G2', dictLabel: '个人还药' },
    { dictValue: "4", dictLabel: '报损' },
    { dictValue: "11", dictLabel: '特别出库' },
    { dictValue: "12", dictLabel: '门诊摆药' },
    { dictValue: 'M1', dictLabel: '门诊摆药' },
    { dictValue: 'M2', dictLabel: '门诊咨询' },
    { dictValue: 'Z1', dictLabel: '住院摆药' },
    { dictValue: 'Z2', dictLabel: '住院还药' },
    { dictValue: "21", dictLabel: '一般出库' }, // 新增
    { dictValue: "22", dictLabel: '出库退货' }, // 新增
    { dictValue: '25', dictLabel: '出库审批' }, // 新增
    { dictValue: '33', dictLabel: '特别出库' }, // 新增
    ],

  }
})

const { PhaOutform, PhaOutrules, PhaOutoptions, PhaOutsingle, PhaOutmultiple } = toRefs(PhaOutstate)

// 关闭dialog
function PhaOutcancel() {
  PhaOutopen.value = false
  PhaOutreset()
}

// 重置表单
function PhaOutreset() {
  PhaOutform.value = {
    drugDeptCode: null,
    outBillCode: null,
    serialCode: null,
    groupCode: null,
    outListCode: null,
    outType: null,
    class3MeaningCode: null,
    inBillCode: null,
    inSerialCode: null,
    inListCode: null,
    drugCode: null,
    tradeName: null,
    drugType: null,
    drugQuality: null,
    specs: null,
    packUnit: null,
    packQty: null,
    minUnit: null,
    showFlag: null,
    showUnit: null,
    batchNo: null,
    validDate: null,
    producerCode: null,
    companyCode: null,
    retailPrice: null,
    wholesalePrice: null,
    purchasePrice: null,
    outNum: null,
    saleCost: null,
    tradeCost: null,
    approveCost: null,
    storeNum: null,
    storeCost: null,
    specialFlag: null,
    outState: null,
    applyNum: null,
    applyOpercode: null,
    applyDate: null,
    examNum: null,
    examOpercode: null,
    examDate: null,
    approveOpercode: null,
    approveDate: null,
    placeCode: null,
    returnNum: null,
    drugedBill: null,
    medId: null,
    drugStorageCode: null,
    recipeNo: null,
    sequenceNo: null,
    signPerson: null,
    getPerson: null,
    strikeFlag: null,
    mark: null,
    operCode: null,
    operDate: null,
    arkFlag: null,
    arkBillCode: null,
    outDate: null,
    applyNumber: null,
  };
  proxy.resetForm("PhaOutformRef")
}

/**
 * 查看
 * @param {*} row
 */
function PhaOuthandlePreview(row) {
  PhaOutreset()
  const id = row.id
  getPhaOut(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      PhaOutopen.value = true
      PhaOuttitle.value = '查看'
      PhaOutopertype.value = 3
      PhaOutform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function PhaOuthandleAdd() {
  PhaOutreset();
  PhaOutopen.value = true
  PhaOuttitle.value = '添加出库记录'
  PhaOutopertype.value = 1
}
// 修改按钮操作
function PhaOuthandleUpdate(row) {
  PhaOutreset()
  const id = row.id || PhaOutids.value
  getPhaOut(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      PhaOutopen.value = true
      PhaOuttitle.value = '修改出库记录'
      PhaOutopertype.value = 2

      PhaOutform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function PhaOutsubmitForm() {
  proxy.$refs["PhaOutformRef"].validate((valid) => {
    if (valid) {

      if (PhaOutform.value.id != undefined && PhaOutopertype.value === 2) {
        updatePhaOut(PhaOutform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          PhaOutopen.value = false
          PhaOutgetList()
        })
      } else {
        addPhaOut(PhaOutform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          PhaOutopen.value = false
          PhaOutgetList()
        })
      }
    }
  })
}

// 删除按钮操作
function PhaOuthandleDelete(row) {
  const PhaOutids = row.id || PhaOutids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + PhaOutids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      PhaOutcancelButtonText: proxy.$t('common.PhaOutcancel'),
      type: "warning",
    })
    .then(function () {
      return delPhaOut(PhaOutids)
    })
    .then(() => {
      PhaOutgetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function PhaOuthandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      PhaOutcancelButtonText: proxy.$t('common.PhaOutcancel'),
      type: "warning",
    })
    .then(function () {
      return clearPhaOut()
    })
    .then(() => {
      PhaOuthandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const PhaOuthandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  PhaOutgetList()
}

// 导出按钮操作
function PhaOuthandleExport() {
  proxy
    .$confirm("是否确认导出出库记录数据项?", "警告", {
      confirmButtonText: "确定",
      PhaOutcancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/PhaOut/export', { ...PhaOutqueryParams })
    })
}

PhaOuthandleQuery()
function PhaOutTongBu() {
  proxy.$modal.loading("请稍等")
  TongBu().then((res) => {
    proxy.$modal.closeLoading()
    if (res.data == "true") {
      console.log(res)
      proxy.$modal.msgSuccess("同步成功")
      PhaOutgetList()
    } else {
      proxy.$modal.msgError("出现错误请联系开发人员")
    }
  })
}
//#endregion



</script>