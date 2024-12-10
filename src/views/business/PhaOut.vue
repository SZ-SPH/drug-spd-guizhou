<!--
 * @Descripttion: (出库记录/PhaOut)
 * @Author: (admin)
 * @Date: (2024-11-27)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="出库科室编码" prop="drugDeptCode">
        <el-input v-model="queryParams.drugDeptCode" placeholder="请输入出库科室编码" />
      </el-form-item>
      <el-form-item label="出库单流水号" prop="outBillCode">
        <el-input v-model.number="queryParams.outBillCode" placeholder="请输入出库单流水号" />
      </el-form-item>
      <el-form-item label="序号" prop="serialCode">
        <el-input v-model.number="queryParams.serialCode" placeholder="请输入序号" />
      </el-form-item>
      <el-form-item label="批次号" prop="groupCode">
        <el-input v-model="queryParams.groupCode" placeholder="请输入批次号" />
      </el-form-item>
      <el-form-item label="出库单据号" prop="outListCode">
        <el-input v-model="queryParams.outListCode" placeholder="请输入出库单据号" />
      </el-form-item>
      <el-form-item label="出库类型" prop="outType">
        <el-select clearable v-model="queryParams.outType" placeholder="请选择出库类型">
          <el-option v-for="item in options.outTypeOptions" :key="item.dictValue" :label="item.dictLabel"
            :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
            <span class="fr" style="color: var(--el-text-color-secondary);">{{ item.dictValue }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出库分类" prop="class3MeaningCode">
        <el-input v-model="queryParams.class3MeaningCode" placeholder="请输入出库分类" />
      </el-form-item>
      <el-form-item label="入库单号" prop="inBillCode">
        <el-input v-model.number="queryParams.inBillCode" placeholder="请输入入库单号" />
      </el-form-item>
      <el-form-item label="入库单序号" prop="inSerialCode">
        <el-input v-model.number="queryParams.inSerialCode" placeholder="请输入入库单序号" />
      </el-form-item>
      <el-form-item label="入库单据号" prop="inListCode">
        <el-input v-model="queryParams.inListCode" placeholder="请输入入库单据号" />
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
      <el-form-item label="生产厂家" prop="producerCode">
        <el-input v-model="queryParams.producerCode" placeholder="请输入生产厂家" />
      </el-form-item>
      <el-form-item label="供货单位代码" prop="companyCode">
        <el-input v-model="queryParams.companyCode" placeholder="请输入供货单位代码" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['phaout:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['phaout:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['phaout:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['phaout:delete']" plain icon="delete" @click="handleClear">
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
                  @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['phaout:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="drugDeptCode" label="出库科室编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugDeptCode')" />
      <el-table-column prop="outBillCode" label="出库单流水号" align="center" v-if="columns.showColumn('outBillCode')" />
      <el-table-column prop="serialCode" label="序号" align="center" v-if="columns.showColumn('serialCode')" />
      <el-table-column prop="groupCode" label="批次号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('groupCode')" />
      <el-table-column prop="outListCode" label="出库单据号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('outListCode')" />
      <el-table-column prop="outType" label="出库类型" align="center" v-if="columns.showColumn('outType')">
        <template #default="scope">
          <dict-tag :options="options.outTypeOptions" :value="scope.row.outType" />
        </template>
      </el-table-column>
      <el-table-column prop="class3MeaningCode" label="出库分类" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('class3MeaningCode')" />
      <el-table-column prop="inBillCode" label="入库单号" align="center" v-if="columns.showColumn('inBillCode')" />
      <el-table-column prop="inSerialCode" label="入库单序号" align="center" v-if="columns.showColumn('inSerialCode')" />
      <el-table-column prop="inListCode" label="入库单据号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('inListCode')" />
      <el-table-column prop="drugCode" label="药品编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugCode')" />
      <el-table-column prop="tradeName" label="药品商品名" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('tradeName')" />
      <el-table-column prop="drugType" label="药品类别" align="center" v-if="columns.showColumn('drugType')">
        <template #default="scope">
          <dict-tag :options="options.drugTypeOptions" :value="scope.row.drugType" />
        </template>
      </el-table-column>
      <el-table-column prop="drugQuality" label="药品性质" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugQuality')" />
      <el-table-column prop="specs" label="规格" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('specs')" />
      <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('packUnit')" />
      <el-table-column prop="packQty" label="包装数" align="center" v-if="columns.showColumn('packQty')" />
      <el-table-column prop="minUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('minUnit')" />
      <el-table-column prop="showFlag" label="显示的单位标记" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('showFlag')" />
      <el-table-column prop="showUnit" label="显示的单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('showUnit')" />
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
      <el-table-column prop="outNum" label="出库数量" align="center" v-if="columns.showColumn('outNum')" />
      <el-table-column prop="saleCost" label="零售金额" align="center" v-if="columns.showColumn('saleCost')" />
      <el-table-column prop="tradeCost" label="批发金额" align="center" v-if="columns.showColumn('tradeCost')" />
      <el-table-column prop="approveCost" label="购入金额" align="center" v-if="columns.showColumn('approveCost')" />
      <el-table-column prop="storeNum" label="出库后库存数量" align="center" v-if="columns.showColumn('storeNum')" />
      <el-table-column prop="storeCost" label="出库后库存总金额" align="center" v-if="columns.showColumn('storeCost')" />
      <el-table-column prop="specialFlag" label="特殊标记" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('specialFlag')" />
      <el-table-column prop="outState" label="出库状态" align="center" v-if="columns.showColumn('outState')">
        <template #default="scope">
          <dict-tag :options="options.outStateOptions" :value="scope.row.outState" />
        </template>
      </el-table-column>
      <el-table-column prop="applyNum" label="申请出库量" align="center" v-if="columns.showColumn('applyNum')" />
      <el-table-column prop="applyOpercode" label="申请出库人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('applyOpercode')" />
      <el-table-column prop="applyDate" label="申请出库日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('applyDate')" />
      <el-table-column prop="examNum" label="审批数量" align="center" v-if="columns.showColumn('examNum')" />
      <el-table-column prop="examOpercode" label="审批人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('examOpercode')" />
      <el-table-column prop="examDate" label="审批日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('examDate')" />
      <el-table-column prop="approveOpercode" label="核准人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('approveOpercode')" />
      <el-table-column prop="approveDate" label="核准日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('approveDate')" />
      <el-table-column prop="placeCode" label="货位号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('placeCode')" />
      <el-table-column prop="returnNum" label="退库数量" align="center" v-if="columns.showColumn('returnNum')" />
      <el-table-column prop="drugedBill" label="摆药单号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugedBill')" />
      <el-table-column prop="medId" label="制剂序号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('medId')" />
      <el-table-column prop="drugStorageCode" label="领药单位编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugStorageCode')" />
      <el-table-column prop="recipeNo" label="处方号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('recipeNo')" />
      <el-table-column prop="sequenceNo" label="处方流水号" align="center" v-if="columns.showColumn('sequenceNo')" />
      <el-table-column prop="signPerson" label="签字人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('signPerson')" />
      <el-table-column prop="getPerson" label="领药人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('getPerson')" />
      <el-table-column prop="strikeFlag" label="冲账标志" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('strikeFlag')" />
      <el-table-column prop="mark" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('mark')" />
      <el-table-column prop="operCode" label="操作员" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('operCode')" />
      <el-table-column prop="operDate" label="操作日期" :show-overflow-tooltip="true"
        v-if="columns.showColumn('operDate')" />
      <el-table-column prop="arkFlag" label="是否药房向药柜出库记录" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('arkFlag')" />
      <el-table-column prop="arkBillCode" label="药柜发药出库单流水号" align="center" v-if="columns.showColumn('arkBillCode')" />
      <el-table-column prop="outDate" label="出库记录发生时间" :show-overflow-tooltip="true"
        v-if="columns.showColumn('outDate')" />
      <el-table-column prop="applyNumber" label="申请单流水号" align="center" v-if="columns.showColumn('applyNumber')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['phaout:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['phaout:delete']"
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
            <el-form-item label="出库科室编码" prop="drugDeptCode">
              <el-input v-model="form.drugDeptCode" placeholder="请输入出库科室编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库单流水号" prop="outBillCode">
              <el-input v-model.number="form.outBillCode" placeholder="请输入出库单流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="序号" prop="serialCode">
              <el-input v-model.number="form.serialCode" placeholder="请输入序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批次号" prop="groupCode">
              <el-input v-model="form.groupCode" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库单据号" prop="outListCode">
              <el-input v-model="form.outListCode" placeholder="请输入出库单据号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库类型" prop="outType">
              <el-select v-model="form.outType" placeholder="请选择出库类型">
                <el-option v-for="item in options.outTypeOptions" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库分类" prop="class3MeaningCode">
              <el-input v-model="form.class3MeaningCode" placeholder="请输入出库分类" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库单号" prop="inBillCode">
              <el-input v-model.number="form.inBillCode" placeholder="请输入入库单号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库单序号" prop="inSerialCode">
              <el-input v-model.number="form.inSerialCode" placeholder="请输入入库单序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库单据号" prop="inListCode">
              <el-input v-model="form.inListCode" placeholder="请输入入库单据号" />
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
            <el-form-item label="显示的单位标记" prop="showFlag">
              <el-input v-model="form.showFlag" placeholder="请输入显示的单位标记" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="显示的单位" prop="showUnit">
              <el-input v-model="form.showUnit" placeholder="请输入显示的单位" />
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
            <el-form-item label="出库数量" prop="outNum">
              <el-input v-model="form.outNum" placeholder="请输入出库数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="零售金额" prop="saleCost">
              <el-input v-model="form.saleCost" placeholder="请输入零售金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批发金额" prop="tradeCost">
              <el-input v-model="form.tradeCost" placeholder="请输入批发金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="购入金额" prop="approveCost">
              <el-input v-model="form.approveCost" placeholder="请输入购入金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库后库存数量" prop="storeNum">
              <el-input v-model="form.storeNum" placeholder="请输入出库后库存数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库后库存总金额" prop="storeCost">
              <el-input v-model="form.storeCost" placeholder="请输入出库后库存总金额" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="特殊标记" prop="specialFlag">
              <el-input v-model="form.specialFlag" placeholder="请输入特殊标记" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库状态" prop="outState">
              <el-radio-group v-model="form.outState">
                <el-radio v-for="item in options.outStateOptions" :key="item.dictValue" :value="item.dictValue">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请出库量" prop="applyNum">
              <el-input v-model="form.applyNum" placeholder="请输入申请出库量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请出库人" prop="applyOpercode">
              <el-input v-model="form.applyOpercode" placeholder="请输入申请出库人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请出库日期" prop="applyDate">
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
            <el-form-item label="审批人" prop="examOpercode">
              <el-input v-model="form.examOpercode" placeholder="请输入审批人" />
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
            <el-form-item label="核准人" prop="approveOpercode">
              <el-input v-model="form.approveOpercode" placeholder="请输入核准人" />
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
            <el-form-item label="货位号" prop="placeCode">
              <el-input v-model="form.placeCode" placeholder="请输入货位号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="退库数量" prop="returnNum">
              <el-input v-model="form.returnNum" placeholder="请输入退库数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="摆药单号" prop="drugedBill">
              <el-input v-model="form.drugedBill" placeholder="请输入摆药单号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="制剂序号" prop="medId">
              <el-input v-model="form.medId" placeholder="请输入制剂序号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="领药单位编码" prop="drugStorageCode">
              <el-input v-model="form.drugStorageCode" placeholder="请输入领药单位编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="处方号" prop="recipeNo">
              <el-input v-model="form.recipeNo" placeholder="请输入处方号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="处方流水号" prop="sequenceNo">
              <el-input v-model.number="form.sequenceNo" placeholder="请输入处方流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="签字人" prop="signPerson">
              <el-input v-model="form.signPerson" placeholder="请输入签字人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="领药人" prop="getPerson">
              <el-input v-model="form.getPerson" placeholder="请输入领药人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="冲账标志" prop="strikeFlag">
              <el-input v-model="form.strikeFlag" placeholder="请输入冲账标志" />
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
            <el-form-item label="是否药房向药柜出库记录" prop="arkFlag">
              <el-input v-model="form.arkFlag" placeholder="请输入是否药房向药柜出库记录" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药柜发药出库单流水号" prop="arkBillCode">
              <el-input v-model.number="form.arkBillCode" placeholder="请输入药柜发药出库单流水号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="出库记录发生时间" prop="outDate">
              <el-date-picker v-model="form.outDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="申请单流水号" prop="applyNumber">
              <el-input v-model.number="form.applyNumber" placeholder="请输入申请单流水号" />
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

<script setup name="phaout">
import {
  listPhaOut,
  addPhaOut, delPhaOut,
  updatePhaOut, getPhaOut,
  clearPhaOut,
}
  from '@/api/business/phaout.js'
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
const columns = ref([
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
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var dictParams = [
]


function getList() {
  loading.value = true
  listPhaOut(queryParams).then(res => {
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
    // 出库类型 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    outTypeOptions: [],
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
  proxy.resetForm("formRef")
}

/**
 * 查看
 * @param {*} row
 */
function handlePreview(row) {
  reset()
  const id = row.id
  getPhaOut(id).then((res) => {
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
  title.value = '添加出库记录'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getPhaOut(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改出库记录'
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
        updatePhaOut(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addPhaOut(form.value).then((res) => {
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
      return delPhaOut(Ids)
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
      return clearPhaOut()
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
    .$confirm("是否确认导出出库记录数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/PhaOut/export', { ...queryParams })
    })
}

handleQuery()
</script>