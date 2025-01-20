<!--
 * @Descripttion: (采购退货/OutDrugs)
 * @Author: (admin)
 * @Date: (2024-12-30)
-->
<template>
  <div>
    <el-form :model="OutDrugsqueryParams" label-position="right" inline ref="OutDrugsqueryRef"
      v-show="OutDrugsshowSearch" @submit.prevent>
      <el-form-item label="OutorderID" prop="outorderID">
        <el-input v-model.number="OutDrugsqueryParams.outorderID" placeholder="请输入OutorderID" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="OutDrugshandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="OutDrugsresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['outdrugs:add']" plain icon="plus" @click="OutDrugshandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="OutDrugssingle" v-hasPermi="['outdrugs:edit']" plain icon="edit"
          @click="OutDrugshandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="OutDrugsmultiple" v-hasPermi="['outdrugs:delete']" plain icon="delete"
          @click="OutDrugshandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['outdrugs:delete']" plain icon="delete" @click="OutDrugshandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['outdrugs:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/OutDrugs/importTemplate" importUrl="/business/OutDrugs/importData"
                  @success="OutDrugshandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="OutDrugshandleExport" v-hasPermi="['outdrugs:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="OutDrugsshowSearch" @queryTable="OutDrugsgetList"
        :columns="OutDrugscolumns"></right-toolbar>
    </el-row>

    <el-table :data="OutDrugsdataList" v-OutDrugsloading="OutDrugsloading" ref="OutDrugstable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="OutDrugssortChange"
      @selection-change="OutDrugshandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="outorderID" label="OutorderID" align="center"
        v-if="OutDrugscolumns.showColumn('outorderID')" />
      <el-table-column prop="drugDeptCode" label="库存科室 0-全部部门" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('drugDeptCode')" />
      <el-table-column prop="inBillCode" label="入库单流水号" align="center"
        v-if="OutDrugscolumns.showColumn('inBillCode')" />
      <el-table-column prop="serialCode" label="序号" align="center" v-if="OutDrugscolumns.showColumn('serialCode')" />
      <el-table-column prop="groupCode" label="批次号" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('groupCode')" />
      <el-table-column prop="inListCode" label="入库单据号" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('inListCode')" />
      <el-table-column prop="inType" label="入库类型" align="center" v-if="OutDrugscolumns.showColumn('inType')">
        <template #default="scope">
          <dict-tag :options="OutDrugsoptions.inTypeOptions" :value="scope.row.inType" />
        </template>
      </el-table-column>
      <el-table-column prop="class3MeaningCode" label="入库分类" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('class3MeaningCode')" />
      <el-table-column prop="outBillCode" label="出库单号" align="center"
        v-if="OutDrugscolumns.showColumn('outBillCode')" />
      <el-table-column prop="outSerialCode" label="出库单序号" align="center"
        v-if="OutDrugscolumns.showColumn('outSerialCode')" />
      <el-table-column prop="outListCode" label="出库单据号" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('outListCode')" />
      <el-table-column prop="drugCode" label="药品编码" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('drugCode')" />
      <el-table-column prop="tradeName" label="药品商品名" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('tradeName')" />
      <el-table-column prop="drugType" label="药品类别" align="center" v-if="OutDrugscolumns.showColumn('drugType')">
        <template #default="scope">
          <dict-tag :options="OutDrugsoptions.drugTypeOptions" :value="scope.row.drugType" />
        </template>
      </el-table-column>
      <el-table-column prop="drugQuality" label="药品性质" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('drugQuality')" />
      <el-table-column prop="specs" label="规格" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('specs')" />
      <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('packUnit')" />
      <el-table-column prop="packQty" label="包装数" align="center" v-if="OutDrugscolumns.showColumn('packQty')" />
      <el-table-column prop="minUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('minUnit')" />
      <el-table-column prop="showFlag" label="显示的单位标记" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('showFlag')" />
      <el-table-column prop="showUnit" label="显示的单位" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('showUnit')" />
      <el-table-column prop="batchNo" label="批号" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('batchNo')" />
      <el-table-column prop="validDate" label="有效期" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('validDate')" />
      <el-table-column prop="producerCode" label="生产厂家" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('producerCode')" />
      <el-table-column prop="companyCode" label="供货单位代码" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('companyCode')" />
      <el-table-column prop="retailPrice" label="零售价" align="center" v-if="OutDrugscolumns.showColumn('retailPrice')" />
      <el-table-column prop="wholesalePrice" label="批发价" align="center"
        v-if="OutDrugscolumns.showColumn('wholesalePrice')" />
      <el-table-column prop="purchasePrice" label="购入价" align="center"
        v-if="OutDrugscolumns.showColumn('purchasePrice')" />
      <el-table-column prop="inNum" label="退货数量（负数）" align="center" v-if="OutDrugscolumns.showColumn('inNum')" />
      <el-table-column prop="retailCost" label="零售金额" align="center" v-if="OutDrugscolumns.showColumn('retailCost')" />
      <el-table-column prop="wholesaleCost" label="批发金额" align="center"
        v-if="OutDrugscolumns.showColumn('wholesaleCost')" />
      <el-table-column prop="purchaseCost" label="购入金额" align="center"
        v-if="OutDrugscolumns.showColumn('purchaseCost')" />
      <el-table-column prop="storeCum" label="入库后库存数量" align="center" v-if="OutDrugscolumns.showColumn('storeCum')" />
      <el-table-column prop="storeCost" label="入库后库存总金额" align="center"
        v-if="OutDrugscolumns.showColumn('storeCost')" />
      <el-table-column prop="specialFlag" label="特殊标记，1是，0否" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('specialFlag')" />
      <el-table-column prop="inState" label="入库状态，0-申请，1-审批（发票入库），2-核准" align="center"
        v-if="OutDrugscolumns.showColumn('inState')">
        <template #default="scope">
          <dict-tag :options="OutDrugsoptions.inStateOptions" :value="scope.row.inState" />
        </template>
      </el-table-column>
      <el-table-column prop="applyNum" label="申请入库量" align="center" v-if="OutDrugscolumns.showColumn('applyNum')" />
      <el-table-column prop="applyOpercode" label="申请入库操作员" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('applyOpercode')" />
      <el-table-column prop="applyDate" label="申请入库日期" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('applyDate')" />
      <el-table-column prop="examNum" label="审批数量" align="center" v-if="OutDrugscolumns.showColumn('examNum')" />
      <el-table-column prop="examOpercode" label="审批人（药库发票入库人）" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('examOpercode')" />
      <el-table-column prop="examDate" label="审批日期（药库发票入库日期）" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('examDate')" />
      <el-table-column prop="approveOpercode" label="核准人" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('approveOpercode')" />
      <el-table-column prop="approveDate" label="核准日期" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('approveDate')" />
      <el-table-column prop="placeCode" label="货位码" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('placeCode')" />
      <el-table-column prop="returnNum" label="退库数量" align="center" v-if="OutDrugscolumns.showColumn('returnNum')" />
      <el-table-column prop="applyNumber" label="申请序号" align="center"
        v-if="OutDrugscolumns.showColumn('applyNumber')" />
      <el-table-column prop="medId" label="制剂序号－生产序号或检验序号" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('medId')" />
      <el-table-column prop="invoiceNo" label="发票号" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('invoiceNo')" />
      <el-table-column prop="deliveryNo" label="送药单流水号" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('deliveryNo')" />
      <el-table-column prop="tenderNo" label="招标序号－招标单的序号" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('tenderNo')" />
      <el-table-column prop="actualRate" label="实际扣率" align="center" v-if="OutDrugscolumns.showColumn('actualRate')" />
      <el-table-column prop="cashFlag" label="现金标志" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('cashFlag')" />
      <el-table-column prop="payState" label="供货商结存付款状态 0 未付 1 未全付 2 付清" align="center"
        v-if="OutDrugscolumns.showColumn('payState')">
        <template #default="scope">
          <dict-tag :options="OutDrugsoptions.payStateOptions" :value="scope.row.payState" />
        </template>
      </el-table-column>
      <el-table-column prop="operCode" label="操作员" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('operCode')" />
      <el-table-column prop="operDate" label="操作日期" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('operDate')" />
      <el-table-column prop="mark" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('mark')" />
      <el-table-column prop="extCode" label="扩展字段" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('extCode')" />
      <el-table-column prop="extCode1" label="扩展字段1 存储草药产地" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('extCode1')" />
      <el-table-column prop="extCode2" label="扩展字段2 存储生产日期" align="center" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('extCode2')" />
      <el-table-column prop="purcharsePriceFirsttime" label="一般入库时的购入价" align="center"
        v-if="OutDrugscolumns.showColumn('purcharsePriceFirsttime')" />
      <el-table-column prop="isTenderOffer" label="招标标记，1是，0否" align="center"
        v-if="OutDrugscolumns.showColumn('isTenderOffer')">
        <template #default="scope">
          <dict-tag :options="OutDrugsoptions.isTenderOfferOptions" :value="scope.row.isTenderOffer" />
        </template>
      </el-table-column>
      <el-table-column prop="invoiceDate" label="发票上的发票日期" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('invoiceDate')" />
      <el-table-column prop="inDate" label="入库时间，即实际入库发生时间" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('inDate')" />
      <el-table-column prop="sourceCompanyType" label="源科室（供货单位）类别 1 院内科室 2 供货单位 3 扩展" align="center"
        v-if="OutDrugscolumns.showColumn('sourceCompanyType')">
        <template #default="scope">
          <dict-tag :options="OutDrugsoptions.sourceCompanyTypeOptions" :value="scope.row.sourceCompanyType" />
        </template>
      </el-table-column>
      <el-table-column prop="productionDate" label="生产日期" :show-overflow-tooltip="true"
        v-if="OutDrugscolumns.showColumn('productionDate')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" OutDrugstitle="详情"
            @click="OutDrugshandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" OutDrugstitle="编辑" v-hasPermi="['outdrugs:edit']"
            @click="OutDrugshandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" OutDrugstitle="删除" v-hasPermi="['outdrugs:delete']"
            @click="OutDrugshandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="OutDrugstotal" v-model:page="OutDrugsqueryParams.pageNum"
      v-model:limit="OutDrugsqueryParams.pageSize" @pagination="OutDrugsgetList" />


    <el-dialog :title="OutDrugstitle" :lock-scroll="false" v-model="OutDrugsopen">
      <el-form ref="OutDrugsformRef" :model="OutDrugsform" :rules="OutDrugsrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="OutorderID" prop="outorderID">
              <el-input v-model.number="OutDrugsform.outorderID" placeholder="请输入OutorderID" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="库存科室 0-全部部门" prop="drugDeptCode">
              <el-input v-model="OutDrugsform.drugDeptCode" placeholder="请输入库存科室 0-全部部门" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库单流水号" prop="inBillCode">
              <el-input v-model.number="OutDrugsform.inBillCode" placeholder="请输入入库单流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="序号" prop="serialCode">
              <el-input v-model.number="OutDrugsform.serialCode" placeholder="请输入序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批次号" prop="groupCode">
              <el-input v-model="OutDrugsform.groupCode" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库单据号" prop="inListCode">
              <el-input v-model="OutDrugsform.inListCode" placeholder="请输入入库单据号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库类型" prop="inType">
              <el-select v-model="OutDrugsform.inType" placeholder="请选择入库类型">
                <el-option v-for="item in OutDrugsoptions.inTypeOptions" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库分类" prop="class3MeaningCode">
              <el-input v-model="OutDrugsform.class3MeaningCode" placeholder="请输入入库分类" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库单号" prop="outBillCode">
              <el-input v-model.number="OutDrugsform.outBillCode" placeholder="请输入出库单号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库单序号" prop="outSerialCode">
              <el-input v-model.number="OutDrugsform.outSerialCode" placeholder="请输入出库单序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库单据号" prop="outListCode">
              <el-input v-model="OutDrugsform.outListCode" placeholder="请输入出库单据号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品编码" prop="drugCode">
              <el-input v-model="OutDrugsform.drugCode" placeholder="请输入药品编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品商品名" prop="tradeName">
              <el-input v-model="OutDrugsform.tradeName" placeholder="请输入药品商品名" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品类别" prop="drugType">
              <el-select v-model="OutDrugsform.drugType" placeholder="请选择药品类别">
                <el-option v-for="item in OutDrugsoptions.drugTypeOptions" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品性质" prop="drugQuality">
              <el-input v-model="OutDrugsform.drugQuality" placeholder="请输入药品性质" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="规格" prop="specs">
              <el-input v-model="OutDrugsform.specs" placeholder="请输入规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装单位" prop="packUnit">
              <el-input v-model="OutDrugsform.packUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装数" prop="packQty">
              <el-input v-model.number="OutDrugsform.packQty" placeholder="请输入包装数" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最小单位" prop="minUnit">
              <el-input v-model="OutDrugsform.minUnit" placeholder="请输入最小单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="显示的单位标记" prop="showFlag">
              <el-input v-model="OutDrugsform.showFlag" placeholder="请输入显示的单位标记" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="显示的单位" prop="showUnit">
              <el-input v-model="OutDrugsform.showUnit" placeholder="请输入显示的单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批号" prop="batchNo">
              <el-input v-model="OutDrugsform.batchNo" placeholder="请输入批号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="有效期" prop="validDate">
              <el-date-picker v-model="OutDrugsform.validDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产厂家" prop="producerCode">
              <el-input v-model="OutDrugsform.producerCode" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="供货单位代码" prop="companyCode">
              <el-input v-model="OutDrugsform.companyCode" placeholder="请输入供货单位代码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="零售价" prop="retailPrice">
              <el-input v-model="OutDrugsform.retailPrice" placeholder="请输入零售价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批发价" prop="wholesalePrice">
              <el-input v-model="OutDrugsform.wholesalePrice" placeholder="请输入批发价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="购入价" prop="purchasePrice">
              <el-input v-model="OutDrugsform.purchasePrice" placeholder="请输入购入价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="退货数量（负数）" prop="inNum">
              <el-input v-model="OutDrugsform.inNum" placeholder="请输入退货数量（负数）" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="零售金额" prop="retailCost">
              <el-input v-model="OutDrugsform.retailCost" placeholder="请输入零售金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批发金额" prop="wholesaleCost">
              <el-input v-model="OutDrugsform.wholesaleCost" placeholder="请输入批发金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="购入金额" prop="purchaseCost">
              <el-input v-model="OutDrugsform.purchaseCost" placeholder="请输入购入金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库后库存数量" prop="storeCum">
              <el-input v-model="OutDrugsform.storeCum" placeholder="请输入入库后库存数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库后库存总金额" prop="storeCost">
              <el-input v-model="OutDrugsform.storeCost" placeholder="请输入入库后库存总金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="特殊标记，1是，0否" prop="specialFlag">
              <el-input v-model="OutDrugsform.specialFlag" placeholder="请输入特殊标记，1是，0否" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库状态，0-申请，1-审批（发票入库），2-核准" prop="inState">
              <el-radio-group v-model="OutDrugsform.inState">
                <el-radio v-for="item in OutDrugsoptions.inStateOptions" :key="item.dictValue" :value="item.dictValue">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请入库量" prop="applyNum">
              <el-input v-model="OutDrugsform.applyNum" placeholder="请输入申请入库量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请入库操作员" prop="applyOpercode">
              <el-input v-model="OutDrugsform.applyOpercode" placeholder="请输入申请入库操作员" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请入库日期" prop="applyDate">
              <el-date-picker v-model="OutDrugsform.applyDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="审批数量" prop="examNum">
              <el-input v-model="OutDrugsform.examNum" placeholder="请输入审批数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="审批人（药库发票入库人）" prop="examOpercode">
              <el-input v-model="OutDrugsform.examOpercode" placeholder="请输入审批人（药库发票入库人）" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="审批日期（药库发票入库日期）" prop="examDate">
              <el-date-picker v-model="OutDrugsform.examDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="核准人" prop="approveOpercode">
              <el-input v-model="OutDrugsform.approveOpercode" placeholder="请输入核准人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="核准日期" prop="approveDate">
              <el-date-picker v-model="OutDrugsform.approveDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="货位码" prop="placeCode">
              <el-input v-model="OutDrugsform.placeCode" placeholder="请输入货位码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="退库数量" prop="returnNum">
              <el-input v-model="OutDrugsform.returnNum" placeholder="请输入退库数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请序号" prop="applyNumber">
              <el-input v-model.number="OutDrugsform.applyNumber" placeholder="请输入申请序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="制剂序号－生产序号或检验序号" prop="medId">
              <el-input v-model="OutDrugsform.medId" placeholder="请输入制剂序号－生产序号或检验序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="发票号" prop="invoiceNo">
              <el-input v-model="OutDrugsform.invoiceNo" placeholder="请输入发票号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="送药单流水号" prop="deliveryNo">
              <el-input v-model="OutDrugsform.deliveryNo" placeholder="请输入送药单流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="招标序号－招标单的序号" prop="tenderNo">
              <el-input v-model="OutDrugsform.tenderNo" placeholder="请输入招标序号－招标单的序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="实际扣率" prop="actualRate">
              <el-input v-model="OutDrugsform.actualRate" placeholder="请输入实际扣率" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="现金标志" prop="cashFlag">
              <el-input v-model="OutDrugsform.cashFlag" placeholder="请输入现金标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="供货商结存付款状态 0 未付 1 未全付 2 付清" prop="payState">
              <el-radio-group v-model="OutDrugsform.payState">
                <el-radio v-for="item in OutDrugsoptions.payStateOptions" :key="item.dictValue" :value="item.dictValue">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="操作员" prop="operCode">
              <el-input v-model="OutDrugsform.operCode" placeholder="请输入操作员" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="操作日期" prop="operDate">
              <el-date-picker v-model="OutDrugsform.operDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="mark">
              <el-input v-model="OutDrugsform.mark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="扩展字段" prop="extCode">
              <el-input v-model="OutDrugsform.extCode" placeholder="请输入扩展字段" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="扩展字段1 存储草药产地" prop="extCode1">
              <el-input v-model="OutDrugsform.extCode1" placeholder="请输入扩展字段1 存储草药产地" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="扩展字段2 存储生产日期" prop="extCode2">
              <el-input v-model="OutDrugsform.extCode2" placeholder="请输入扩展字段2 存储生产日期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="一般入库时的购入价" prop="purcharsePriceFirsttime">
              <el-input v-model="OutDrugsform.purcharsePriceFirsttime" placeholder="请输入一般入库时的购入价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="招标标记，1是，0否" prop="isTenderOffer">
              <el-radio-group v-model="OutDrugsform.isTenderOffer">
                <el-radio v-for="item in OutDrugsoptions.isTenderOfferOptions" :key="item.dictValue"
                  :value="item.dictValue">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="发票上的发票日期" prop="invoiceDate">
              <el-date-picker v-model="OutDrugsform.invoiceDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库时间，即实际入库发生时间" prop="inDate">
              <el-date-picker v-model="OutDrugsform.inDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="源科室（供货单位）类别 1 院内科室 2 供货单位 3 扩展" prop="sourceCompanyType">
              <el-select v-model="OutDrugsform.sourceCompanyType" placeholder="请选择源科室（供货单位）类别 1 院内科室 2 供货单位 3 扩展">
                <el-option v-for="item in OutDrugsoptions.sourceCompanyTypeOptions" :key="item.dictValue"
                  :label="item.dictLabel" :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产日期" prop="productionDate">
              <el-date-picker v-model="OutDrugsform.productionDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="OutDrugsopertype != 3">
        <el-button text @click="OutDrugscancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="OutDrugssubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="outdrugs">
import {
  listOutDrugs,
  addOutDrugs, delOutDrugs,
  updateOutDrugs, getOutDrugs,
  clearOutDrugs,
}
  from '@/api/business/outdrugs.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const OutDrugsids = ref([])
const OutDrugsloading = ref(false)
const OutDrugsshowSearch = ref(true)
const OutDrugsqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'OutorderID',
  sortType: 'asc',
  outorderID: undefined,
})
const OutDrugscolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'outorderID', label: 'OutorderID' },
  { visible: true, align: 'center', type: '', prop: 'drugDeptCode', label: '库存科室 0-全部部门', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'inBillCode', label: '入库单流水号' },
  { visible: true, align: 'center', type: '', prop: 'serialCode', label: '序号' },
  { visible: true, align: 'center', type: '', prop: 'groupCode', label: '批次号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'inListCode', label: '入库单据号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'inType', label: '入库类型', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'class3MeaningCode', label: '入库分类', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'outBillCode', label: '出库单号' },
  { visible: false, align: 'center', type: '', prop: 'outSerialCode', label: '出库单序号' },
  { visible: false, align: 'center', type: '', prop: 'outListCode', label: '出库单据号', showOverflowTooltip: true },
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
  { visible: false, align: 'center', type: '', prop: 'inNum', label: '退货数量（负数）' },
  { visible: false, align: 'center', type: '', prop: 'retailCost', label: '零售金额' },
  { visible: false, align: 'center', type: '', prop: 'wholesaleCost', label: '批发金额' },
  { visible: false, align: 'center', type: '', prop: 'purchaseCost', label: '购入金额' },
  { visible: false, align: 'center', type: '', prop: 'storeCum', label: '入库后库存数量' },
  { visible: false, align: 'center', type: '', prop: 'storeCost', label: '入库后库存总金额' },
  { visible: false, align: 'center', type: '', prop: 'specialFlag', label: '特殊标记，1是，0否', showOverflowTooltip: true },
  { visible: false, align: 'center', type: 'dict', prop: 'inState', label: '入库状态，0-申请，1-审批（发票入库），2-核准', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'applyNum', label: '申请入库量' },
  { visible: false, align: 'center', type: '', prop: 'applyOpercode', label: '申请入库操作员', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'applyDate', label: '申请入库日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'examNum', label: '审批数量' },
  { visible: false, align: 'center', type: '', prop: 'examOpercode', label: '审批人（药库发票入库人）', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'examDate', label: '审批日期（药库发票入库日期）', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveOpercode', label: '核准人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveDate', label: '核准日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'placeCode', label: '货位码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'returnNum', label: '退库数量' },
  { visible: false, align: 'center', type: '', prop: 'applyNumber', label: '申请序号' },
  { visible: false, align: 'center', type: '', prop: 'medId', label: '制剂序号－生产序号或检验序号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'invoiceNo', label: '发票号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'deliveryNo', label: '送药单流水号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'tenderNo', label: '招标序号－招标单的序号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'actualRate', label: '实际扣率' },
  { visible: false, align: 'center', type: '', prop: 'cashFlag', label: '现金标志', showOverflowTooltip: true },
  { visible: false, align: 'center', type: 'dict', prop: 'payState', label: '供货商结存付款状态 0 未付 1 未全付 2 付清', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'operCode', label: '操作员', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'operDate', label: '操作日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'mark', label: '备注', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'extCode', label: '扩展字段', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'extCode1', label: '扩展字段1 存储草药产地', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'extCode2', label: '扩展字段2 存储生产日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'purcharsePriceFirsttime', label: '一般入库时的购入价' },
  { visible: false, align: 'center', type: 'dict', prop: 'isTenderOffer', label: '招标标记，1是，0否', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'invoiceDate', label: '发票上的发票日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'inDate', label: '入库时间，即实际入库发生时间', showOverflowTooltip: true },
  { visible: false, align: 'center', type: 'dict', prop: 'sourceCompanyType', label: '源科室（供货单位）类别 1 院内科室 2 供货单位 3 扩展', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'productionDate', label: '生产日期', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const OutDrugstotal = ref(0)
const OutDrugsdataList = ref([])
const OutDrugsqueryRef = ref()
const OutDrugsdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var OutDrugsdictParams = [
]


function OutDrugsgetList() {
  OutDrugsloading.value = true
  listOutDrugs(OutDrugsqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      OutDrugsdataList.value = data.result
      OutDrugstotal.value = data.totalNum
      OutDrugsloading.value = false
    }
  })
}

// 查询
function OutDrugshandleQuery() {
  OutDrugsqueryParams.pageNum = 1
  OutDrugsgetList()
}

// 重置查询操作
function OutDrugsresetQuery() {
  proxy.resetForm("OutDrugsqueryRef")
  OutDrugshandleQuery()
}
// 多选框选中数据
function OutDrugshandleSelectionChange(selection) {
  OutDrugsids.value = selection.map((item) => item.id);
  OutDrugssingle.value = selection.length != 1
  OutDrugsmultiple.value = !selection.length;
}
// 自定义排序
function OutDrugssortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  OutDrugsqueryParams.sort = sort
  OutDrugsqueryParams.sortType = sortType
  OutDrugshandleQuery()
}

/*************** form操作 ***************/
const OutDrugsformRef = ref()
const OutDrugstitle = ref('')
// 操作类型 1、add 2、edit 3、view
const OutDrugsopertype = ref(0)
const OutDrugsopen = ref(false)
const OutDrugsstate = reactive({
  OutDrugssingle: true,
  OutDrugsmultiple: true,
  OutDrugsform: {},
  OutDrugsrules: {
  },
  OutDrugsoptions: {
    // 入库类型 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    inTypeOptions: [],
  }
})

const { OutDrugsform, OutDrugsrules, OutDrugsoptions, OutDrugssingle, OutDrugsmultiple } = toRefs(OutDrugsstate)

// 关闭dialog
function OutDrugscancel() {
  OutDrugsopen.value = false
  OutDrugsreset()
}

// 重置表单
function OutDrugsreset() {
  OutDrugsform.value = {
    outorderID: null,
    drugDeptCode: null,
    inBillCode: null,
    serialCode: null,
    groupCode: null,
    inListCode: null,
    inType: null,
    class3MeaningCode: null,
    outBillCode: null,
    outSerialCode: null,
    outListCode: null,
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
    inNum: null,
    retailCost: null,
    wholesaleCost: null,
    purchaseCost: null,
    storeCum: null,
    storeCost: null,
    specialFlag: null,
    inState: null,
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
    applyNumber: null,
    medId: null,
    invoiceNo: null,
    deliveryNo: null,
    tenderNo: null,
    actualRate: null,
    cashFlag: null,
    payState: null,
    operCode: null,
    operDate: null,
    mark: null,
    extCode: null,
    extCode1: null,
    extCode2: null,
    purcharsePriceFirsttime: null,
    isTenderOffer: null,
    invoiceDate: null,
    inDate: null,
    sourceCompanyType: null,
    productionDate: null,
  };
  proxy.resetForm("OutDrugsformRef")
}

/**
 * 查看
 * @param {*} row
 */
function OutDrugshandlePreview(row) {
  OutDrugsreset()
  const id = row.id
  getOutDrugs(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      OutDrugsopen.value = true
      OutDrugstitle.value = '查看'
      OutDrugsopertype.value = 3
      OutDrugsform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function OutDrugshandleAdd() {
  OutDrugsreset();
  OutDrugsopen.value = true
  OutDrugstitle.value = '添加采购退货'
  OutDrugsopertype.value = 1
}
// 修改按钮操作
function OutDrugshandleUpdate(row) {
  OutDrugsreset()
  const id = row.id || OutDrugsids.value
  getOutDrugs(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      OutDrugsopen.value = true
      OutDrugstitle.value = '修改采购退货'
      OutDrugsopertype.value = 2

      OutDrugsform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function OutDrugssubmitForm() {
  proxy.$refs["OutDrugsformRef"].validate((valid) => {
    if (valid) {

      if (OutDrugsform.value.id != undefined && OutDrugsopertype.value === 2) {
        updateOutDrugs(OutDrugsform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          OutDrugsopen.value = false
          OutDrugsgetList()
        })
      } else {
        addOutDrugs(OutDrugsform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          OutDrugsopen.value = false
          OutDrugsgetList()
        })
      }
    }
  })
}

// 删除按钮操作
function OutDrugshandleDelete(row) {
  const OutDrugsids = row.id || OutDrugsids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + OutDrugsids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      OutDrugscancelButtonText: proxy.$t('common.OutDrugscancel'),
      type: "warning",
    })
    .then(function () {
      return delOutDrugs(OutDrugsids)
    })
    .then(() => {
      OutDrugsgetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function OutDrugshandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      OutDrugscancelButtonText: proxy.$t('common.OutDrugscancel'),
      type: "warning",
    })
    .then(function () {
      return clearOutDrugs()
    })
    .then(() => {
      OutDrugshandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const OutDrugshandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  OutDrugsgetList()
}

// 导出按钮操作
function OutDrugshandleExport() {
  proxy
    .$confirm("是否确认导出采购退货数据项?", "警告", {
      confirmButtonText: "确定",
      OutDrugscancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/OutDrugs/export', { ...OutDrugsqueryParams })
    })
}

OutDrugshandleQuery()
</script>