<!--
 * @Descripttion: (入库信息/InWarehousing)
 * @Author: (admin)
 * @Date: (2024-06-25)
-->
<template>
  <!-- 入库单据 -->
  <div>
    <el-row :gutter="15" class="mb10">
      <el-form :model="ReceiptqueryParams" label-position="right" inline ref="ReceiptqueryRef"
        v-show="ReceiptshowSearch" @submit.prevent>
        <el-form-item label="入库单" prop="ReceiptCode">
          <el-input v-model="ReceiptqueryParams.ReceiptCode" placeholder="请输入入库单号" />
        </el-form-item>
        <el-form-item>
          <el-button icon="search" type="primary" @click="ReceipthandleQuery">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="ReceiptresetQuery">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['warehousereceipt:add']" plain icon="plus" @click="ReceipthandleAdd">
          增加入库单
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="ReceipthandleSubmithis"
          v-hasPermi="['inwarehousing:export']">
          确认收货
        </el-button>
      </el-col>
    </el-row>
    <el-table @row-click="ReceiptDrugdatalist" :data="ReceiptdataList" v-loading="Receiptloading" ref="table" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="ReceiptsortChange"
      :row-class-name="rowClassName" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="receiptId" label="入库单id" align="center" v-if="Receiptcolumns.showColumn('receiptId')" />
      <el-table-column prop="receiptCode" label="入库单编号" align="center" :show-overflow-tooltip="true"
        v-if="Receiptcolumns.showColumn('receiptCode')" />
      <el-table-column prop="storageTime" label="入库时间" align="center" :show-overflow-tooltip="true"
        v-if="Receiptcolumns.showColumn('storageTime')" />
      <el-table-column prop="creationTime" label="创建时间" align="center" :show-overflow-tooltip="true"
        v-if="Receiptcolumns.showColumn('creationTime')" />
      <el-table-column prop="creator" label="创建人" align="center" :show-overflow-tooltip="true"
        v-if="Receiptcolumns.showColumn('creator')" />
      <el-table-column prop="changeTime" label="修改时间" align="center" :show-overflow-tooltip="true"
        v-if="Receiptcolumns.showColumn('changeTime')" />
      <el-table-column prop="modifiedBy" label="修改人" align="center" :show-overflow-tooltip="true"
        v-if="Receiptcolumns.showColumn('modifiedBy')" />
      <el-table-column prop="state" label="状态" align="center" :show-overflow-tooltip="true"
        v-if="Receiptcolumns.showColumn('state')" />
      <el-table-column prop="invoiceNumber" label="发票号" align="center" :show-overflow-tooltip="true"
        v-if="Receiptcolumns.showColumn('invoiceNumber')" />

      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['warehousereceipt:edit']"
            @click="ReceipthandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['warehousereceipt:delete']"
            @click="ReceipthandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="Receipttotal" v-model:page="ReceiptqueryParams.pageNum"
      v-model:limit="ReceiptqueryParams.pageSize" @pagination="ReceiptgetList" />

  </div>
  <div>
    <div class="table-content">
      <!-- 药品 -->
      <div class="table-item1">
        <el-row :gutter="15" class="mb10">
          <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch"
            @submit.prevent>
            <el-form-item label="药品名称" prop="drugName">
              <el-input v-model="queryParams.drugName" placeholder="请输入药品名称" />
            </el-form-item>
            <el-form-item>
              <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
              <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
            </el-form-item>
          </el-form>
          <el-col :span="1.5">
            <el-button :disabled="queryParams.receiptId == 0" type="primary" v-hasPermi="['inwarehousing:add']" plain
              icon="plus" @click="handleAdd">
              添加明细
            </el-button>
          </el-col>
        </el-row>

        <el-table @row-click="CODEDrugdatalist" :data="dataList" v-loading="loading" ref="table" border
          :row-class-name="rowcodeClassName" header-cell-class-name="el-table-header-cell" highlight-current-row
          @sort-change="sortChange">
          <el-table-column prop="id" label="id" align="center" v-if="columns.showColumn('id')" />
          <el-table-column prop="drugId" label="药品id" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('drugId')" />
          <el-table-column prop="drugName" label="入库药品" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('drugName')" />
          <el-table-column prop="drugCode" label="药品编码" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('drugCode')" />
          <el-table-column prop="codeCount" label="药品有码数量" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('codeCount')">

          </el-table-column>
          <el-table-column prop="inventoryQuantity" label="药品入库数量" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('inventoryQuantity')">
            <template #default="{ row }">
              <el-input v-model="row.inventoryQuantity" size="small" />
            </template>
            <!-- @blur="DrugQuantityChange(row)" -->
          </el-table-column>
          <el-table-column prop="tracingSourceCode" label="药品溯源码" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('tracingSourceCode')" />
          <el-table-column prop="batchNumber" label="药品批号" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('batchNumber')">
            <template #default="{ row }">
              <el-input v-model="row.batchNumber" size="small" />
            </template>
            <!-- @blur="DrugQuantityChange(row)" -->
          </el-table-column>
          <el-table-column prop="drugSpecifications" label="药品规格" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('drugSpecifications')" />
          <!-- 未修改 -->
          <!-- ManufacturerId -->
          <el-table-column prop="manufacturerId" label="生产厂家" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('manufacturerId')" />
          <el-table-column prop="exprie" label="有效期" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('exprie')" />
          <el-table-column prop="price" label="价格" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('price')">
            <template #default="{ row }">
              <el-input v-model="row.price" size="small" />
            </template>
            <!-- @blur="DrugQuantityChange(row)" -->
          </el-table-column>
          <el-table-column prop="locationNumber" label="货位号" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('locationNumber')" />
          <el-table-column prop="dateOfManufacture" label="生产日期" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('dateOfManufacture')" />
          <el-table-column prop="minunit" label="最小单位" align="center" :show-overflow-tooltip="true"
            v-if="columns.showColumn('minunit')" />
          <!-- 未修改 -->

          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button type="success" size="small" icon="FullScreen" title="扫码添加" v-hasPermi="['inwarehousing:add']"
                @click="CodeScreenAdd(scope.row)"></el-button>
              <el-button type="primary" size="small" icon="edit" title="手动添加" v-hasPermi="['inwarehousing:add']"
                @click="CodehandleAdd(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
          @pagination="getList" />


      </div>
      <!-- 详情信息 -->
      <div class="table-item2">
        <el-row :gutter="15" class="mb10">

          <el-form :model="CodequeryParams" label-position="right" inline ref="CodeDrugqueryRef" v-show="CodeshowSearch"
            @submit.prevent>
            <el-form-item label="溯源码" prop="Code">
              <el-input v-model="CodequeryParams.Code" placeholder="请输入溯源码" />
            </el-form-item>
            <el-form-item>
              <el-button icon="search" type="primary" @click="CodehandleQuery">{{ $t('btn.search') }}</el-button>
              <el-button icon="refresh" @click="CoderesetQuery">{{ $t('btn.reset') }}</el-button>
            </el-form-item>
          </el-form>
        </el-row>

        <el-table :data="CodedataList" v-loading="Codeloading" ref="table" border
          header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="CodesortChange"
          @selection-change="CodehandleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="Id" align="center" v-if="Codecolumns.showColumn('id')" />
          <el-table-column prop="receiptid" label="入库单id" align="center" v-if="Codecolumns.showColumn('receiptid')" />
          <el-table-column prop="drugId" label="药品id" align="center" v-if="Codecolumns.showColumn('drugId')" />
          <el-table-column prop="inWarehouseId" label="入库药品id" align="center"
            v-if="Codecolumns.showColumn('inWarehouseId')" />

          <el-table-column prop="code" label="追溯码" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('code')" />
          <el-table-column prop="physicTypeDesc" label="药品类型描述" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('physicTypeDesc')" />
          <el-table-column prop="refEntId" label="企业id" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('refEntId')" />
          <el-table-column prop="entName" label="企业名称" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('entName')" />
          <el-table-column prop="packageLevel" label="码等级" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('packageLevel')" />
          <el-table-column prop="physicName" label="药品名称" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('physicName')" />
          <el-table-column prop="exprie" label="有效期" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('exprie')" />
          <el-table-column prop="drugEntBaseInfoId" label="药品id" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('drugEntBaseInfoId')" />
          <el-table-column prop="approvalLicenceNo" label="批准文号" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('approvalLicenceNo')" />
          <el-table-column prop="pkgSpecCrit" label="包装规格" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('pkgSpecCrit')" />
          <el-table-column prop="prepnSpec" label="制剂规格" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('prepnSpec')" />
          <el-table-column prop="prepnTypeDesc" label="剂型描述" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('prepnTypeDesc')" />
          <el-table-column prop="produceDateStr" label="生产日期" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('produceDateStr')" />
          <el-table-column prop="pkgAmount" label="最小包装数量" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('pkgAmount')" />
          <el-table-column prop="expireDate" label="有效期至" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('expireDate')" />
          <el-table-column prop="batchNo" label="批次号" align="center" :show-overflow-tooltip="true"
            v-if="Codecolumns.showColumn('batchNo')" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" icon="view" title="详情"
                @click="CodehandlePreview(scope.row)"></el-button>
              <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['codedetails:edit']"
                @click="CodehandleUpdate(scope.row)"></el-button>
              <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['codedetails:delete']"
                @click="CodehandleDelete(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="Codetotal" v-model:page="CodequeryParams.pageNum" v-model:limit="CodequeryParams.pageSize"
          @pagination="CodegetList" />

      </div>
    </div>

  </div>
  <el-dialog :title="Codetitle" :lock-scroll="false" v-model="Codeopen">
    <el-form ref="CodeformRef" :model="Codeform" :rules="Coderules" label-width="100px">
      <el-row :gutter="20">

        <el-col :lg="12">
          <el-form-item label="追溯码" prop="code">
            <el-input v-model="Codeform.code" placeholder="请输入追溯码" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="药品类型描述" prop="physicTypeDesc">
            <el-input v-model="Codeform.physicTypeDesc" placeholder="请输入药品类型描述" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="企业id" prop="refEntId">
            <el-input v-model="Codeform.refEntId" placeholder="请输入企业id" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="企业名称" prop="entName">
            <el-input v-model="Codeform.entName" placeholder="请输入企业名称" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="码等级" prop="packageLevel">
            <el-input v-model="Codeform.packageLevel" placeholder="请输入码等级" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="药品名称" prop="physicName">
            <el-input v-model="Codeform.physicName" placeholder="请输入药品名称" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="有效期" prop="exprie">
            <el-input v-model="Codeform.exprie" placeholder="请输入有效期" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="药品id" prop="drugEntBaseInfoId">
            <el-input v-model="Codeform.drugEntBaseInfoId" placeholder="请输入药品id" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="批准文号" prop="approvalLicenceNo">
            <el-input v-model="Codeform.approvalLicenceNo" placeholder="请输入批准文号" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="包装规格" prop="pkgSpecCrit">
            <el-input v-model="Codeform.pkgSpecCrit" placeholder="请输入包装规格" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="制剂规格" prop="prepnSpec">
            <el-input v-model="Codeform.prepnSpec" placeholder="请输入制剂规格" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="剂型描述" prop="prepnTypeDesc">
            <el-input v-model="Codeform.prepnTypeDesc" placeholder="请输入剂型描述" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="生产日期" prop="produceDateStr">
            <el-input v-model="Codeform.produceDateStr" placeholder="请输入生产日期" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="最小包装数量" prop="pkgAmount">
            <el-input v-model="Codeform.pkgAmount" placeholder="请输入最小包装数量" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="有效期至" prop="expireDate">
            <el-input v-model="Codeform.expireDate" placeholder="请输入有效期至" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="批次号" prop="batchNo">
            <el-input v-model="Codeform.batchNo" placeholder="请输入批次号" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer v-if="Codeopertype != 3">
      <el-button text @click="Codecancel">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="CodesubmitForm">{{ $t('btn.submit') }}</el-button>
    </template>
  </el-dialog>
  <!-- 入库单 -->
  <el-dialog :title="Receipttitle" :lock-scroll="false" v-model="Receiptopen">
    <el-form ref="ReceiptformRef" :model="Receiptform" :rules="Receiptrules" label-width="100px">
      <el-row :gutter="20">



        <el-col :lg="12">
          <el-form-item label="入库单编号" prop="receiptCode">
            <el-input v-model="Receiptform.receiptCode" placeholder="请输入入库单编号" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="入库时间" prop="storageTime">
            <el-input v-model="Receiptform.storageTime" placeholder="请输入入库时间" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="创建时间" prop="creationTime">
            <el-input v-model="Receiptform.creationTime" placeholder="请输入创建时间" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="创建人" prop="creator">
            <el-input v-model="Receiptform.creator" placeholder="请输入创建人" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="修改时间" prop="changeTime">
            <el-input v-model="Receiptform.changeTime" placeholder="请输入修改时间" />
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item label="修改人" prop="modifiedBy">
            <el-input v-model="Receiptform.modifiedBy" placeholder="请输入修改人" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="状态" prop="state">
            <el-input v-model="Receiptform.state" placeholder="请输入状态" />
          </el-form-item>
        </el-col> <el-col :lg="12">
          <el-form-item label="发票号" prop="invoiceNumber">
            <el-input v-model="Receiptform.invoiceNumber" placeholder="请输入发票号" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer v-if="opertype != 3">
      <el-button text @click="Receiptcancel">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="ReceiptsubmitForm">{{ $t('btn.submit') }}</el-button>
    </template>
  </el-dialog>
  <!-- 药品选择 -->
  <el-dialog :title="title" :lock-scroll="false" v-model="open">
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
    <el-table :data="DrugdataList" v-loading="Drugloading" ref="drugtable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="DrugsortChange"
      v-model:selection="selectedItems" @selection-change="DrughandleSelectionChange">
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
      <el-table-column prop="minunit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('minunit')" />
      <el-table-column prop="produceName" label="生产厂家" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('produceName')" />
      <el-table-column prop="packageRatio" label="转换系数" align="center" v-if="Drugcolumns.showColumn('packageRatio')" />
      <el-table-column prop="packageUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('packageUnit')" />

    </el-table>
    <pagination :total="Drugtotal" v-model:page="DrugqueryParams.pageNum" v-model:limit="DrugqueryParams.pageSize"
      @pagination="DruggetList" />
    <template #footer v-if="opertype != 3">
      <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
    </template>

  </el-dialog>
  <!-- 扫码入库 -->
  <el-dialog :title="FUllcodetitle" :lock-scroll="false" v-model="FUllcodeopen">
    <el-form ref="FUllcodeformRef" :model="FUllcodeform" :rules="FUllcoderules" label-width="100px">
      <el-row :gutter="20">
        <el-col :lg="12">
          <el-form-item label="溯源码" prop="Code">
            <el-input v-model="FUllcodeform.Code" placeholder="请输入溯源码" ref="refInput" @input="handleInput"
              @blur="handleBlur" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="入库时间" prop="storageTime">
            <el-input v-model="FUllcodeform.storageTime" placeholder="请输入入库时间" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="药品类型描述" prop="physicTypeDesc">
            <el-input v-model="FUllcodeform.physicTypeDesc" placeholder="请输入药品类型描述" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="企业id" prop="refEntId">
            <el-input v-model="FUllcodeform.refEntId" placeholder="请输入企业id" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="企业名称" prop="entName">
            <el-input v-model="FUllcodeform.entName" placeholder="请输入企业名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="码等级" prop="packageLevel">
            <el-input v-model="FUllcodeform.packageLevel" placeholder="请输入码等级" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="药品名称" prop="physicName">
            <el-input v-model="FUllcodeform.physicName" placeholder="请输入药品名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="有效期" prop="exprie">
            <el-input v-model="FUllcodeform.exprie" placeholder="请输入药品有效期" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="药品ID" prop="drugEntBaseInfoId">
            <el-input v-model="FUllcodeform.drugEntBaseInfoId" placeholder="请输入药品ID" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="批准文号" prop="approvalLicenceNo">
            <el-input v-model="FUllcodeform.approvalLicenceNo" placeholder="请输入批准文号" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="包装规格" prop="pkgSpecCrit">
            <el-input v-model="FUllcodeform.pkgSpecCrit" placeholder="请输入包装规格" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="制剂规格" prop="prepnSpec">
            <el-input v-model="FUllcodeform.prepnSpec" placeholder="请输入制剂规格" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="剂型描述" prop="prepnTypeDesc">
            <el-input v-model="FUllcodeform.prepnTypeDesc" placeholder="请输入剂型描述" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="最小包装数量" prop="pkgAmount">
            <el-input v-model="FUllcodeform.pkgAmount" placeholder="请输入最小包装数量" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="有效期至" prop="expireDate">
            <el-input v-model="FUllcodeform.expireDate" placeholder="请输入有效期至" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="批次号" prop="batchNo">
            <el-input v-model="FUllcodeform.batchNo" placeholder="请输入批次号" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button text @click="FUllcodecancel">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="FUllcodesubmitForm">{{ $t('btn.submit') }}</el-button>
    </template>
  </el-dialog>
  <el-dialog :title="Warehousetitle" :lock-scroll="false" v-model="Warehouseopen">
    <el-form :model="WarehousequeryParams" label-position="right" inline ref="WarehousequeryRef"
      v-show="WarehouseshowSearch" @submit.prevent>
      <el-form-item label="名称" prop="name">
        <el-input v-model="WarehousequeryParams.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input v-model="WarehousequeryParams.state" placeholder="请输入状态" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="WarehousequeryParams.code" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="WarehousehandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="WarehouseresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <!-- <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['warehouse:add']" plain icon="plus" @click="WarehousehandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="WarehousehandleExport"
          v-hasPermi="['warehouse:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="WarehouseshowSearch" @queryTable="WarehousegetList"
        :columns="Warehousecolumns"></right-toolbar>
    </el-row> -->

    <el-table :data="WarehousedataList" v-loading="Warehouseloading" ref="Warehousetable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="WarehousesortChange"
      @selection-change="WarehousehandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="id" align="center" v-if="Warehousecolumns.showColumn('id')" />
      <el-table-column prop="name" label="名称" align="center" :show-overflow-tooltip="true"
        v-if="Warehousecolumns.showColumn('name')" />
      <el-table-column prop="state" label="状态" align="center" v-if="Warehousecolumns.showColumn('state')">
        <template #default="scope">
          <dict-tag :options="Warehouseoptions.stateOptions" :value="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column prop="code" label="编码" align="center" :show-overflow-tooltip="true"
        v-if="Warehousecolumns.showColumn('code')" />
      <!-- <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情"
            @click="WarehousehandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['warehouse:edit']"
            @click="WarehousehandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['warehouse:delete']"
            @click="WarehousehandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination :total="Warehousetotal" v-model:page="WarehousequeryParams.pageNum"
      v-model:limit="WarehousequeryParams.pageSize" @pagination="WarehousegetList" />
    <template #footer v-if="opertype != 3">
      <el-button text @click="Warehousecancel">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="WarehousesubmitForm">{{ $t('btn.submit') }}</el-button>
    </template>

  </el-dialog>

</template>

<script setup name="inwarehousing">
import {
  listInWarehousing,
  addInWarehousing, delInWarehousing,
  updateInWarehousing, getInWarehousing,
  getcodedetail
}
  from '@/api/business/inwarehousing.js'
const { proxy } = getCurrentInstance()
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
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
const columns = ref([
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
const total = ref(0)
const dataList = ref([])
const drugdataList = ref([])

const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

var dictParams = [
]

function getList() {
  loading.value = true
  listInWarehousing(queryParams).then(res => {
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
    // id: [{ required: true, message: "id不能为空", trigger: "blur", type: "number" }],
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
  proxy.resetForm("formRef")
}

/**
 * 查看
 * @param {*} row
 */
function handlePreview(row) {
  reset()
  const id = row.id
  getInWarehousing(id).then((res) => {
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
  title.value = '添加入库信息'
  opertype.value = 1
  DrugresetQuery()

}

function handleopenadd(row) {
  //打开界面
}


// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getInWarehousing(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改入库信息'
      opertype.value = 2

      form.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交 获取选择的入库单号 进行填充
function submitForm() {
  // queryParams.receiptId
  // if (form.value.id != undefined && opertype.value === 1) {
  // console.log(FictitiousDrugData.value)
  addInWarehousing(FictitiousDrugData.value).then((res) => {
    proxy.$modal.msgSuccess("新增成功")
    open.value = false
    getList()
    DrugresetQuery()
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
      return delInWarehousing(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}



// 导出按钮操作
function handleExport() {
  proxy
    .$confirm("是否确认导出入库信息数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/InWarehousing/export', { ...queryParams })
    })
}

handleQuery()

import {
  listWarehouseReceipt,
  addWarehouseReceipt, delWarehouseReceipt,
  updateWarehouseReceipt, getWarehouseReceipt, sendOutWarehouseReceipt
}
  from '@/api/business/warehousereceipt.js'

// const { proxy } = getCurrentInstance()
const Receiptids = ref([])
const Receiptloading = ref(false)
const ReceiptshowSearch = ref(true)
const ReceiptqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
})
const Receiptcolumns = ref([
  { visible: false, align: 'center', type: '', prop: 'receiptId', label: '入库单id' },
  { visible: true, align: 'center', type: '', prop: 'receiptCode', label: '入库单编号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'storageTime', label: '入库时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'creationTime', label: '创建时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'creator', label: '创建人', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'changeTime', label: '修改时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'modifiedBy', label: '修改人', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'state', label: '状态', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'invoiceNumber', label: '发票号', showOverflowTooltip: true },



  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const Receipttotal = ref(0)
const ReceiptdataList = ref([])
const ReceiptqueryRef = ref()
const ReceiptdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var ReceiptdictParams = [
]


function ReceiptgetList() {
  Receiptloading.value = true
  listWarehouseReceipt(ReceiptqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      ReceiptdataList.value = data.result
      Receipttotal.value = data.totalNum
      Receiptloading.value = false
    }
  })
}

// 查询
function ReceipthandleQuery() {
  ReceiptqueryParams.pageNum = 1
  ReceiptgetList()
}

// 重置查询操作
function ReceiptresetQuery() {
  proxy.resetForm("ReceiptqueryRef")
  ReceipthandleQuery()
}
// 自定义排序
function ReceiptsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  ReceiptqueryParams.sort = sort
  ReceiptqueryParams.sortType = sortType
  ReceipthandleQuery()
}
const FUllcodeformRef = ref()
const FUllcodetitle = ref('')
const FUllcodeopen = ref(false)

const FUllcode = reactive({
  FUllcodesingle: true,
  FUllcodemultiple: true,
  FUllcodeform: {

  },
  FUllcoderules: {
    // receiptId: [{ required: true, message: "入库单id不能为空", trigger: "blur", type: "number" }],
  },
  FUllcodeoptions: {
  }
})

const { FUllcodeform, FUllcoderules, FUllcodeoptions, FUllcodesingle, FUllcodemultiple } = toRefs(FUllcode)

/*************** form操作 ***************/
const ReceiptformRef = ref()
const Receipttitle = ref('')
// 操作类型 1、add 2、edit 3、view
const Receiptopertype = ref(0)
const Receiptopen = ref(false)
const Receiptstate = reactive({
  Receiptsingle: true,
  Receiptmultiple: true,
  Receiptform: {},
  Receiptrules: {
    receiptId: [{ required: true, message: "入库单id不能为空", trigger: "blur", type: "number" }],
  },
  Receiptoptions: {
  }
})

const { Receiptform, Receiptrules, Receiptoptions, Receiptsingle, Receiptmultiple } = toRefs(Receiptstate)

// 关闭dialog
function Receiptcancel() {
  Receiptopen.value = false
  Receiptreset()
}

// 重置表单
function Receiptreset() {
  Receiptform.value = {
    receiptId: null,
    receiptCode: null,
    storageTime: null,
    creationTime: null,
    creator: null,
    changeTime: null,
    modifiedBy: null,
    state: null,
    invoiceNumber: null,

  };
  proxy.resetForm("ReceiptformRef")
}
import useUserStore from "@/store/modules/user";

var userId = useUserStore().userId;
var userInfo = useUserStore().userInfo;

// 昵称
var nickName = useUserStore().name;

// 添加按钮操作
function ReceipthandleAdd() {
  Receiptreset();
  Receiptopen.value = true
  Receipttitle.value = '添加入库单'
  Receiptopertype.value = 1

  Receiptform.value.changeTime = new Date().toLocaleString();
  Receiptform.value.storageTime = new Date().toLocaleString();
  Receiptform.value.creationTime = new Date().toLocaleString();
  Receiptform.value.creator = nickName
  Receiptform.value.modifiedBy = nickName;

}
// 修改按钮操作
function ReceipthandleUpdate(row) {
  Receiptreset()
  const id = row.receiptId || Receiptids.value
  getWarehouseReceipt(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Receiptopen.value = true
      Receipttitle.value = '修改入库单'
      Receiptopertype.value = 2

      Receiptform.value = {
        ...data,
      }
    }
  })
}
''
// 添加&修改 表单提交
function ReceiptsubmitForm() {
  proxy.$refs["ReceiptformRef"].validate((valid) => {
    if (valid) {

      if (Receiptform.value.receiptId != undefined && Receiptopertype.value === 2) {
        updateWarehouseReceipt(Receiptform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          Receiptopen.value = false
          ReceiptgetList()
        })
      } else {
        addWarehouseReceipt(Receiptform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          Receiptopen.value = false
          ReceiptgetList()
        })
      }
    }
  })
}

// 删除按钮操作
function ReceipthandleDelete(row) {
  const Ids = row.receiptId || Receiptids.value
  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delWarehouseReceipt(Ids)
    })
    .then(() => {
      ReceiptgetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}




ReceipthandleQuery()

// 当前选中的行
const selectedRow = ref(null);
//双击更新数据
function ReceiptDrugdatalist(row) {
  selectedRow.value = row;

  queryParams.receiptId = row.receiptId
  getList()
  if (CodequeryParams.drugId != 0 || CodequeryParams.receiptid != 0) {
    CodequeryParams.receiptid = 0
    CodequeryParams.drugId = 0
    CodegetList()
  }
}



// 当前选中的行
const selectedcodeRow = ref(null);
//双击更新数据
function CODEDrugdatalist(row) {
  selectedcodeRow.value = row;

  CodequeryParams.receiptid = queryParams.receiptId
  CodequeryParams.drugId = row.drugId
  CodequeryParams.inWarehouseId = row.id
  CodegetList()
}
//码信息
import {
  listCodeDetails,
  addCodeDetails, delCodeDetails,
  updateCodeDetails, getCodeDetails,
  clearCodeDetails,
}
  from '@/api/business/codedetails.js'
import importData from '@/components/ImportData'
// const { proxy } = getCurrentInstance()
const Codeids = ref([])
const Codeloading = ref(false)
const CodeshowSearch = ref(true)
const CodequeryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  receiptid: 0,
  drugId: 0,
  inWarehouseId: 0,
  code: undefined,
  refEntId: undefined,
  entName: undefined,
})
const Codecolumns = ref([
  { visible: false, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: false, align: 'center', type: '', prop: 'receiptid', label: '入库单id' },
  { visible: false, align: 'center', type: '', prop: 'drugId', label: '药品id' },

  { visible: false, align: 'center', type: '', prop: 'inWarehouseId', label: '入库药品id' },
  { visible: true, align: 'center', type: '', prop: 'code', label: '追溯码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'physicTypeDesc', label: '药品类型描述', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'refEntId', label: '企业id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'entName', label: '企业名称', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'packageLevel', label: '码等级', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'physicName', label: '药品名称', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'exprie', label: '有效期', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugEntBaseInfoId', label: '药品id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'approvalLicenceNo', label: '批准文号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'pkgSpecCrit', label: '包装规格', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'prepnSpec', label: '制剂规格', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'prepnTypeDesc', label: '剂型描述', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'produceDateStr', label: '生产日期', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'pkgAmount', label: '最小包装数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'expireDate', label: '有效期至', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'batchNo', label: '批次号', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const Codetotal = ref(0)
const CodedataList = ref([])
const CodequeryRef = ref()
const CodedefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var CodedictParams = [
]


function CodegetList() {
  Codeloading.value = true
  listCodeDetails(CodequeryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      CodedataList.value = data.result
      Codetotal.value = data.totalNum
      Codeloading.value = false
    }
  })
}

// 查询
function CodehandleQuery() {
  CodequeryParams.pageNum = 1
  CodegetList()
}

// 重置查询操作
function CoderesetQuery() {
  proxy.resetForm("queryRef")
  CodehandleQuery()
}
// 多选框选中数据
function CodehandleSelectionChange(selection) {
  Codeids.value = selection.map((item) => item.id);
  Codesingle.value = selection.length != 1
  Codemultiple.value = !selection.length;
}
// 自定义排序
function CodesortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  CodequeryParams.sort = sort
  CodequeryParams.sortType = sortType
  CodehandleQuery()
}

/*************** form操作 ***************/
const CodeformRef = ref()
const Codetitle = ref('')
// 操作类型 1、add 2、edit 3、view
const Codeopertype = ref(0)
const Codeopen = ref(false)
const Codestate = reactive({
  Codesingle: true,
  Codemultiple: true,
  Codeform: {},
  Coderules: {
    // id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
  },
  Codeoptions: {
  }
})

const { Codeform, Coderules, Codeoptions, Codesingle, Codemultiple } = toRefs(Codestate)

// 关闭dialog
function Codecancel() {
  Codeopen.value = false
  Codereset()
}

function FUllcodecancel() {
  FUllcodeopen.value = false
  FullCodereset()
}// 重置表单
function FullCodereset() {
  FUllcodeform.value = {
    id: null,
    receiptid: null,
    drugId: null,
    code: null,
    physicTypeDesc: null,
    refEntId: null,
    entName: null,
    packageLevel: null,
    physicName: null,
    exprie: null,
    drugEntBaseInfoId: null,
    approvalLicenceNo: null,
    pkgSpecCrit: null,
    prepnSpec: null,
    prepnTypeDesc: null,
    produceDateStr: null,
    pkgAmount: null,
    expireDate: null,
    batchNo: null,
    inWarehouseId: null,
  };
  proxy.resetForm("CodeformRef")
}
// 重置表单
function Codereset() {
  Codeform.value = {
    id: null,
    receiptid: null,
    drugId: null,
    code: null,
    physicTypeDesc: null,
    refEntId: null,
    entName: null,
    packageLevel: null,
    physicName: null,
    exprie: null,
    drugEntBaseInfoId: null,
    approvalLicenceNo: null,
    pkgSpecCrit: null,
    prepnSpec: null,
    prepnTypeDesc: null,
    produceDateStr: null,
    pkgAmount: null,
    expireDate: null,
    batchNo: null,
    inWarehouseId: null,
  };
  proxy.resetForm("CodeformRef")
}

/**
 * 查看
 * @param {*} row
 */
function CodehandlePreview(row) {
  Codereset()
  const id = row.id
  getCodeDetails(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Codeopen.value = true
      Codetitle.value = '查看'
      Codeopertype.value = 3
      Codeform.value = {
        ...data,
      }
    }
  })
}
import { ref, nextTick } from 'vue';
const refInput = ref()
function CodeScreenAdd(row) {
  FUllcodeopen.value = true
  FUllcodetitle.value = '扫码添加'
  // FUllcodeopertype.value = 1
  // alert(row.id)
  setTimeout(() => {
    refInput.value.focus()
  }, 100
  )
}

//获取数据
// 初始化响应式数据
// const FUllcodeform = ref({
//   FUllcodeCode: '' // 确保这是响应式的
// });

let typingTimeout = null;
import axios from 'axios';
// 处理用户输入
const handleInput = () => {
  console.log('正在输入:', FUllcodeform.value.Code);

  // 清除之前的定时器
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  // 设置新的定时器，在用户输入停止后延迟处理
  typingTimeout = setTimeout(() => {
    console.log('输入结束值：', FUllcodeform.value.Code);
    //调用本地方法
    fetchData(FUllcodeform.value.Code)

  }, 300); // 延迟时间（300ms），可以根据需要调整

};

// 处理失去焦点
const handleBlur = () => {
  // 清除定时器，确保在失去焦点时处理最终值
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    console.log('输入结束值（失去焦点）：', FUllcodeform.value.Code);
  }
};

// 定义 fetchData 函数
const fetchData = async (code) => {
  try {
    const response = await axios.get('http://localhost:8888/Mtaobo/codedetail', {
      params: { codes: code }
    });
    console.log('接口返回数据：', response.data.models);

    // FUllcodeform = response.data
    FUllcodeform.Code = response.data.models.code
    // console.log(response.data.models[0].drugEntBaseDTO.approvalLicenceNo)
    FUllcodeform.value.codeStatus = response.data.models[0].codeStatusTypeDTO.codeStatus
    FUllcodeform.value.approvalLicenceNo = response.data.models[0].drugEntBaseDTO.approvalLicenceNo
    FUllcodeform.value.exprie = response.data.models[0].drugEntBaseDTO.exprie

    FUllcodeform.value.drugEntBaseInfoId = response.data.models[0].drugEntBaseDTO.drugEntBaseInfoId
    FUllcodeform.value.physicName = response.data.models[0].drugEntBaseDTO.physicName
    FUllcodeform.value.physicTypeDesc = response.data.models[0].drugEntBaseDTO.physicTypeDesc
    FUllcodeform.value.pkgSpecCrit = response.data.models[0].drugEntBaseDTO.pkgSpecCrit
    FUllcodeform.value.prepnSpec = response.data.models[0].drugEntBaseDTO.prepnSpec
    FUllcodeform.value.prepnTypeDesc = response.data.models[0].drugEntBaseDTO.prepnTypeDesc
    FUllcodeform.value.entName = response.data.models[0].pUserEntDTO.entName
    FUllcodeform.value.refEntId = response.data.models[0].pUserEntDTO.refEntId
    FUllcodeform.value.packageLevel = response.data.models[0].packageLevel

    FUllcodeform.value.pkgAmount = response.data.models[0].codeProduceInfoDTO.produceInfoList[0].pkgAmount
    FUllcodeform.value.expireDate = response.data.models[0].codeProduceInfoDTO.produceInfoList[0].expireDate
    FUllcodeform.value.batchNo = response.data.models[0].codeProduceInfoDTO.produceInfoList[0].batchNo
    FUllcodeform.value.produceDateStr = response.data.models[0].codeProduceInfoDTO.produceInfoList[0].produceDateStr

    FUllcodeform.value.storageTime = new Date().toLocaleString()

  } catch (error) {
    console.error('请求失败：', error);
  }
};


// 添加按钮操作
function CodehandleAdd(row) {
  Codereset();
  Codeopen.value = true

  Codetitle.value = '添加码信息'
  Codeopertype.value = 1

  Codeform.value.Receiptid = queryParams.receiptId
  Codeform.value.DrugId = row.drugId
  Codeform.value.InWarehouseId = row.id

}
// 修改按钮操作
function CodehandleUpdate(row) {
  Codereset()
  const id = row.id || ids.value
  getCodeDetails(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Codeopen.value = true
      Codetitle.value = '修改码信息'
      Codeopertype.value = 2
      Codeform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function CodesubmitForm() {

  proxy.$refs["CodeformRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined && Codeopertype.value === 2) {
        updateCodeDetails(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          Codeopen.value = false
          CodegetList()
        })
      } else {
        addCodeDetails(Codeform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          Codeopen.value = false
          CodegetList()
        })
      }
    }
  })
}
// 添加&修改 表单提交
function FUllcodesubmitForm() {
  FUllcodeform.value.Receiptid = queryParams.receiptId
  FUllcodeform.value.DrugId = CodequeryParams.drugId
  FUllcodeform.value.InWarehouseId = CodequeryParams.inWarehouseId

  proxy.$refs["FUllcodeformRef"].validate((valid) => {
    if (valid) {
      if (FUllcodeform.value.id != undefined) {
        updateCodeDetails(FUllcodeform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          Codeopen.value = false
          CodegetList()
        })
      } else {
        addCodeDetails(FUllcodeform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          Codeopen.value = false
          CodegetList()
        })
      }
    }
  })


}



// 删除按钮操作
function CodehandleDelete(row) {
  const Ids = row.id || Codeids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delCodeDetails(Ids)
    })
    .then(() => {
      CodegetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function CodehandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return clearCodeDetails()
    })
    .then(() => {
      CodehandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const CodehandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  CodegetList()
}

// 导出按钮操作
function CodehandleExport() {
  proxy
    .$confirm("是否确认导出码信息数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/CodeDetails/export', { ...CodequeryParams })
    })
}

CodehandleQuery()



//药品选择

import {
  listDrug,
  addDrug, delDrug,
  updateDrug, getDrug,
}
  from '@/api/business/drug.js'
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
  { visible: false, align: 'center', type: '', prop: 'drugVarietyName', label: '药品品种名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugClassification', label: '药物分类', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'tracingSourceCode', label: '溯源码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'drugBatchNumber', label: '批号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'minunit', label: '最小单位', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'produceName', label: '生产厂家', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'packageRatio', label: '转换系数' },
  { visible: true, align: 'center', type: '', prop: 'packageUnit', label: '包装单位', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const Drugtotal = ref(0)
const DrugdataList = ref([])
const DrugqueryRef = ref()
const DrugdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


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
const selectedItems = ref([]);
// 获取表格实例的引用
const drugtable = ref(null);
// 标志变量
let alertShown = false;
// 多选框选中数据
function DrughandleSelectionChange(selection) {
  const duplicates = selection.filter(selectedItem => {
    return dataList.value.some(dataItem => dataItem.drugId === selectedItem.drugId);
  });

  if (duplicates.length > 0) {
    // 取消选中的重复行
    if (!alertShown) {
      alert(`选择的数据与现有数据重复！重复项数量: ${duplicates.length}`);
      alertShown = true; // 标记为已弹出
    }
    duplicates.forEach(item => {
      // 通过表格实例取消选中
      drugtable.value.toggleRowSelection(item, false);
    });

    // 更新选中项
    selectedItems.value = selection;
    return; // 如果有重复，不继续后续操作
  }
  alertShown = false;
  Drugids.value = selection.map((item) => item.drugId);
  Drugsingle.value = selection.length != 1
  Drugmultiple.value = !selection.length;
  FictitiousDrugData.value = selection.map((item, index) => {
    return {
      ...item,         // 保留原始对象的其他属性
      ReceiptId: queryParams.receiptId // 添加 redid 属性，假设你要用索引值+1作为 redid
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
const Drugopen = ref(false)
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



DrughandleQuery()

// 多选框选中数据
function handleSelectionChange(selection) {
  Receiptids.value = selection.map((item) => item.receiptId);
  Receiptsingle.value = selection.length != 1
  Receiptmultiple.value = !selection.length;
}
//qrsh
function ReceipthandleSubmithis() {
  Warehouseopen.value = true
  Warehousetitle.value = "选择仓库"

}


import {
  listWarehouse,
  addWarehouse, delWarehouse,
  updateWarehouse, getWarehouse,
}
  from '@/api/business/warehouse.js'


const Warehouseids = ref([])
const Warehouseloading = ref(false)
const WarehouseshowSearch = ref(true)
const WarehousequeryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  name: undefined,
  state: undefined,
  code: undefined,
})
const Warehousecolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'id' },
  { visible: true, align: 'center', type: '', prop: 'name', label: '名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'state', label: '状态', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'code', label: '编码', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const Warehousetotal = ref(0)
const WarehousedataList = ref([])
const WarehousequeryRef = ref()
const WarehousedefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var WarehousedictParams = [
]


function WarehousegetList() {
  Warehouseloading.value = true
  listWarehouse(WarehousequeryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      WarehousedataList.value = data.result
      Warehousetotal.value = data.totalNum
      Warehouseloading.value = false
    }
  })
}

// 查询
function WarehousehandleQuery() {
  WarehousequeryParams.pageNum = 1
  WarehousegetList()
}

// 重置查询操作
function WarehouseresetQuery() {
  proxy.resetForm("WarehousequeryRef")
  WarehousehandleQuery()
}
// 自定义排序
function WarehousesortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  WarehousequeryParams.sort = sort
  WarehousequeryParams.sortType = sortType
  WarehousehandleQuery()
}

/*************** form操作 ***************/
const WarehouseformRef = ref()
const Warehousetitle = ref('')
// 操作类型 1、add 2、edit 3、view
const Warehouseopertype = ref(0)
const Warehouseopen = ref(false)
const Warehousestate = reactive({
  Warehousesingle: true,
  Warehousemultiple: true,
  Warehouseform: {},
  Warehouserules: {
    id: [{ required: true, message: "id不能为空", trigger: "blur", type: "number" }],
  },
  Warehouseoptions: {
    // 状态 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    stateOptions: [],
  }
})

const { Warehouseform, Warehouserules, Warehouseoptions, Warehousesingle, Warehousemultiple } = toRefs(Warehousestate)

// 关闭dialog
function Warehousecancel() {
  Warehouseopen.value = false
  Warehousereset()
}

// 重置表单
function Warehousereset() {
  Warehouseform.value = {
    id: null,
    name: null,
    state: null,
  };
  proxy.resetForm("WarehouseformRef")
}

/**
 * 查看
 * @param {*} row
 */
function WarehousehandlePreview(row) {
  Warehousereset()
  const id = row.id
  getWarehouse(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Warehouseopen.value = true
      Warehousetitle.value = '查看'
      Warehouseopertype.value = 3
      Warehouseform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function WarehousehandleAdd() {
  Warehousereset();
  Warehouseopen.value = true
  Warehousetitle.value = '添加库存查询'
  Warehouseopertype.value = 1
}
// 修改按钮操作
function WarehousehandleUpdate(row) {
  Warehousereset()
  const id = row.id || Warehouseids.value
  getWarehouse(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Warehouseopen.value = true
      Warehousetitle.value = '修改库存查询'
      Warehouseopertype.value = 2

      Warehouseform.value = {
        ...data,
      }
    }
  })
}
const sendOutData = ref()

// 添加&修改 表单提交
function WarehousesubmitForm() {
  //选择一个单据
  if (Warehouseids.value.length == 1) {

    proxy
      .$confirm("是否确认收货" + Receiptids.value.length + "个单据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {

        sendOutData.value.warehouseId = Warehouseids.value[0]
        sendOutData.value.receiptIds = Receiptids.value
        // sendOutData.value.
        //数据分析
        //传递单据
        sendOutWarehouseReceipt(Receiptids.value).then((res) => {
          proxy.$modal.msgSuccess('发送成功')
          Receiptopen.value = false
          ReceiptgetList()
        })
      }
      )
  } else {
    alert("选择一个仓库")
  }


}

// 删除按钮操作
function WarehousehandleDelete(row) {
  const Ids = row.id || Warehouseids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delWarehouse(Ids)
    })
    .then(() => {
      WarehousegetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}



// 导出按钮操作
function WarehousehandleExport() {
  proxy
    .$confirm("是否确认导出库存查询数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/Warehouse/export', { ...WarehousequeryParams })
    })
}

WarehousehandleQuery()
// 多选框选中数据
function WarehousehandleSelectionChange(selection) {
  Warehouseids.value = selection.map((item) => item.id);
  Warehousesingle.value = selection.length != 1
  Warehousemultiple.value = !selection.length;
}


// 动态为行绑定类
function rowClassName({ row }) {
  return row === selectedRow.value ? 'selectedrow' : '';
}

// 动态为行绑定类
function rowcodeClassName({ row }) {
  return row === selectedcodeRow.value ? 'selectedrow' : '';
}

</script>
<style>
.table-content {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.table-item1 {
  width: 70%;
  flex: 1;
}

.table-item2 {
  width: 30%;
  flex: 1;
}

.tb3 {
  margin-top: 42px;
}

/* 定义选中行的背景颜色 */
.selectedrow {
  /* background-color: #65c332 !important; */
  background-color: hsl(119, 67%, 70%) !important;
  /* 自定义的背景色 */
}
</style>
