<!--
 * @Descripttion: (送货单追溯码/GYSCodeDetails)
 * @Author: (admin)
 * @Date: (2024-12-03)
-->
<template>
  <div>
    <el-form :model="GYSCodequeryParams" label-position="right" inline ref="GYSCodequeryRef" v-show="GYSCodeshowSearch"
      @submit.prevent>
      <el-form-item label="送货单id" prop="deliveryid">
        <el-input v-model.number="GYSCodequeryParams.deliveryid" placeholder="请输入送货单id" />
      </el-form-item>
      <el-form-item label="药品id" prop="drugId">
        <el-input v-model.number="GYSCodequeryParams.drugId" placeholder="请输入药品id" />
      </el-form-item>
      <el-form-item label="追溯码" prop="code">
        <el-input v-model="GYSCodequeryParams.code" placeholder="请输入追溯码" />
      </el-form-item>
      <el-form-item label="药品名称" prop="physicName">
        <el-input v-model="GYSCodequeryParams.physicName" placeholder="请输入药品名称" />
      </el-form-item>
      <el-form-item label="送货药品" prop="inDeliveryId">
        <el-input v-model.number="GYSCodequeryParams.inDeliveryId" placeholder="请输入送货药品" />
      </el-form-item>
      <el-form-item label="医嘱id" prop="medicalAdviceId">
        <el-input v-model.number="GYSCodequeryParams.medicalAdviceId" placeholder="请输入医嘱id" />
      </el-form-item>
      <el-form-item label="发票号" prop="invoiceCode">
        <el-input v-model="GYSCodequeryParams.invoiceCode" placeholder="请输入发票号" />
      </el-form-item>
      <el-form-item label="父码" prop="parentCode">
        <el-input v-model="GYSCodequeryParams.parentCode" placeholder="请输入父码" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="GYSCodehandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="GYSCodeGYSCoderesetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['gyscodedetails:add']" plain icon="plus" @click="GYSCodehandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="GYSCodesingle" v-hasPermi="['gyscodedetails:edit']" plain icon="edit"
          @click="GYSCodehandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="GYSCodemultiple" v-hasPermi="['gyscodedetails:delete']" plain icon="delete"
          @click="GYSCodehandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['gyscodedetails:delete']" plain icon="delete" @click="GYSCodehandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['gyscodedetails:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/GYSCodeDetails/importTemplate"
                  importUrl="/business/GYSCodeDetails/importData" @success="GYSCodehandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="GYSCodehandleExport"
          v-hasPermi="['gyscodedetails:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="GYSCodeshowSearch" @queryTable="GYSCodegetList"
        :columns="GYSCodecolumns"></right-toolbar>
    </el-row>

    <el-table :data="GYSCodedataList" v-loading="GYSCodeloading" ref="GYSCodetable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="GYSCodesortChange"
      @selection-change="GYSCodehandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="Id" align="center" v-if="GYSCodecolumns.showColumn('id')" />
      <el-table-column prop="deliveryid" label="送货单id" align="center" v-if="GYSCodecolumns.showColumn('deliveryid')" />
      <el-table-column prop="drugId" label="药品id" align="center" v-if="GYSCodecolumns.showColumn('drugId')" />
      <el-table-column prop="code" label="追溯码" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('code')" />
      <el-table-column prop="physicTypeDesc" label="药品类型描述" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('physicTypeDesc')" />
      <el-table-column prop="refEntId" label="企业id" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('refEntId')" />
      <el-table-column prop="entName" label="企业名称" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('entName')" />
      <el-table-column prop="packageLevel" label="码等级" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('packageLevel')" />
      <el-table-column prop="physicName" label="药品名称" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('physicName')" />
      <el-table-column prop="exprie" label="有效期" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('exprie')" />
      <el-table-column prop="drugEntBaseInfoId" label="药品id" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('drugEntBaseInfoId')" />
      <el-table-column prop="approvalLicenceNo" label="批准文号" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('approvalLicenceNo')" />
      <el-table-column prop="pkgSpecCrit" label="包装规格" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('pkgSpecCrit')" />
      <el-table-column prop="prepnSpec" label="制剂规格" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('prepnSpec')" />
      <el-table-column prop="prepnTypeDesc" label="剂型描述" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('prepnTypeDesc')" />
      <el-table-column prop="produceDateStr" label="生产日期" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('produceDateStr')" />
      <el-table-column prop="pkgAmount" label="最小包装数量" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('pkgAmount')" />
      <el-table-column prop="expireDate" label="有效期至" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('expireDate')" />
      <el-table-column prop="batchNo" label="批次号" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('batchNo')" />
      <el-table-column prop="storageTime" label="扫码入库时间" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('storageTime')" />
      <el-table-column prop="inDeliveryId" label="送货药品" align="center"
        v-if="GYSCodecolumns.showColumn('inDeliveryId')" />
      <el-table-column prop="medicalAdviceId" label="医嘱id" align="center"
        v-if="GYSCodecolumns.showColumn('medicalAdviceId')" />
      <el-table-column prop="invoiceCode" label="发票号" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('invoiceCode')" />
      <el-table-column prop="parentCode" label="父码" align="center" :show-overflow-tooltip="true"
        v-if="GYSCodecolumns.showColumn('parentCode')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情"
            @click="GYSCodehandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['gyscodedetails:edit']"
            @click="GYSCodehandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['gyscodedetails:delete']"
            @click="GYSCodehandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="GYSCodetotal" v-model:page="GYSCodequeryParams.pageNum"
      v-model:limit="GYSCodequeryParams.pageSize" @pagination="GYSCodegetList" />


    <el-dialog :title="GYSCodetitle" :lock-scroll="false" v-model="GYSCodeopen">
      <el-form ref="GYSCodeformRef" :model="GYSCodeform" :GYSCoderules="GYSCoderules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12" v-if="GYSCodeopertype != 1">
            <el-form-item label="Id" prop="id">
              <el-input-number v-model.number="GYSCodeform.id" controls-position="right" placeholder="请输入Id"
                :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="送货单id" prop="deliveryid">
              <el-input v-model.number="GYSCodeform.deliveryid" placeholder="请输入送货单id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品id" prop="drugId">
              <el-input v-model.number="GYSCodeform.drugId" placeholder="请输入药品id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="追溯码" prop="code">
              <el-input v-model="GYSCodeform.code" placeholder="请输入追溯码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品类型描述" prop="physicTypeDesc">
              <el-input v-model="GYSCodeform.physicTypeDesc" placeholder="请输入药品类型描述" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="企业id" prop="refEntId">
              <el-input v-model="GYSCodeform.refEntId" placeholder="请输入企业id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="企业名称" prop="entName">
              <el-input v-model="GYSCodeform.entName" placeholder="请输入企业名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="码等级" prop="packageLevel">
              <el-input v-model="GYSCodeform.packageLevel" placeholder="请输入码等级" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品名称" prop="physicName">
              <el-input v-model="GYSCodeform.physicName" placeholder="请输入药品名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="有效期" prop="exprie">
              <el-input v-model="GYSCodeform.exprie" placeholder="请输入有效期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品id" prop="drugEntBaseInfoId">
              <el-input v-model="GYSCodeform.drugEntBaseInfoId" placeholder="请输入药品id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批准文号" prop="approvalLicenceNo">
              <el-input v-model="GYSCodeform.approvalLicenceNo" placeholder="请输入批准文号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装规格" prop="pkgSpecCrit">
              <el-input v-model="GYSCodeform.pkgSpecCrit" placeholder="请输入包装规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="制剂规格" prop="prepnSpec">
              <el-input v-model="GYSCodeform.prepnSpec" placeholder="请输入制剂规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="剂型描述" prop="prepnTypeDesc">
              <el-input v-model="GYSCodeform.prepnTypeDesc" placeholder="请输入剂型描述" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产日期" prop="produceDateStr">
              <el-input v-model="GYSCodeform.produceDateStr" placeholder="请输入生产日期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最小包装数量" prop="pkgAmount">
              <el-input v-model="GYSCodeform.pkgAmount" placeholder="请输入最小包装数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="有效期至" prop="expireDate">
              <el-input v-model="GYSCodeform.expireDate" placeholder="请输入有效期至" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批次号" prop="batchNo">
              <el-input v-model="GYSCodeform.batchNo" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="扫码入库时间" prop="storageTime">
              <el-input v-model="GYSCodeform.storageTime" placeholder="请输入扫码入库时间" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="送货药品" prop="inDeliveryId">
              <el-input v-model.number="GYSCodeform.inDeliveryId" placeholder="请输入送货药品" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="医嘱id" prop="medicalAdviceId">
              <el-input v-model.number="GYSCodeform.medicalAdviceId" placeholder="请输入医嘱id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="发票号" prop="invoiceCode">
              <el-input v-model="GYSCodeform.invoiceCode" placeholder="请输入发票号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="父码" prop="parentCode">
              <el-input v-model="GYSCodeform.parentCode" placeholder="请输入父码" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="GYSCodeopertype != 3">
        <el-button text @click="GYSCodecancel">{{ $t('btn.GYSCodecancel') }}</el-button>
        <el-button type="primary" @click="GYSCodesubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="gyscodedetails">
import {
  listGYSCodeDetails,
  addGYSCodeDetails, delGYSCodeDetails,
  updateGYSCodeDetails, getGYSCodeDetails,
  clearGYSCodeDetails,
}
  from '@/api/business/gyscodedetails.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const GYSCodeids = ref([])
const GYSCodeloading = ref(false)
const GYSCodeshowSearch = ref(true)
const GYSCodequeryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  deliveryid: undefined,
  drugId: undefined,
  code: undefined,
  physicName: undefined,
  inDeliveryId: undefined,
  medicalAdviceId: undefined,
  invoiceCode: undefined,
  parentCode: undefined,
})
const GYSCodecolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'deliveryid', label: '送货单id' },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品id' },
  { visible: true, align: 'center', type: '', prop: 'code', label: '追溯码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'physicTypeDesc', label: '药品类型描述', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'refEntId', label: '企业id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'entName', label: '企业名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'packageLevel', label: '码等级', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'physicName', label: '药品名称', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'exprie', label: '有效期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'drugEntBaseInfoId', label: '药品id', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'approvalLicenceNo', label: '批准文号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'pkgSpecCrit', label: '包装规格', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'prepnSpec', label: '制剂规格', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'prepnTypeDesc', label: '剂型描述', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'produceDateStr', label: '生产日期', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'pkgAmount', label: '最小包装数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'expireDate', label: '有效期至', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'batchNo', label: '批次号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'storageTime', label: '扫码入库时间', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'inDeliveryId', label: '送货药品' },
  { visible: false, align: 'center', type: '', prop: 'medicalAdviceId', label: '医嘱id' },
  { visible: false, align: 'center', type: '', prop: 'invoiceCode', label: '发票号', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'parentCode', label: '父码', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const GYSCodetotal = ref(0)
const GYSCodedataList = ref([])
const GYSCodequeryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var dictParams = [
]


function GYSCodegetList() {
  GYSCodeloading.value = true
  listGYSCodeDetails(GYSCodequeryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      GYSCodedataList.value = data.result
      GYSCodetotal.value = data.totalNum
      GYSCodeloading.value = false
    }
  })
}

// 查询
function GYSCodehandleQuery() {
  GYSCodequeryParams.pageNum = 1
  GYSCodegetList()
}

// 重置查询操作
function GYSCodeGYSCoderesetQuery() {
  proxy.GYSCoderesetForm("GYSCodequeryRef")
  GYSCodehandleQuery()
}
// 多选框选中数据
function GYSCodehandleSelectionChange(selection) {
  GYSCodeids.value = selection.map((item) => item.id);
  GYSCodesingle.value = selection.length != 1
  GYSCodemultiple.value = !selection.length;
}
// 自定义排序
function GYSCodesortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  GYSCodequeryParams.sort = sort
  GYSCodequeryParams.sortType = sortType
  GYSCodehandleQuery()
}

/*************** form操作 ***************/
const GYSCodeformRef = ref()
const GYSCodetitle = ref('')
// 操作类型 1、add 2、edit 3、view
const GYSCodeopertype = ref(0)
const GYSCodeopen = ref(false)
const GYSCodestate = reactive({
  GYSCodesingle: true,
  GYSCodemultiple: true,
  GYSCodeform: {},
  GYSCoderules: {
  },
  GYSCodeoptions: {
  }
})

const { GYSCodeform, GYSCoderules, GYSCodeoptions, GYSCodesingle, GYSCodemultiple } = toRefs(GYSCodestate)

// 关闭dialog
function GYSCodecancel() {
  GYSCodeopen.value = false
  GYSCodereset()
}

// 重置表单
function GYSCodereset() {
  GYSCodeform.value = {
    id: null,
    deliveryid: null,
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
    storageTime: null,
    inDeliveryId: null,
    medicalAdviceId: null,
    invoiceCode: null,
    parentCode: null,
  };
  proxy.GYSCoderesetForm("GYSCodeformRef")
}

/**
 * 查看
 * @param {*} row
 */
function GYSCodehandlePreview(row) {
  GYSCodereset()
  const id = row.id
  getGYSCodeDetails(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      GYSCodeopen.value = true
      GYSCodetitle.value = '查看'
      GYSCodeopertype.value = 3
      GYSCodeform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function GYSCodehandleAdd() {
  GYSCodereset();
  GYSCodeopen.value = true
  GYSCodetitle.value = '添加送货单追溯码'
  GYSCodeopertype.value = 1
}
// 修改按钮操作
function GYSCodehandleUpdate(row) {
  GYSCodereset()
  const id = row.id || GYSCodeids.value
  getGYSCodeDetails(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      GYSCodeopen.value = true
      GYSCodetitle.value = '修改送货单追溯码'
      GYSCodeopertype.value = 2

      GYSCodeform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function GYSCodesubmitForm() {
  proxy.$refs["GYSCodeformRef"].validate((valid) => {
    if (valid) {

      if (GYSCodeform.value.id != undefined && GYSCodeopertype.value === 2) {
        updateGYSCodeDetails(GYSCodeform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          GYSCodeopen.value = false
          GYSCodegetList()
        })
      } else {
        addGYSCodeDetails(GYSCodeform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          GYSCodeopen.value = false
          GYSCodegetList()
        })
      }
    }
  })
}

// 删除按钮操作
function GYSCodehandleDelete(row) {
  const Ids = row.id || GYSCodeids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      GYSCodecancelButtonText: proxy.$t('common.GYSCodecancel'),
      type: "warning",
    })
    .then(function () {
      return delGYSCodeDetails(Ids)
    })
    .then(() => {
      GYSCodegetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function GYSCodehandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      GYSCodecancelButtonText: proxy.$t('common.GYSCodecancel'),
      type: "warning",
    })
    .then(function () {
      return clearGYSCodeDetails()
    })
    .then(() => {
      GYSCodehandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const GYSCodehandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  GYSCodegetList()
}

// 导出按钮操作
function GYSCodehandleExport() {
  proxy
    .$confirm("是否确认导出送货单追溯码数据项?", "警告", {
      confirmButtonText: "确定",
      GYSCodecancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/GYSCodeDetails/export', { ...GYSCodequeryParams })
    })
}

GYSCodehandleQuery()
</script>