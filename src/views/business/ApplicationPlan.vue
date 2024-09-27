<!--
 * @Descripttion: (申请计划/applicationPlan)
 * @Author: (admin)
 * @Date: (2024-09-26)
-->
<template>
  <div>

    <div>
      <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
        <el-form-item label="药品" prop="drugId">
          <el-input v-model.number="queryParams.drugId" placeholder="请输入药品" />
        </el-form-item>
        <el-form-item label="药房" prop="pharmacyId">
          <el-input v-model.number="queryParams.pharmacyId" placeholder="请输入药房" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="queryParams.state">
            <el-radio>全部</el-radio>
            <el-radio v-for="item in options.stateOptions" :key="item.dictValue" :value="item.dictValue">{{
              item.dictLabel
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="dateRangeTimes" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime" :shortcuts="dateOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人" prop="users">
          <el-input v-model="queryParams.users" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item>
          <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <!-- 工具区域 -->
      <el-row :gutter="15" class="mb10">
        <el-col :span="1.5">
          <el-button type="success" v-hasPermi="['applicationplan:edit']" plain icon="edit" @click="handaddOut">
            确认
          </el-button>
        </el-col>
        <!-- <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['applicationplan:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['applicationplan:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['applicationplan:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['applicationplan:delete']" plain icon="delete" @click="handleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['applicationplan:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/ApplicationPlan/importTemplate"
                  importUrl="/business/ApplicationPlan/importData" @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
</el-dropdown>
</el-col>
<el-col :span="1.5">
  <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['applicationplan:export']">
    {{ $t('btn.export') }}
  </el-button>
</el-col>
<right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar> -->
      </el-row>

      <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
        highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="id" label="Id" align="center" v-if="columns.showColumn('id')" />
        <el-table-column prop="drugId" label="药品" align="center" v-if="columns.showColumn('drugId')" />
        <el-table-column prop="pharmacyId" label="药房" align="center" v-if="columns.showColumn('pharmacyId')" />
        <el-table-column prop="qty" label="数量" align="center" v-if="columns.showColumn('qty')" />
        <el-table-column prop="state" label="状态" align="center" v-if="columns.showColumn('state')">
          <template #default="scope">
            <dict-tag :options="options.stateOptions" :value="scope.row.state" />
          </template>
        </el-table-column>
        <el-table-column prop="times" label="时间" :show-overflow-tooltip="true" v-if="columns.showColumn('times')" />
        <el-table-column prop="users" label="操作人" align="center" :show-overflow-tooltip="true"
          v-if="columns.showColumn('users')" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
            <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['applicationplan:edit']"
              @click="handleUpdate(scope.row)"></el-button>
            <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['applicationplan:delete']"
              @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
        @pagination="getList" />


      <el-dialog :title="title" :lock-scroll="false" v-model="open">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
          <el-row :gutter="20">

            <el-col :lg="12" v-if="opertype != 1">
              <el-form-item label="Id" prop="id">
                <el-input-number v-model.number="form.id" controls-position="right" placeholder="请输入Id"
                  :disabled="true" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="药品" prop="drugId">
                <el-input v-model.number="form.drugId" placeholder="请输入药品" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="药房" prop="pharmacyId">
                <el-input v-model.number="form.pharmacyId" placeholder="请输入药房" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="数量" prop="qty">
                <el-input v-model="form.qty" placeholder="请输入数量" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="状态" prop="state">
                <el-radio-group v-model="form.state">
                  <el-radio v-for="item in options.stateOptions" :key="item.dictValue" :value="item.dictValue">
                    {{ item.dictLabel }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="时间" prop="times">
                <el-date-picker v-model="form.times" type="datetime" placeholder="选择日期时间"
                  value-format="YYYY-MM-DD HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="操作人" prop="users">
                <el-input v-model="form.users" placeholder="请输入操作人" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer v-if="opertype != 3">
          <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
        </template>
      </el-dialog>

      <el-dialog :title="Warsetitle" :lock-scroll="false" v-model="Warseopen">
        <!-- <el-form :model="stockqueryParams" label-position="right" inline ref="stockqueryRef" v-show="stockshowSearch"
          @submit.prevent>
          <el-form-item label="药品" prop="drugId">
            <el-input v-model.number="stockqueryParams.drugId" placeholder="请输入药品" />
          </el-form-item>
          <el-form-item label="批号" prop="batchON">
            <el-input v-model="stockqueryParams.batchON" placeholder="请输入批号" />
          </el-form-item>
          <el-form-item label="批次号" prop="batchNum">
            <el-input v-model.number="stockqueryParams.batchNum" placeholder="请输入批次号" />
          </el-form-item>
          <el-form-item label="库房" prop="warehouseID">
            <el-input v-model.number="stockqueryParams.warehouseID" placeholder="请输入库房" />
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="stockhandleQuery">{{ $t('btn.search') }}</el-button>
            <el-button icon="refresh" @click="stockstockresetQuery">{{ $t('btn.reset') }}</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="15" class="mb10">
          <el-col :span="1.5">
            <el-button type="primary" v-hasPermi="['stock:add']" plain icon="plus" @click="stockhandleAdd">
              {{ $t('btn.add') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" :disabled="stocksingle" v-hasPermi="['stock:edit']" plain icon="edit"
              @click="stockhandleUpdate">
              {{ $t('btn.edit') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" :disabled="stockmultiple" v-hasPermi="['stock:delete']" plain icon="delete"
              @click="stockhandleDelete">
              {{ $t('btn.delete') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" v-hasPermi="['stock:delete']" plain icon="delete" @click="stockhandleClear">
              {{ $t('btn.clean') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-dropdown trigger="click" v-hasPermi="['stock:import']">
              <el-button type="primary" plain icon="Upload">
                {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="upload">
                    <importData templateUrl="business/Stock/importTemplate" importUrl="/business/Stock/importData"
                      @success="stockhandleFileSuccess"></importData>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="download" @click="stockhandleExport" v-hasPermi="['stock:export']">
              {{ $t('btn.export') }}
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="stockshowSearch" @queryTable="stockgetList"
            :stockcolumns="stockcolumns"></right-toolbar>
        </el-row> -->
        <el-table :data="stockdataList" v-loading="stockloading" ref="table" border
          header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="stocksortChange"
          @selection-change="stockhandleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="Id" align="center" v-if="stockcolumns.showColumn('id')" />
          <el-table-column prop="drugId" label="药品" align="center" v-if="stockcolumns.showColumn('drugId')" />
          <el-table-column prop="drugqty" label="药品数量" align="center" v-if="stockcolumns.showColumn('drugqty')" />
          <el-table-column prop="purchasePrice" label="购入价" align="center"
            v-if="stockcolumns.showColumn('purchasePrice')" />
          <el-table-column prop="retailPrice" label="零售价" align="center"
            v-if="stockcolumns.showColumn('retailPrice')" />
          <el-table-column prop="inventoryQuantity" label="库存量" align="center" :show-overflow-tooltip="true"
            v-if="stockcolumns.showColumn('inventoryQuantity')" />
          <el-table-column prop="deQuantity" label="预扣数量" align="center" :show-overflow-tooltip="true"
            v-if="stockcolumns.showColumn('deQuantity')" />
          <el-table-column prop="actualStock" label="库存（库存量-预扣）" align="center" :show-overflow-tooltip="true"
            v-if="stockcolumns.showColumn('actualStock')" />
          <el-table-column prop="sUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
            v-if="stockcolumns.showColumn('sUnit')" />
          <el-table-column prop="packqty" label="包装数量" align="center" v-if="stockcolumns.showColumn('packqty')" />
          <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
            v-if="stockcolumns.showColumn('packUnit')" />
          <el-table-column prop="batchON" label="批号" align="center" :show-overflow-tooltip="true"
            v-if="stockcolumns.showColumn('batchON')" />
          <el-table-column prop="batchNum" label="批次号" align="center" v-if="stockcolumns.showColumn('batchNum')" />
          <el-table-column prop="warehouseID" label="库房" align="center" v-if="stockcolumns.showColumn('warehouseID')" />
          <el-table-column label="操作" width="160">
            <template #default="scope">
              <el-button type="primary" size="small" icon="view" stocktitle="详情"
                @click="stockhandlePreview(scope.row)"></el-button>
              <el-button type="success" size="small" icon="edit" stocktitle="编辑" v-hasPermi="['stock:edit']"
                @click="stockhandleUpdate(scope.row)"></el-button>
              <el-button type="danger" size="small" icon="delete" stocktitle="删除" v-hasPermi="['stock:delete']"
                @click="stockhandleDelete(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="stocktotal" v-model:page="stockqueryParams.pageNum"
          v-model:limit="stockqueryParams.pageSize" @pagination="stockgetList" />
        <template #footer>
          <el-button text @click="Warsecancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="WarsesubmitForm">{{ $t('btn.submit') }}</el-button>
        </template>
        <!-- <el-dialog :stocktitle="stocktitle" :lock-scroll="false" v-model="stockopen">
          <el-form ref="stockformRef" :model="stockform" :rules="stockrules" label-width="100px">
            <el-row :gutter="20">

              <el-col :lg="12" v-if="stockopertype != 1">
                <el-form-item label="Id" prop="id">
                  <el-input-number v-model.number="stockform.id" controls-position="right" placeholder="请输入Id"
                    :disabled="true" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="药品" prop="drugId">
                  <el-input v-model.number="stockform.drugId" placeholder="请输入药品" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="药品数量" prop="drugqty">
                  <el-input v-model.number="stockform.drugqty" placeholder="请输入药品数量" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="购入价" prop="purchasePrice">
                  <el-input v-model="stockform.purchasePrice" placeholder="请输入购入价" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="零售价" prop="retailPrice">
                  <el-input v-model="stockform.retailPrice" placeholder="请输入零售价" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="库存量" prop="inventoryQuantity">
                  <el-input v-model="stockform.inventoryQuantity" placeholder="请输入库存量" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="预扣数量" prop="deQuantity">
                  <el-input v-model="stockform.deQuantity" placeholder="请输入预扣数量" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="库存（库存量-预扣）" prop="actualStock">
                  <el-input v-model="stockform.actualStock" placeholder="请输入库存（库存量-预扣）" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="最小单位" prop="sUnit">
                  <el-input v-model="stockform.sUnit" placeholder="请输入最小单位" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="包装数量" prop="packqty">
                  <el-input v-model.number="stockform.packqty" placeholder="请输入包装数量" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="包装单位" prop="packUnit">
                  <el-input v-model="stockform.packUnit" placeholder="请输入包装单位" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="批号" prop="batchON">
                  <el-input v-model="stockform.batchON" placeholder="请输入批号" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="批次号" prop="batchNum">
                  <el-input v-model.number="stockform.batchNum" placeholder="请输入批次号" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="库房" prop="warehouseID">
                  <el-input v-model.number="stockform.warehouseID" placeholder="请输入库房" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <template #footer v-if="stockopertype != 3">
            <el-button text @click="stockcancel">{{ $t('btn.cancel') }}</el-button>
            <el-button type="primary" @click="stocksubmitForm">{{ $t('btn.submit') }}</el-button>
          </template>
        </el-dialog> -->
      </el-dialog>


    </div>

    <div>
      <el-form :model="OutqueryParams" label-position="right" inline ref="OutqueryRef" v-show="OutshowSearch"
        @submit.prevent>
        <el-form-item label="药品" prop="drugId">
          <el-input v-model.number="OutqueryParams.drugId" placeholder="请输入药品" />
        </el-form-item>
        <el-form-item label="出库房" prop="outWarehouseID">
          <el-input v-model.number="OutqueryParams.outWarehouseID" placeholder="请输入出库房" />
        </el-form-item>
        <el-form-item label="入药房" prop="inpharmacyId">
          <el-input v-model.number="OutqueryParams.inpharmacyId" placeholder="请输入入药房" />
        </el-form-item>
        <el-form-item label="数量" prop="qty">
          <el-input v-model="OutqueryParams.qty" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="申请计划" prop="pharmacyId">
          <el-input v-model.number="OutqueryParams.pharmacyId" placeholder="请输入申请计划" />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="OutdateRangeTimes" type="datetimerange" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" :default-time="OutdefaultTime"
            :shortcuts="dateOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="search" type="primary" @click="OuthandleQuery">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="OutresetQuery">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <!-- 工具区域 -->
      <el-row :gutter="15" class="mb10">
        <el-col :span="1.5">
          <el-button type="primary" v-hasPermi="['ouwarehouset:add']" plain icon="plus" @click="OuthandleAdd">
            {{ $t('btn.add') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" :disabled="Outsingle" v-hasPermi="['ouwarehouset:edit']" plain icon="edit"
            @click="OuthandleUpdate">
            {{ $t('btn.edit') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" :disabled="Outmultiple" v-hasPermi="['ouwarehouset:delete']" plain icon="delete"
            @click="OuthandleDelete">
            {{ $t('btn.delete') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" v-hasPermi="['ouwarehouset:delete']" plain icon="delete" @click="OuthandleClear">
            {{ $t('btn.clean') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-dropdown trigger="click" v-hasPermi="['ouwarehouset:import']">
            <el-button type="primary" plain icon="Upload">
              {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="upload">
                  <importData templateUrl="business/OuWarehouset/importTemplate"
                    importUrl="/business/OuWarehouset/importData" @success="OuthandleFileSuccess"></importData>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="download" @click="OuthandleExport" v-hasPermi="['ouwarehouset:export']">
            {{ $t('btn.export') }}
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="OutshowSearch" @queryTable="OutgetList"
          :Outcolumns="Outcolumns"></right-toolbar>
      </el-row>

      <el-table :data="OutdataList" v-loading="Outloading" ref="Outtable" border
        header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="OutsortChange"
        @selection-change="OuthandleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="id" label="Id" align="center" v-if="Outcolumns.showColumn('id')" />
        <el-table-column prop="drugId" label="药品" align="center" v-if="Outcolumns.showColumn('drugId')" />
        <el-table-column prop="outWarehouseID" label="出库房" align="center"
          v-if="Outcolumns.showColumn('outWarehouseID')" />
        <el-table-column prop="inpharmacyId" label="入药房" align="center" v-if="Outcolumns.showColumn('inpharmacyId')" />
        <el-table-column prop="qty" label="数量" align="center" v-if="Outcolumns.showColumn('qty')" />
        <el-table-column prop="pharmacyId" label="申请计划" align="center" v-if="Outcolumns.showColumn('pharmacyId')" />
        <el-table-column prop="times" label="时间" :show-overflow-tooltip="true" v-if="Outcolumns.showColumn('times')" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" size="small" icon="view" Outtitle="详情"
              @click="OuthandlePreview(scope.row)"></el-button>
            <el-button type="success" size="small" icon="edit" Outtitle="编辑" v-hasPermi="['ouwarehouset:edit']"
              @click="OuthandleUpdate(scope.row)"></el-button>
            <el-button type="danger" size="small" icon="delete" Outtitle="删除" v-hasPermi="['ouwarehouset:delete']"
              @click="OuthandleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="Outtotal" v-model:page="OutqueryParams.pageNum" v-model:limit="OutqueryParams.pageSize"
        @pagination="OutgetList" />


      <el-dialog :Outtitle="Outtitle" :lock-scroll="false" v-model="Outopen">
        <el-form ref="OutformRef" :model="Outform" :Outrules="Outrules" label-width="100px">
          <el-row :gutter="20">

            <el-col :lg="12">
              <el-form-item label="Id" prop="id">
                <el-input v-model.number="Outform.id" placeholder="请输入Id" :disabled="Outopertype != 1" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="药品" prop="drugId">
                <el-input v-model.number="Outform.drugId" placeholder="请输入药品" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="出库房" prop="outWarehouseID">
                <el-input v-model.number="Outform.outWarehouseID" placeholder="请输入出库房" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="入药房" prop="inpharmacyId">
                <el-input v-model.number="Outform.inpharmacyId" placeholder="请输入入药房" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="数量" prop="qty">
                <el-input v-model="Outform.qty" placeholder="请输入数量" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="申请计划" prop="pharmacyId">
                <el-input v-model.number="Outform.pharmacyId" placeholder="请输入申请计划" />
              </el-form-item>
            </el-col>

            <el-col :lg="12">
              <el-form-item label="时间" prop="times">
                <el-date-picker v-model="Outform.times" type="datetime" placeholder="选择日期时间"
                  value-format="YYYY-MM-DD HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer v-if="Outopertype != 3">
          <el-button text @click="Outcancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="OutsubmitForm">{{ $t('btn.submit') }}</el-button>
        </template>
      </el-dialog>
    </div>
  </div>

</template>

<script setup name="applicationplan">
import {
  listApplicationPlan,
  addApplicationPlan, delApplicationPlan,
  updateApplicationPlan, getApplicationPlan,
  clearApplicationPlan,
}
  from '@/api/business/applicationplan.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'Id',
  sortType: 'asc',
  drugId: undefined,
  pharmacyId: undefined,
  state: undefined,
  times: undefined,
  users: undefined,
})
const columns = ref([
  { visible: false, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品' },
  { visible: true, align: 'center', type: '', prop: 'pharmacyId', label: '药房' },
  { visible: true, align: 'center', type: '', prop: 'qty', label: '数量' },
  { visible: true, align: 'center', type: 'dict', prop: 'state', label: '状态', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'times', label: '时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'users', label: '操作人', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
// const defaultTime = ref([new Date(2024, 1, 1, 0, 0, 0), new Date(2024, 2, 1, 23, 59, 59)])
const defaultTime = ref([new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 11, 31, 23, 59, 59)]);
// 时间时间范围
// const dateRangeTimes = ref([])
const dateRangeTimes = ref([new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 11, 31, 23, 59, 59)]);

var dictParams = [
]


function getList() {
  proxy.addDateRange(queryParams, dateRangeTimes.value, 'Times');
  loading.value = true
  listApplicationPlan(queryParams).then(res => {
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
  // 时间时间范围
  dateRangeTimes.value = []
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
    // 状态 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
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
    id: null,
    drugId: null,
    pharmacyId: null,
    qty: null,
    state: null,
    times: null,
    users: null,
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
  getApplicationPlan(id).then((res) => {
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
  title.value = '添加申请计划'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getApplicationPlan(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改申请计划'
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
        updateApplicationPlan(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addApplicationPlan(form.value).then((res) => {
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
      return delApplicationPlan(Ids)
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
      return clearApplicationPlan()
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
    .$confirm("是否确认导出申请计划数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/ApplicationPlan/export', { ...queryParams })
    })
}

handleQuery()


import {
  listOuWarehouset,
  addOuWarehouset, delOuWarehouset,
  updateOuWarehouset, getOuWarehouset,
  clearOuWarehouset, aLLADDplanStock
}
  from '@/api/business/ouwarehouset.js'
// import importData from '@/components/ImportData'
const Outids = ref([])
const Outloading = ref(false)
const OutshowSearch = ref(true)
const OutqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'Id',
  sortType: 'asc',
  drugId: undefined,
  outWarehouseID: undefined,
  inpharmacyId: undefined,
  qty: undefined,
  pharmacyId: undefined,
  times: undefined,
})
const Outcolumns = ref([
  { visible: false, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品' },
  { visible: true, align: 'center', type: '', prop: 'outWarehouseID', label: '出库房' },
  { visible: true, align: 'center', type: '', prop: 'inpharmacyId', label: '入药房' },
  { visible: true, align: 'center', type: '', prop: 'qty', label: '数量' },
  { visible: true, align: 'center', type: '', prop: 'pharmacyId', label: '申请计划' },
  { visible: true, align: 'center', type: '', prop: 'times', label: '时间', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const Outtotal = ref(0)
const OutdataList = ref([])
const OutqueryRef = ref()
const OutdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

// 时间时间范围
const OutdateRangeTimes = ref([])


var dictParams = [
]


function OutgetList() {
  proxy.addDateRange(OutqueryParams, OutdateRangeTimes.value, 'Times');
  Outloading.value = true
  listOuWarehouset(OutqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      OutdataList.value = data.result
      Outtotal.value = data.totalNum
      Outloading.value = false
    }
  })
}

// 查询
function OuthandleQuery() {
  OutqueryParams.pageNum = 1
  OutgetList()
}

// 重置查询操作
function OutresetQuery() {
  // 时间时间范围
  OutdateRangeTimes.value = []
  proxy.resetForm("OutqueryRef")
  OuthandleQuery()
}
// 多选框选中数据
function OuthandleSelectionChange(selection) {
  Outids.value = selection.map((item) => item.id);
  Outsingle.value = selection.length != 1
  Outmultiple.value = !selection.length;
}
// 自定义排序
function OutsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  OutqueryParams.sort = sort
  OutqueryParams.sortType = sortType
  OuthandleQuery()
}

/*************** form操作 ***************/
const OutformRef = ref()
const Outtitle = ref('')
// 操作类型 1、add 2、edit 3、view
const Outopertype = ref(0)
const Outopen = ref(false)
const Outstate = reactive({
  Outsingle: true,
  Outmultiple: true,
  Outform: {},
  Outrules: {
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
  },
  Outoptions: {
  }
})

const { Outform, Outrules, Outoptions, Outsingle, Outmultiple } = toRefs(Outstate)

// 关闭dialog
function Outcancel() {
  Outopen.value = false
  Outreset()
}

// 重置表单
function Outreset() {
  form.value = {
    id: null,
    drugId: null,
    outWarehouseID: null,
    inpharmacyId: null,
    qty: null,
    pharmacyId: null,
    times: null,
  };
  proxy.resetForm("OutformRef")
}

/**
 * 查看
 * @param {*} row
 */
function OuthandlePreview(row) {
  Outreset()
  const id = row.id
  getOuWarehouset(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Outopen.value = true
      Outtitle.value = '查看'
      Outopertype.value = 3
      form.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function OuthandleAdd() {
  Outreset();
  Outopen.value = true
  Outtitle.value = '添加出库'
  Outopertype.value = 1
}
// 修改按钮操作
function OuthandleUpdate(row) {
  Outreset()
  const id = row.id || Outids.value
  getOuWarehouset(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Outopen.value = true
      Outtitle.value = '修改出库'
      Outopertype.value = 2

      form.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function OutsubmitForm() {
  proxy.$refs["OutformRef"].validate((valid) => {
    if (valid) {

      if (form.value.id != undefined && Outopertype.value === 2) {
        updateOuWarehouset(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          Outopen.value = false
          OutgetList()
        })
      } else {
        addOuWarehouset(form.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          Outopen.value = false
          OutgetList()
        })
      }
    }
  })
}

// 删除按钮操作
function OuthandleDelete(row) {
  const Outids = row.id || Outids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Outids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      OutcancelButtonText: proxy.$t('common.Outcancel'),
      type: "warning",
    })
    .then(function () {
      return delOuWarehouset(Outids)
    })
    .then(() => {
      OutgetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function OuthandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      OutcancelButtonText: proxy.$t('common.Outcancel'),
      type: "warning",
    })
    .then(function () {
      return clearOuWarehouset()
    })
    .then(() => {
      OuthandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const OuthandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  OutgetList()
}

// 导出按钮操作
function OuthandleExport() {
  proxy
    .$confirm("是否确认导出出库数据项?", "警告", {
      confirmButtonText: "确定",
      OutcancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/OuWarehouset/export', { ...OutqueryParams })
    })
}

OuthandleQuery()

const Warseopen = ref(false)
const Warsetitle = ref()


function handaddOut() {
  //传递值后 默认匹配药品 到后端 获取到当前id 循环添加 后 自动去选择 一个药品库存 
  console.log(ids.value)
  Warseopen.value = true;
  AllGetliststock(ids.value).then(res => {
    console.log(res)

    const { code, data } = res
    if (code == 200) {
      stockdataList.value = data
      // stocktotal.value = data.totalNum
    }
  })
  //出现相关药品库存信息、

}
function WarsesubmitForm() {
  // 获取 库存存在的药品
  // 申请计划 ids.value  后端查询接口 后 添加


  aLLADDplanStock(ids.value).then((res) => {
    // proxy.$modal.msgSuccess("新增成功")
    Warseopen.value = false;
    OutgetList()
  })


}
function Warsecancel() {
  Warseopen.value = false;
}

import {
  listStock,
  addStock, delStock,
  updateStock, getStock,
  clearStock, AllGetliststock
}
  from '@/api/business/stock.js'
const stockids = ref([])
const stockloading = ref(false)
const stockshowSearch = ref(true)
const stockqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'Id',
  sortType: 'asc',
  drugId: undefined,
  batchON: undefined,
  batchNum: undefined,
  warehouseID: undefined,
})
const stockcolumns = ref([
  { visible: false, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品' },
  { visible: true, align: 'center', type: '', prop: 'drugqty', label: '药品数量' },
  { visible: true, align: 'center', type: '', prop: 'purchasePrice', label: '购入价' },
  { visible: true, align: 'center', type: '', prop: 'retailPrice', label: '零售价' },
  { visible: true, align: 'center', type: '', prop: 'inventoryQuantity', label: '库存量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'deQuantity', label: '预扣数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'actualStock', label: '库存（库存量-预扣）', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'sUnit', label: '最小单位', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'packqty', label: '包装数量' },
  { visible: true, align: 'center', type: '', prop: 'packUnit', label: '包装单位', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'batchON', label: '批号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'batchNum', label: '批次号' },
  { visible: true, align: 'center', type: '', prop: 'warehouseID', label: '库房' },
  //{visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const stocktotal = ref(0)
const stockdataList = ref([])
const stockqueryRef = ref()
const stockdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var stockdictParams = [
]


function stockgetList() {
  // stockloading.value = true
  // listStock(stockqueryParams).then(res => {
  //   const { code, data } = res
  //   if (code == 200) {
  //     stockdataList.value = data.result
  //     stocktotal.value = data.totalNum
  //     stockloading.value = false
  //   }
  // })
}

// 查询
function stockhandleQuery() {
  stockqueryParams.pageNum = 1
  stockgetList()
}

// 重置查询操作
function stockstockresetQuery() {
  proxy.resetForm("stockqueryRef")
  stockhandleQuery()
}
// 多选框选中数据
function stockhandleSelectionChange(selection) {
  stockids.value = selection.map((item) => item.id);
  stocksingle.value = selection.length != 1
  stockmultiple.value = !selection.length;
}
// 自定义排序
function stocksortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  stockqueryParams.sort = sort
  stockqueryParams.sortType = sortType
  stockhandleQuery()
}

/*************** form操作 ***************/
const stockformRef = ref()
const stocktitle = ref('')
// 操作类型 1、add 2、edit 3、view
const stockopertype = ref(0)
const stockopen = ref(false)
const stockstate = reactive({
  stocksingle: true,
  stockmultiple: true,
  stockform: {},
  stockrules: {
  },
  stockoptions: {
  }
})

const { stockform, stockrules, stockoptions, stocksingle, stockmultiple } = toRefs(stockstate)

// 关闭dialog
function stockcancel() {
  stockopen.value = false
  stockreset()
}

// 重置表单
function stockreset() {
  stockform.value = {
    id: null,
    drugId: null,
    drugqty: null,
    purchasePrice: null,
    retailPrice: null,
    inventoryQuantity: null,
    deQuantity: null,
    actualStock: null,
    sUnit: null,
    packqty: null,
    packUnit: null,
    batchON: null,
    batchNum: null,
    warehouseID: null,
  };
  proxy.resetForm("stockformRef")
}

/**
 * 查看
 * @param {*} row
  */
function stockhandlePreview(row) {
  stockreset()
  const id = row.id
  getStock(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      stockopen.value = true
      stocktitle.value = '查看'
      stockopertype.value = 3
      stockform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function stockhandleAdd() {
  stockreset();
  stockopen.value = true
  stocktitle.value = '添加库存'
  stockopertype.value = 1
}
// 修改按钮操作
function stockhandleUpdate(row) {
  stockreset()
  const id = row.id || stockids.value
  getStock(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      stockopen.value = true
      stocktitle.value = '修改库存'
      stockopertype.value = 2

      stockform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function stocksubmitForm() {
  proxy.$refs["stockformRef"].validate((valid) => {
    if (valid) {

      if (stockform.value.id != undefined && stockopertype.value === 2) {
        updateStock(stockform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          stockopen.value = false
          stockgetList()
        })
      } else {
        addStock(stockform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          stockopen.value = false
          stockgetList()
        })
      }
    }
  })
}

// 删除按钮操作
function stockhandleDelete(row) {
  const stockids = row.id || stockids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + stockids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      stockcancelButtonText: proxy.$t('common.stockcancel'),
      type: "warning",
    })
    .then(function () {
      return delStock(stockids)
    })
    .then(() => {
      stockgetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function stockhandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      stockcancelButtonText: proxy.$t('common.stockcancel'),
      type: "warning",
    })
    .then(function () {
      return clearStock()
    })
    .then(() => {
      stockhandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const stockhandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  stockgetList()
}

// 导出按钮操作
function stockhandleExport() {
  proxy
    .$confirm("是否确认导出库存数据项?", "警告", {
      confirmButtonText: "确定",
      stockcancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/Stock/export', { ...stockqueryParams })
    })
}

stockhandleQuery()


</script>