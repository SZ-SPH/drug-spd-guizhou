<!--
 * @Descripttion: (入库详情/PhaInput)
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
      <el-form-item label="采购流水号" prop="stockNo">
        <el-input v-model="queryParams.stockNo" placeholder="请输入采购流水号" />
      </el-form-item>
      <el-form-item label="序号" prop="serialCode">
        <el-input v-model.number="queryParams.serialCode" placeholder="请输入序号" />
      </el-form-item>
      <el-form-item label="库存科室" prop="drugDeptCode">
        <el-input v-model="queryParams.drugDeptCode" placeholder="请输入库存科室" />
      </el-form-item>
      <el-form-item label="批次号" prop="groupCode">
        <el-input v-model="queryParams.groupCode" placeholder="请输入批次号" />
      </el-form-item>
      <el-form-item label="入库类型" prop="inType">
        <el-select clearable v-model="queryParams.inType" placeholder="请选择入库类型">
          <el-option v-for="item in options.inTypeOptions" :key="item.dictValue" :label="item.dictLabel"
            :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
            <span class="fr" style="color: var(--el-text-color-secondary);">{{ item.dictValue }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="药品编码" prop="drugCode">
        <el-input v-model="queryParams.drugCode" placeholder="请输入药品编码" />
      </el-form-item>
      <el-form-item label="药品商品名" prop="tradeName">
        <el-input v-model="queryParams.tradeName" placeholder="请输入药品商品名" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['phainput:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['phainput:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['phainput:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['phainput:delete']" plain icon="delete" @click="handleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['phainput:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/PhaInput/importTemplate" importUrl="/business/PhaInput/importData"
                  @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['phainput:export']">
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
      <el-table-column prop="stockNo" label="采购流水号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stockNo')" />
      <el-table-column prop="serialCode" label="序号" align="center" v-if="columns.showColumn('serialCode')" />
      <el-table-column prop="drugDeptCode" label="库存科室" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugDeptCode')" />
      <el-table-column prop="groupCode" label="批次号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('groupCode')" />
      <el-table-column prop="inType" label="入库类型" align="center" v-if="columns.showColumn('inType')">
        <template #default="scope">
          <dict-tag :options="options.inTypeOptions" :value="scope.row.inType" />
        </template>
      </el-table-column>
      <el-table-column prop="class3MeaningCode" label="入库分类" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('class3MeaningCode')" />
      <el-table-column prop="drugCode" label="药品编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugCode')" />
      <el-table-column prop="tradeName" label="药品商品名" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('tradeName')" />
      <el-table-column prop="specs" label="规格" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('specs')" />
      <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('packUnit')" />
      <el-table-column prop="packQty" label="包装数" align="center" v-if="columns.showColumn('packQty')" />
      <el-table-column prop="minUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('minUnit')" />
      <el-table-column prop="batchNo" label="批号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('batchNo')" />
      <el-table-column prop="validDate" label="有效期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('validDate')" />
      <el-table-column prop="producerCode" label="生产厂家" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('producerCode')" />
      <el-table-column prop="companyCode" label="供货单位代码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('companyCode')" />
      <el-table-column prop="retailPrice" label="零售价" align="center" v-if="columns.showColumn('retailPrice')" />
      <el-table-column prop="wholesalePrice" label="批发价" align="center" v-if="columns.showColumn('wholesalePrice')" />
      <el-table-column prop="purchasePrice" label="购入价" align="center" v-if="columns.showColumn('purchasePrice')" />
      <el-table-column prop="inNum" label="入库数量" align="center" v-if="columns.showColumn('inNum')" />
      <el-table-column prop="retailCost" label="零售金额" align="center" v-if="columns.showColumn('retailCost')" />
      <el-table-column prop="wholesaleCost" label="批发金额" align="center" v-if="columns.showColumn('wholesaleCost')" />
      <el-table-column prop="purchaseCost" label="购入金额" align="center" v-if="columns.showColumn('purchaseCost')" />
      <el-table-column prop="specialFlag" label="特殊标记" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('specialFlag')" />
      <el-table-column prop="inState" label="入库状态" align="center" v-if="columns.showColumn('inState')">
        <template #default="scope">
          <dict-tag :options="options.inStateOptions" :value="scope.row.inState" />
        </template>
      </el-table-column>
      <el-table-column prop="applyNum" label="申请入库量" align="center" v-if="columns.showColumn('applyNum')" />
      <el-table-column prop="applyOperCode" label="申请入库操作员" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('applyOperCode')" />
      <el-table-column prop="applyDate" label="申请入库日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('applyDate')" />
      <el-table-column prop="examNum" label="审批数量" align="center" v-if="columns.showColumn('examNum')" />
      <el-table-column prop="examOperCode" label="审批人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('examOperCode')" />
      <el-table-column prop="examDate" label="审批日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('examDate')" />
      <el-table-column prop="approveOperCode" label="核准人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('approveOperCode')" />
      <el-table-column prop="approveDate" label="核准日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('approveDate')" />
      <el-table-column prop="placeCode" label="货位码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('placeCode')" />
      <el-table-column prop="invoiceNo" label="发票号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('invoiceNo')" />
      <el-table-column prop="operCode" label="操作员" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('operCode')" />
      <el-table-column prop="operDate" label="操作日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('operDate')" />
      <el-table-column prop="mark" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('mark')" />
      <el-table-column prop="extCode1" label="扩展字段1" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('extCode1')" />
      <el-table-column prop="extCode2" label="扩展字段2" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('extCode2')" />
      <el-table-column prop="purcharsePriceFirsttime" label="一般入库时的购入价" align="center"
        v-if="columns.showColumn('purcharsePriceFirsttime')" />
      <el-table-column prop="isTenderOffer" label="招标标记" align="center" v-if="columns.showColumn('isTenderOffer')">
        <template #default="scope">
          <dict-tag :options="options.isTenderOfferOptions" :value="scope.row.isTenderOffer" />
        </template>
      </el-table-column>
      <el-table-column prop="invoiceDate" label="发票上的发票日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('invoiceDate')" />
      <el-table-column prop="productionDate" label="生产日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('productionDate')" />
      <el-table-column prop="approveInfo" label="批文信息" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('approveInfo')" />
      <el-table-column prop="tracCode" label="药品追溯码，多追溯码用|隔开，如A|B" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('tracCode')" />
      <el-table-column prop="caseCode" label="箱码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('caseCode')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['phainput:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['phainput:delete']"
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
              <el-input v-model="form.planNo" placeholder="请输入入库计划流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购单号" prop="billCode">
              <el-input v-model="form.billCode" placeholder="请输入采购单号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购流水号" prop="stockNo">
              <el-input v-model="form.stockNo" placeholder="请输入采购流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="序号" prop="serialCode">
              <el-input v-model.number="form.serialCode" placeholder="请输入序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="库存科室" prop="drugDeptCode">
              <el-input v-model="form.drugDeptCode" placeholder="请输入库存科室" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批次号" prop="groupCode">
              <el-input v-model="form.groupCode" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库类型" prop="inType">
              <el-select v-model="form.inType" placeholder="请选择入库类型">
                <el-option v-for="item in options.inTypeOptions" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库分类" prop="class3MeaningCode">
              <el-input v-model="form.class3MeaningCode" placeholder="请输入入库分类" />
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
            <el-form-item label="批号" prop="batchNo">
              <el-input v-model="form.batchNo" placeholder="请输入批号" />
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
            <el-form-item label="生产厂家" prop="producerCode">
              <el-input v-model="form.producerCode" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="供货单位代码" prop="companyCode">
              <el-input v-model="form.companyCode" placeholder="请输入供货单位代码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="零售价" prop="retailPrice">
              <el-input v-model="form.retailPrice" placeholder="请输入零售价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批发价" prop="wholesalePrice">
              <el-input v-model="form.wholesalePrice" placeholder="请输入批发价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="购入价" prop="purchasePrice">
              <el-input v-model="form.purchasePrice" placeholder="请输入购入价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库数量" prop="inNum">
              <el-input v-model="form.inNum" placeholder="请输入入库数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="零售金额" prop="retailCost">
              <el-input v-model="form.retailCost" placeholder="请输入零售金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批发金额" prop="wholesaleCost">
              <el-input v-model="form.wholesaleCost" placeholder="请输入批发金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="购入金额" prop="purchaseCost">
              <el-input v-model="form.purchaseCost" placeholder="请输入购入金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="特殊标记" prop="specialFlag">
              <el-input v-model="form.specialFlag" placeholder="请输入特殊标记" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库状态" prop="inState">
              <el-radio-group v-model="form.inState">
                <el-radio v-for="item in options.inStateOptions" :key="item.dictValue" :value="item.dictValue">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请入库量" prop="applyNum">
              <el-input v-model="form.applyNum" placeholder="请输入申请入库量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请入库操作员" prop="applyOperCode">
              <el-input v-model="form.applyOperCode" placeholder="请输入申请入库操作员" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请入库日期" prop="applyDate">
              <el-date-picker v-model="form.applyDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="审批数量" prop="examNum">
              <el-input v-model="form.examNum" placeholder="请输入审批数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="审批人" prop="examOperCode">
              <el-input v-model="form.examOperCode" placeholder="请输入审批人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="审批日期" prop="examDate">
              <el-date-picker v-model="form.examDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="核准人" prop="approveOperCode">
              <el-input v-model="form.approveOperCode" placeholder="请输入核准人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="核准日期" prop="approveDate">
              <el-date-picker v-model="form.approveDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="货位码" prop="placeCode">
              <el-input v-model="form.placeCode" placeholder="请输入货位码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="发票号" prop="invoiceNo">
              <el-input v-model="form.invoiceNo" placeholder="请输入发票号" />
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
            <el-form-item label="备注" prop="mark">
              <el-input v-model="form.mark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="扩展字段1" prop="extCode1">
              <el-input v-model="form.extCode1" placeholder="请输入扩展字段1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="扩展字段2" prop="extCode2">
              <el-input v-model="form.extCode2" placeholder="请输入扩展字段2" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="一般入库时的购入价" prop="purcharsePriceFirsttime">
              <el-input v-model="form.purcharsePriceFirsttime" placeholder="请输入一般入库时的购入价" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="招标标记" prop="isTenderOffer">
              <el-radio-group v-model="form.isTenderOffer">
                <el-radio v-for="item in options.isTenderOfferOptions" :key="item.dictValue" :value="item.dictValue">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="发票上的发票日期" prop="invoiceDate">
              <el-date-picker v-model="form.invoiceDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产日期" prop="productionDate">
              <el-date-picker v-model="form.productionDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批文信息" prop="approveInfo">
              <el-input v-model="form.approveInfo" placeholder="请输入批文信息" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品追溯码，多追溯码用|隔开，如A|B" prop="tracCode">
              <el-input v-model="form.tracCode" placeholder="请输入药品追溯码，多追溯码用|隔开，如A|B" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="箱码" prop="caseCode">
              <el-input v-model="form.caseCode" placeholder="请输入箱码" />
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

<script setup name="phainput">
import {
  listPhaInput,
  addPhaInput, delPhaInput,
  updatePhaInput, getPhaInput,
  clearPhaInput,
}
  from '@/api/business/phainput.js'
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
  stockNo: undefined,
  serialCode: undefined,
  drugDeptCode: undefined,
  groupCode: undefined,
  inType: undefined,
  drugCode: undefined,
  tradeName: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'planNo', label: '入库计划流水号' },
  { visible: true, align: 'center', type: '', prop: 'billCode', label: '采购单号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'stockNo', label: '采购流水号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'serialCode', label: '序号' },
  { visible: true, align: 'center', type: '', prop: 'drugDeptCode', label: '库存科室', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'groupCode', label: '批次号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'inType', label: '入库类型', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'class3MeaningCode', label: '入库分类', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'drugCode', label: '药品编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'tradeName', label: '药品商品名', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'specs', label: '规格', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packUnit', label: '包装单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packQty', label: '包装数' },
  { visible: false, align: 'center', type: '', prop: 'minUnit', label: '最小单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'batchNo', label: '批号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'validDate', label: '有效期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'producerCode', label: '生产厂家', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'companyCode', label: '供货单位代码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'retailPrice', label: '零售价' },
  { visible: false, align: 'center', type: '', prop: 'wholesalePrice', label: '批发价' },
  { visible: false, align: 'center', type: '', prop: 'purchasePrice', label: '购入价' },
  { visible: false, align: 'center', type: '', prop: 'inNum', label: '入库数量' },
  { visible: false, align: 'center', type: '', prop: 'retailCost', label: '零售金额' },
  { visible: false, align: 'center', type: '', prop: 'wholesaleCost', label: '批发金额' },
  { visible: false, align: 'center', type: '', prop: 'purchaseCost', label: '购入金额' },
  { visible: false, align: 'center', type: '', prop: 'specialFlag', label: '特殊标记', showOverflowTooltip: true },
  { visible: false, align: 'center', type: 'dict', prop: 'inState', label: '入库状态', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'applyNum', label: '申请入库量' },
  { visible: false, align: 'center', type: '', prop: 'applyOperCode', label: '申请入库操作员', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'applyDate', label: '申请入库日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'examNum', label: '审批数量' },
  { visible: false, align: 'center', type: '', prop: 'examOperCode', label: '审批人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'examDate', label: '审批日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveOperCode', label: '核准人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveDate', label: '核准日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'placeCode', label: '货位码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'invoiceNo', label: '发票号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'operCode', label: '操作员', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'operDate', label: '操作日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'mark', label: '备注', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'extCode1', label: '扩展字段1', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'extCode2', label: '扩展字段2', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'purcharsePriceFirsttime', label: '一般入库时的购入价' },
  { visible: false, align: 'center', type: 'dict', prop: 'isTenderOffer', label: '招标标记', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'invoiceDate', label: '发票上的发票日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'productionDate', label: '生产日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveInfo', label: '批文信息', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'tracCode', label: '药品追溯码，多追溯码用|隔开，如A|B', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'caseCode', label: '箱码', showOverflowTooltip: true },
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
  listPhaInput(queryParams).then(res => {
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
    planNo: [{ required: true, message: "入库计划流水号不能为空", trigger: "blur" }],
    billCode: [{ required: true, message: "采购单号不能为空", trigger: "blur" }],
    stockNo: [{ required: true, message: "采购流水号不能为空", trigger: "blur" }],
    serialCode: [{ required: true, message: "序号不能为空", trigger: "blur", type: "number" }],
    drugDeptCode: [{ required: true, message: "库存科室不能为空", trigger: "blur" }],
    groupCode: [{ required: true, message: "批次号不能为空", trigger: "blur" }],
    inType: [{ required: true, message: "入库类型不能为空", trigger: "change" }],
    class3MeaningCode: [{ required: true, message: "入库分类不能为空", trigger: "blur" }],
    drugCode: [{ required: true, message: "药品编码不能为空", trigger: "blur" }],
    tradeName: [{ required: true, message: "药品商品名不能为空", trigger: "blur" }],
    specs: [{ required: true, message: "规格不能为空", trigger: "blur" }],
    packUnit: [{ required: true, message: "包装单位不能为空", trigger: "blur" }],
    packQty: [{ required: true, message: "包装数不能为空", trigger: "blur", type: "number" }],
    minUnit: [{ required: true, message: "最小单位不能为空", trigger: "blur" }],
    batchNo: [{ required: true, message: "批号不能为空", trigger: "blur" }],
    validDate: [{ required: true, message: "有效期不能为空", trigger: "blur" }],
    producerCode: [{ required: true, message: "生产厂家不能为空", trigger: "blur" }],
    companyCode: [{ required: true, message: "供货单位代码不能为空", trigger: "blur" }],
    retailPrice: [{ required: true, message: "零售价不能为空", trigger: "blur" }],
    wholesalePrice: [{ required: true, message: "批发价不能为空", trigger: "blur" }],
    purchasePrice: [{ required: true, message: "购入价不能为空", trigger: "blur" }],
    inNum: [{ required: true, message: "入库数量不能为空", trigger: "blur" }],
    retailCost: [{ required: true, message: "零售金额不能为空", trigger: "blur" }],
    wholesaleCost: [{ required: true, message: "批发金额不能为空", trigger: "blur" }],
    purchaseCost: [{ required: true, message: "购入金额不能为空", trigger: "blur" }],
    specialFlag: [{ required: true, message: "特殊标记不能为空", trigger: "blur" }],
    inState: [{ required: true, message: "入库状态不能为空", trigger: "blur" }],
    applyNum: [{ required: true, message: "申请入库量不能为空", trigger: "blur" }],
    applyOperCode: [{ required: true, message: "申请入库操作员不能为空", trigger: "blur" }],
    applyDate: [{ required: true, message: "申请入库日期不能为空", trigger: "blur" }],
    examNum: [{ required: true, message: "审批数量不能为空", trigger: "blur" }],
    examOperCode: [{ required: true, message: "审批人不能为空", trigger: "blur" }],
    examDate: [{ required: true, message: "审批日期不能为空", trigger: "blur" }],
    approveOperCode: [{ required: true, message: "核准人不能为空", trigger: "blur" }],
    approveDate: [{ required: true, message: "核准日期不能为空", trigger: "blur" }],
    operCode: [{ required: true, message: "操作员不能为空", trigger: "blur" }],
    purcharsePriceFirsttime: [{ required: true, message: "一般入库时的购入价不能为空", trigger: "blur" }],
    isTenderOffer: [{ required: true, message: "招标标记不能为空", trigger: "blur" }],
    productionDate: [{ required: true, message: "生产日期不能为空", trigger: "blur" }],
    approveInfo: [{ required: true, message: "批文信息不能为空", trigger: "blur" }],
  },
  options: {
    // 入库类型 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    inTypeOptions: [],
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
    stockNo: null,
    serialCode: null,
    drugDeptCode: null,
    groupCode: null,
    inType: null,
    class3MeaningCode: null,
    drugCode: null,
    tradeName: null,
    specs: null,
    packUnit: null,
    packQty: null,
    minUnit: null,
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
    specialFlag: null,
    inState: null,
    applyNum: null,
    applyOperCode: null,
    applyDate: null,
    examNum: null,
    examOperCode: null,
    examDate: null,
    approveOperCode: null,
    approveDate: null,
    placeCode: null,
    invoiceNo: null,
    operCode: null,
    operDate: null,
    mark: null,
    extCode1: null,
    extCode2: null,
    purcharsePriceFirsttime: null,
    isTenderOffer: null,
    invoiceDate: null,
    productionDate: null,
    approveInfo: null,
    tracCode: null,
    caseCode: null,
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
  getPhaInput(id).then((res) => {
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
  title.value = '添加入库详情'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getPhaInput(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改入库详情'
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
        updatePhaInput(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addPhaInput(form.value).then((res) => {
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
      return delPhaInput(Ids)
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
      return clearPhaInput()
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
    .$confirm("是否确认导出入库详情数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/PhaInput/export', { ...queryParams })
    })
}

handleQuery()
</script>