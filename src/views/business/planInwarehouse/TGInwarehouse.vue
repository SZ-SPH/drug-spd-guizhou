<!--
 * @Descripttion: (采购计划入库/t_g_Inwarehouse)
 * @Author: (admin)
 * @Date: (2024-12-10)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="采购单号" prop="billCode">
        <el-input v-model="queryParams.billCode" placeholder="请输入采购单号" />
      </el-form-item>
      <el-form-item label="入库计划流水号" prop="planNo">
        <el-input v-model="queryParams.planNo" placeholder="请输入入库计划流水号" />
      </el-form-item>
      <el-form-item label="单据状态：" prop="state">
        <el-select clearable v-model="queryParams.state" placeholder="请选择单据状态 :">
          <el-option v-for="item in options.sys_inwarehouse_state " :key="item.dictValue" :label="item.dictLabel"
            :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划类型:" prop="planType">
        <el-select clearable v-model="queryParams.planType" placeholder="请选择计划类型:">
          <el-option v-for="item in options.sys_inwarehouse_plantype " :key="item.dictValue" :label="item.dictLabel"
            :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <!-- <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['tginwarehouse:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['tginwarehouse:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['tginwarehouse:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['tginwarehouse:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" @click="handleGenerateInwarehouse" :disabled="multipleAndSend"
          v-hasPermi="['tginwarehouse:generateInwarehouse']">
          生成入库单
        </el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" @click="handleAppendInwarehouse"
          :disabled="!isAppednInwarehoueEnable" v-hasPermi="['tginwarehouse:generateInwarehouse']">
          追加入库明细
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="refresh">
          同步
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <!-- @row-click="handleInwarehouseRowClick" -->
    <el-table :height="400" :data="dataList" v-loading="loading" ref="table" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="sortChange"
      @selection-change="handleSelectionChange" @current-change="handleCurrentChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="planNo" label="入库计划流水号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('planNo')" />
      <el-table-column prop="billCode" label="采购单号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('billCode')" />
      <el-table-column prop="state" label="单据状态" align="center" v-if="columns.showColumn('state')">
        <template #default="scope">
          <dict-tag :options="options.sys_inwarehouse_state" :value="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="推送状态" align="center" v-if="columns.showColumn('status')">
        <template #default="scope">
          <dict-tag :options="options.sys_inwarehouseplan_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="planType" label="计划类型" align="center" v-if="columns.showColumn('planType')">
        <template #default="scope">
          <dict-tag :options="options.sys_inwarehouse_plantype" :value="scope.row.planType" />
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
      <el-table-column prop="retailPrice" label="参考零售价" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('retailPrice')" />
      <el-table-column prop="wholesalePrice" label="参考批发价" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('wholesalePrice')" />
      <el-table-column prop="purchasePrice" label="最新购入价" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('purchasePrice')" />
      <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('packUnit')" />
      <el-table-column prop="packQty" label="包装数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('packQty')" />
      <el-table-column prop="minUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('minUnit')" />
      <el-table-column prop="producerCode" label="生产厂家编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('producerCode')" />
      <el-table-column prop="producerName" label="生产厂家名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('producerName')" />
      <el-table-column prop="storeNum" label="本科室库存数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('storeNum')" />
      <el-table-column prop="storeTotsum" label="全院库存总和" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('storeTotsum')" />
      <el-table-column prop="outputSum" label="全院出库总量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('outputSum')" />
      <el-table-column prop="planNum" label="计划入库量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('planNum')" />
      <el-table-column prop="planEmpl" label="计划人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('planEmpl')" />
      <el-table-column prop="planDate" label="计划日期" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('planDate')" />
      <el-table-column prop="stockNum" label="采购数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stockNum')" />
      <el-table-column prop="stockEmpl" label="采购人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stockEmpl')" />
      <el-table-column prop="stockDate" label="采购日期" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stockDate')" />
      <el-table-column prop="approveEmpl" label="审批人" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('approveEmpl')" />
      <el-table-column prop="approveDate" label="审批时间" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('approveDate')" />
      <el-table-column prop="stockNo" label="采购流水号" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stockNo')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['tginwarehouse:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['tginwarehouse:delete']"
            @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />


    <div style='display: flex;gap: 30px;margin-top: 20px'>
      <div style='max-width: 50%;'>
        <el-row :gutter="15" class="mb10">
          <el-col :span="1.5">
            <el-button v-hasPermi="['tginwarehouse:delete']" @click="handleInwarehouseDelete(inwarehousestate.itemIds)"
              type="danger" :disabled="inwarehousestate.multiple" plain icon="delete">
              删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['tginwarehouse:delete']"
              @click="handleInwarehousePush(inwarehousestate.inwarehouseNums)" type="success"
              :disabled="inwarehousestate.multiple" plain icon="upload">
              推送
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['tginwarehouse:delete']"
              @click="handleGenerateInwarehouseDialogVisible(inwarehousestate.inwarehouseNums)" type="primary" plain
              icon="download">
              生成入库单
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="inwarehouseGetList"
            :columns="inwarehouseColumns"></right-toolbar>
        </el-row>
        <el-table :data="inwarehouseDataList" :row-key="(row) => { return row.id }" :reserve-selection="true"
          :height='350' v-loading="inwarehouseLoading" ref="inwarehousetable" border
          header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="inwarehouseSortChange"
          @row-click="handleInwarehouseItemRowClick" @current-change="handleInwarehousetableCurrentChange"
          @selection-change="handleInwarehousetableSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="inwarehouseNum" width="200" label="入库单号" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseColumns.showColumn('inwarehouseNum')" />
          <el-table-column prop="pushStatus" width="150" label="推送状态" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseColumns.showColumn('pushStatu')">
            <template #default="scope">
              <dict-tag :options="options.sys_inwarehouse_status" :value="scope.row.pushStatu" />
            </template>
          </el-table-column>
          <el-table-column prop="stockNum" width="200" label="应入库数量" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseColumns.showColumn('stockNum')" />
          <el-table-column prop="createTime" width="180" label="创建时间" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseColumns.showColumn('createTime')" />
          <el-table-column prop="createMan" width="180" label="创建人" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseColumns.showColumn('createMan')" />
          <el-table-column prop="inwarehouseArea" width="180" label="库区" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseColumns.showColumn('inwarehouseArea')" />
          <el-table-column label="操作" width="160">
            <template #default="scope">
              <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['tginwarehouse:edit']"
                @click="handleInwarehouseUpdate(scope.row)"></el-button>
              <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['tginwarehouse:delete']"
                @click="handleInwarehouseDelete(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="inwarehouseTotal" v-model:page="inwarehouseQueryParams.pageNum"
          v-model:limit="inwarehouseQueryParams.pageSize" @pagination="inwarehouseGetList" />
      </div>

      <!-- 第三个表格 -->
      <div style="width: 48%;">
        <el-row :gutter="15" class="mb10">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="inwarehouseitemGetList"
            :columns="inwarehouseitemColumns"></right-toolbar>
        </el-row>
        <el-table :data="inwarehouseitemDataList" :height='350' v-loading="inwarehouseitemLoading"
          ref="inwarehouseitemtable" border header-cell-class-name="el-table-header-cell" highlight-current-row
          @sort-change="inwarehouseitemSortChange" @selection-change="handleInwarehouseitemtableSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="drugCode" width="200" label="药品编码" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('drugCode')" />
          <el-table-column prop="tradeName" width="280" label="药品名称" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('tradeName')" />
          <el-table-column prop="inwarehouseQty" width="180" label="入库数量" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('inwarehouseQty')" />
          <el-table-column prop="remark" width="180" label="备注" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('remark')" />
          <el-table-column prop="drugDeptCode" width="180" label="科室编码" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('drugDeptCode')" />
          <el-table-column prop="specs" width="180" label="规格" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('specs')" />
          <el-table-column prop="retailPrice" width="180" label="参考零售价" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('retailPrice')" />
          <el-table-column prop="wholesalePrice" width="180" label="参考批发价" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('wholesalePrice')" />
          <el-table-column prop="purchasePrice" width="180" label="最新购入价" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('purchasePrice')" />
          <el-table-column prop="packUnit" width="180" label="包装单位" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('packUnit')" />
          <el-table-column prop="packQty" width="180" label="包装数量" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('packQty')" />
          <el-table-column prop="minUnit" width="180" label="最小单位" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('minUnit')" />
          <el-table-column prop="producerCode" width="180" label="生产厂家编码" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('producerCode')" />
          <el-table-column prop="producerName" width="180" label="生产厂家名称" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('producerName')" />
          <el-table-column prop="storeNum" width="180" label="本科室库存数量" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('storeNum')" />
          <el-table-column prop="storeTotsum" width="180" label="全院库存总和" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('storeTotsum')" />
          <el-table-column prop="outputSum" width="180" label="全院出库总量" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('outputSum')" />
          <el-table-column prop="planNum" width="180" label="计划入库量" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('planNum')" />
          <el-table-column prop="planEmpl" width="180" label="计划人" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('planEmpl')" />
          <el-table-column prop="planDate" width="180" label="计划日期" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('planDate')" />
          <el-table-column prop="stockNum" width="180" label="采购数量" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('stockNum')" />
          <el-table-column prop="stockEmpl" width="180" label="采购人" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('stockEmpl')" />
          <el-table-column prop="stockDate" width="180" label="采购日期" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('stockDate')" />
          <el-table-column prop="approveEmpl" width="180" label="审批人" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('approveEmpl')" />
          <el-table-column prop="approveDate" width="180" label="审批时间" align="center" :show-overflow-tooltip="true"
            v-if="inwarehouseitemColumns.showColumn('approveDate')" />
          <el-table-column prop="stockNo" width="180" label="采购流水号" align="center"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="160">
            <template #default="scope">
              <el-button type="success" size="small" icon="edit" title="编辑"
                @click="handleInwarehoueDetailUpdate(scope.row)"></el-button>
              <el-button type="danger" size="small" icon="delete" title="删除"
                @click="handleInwarehoueDetailDelete(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="inwarehouseitemTotal" v-model:page="inwarehouseitemQueryParams.pageNum"
          v-model:limit="inwarehouseitemQueryParams.pageSize" @pagination="inwarehouseitemGetList" />
      </div>
    </div>

    <!-- 生成可选入库单 -->
    <el-dialog title="生成入库单" :lock-scroll="false" v-model="generateInwarehouseDialogOpen">
      <el-form ref="generateInwarehouseRef" :model="generateInwarehouseForm" :rules="generateInwarehouseRules"
        label-width="100px">
        <el-row :gutter="20">
          <el-col :lg="12">
            <el-form-item label="供销商" prop="supplier">
              <el-select clearable v-model="generateInwarehouseForm.SupplierCode" placeholder="请选择供销商 :">
                <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label" :value="item.value">
                  <span class="fl">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 发票号码 -->
          <el-col :lg="12">
            <el-form-item label="发票号码" prop="billCode">
              <el-input v-model="generateInwarehouseForm.BillCode" placeholder="请输入发票号码" />
            </el-form-item>
          </el-col>
          <!-- 发票时间 -->
          <el-col :lg="12">
            <el-form-item label="发票时间" prop="billTime">
              <el-input v-model="generateInwarehouseForm.BillTime" placeholder="请输入发票时间" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitInwarehouseForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>

    <!-- 入库单明细修改 -->
    <!-- :rules="inwarehouseDetailrules" -->
    <el-dialog title="入库单明细修改" :lock-scroll="false" v-model="inwarehouseDetailDialogOpen">
      <el-form ref="inwarehouseDetailFormRef" :model="inwarehouseDetailForm" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12" v-if="opertype != 1">
            <el-form-item label="Id" prop="id">
              <el-input-number v-model.number="inwarehouseDetailForm.id" controls-position="right" placeholder="请输入Id"
                :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品编码" prop="drugCode">
              <el-input v-model="inwarehouseDetailForm.drugCode" placeholder="请输入药品编码 关联 " />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库数量" prop="inwarehouseQty">
              <el-input :disabled="true" v-model.number="inwarehouseDetailForm.inwarehouseQty" placeholder="请输入入库数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="inwarehouseDetailForm.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker v-model="inwarehouseDetailForm.createTime" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库单ID" prop="inwarehouseId">
              <el-input :disabled="true" v-model.number="inwarehouseDetailForm.inwarehouseId" placeholder="请输入入库单ID" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批号" prop="batchNo">
              <el-input v-model="inwarehouseDetailForm.batchNo" placeholder="请输入批号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产日期" prop="productionDate">
              <el-input v-model="inwarehouseDetailForm.productionDate" placeholder="请输入生产日期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="有效期" prop="valiDate">
              <el-input v-model="inwarehouseDetailForm.valiDate" placeholder="请输入有效期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批文信息" prop="approveInfo">
              <el-input v-model="inwarehouseDetailForm.approveInfo" placeholder="请输入批文信息" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="opertype != 3">
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitInwarehouseDetailForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog :title="title" :lock-scroll="false" v-model="open">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12" v-if="opertype != 1">
            <el-form-item label="自增ID" prop="id">
              <el-input-number v-model.number="form.id" controls-position="right" placeholder="请输入自增ID"
                :disabled="true" />
            </el-form-item>
          </el-col>

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
            <el-form-item label="单据状态" prop="state">
              <el-select v-model="form.state" placeholder="请选择单据状态">
                <el-option v-for="item in options.sys_inwarehouse_state" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="计划类型" prop="planType">
              <el-select v-model="form.planType" placeholder="请选择计划类型">
                <el-option v-for="item in options.sys_inwarehouse_plantype" :key="item.dictValue"
                  :label="item.dictLabel" :value="item.dictValue"></el-option>
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
              <el-input v-model="form.planDate" placeholder="请输入计划日期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购数量" prop="stockNum">
              <el-input v-model="form.stockNum" placeholder="请输入采购数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购人" prop="stockEmpl">
              <el-input v-model="form.stockEmpl" placeholder="请输入采购人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购日期" prop="stockDate">
              <el-input v-model="form.stockDate" placeholder="请输入采购日期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="审批人" prop="approveEmpl">
              <el-input v-model="form.approveEmpl" placeholder="请输入审批人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="审批时间" prop="approveDate">
              <el-input v-model="form.approveDate" placeholder="请输入审批时间" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="采购流水号" prop="stockNo">
              <el-input v-model="form.stockNo" placeholder="请输入采购流水号" />
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
              <el-input v-model="form.operDate" placeholder="请输入操作日期" />
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

    <!-- 添加入库条目 -->
    <el-dialog title="添加入库条目" :destroy-on-close="false" :lock-scroll="false" v-model="inwarehouseOpen">
      <div>
        <el-row :gutter="15" class="mb10">
          <el-col :span="1.5">
            <el-button type="success" :disabled="inwarehouseInstate.multiple" plain icon="plus"
              @click="handleInwarehouseInAdd">
              添加
            </el-button>
          </el-col>
        </el-row>
        <el-table :height="400" :data="inwarehouseInDataList" v-loading="inwarehouseInLoading" ref="table" border
          header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="inwarehouseInSortChange"
          @selection-change="handleInwarehouseInSelectionChange" @current-change="handleInwarehouseInCurrentChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="数量" width="180">
            <template #default="scope">
              <el-input-number v-model="scope.row.num" :min="1" />
            </template>
          </el-table-column>
          <el-table-column prop="drugCode" width="180" label="药品编码" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="tradeName" width="180" label="药品名称" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="specs" width="280" label="规格" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="retailPrice" label="参考零售价" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="wholesalePrice" label="参考批发价" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="purchasePrice" label="最新购入价" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="packQty" label="包装数量" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="minUnit" label="最小单位" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="producerName" width="280" label="生产厂家名称" align="center"
            :show-overflow-tooltip="true" />
          <el-table-column prop="storeNum" label="本科室库存数量" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="storeTotsum" label="全院库存总和" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="outputSum" label="全院出库总量" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="planNum" label="计划入库量" align="center" :show-overflow-tooltip="true" />
        </el-table>
        <pagination :total="inwarehouseInTotal" v-model:page="inwarehouseInQueryParams.pageNum"
          v-model:limit="inwarehouseInQueryParams.pageSize" @pagination="inwarehouseInGetList" />
      </div>

    </el-dialog>

    <!-- 修改采购计划 -->
    <el-dialog title="修改采购计划" :lock-scroll="false" v-model="inwarehouseDialogOpen">
      <el-form ref="inwarehouseFormRef" :model="inwarehouseForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :lg="12">
            <el-form-item label="发票号" prop="billCode">
              <el-input v-model="inwarehouseForm.billCode" placeholder="请输入发票号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="发票时间" prop="billTime">
              <el-input v-model="inwarehouseForm.billTime" placeholder="请输入发票时间" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="供销商" prop="supplier">
              <el-select clearable v-model="inwarehouseForm.supplierCode" placeholder="请选择供销商 :">
                <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label" :value="item.value">
                  <span class="fl">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitInwarehouseUpdateForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="tginwarehouse">
import {
  listTGInwarehouse,
  addTGInwarehouse, delTGInwarehouse,
  updateTGInwarehouse, getTGInwarehouse,
  generateInwarehouse, listInwarehouse,
  listInwarehouseitem, delInwarehouse,
  pushInwarehouseOrder, getSupplierInfoList,
  generateSelectiveInwarehouse, AppendSelectiveInwarehouse,
  updateInwarehouseDetailItem, getTInwarehousedetail,
  delTInwarehousedetail, getInwarehouse,
  updateInwarehouse
}
  from '@/api/business/tginwarehouse.js'
const { proxy } = getCurrentInstance()
const ids = ref([])
const generateInwarehouseRef = ref(null)
const loading = ref(false)
const inwarehouseLoading = ref(false)
const inwarehouseInLoading = ref(false)
const inwarehouseitemLoading = ref(false)
const showSearch = ref(true)


//入库明细相关变量
const inwarehouseDetailDialogOpen = ref(false)
const inwarehouseDetailForm = reactive({
  id: undefined,
  drugCode: undefined,
  inwarehouseQty: undefined,
  remark: undefined,
  createTime: undefined,
  inwarehouseId: undefined,
  batchNo: undefined,
  productionDate: undefined,
  valiDate: undefined,
  approveInfo: undefined
})
const submitInwarehouseDetailForm = () => {
  updateInwarehouseDetailItem(inwarehouseDetailForm).then((res) => {
    if (res?.code != 200) return proxy.$message.error(res?.msg)
    proxy.$message.success('操作成功')
  }).catch((err) => {
    proxy.$message.error(err)
  }).finally(() => {
    inwarehouseDetailDialogOpen.value = false
  })
}
//dialog 打开
const handleInwarehoueDetailUpdate = (row) => {
  reset()
  const id = row.id || ids.value
  getTInwarehousedetail(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      inwarehouseDetailDialogOpen.value = true
      Object.assign(inwarehouseDetailForm, data)
    }
  })
}


const handleInwarehoueDetailDelete = (row) => {
  const Ids = row.id || ids.value
  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delTInwarehousedetail(Ids)
    })
    .then(() => {
      proxy.$modal.msgSuccess("删除成功")
    }).finally(() => {
      inwarehouseitemGetList();
    })
}


const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  state: undefined,
  planType: undefined,
  planNo: undefined,
  billCode: undefined,
})

const inwarehouseQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  purchaseOrderNum: undefined,
  planNo: undefined,
  state: undefined,
  planType: undefined,
})

const inwarehouseitemQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  inwarehouseId: undefined,
  state: undefined,
  planType: undefined,
})

const inwarehouseInQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  state: undefined,
  planType: undefined,
})


const inwarehouseColumns = ref([
  { visible: true, align: 'center', type: '', prop: 'inwarehouseNum', label: '入库单号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'pushStatu', label: '推送状态', showOverflowTooltip: true, dictType: 'sys_inwarehouse_status' },
  { visible: true, align: 'center', type: '', prop: 'createTime', label: '创建时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'createMan', label: '创建人', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'remark', label: '备注', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'inwarehouseArea', label: '库区', showOverflowTooltip: true },
])


const inwarehouseitemColumns = ref([
  { visible: true, align: 'center', type: '', prop: 'drugDeptCode', label: '科室编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugCode', label: '药品编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'tradeName', label: '药品名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'InwarehouseQty', label: '入库数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'specs', label: '规格', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'retailPrice', label: '参考零售价', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'wholesalePrice', label: '参考批发价', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'purchasePrice', label: '最新购入价', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packUnit', label: '包装单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packQty', label: '包装数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'minUnit', label: '最小单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'producerCode', label: '生产厂家编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'producerName', label: '生产厂家名称', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'storeNum', label: '本科室库存数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'storeTotsum', label: '全院库存总和', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'outputSum', label: '全院出库总量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'planNum', label: '计划入库量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'planEmpl', label: '计划人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'planDate', label: '计划日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockNum', label: '采购数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockEmpl', label: '采购人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockDate', label: '采购日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveEmpl', label: '审批人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveDate', label: '审批时间', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockNo', label: '采购流水号', showOverflowTooltip: true },
])

const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'planNo', label: '入库计划流水号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'billCode', label: '采购单号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'state', label: '单据状态', showOverflowTooltip: true, dictType: 'sys_inwarehouse_state' },
  { visible: true, align: 'center', type: 'dict', prop: 'planType', label: '计划类型', showOverflowTooltip: true, dictType: 'sys_inwarehouse_plantype' },
  { visible: true, align: 'center', type: 'dict', prop: 'status', label: '推送状态', showOverflowTooltip: true, dictType: 'sys_inwarehouseplan_status' },
  { visible: true, align: 'center', type: '', prop: 'drugDeptCode', label: '科室编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugCode', label: '药品编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'tradeName', label: '药品名称', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'specs', label: '规格', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'retailPrice', label: '参考零售价', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'wholesalePrice', label: '参考批发价', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'purchasePrice', label: '最新购入价', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packUnit', label: '包装单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packQty', label: '包装数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'minUnit', label: '最小单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'producerCode', label: '生产厂家编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'producerName', label: '生产厂家名称', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'storeNum', label: '本科室库存数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'storeTotsum', label: '全院库存总和', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'outputSum', label: '全院出库总量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'planNum', label: '计划入库量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'planEmpl', label: '计划人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'planDate', label: '计划日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockNum', label: '采购数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockEmpl', label: '采购人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockDate', label: '采购日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveEmpl', label: '审批人', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approveDate', label: '审批时间', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'stockNo', label: '采购流水号', showOverflowTooltip: true },
])
const total = ref(0)
const inwarehouseTotal = ref(0)
const inwarehouseitemTotal = ref(0)
const inwarehouseInTotal = ref(0)
const dataList = ref([])
const inwarehouseDataList = ref([])
const inwarehouseInDataList = ref([])
const inwarehouseitemDataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var dictParams = [
  { dictType: "sys_inwarehouse_state" },
  { dictType: "sys_inwarehouse_plantype" },
  { dictType: "sys_inwarehouseplan_status" },
  { dictType: "sys_inwarehouse_status" },
]

proxy.getDicts(dictParams).then((response) => {
  response.data.forEach((element) => {
    state.options[element.dictType] = element.list
  })
})

//生成可选入库单
const handleGenerateInwarehouseDialogVisible = (row) => {
  generateInwarehouseDialogOpen.value = true
}


const inwarehouseForm = reactive({
  stockNum: undefined,
  billCode: undefined,
  billTime: undefined,
  supplierCode: undefined,
  id: undefined,
})
const inwarehouseDialogOpen = ref(false)
//修改入库单
const handleInwarehouseUpdate = (row) => {
  reset()
  const id = row.id || ids.value
  getInwarehouse(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      inwarehouseDialogOpen.value = true
      inwarehouseForm.id = data.id
      inwarehouseForm.stockNum = data.stockNum
      inwarehouseForm.billCode = data.billCode
      inwarehouseForm.billTime = data.billTime
      inwarehouseForm.supplierCode = data.supplierCode
    }
  })
}

const submitInwarehouseUpdateForm = (data) => {
  proxy.$refs["inwarehouseFormRef"].validate((valid) => {
    if (valid) {
      updateInwarehouse(inwarehouseForm).then((res) => {
        proxy.$modal.msgSuccess("修改成功")
        inwarehouseDialogOpen.value = false
        inwarehouseGetList()
      })
    }
  })
}

//追加入库单明细
const handleAppendInwarehouse = (data) => {
  const formatPurchaseOrderSelectionList = purchaseOrderSelectionList.value.map((item) => {
    return {
      planNo: item.planNo,
      billCode: item.billCode,
      stockNum: Number(item.planNum),
      drugCode: item.drugCode,
      inwarehouseNum: inwarehousetableCurrent.value.inwarehouseNum
    }
  })
  AppendSelectiveInwarehouse(formatPurchaseOrderSelectionList).then((res) => {
    if (res.code != 200) return proxy.$message({
      type: 'error',
      message: res.msg
    })
    proxy.$message({
      type: 'success',
      message: '追加入库单成功!'
    });
    cancel();
    handleQuery();
  }).finally(() => {
  })
}

//TODO
const inwarehousetableCurrent = ref(null)
const handleInwarehousetableCurrentChange = (currentRow, oldCurrentRow) => {
  inwarehousetableCurrent.value = currentRow
}

//&& inwarehouseSelectionItem.value.length == 1
const isAppednInwarehoueEnable = computed(() => {
  // 如果表当前值为空，直接返回 false
  if (!inwarehousetableCurrent.value) return false;

  // 如果选择列表为空，返回 false
  if (purchaseOrderSelectionList.value.length === 0) return false;

  // 如果存在状态为 '1' 的项，返回 false；否则返回 true
  return !purchaseOrderSelectionList.value.some(item => item.status == '1');
});


const submitInwarehouseForm = (data) => {
  generateSelectiveInwarehouse(generateInwarehouseForm.value).then((res => {
    if (res.code != 200) return proxy.$message({
      type: 'error',
      message: res.msg
    })
    proxy.$message({
      type: 'success',
      message: '生成入库单成功!'
    });
    cancel();
    generateInwarehouseRef.value.resetFields();
    handleQuery();
  }))
}

const handleInwarehouseItemRowClick = (row) => {
  inwarehouseitemQueryParams.inwarehouseId = row.id
  inwarehouseitemGetList()
}

const handleInwarehousePush = (data) => {
  pushInwarehouseOrder({ billCodes: data }).then((res) => {
    if (res.code != 200) return proxy.$message({
      type: 'error',
      message: res.msg
    })
    proxy.$message({
      type: 'success',
      message: '推送成功!'
    });
  }).finally(() => {
    handleQuery();
  });
}

const handleInwarehouseRowClick = (row) => {
  inwarehouseQueryParams.purchaseOrderNum = row.billCode
  inwarehouseQueryParams.planNo = row.planNo
  inwarehouseGetList()
}

//处理入库推送
const handleInwarehouseConfirm = (data) => {

}

const handleInwarehouseDelete = (data) => {
  let ids = null;
  if (Array.isArray(data)) {
    ids = data.map((item) => item).join(",")
  } else {
    ids = data.id
  }
  proxy.$confirm('是否确认删除入库单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delInwarehouse(ids).then((res) => {
      if (res.code != 200) return proxy.$message({
        type: 'error',
        message: res.msg
      })
      proxy.$message({
        type: 'success',
        message: '删除入库单成功!'
      });
    }).finally(() => {
      handleQuery();
    });
  }).catch(() => {
    proxy.$message({
      type: 'info',
      message: '已取消删除'
    });
  }).finally(() => {
    // handleQuery();
  });
}

const handleInwarehouseInAdd = () => {
  inwarehouseOpen.value = false
}

const handleInwarehouseAdd = () => {
  inwarehouseOpen.value = true
}

const handleGenerateInwarehouse = () => {
  proxy.$confirm('是否确认生成入库单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    generateInwarehouse(inwarehouseSelectionItem.value).then((res) => {
      if (res.code != 200) return proxy.$message({
        type: 'error',
        message: res.msg
      })
      proxy.$message({
        type: 'success',
        message: '生成入库单成功!'
      });
    })
  }).catch((err) => {
    proxy.$message({
      type: 'error',
      message: err
    });
  }).finally(() => {
    handleQuery();
  });
}

function inwarehouseInGetList() {
  inwarehouseInLoading.value = true
  listTGInwarehouse(inwarehouseInQueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      inwarehouseInDataList.value = data.result.map(item => ({
        ...item,
        num: 1 // 添加 num 字段并赋值为 1
      }))
      inwarehouseInTotal.value = data.totalNum
      inwarehouseInLoading.value = false
    }
  })
}

function inwarehouseGetList() {
  inwarehouseLoading.value = true
  listInwarehouse(inwarehouseQueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      inwarehouseDataList.value = data.result
      inwarehouseTotal.value = data.totalNum
      inwarehouseLoading.value = false
    }
  })
}

function inwarehouseitemGetList() {
  inwarehouseitemLoading.value = true
  listInwarehouseitem(inwarehouseitemQueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      inwarehouseitemDataList.value = data.result
      inwarehouseitemTotal.value = data.totalNum
      inwarehouseitemLoading.value = false
    }
  })
}

function getList() {
  loading.value = true
  listTGInwarehouse(queryParams).then(res => {
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
  inwarehouseGetList()
  inwarehouseitemGetList()
  inwarehouseInGetList()
  getList()
}

// 重置查询操作
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

const planNos = reactive({
  value: ''
})

const billCodes = reactive({
  value: ''
})

const inwarehouseSelectionItem = ref(null)

const purchaseOrderSelectionList = ref([])
// 多选框选中数据
function handleSelectionChange(selection) {
  purchaseOrderSelectionList.value = selection
  //console.log(purchaseOrderSelectionList.value)
  // 计算数值相加减
  if (selection.length != 0) {
    planNos.value = selection.map((item) => item.planNo).join(',')
    billCodes.value = selection.filter(
      (item, index, self) => self.findIndex(obj => obj.billCode == item.billCode) == index
    ).map(item => item.billCode)
  }

  const groupedData = selection.reduce((acc, item) => {
    if (!acc[item.billCode]) {
      acc[item.billCode] = {
        billCode: item.billCode,
        planNos: [], // 用于存储所有的 planNo
        stockNum: 0     // 用于累加 stockNum
      };
    }
    // 添加 planNo，避免重复
    if (!acc[item.billCode].planNos.includes(item.planNo)) {
      acc[item.billCode].planNos.push(item.planNo);
    }
    // 累加 stockNum
    acc[item.billCode].stockNum += Number(item.stockNum);
    return acc;
  }, {});

  // 转换分组结果为数组形式
  inwarehouseSelectionItem.value = (Object.values(groupedData))

  single.value = selection.length != 1
  multiple.value = !selection.length;
  // 判断selection是否有值 并且勾选的条目 status 是否为 1
  multipleAndSend.value = !selection.length || selection.some(item => item.status == 1)
}

function handleInwarehouseInSelectionChange(selection) {
  inwarehouseInstate.single = selection.length != 1
  inwarehouseInstate.multiple = !selection.length;
}

const inwarehousestate = reactive({
  ids: [],
  itemIds: [],
  inwarehouseNums: [],
  single: true,
  multiple: true,
})

function handleInwarehousetableSelectionChange(selection) {
  inwarehousestate.ids = selection.map((item) => item.planNo);
  inwarehousestate.itemIds = selection.map((item) => item.id);
  inwarehousestate.inwarehouseNums = selection.map((item) => item.inwarehouseNum);
  inwarehousestate.single = selection.length != 1
  inwarehousestate.multiple = !selection.length;
}

function handleInwarehouseitemtableSelectionChange(selection) {
  // ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1
  multiple.value = !selection.length;
}

const isCurrentSelect = computed(() => {
  return current.value == null
})

const current = ref(null)
function handleCurrentChange(currentRow, oldCurrentRow) {
  current.value = currentRow
}

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

// 自定义排序
function inwarehouseSortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  inwarehouseQueryParams.sort = sort
  inwarehouseQueryParams.sortType = sortType
  handleQuery()
}

function inwarehouseInSortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  inwarehouseInQueryParams.sort = sort
  inwarehouseInQueryParams.sortType = sortType
  handleQuery()
}

function inwarehouseitemSortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  inwarehouseitemQueryParams.sort = sort
  inwarehouseitemQueryParams.sortType = sortType
  handleQuery()
}

/*************** form操作 ***************/
const formRef = ref()
const title = ref('')
// 操作类型 1、add 2、edit 3、view
const opertype = ref(0)
const open = ref(false)
const generateInwarehouseDialogOpen = ref(false)
const inwarehouseOpen = ref(false)
const state = reactive({
  single: true,
  multiple: true,
  multipleAndSend: true,
  form: {},
  generateInwarehouseForm: {
    BillTime: '',
    BillCode: '',
    SupplierCode: ''
  },
  rules: {
  },
  generateInwarehouseRules: {

  },
  options: {
    // 单据状态 0 计划单，1 采购单 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    sys_inwarehouse_state: [],
    // 计划类型0手工计划，1警戒线，2消耗，3时间，4日消耗 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    sys_inwarehouse_plantype: [],
    sys_inwarehouseplan_status: [],
    sys_inwarehouse_status: []
  }
})

const inwarehouseInstate = reactive({
  single: true,
  multiple: true,
})

const { form, rules, options, single, multiple, multipleAndSend, generateInwarehouseRules, generateInwarehouseForm } = toRefs(state)

// 关闭dialog
function cancel() {
  open.value = false
  generateInwarehouseDialogOpen.value = false
  inwarehouseDetailDialogOpen.value = false
  inwarehouseDialogOpen.value = false
  reset()
}

const supplierOptions = ref([]);

// 处理供销商 options
const initSelectSupplierInfo = () => {
  getSupplierInfoList({
    pageNum: 1,
    pageSize: 999999,
    companyType: 1
  }).then((res) => {
    if (res.code !== 200) {
      return proxy.$message({
        type: 'error',
        message: res.msg
      });
    }
    // 使用 map 方法生成新的数组
    supplierOptions.value = res.data.result.map((item) => ({
      label: item.facName,
      value: item.facCode
    }));
  }).catch((error) => {
    proxy.$message({
      type: 'error',
      message: `请求失败: ${error.message}`
    });
  });
};


onMounted(() => {
  initSelectSupplierInfo()
});

// 重置表单
function reset() {
  inwarehouseForm.stockNum = null
  inwarehouseForm.billCode = null
  inwarehouseForm.billTime = null
  inwarehouseForm.supplierCode = null
  form.value = {
    id: null,
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
    stockNum: null,
    stockEmpl: null,
    stockDate: null,
    approveEmpl: null,
    approveDate: null,
    stockNo: null,
    replacePlanNo: null,
    mark: null,
    operCode: null,
    operDate: null,
    extendField: null,
  };
  proxy.resetForm("formRef")
}

// 添加按钮操作
function handleAdd() {
  reset();
  open.value = true
  title.value = '添加采购计划入库'
  opertype.value = 1
}

// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.planNo || ids.value
  getTGInwarehouse(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改采购计划入库'
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
        updateTGInwarehouse(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addTGInwarehouse(form.value).then((res) => {
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
      return delTGInwarehouse(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}



// 导出按钮操作
function handleExport() {
  proxy
    .$confirm("是否确认导出采购计划入库数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/TGInwarehouse/export', { ...queryParams })
    })
}

handleQuery()
</script>