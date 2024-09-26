<!--
 * @Descripttion: (供应商基础功能/SUPPLIER)
 * @Author: (admin)
 * @Date: (2024-08-27)
-->
<template>
  <div>
    <el-form :model="SupplierqueryParams" label-position="right" inline ref="queryRef" v-show="SuppliershowSearch"
      @submit.prevent>
      <el-form-item label="id" prop="id">
        <el-input v-model.number="SupplierqueryParams.id" placeholder="请输入id" />
      </el-form-item>
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input v-model="SupplierqueryParams.supplierName" placeholder="请输入供应商名称" />
      </el-form-item>
      <el-form-item label="社会信用代码" prop="socialCreditCode">
        <el-input v-model="SupplierqueryParams.socialCreditCode" placeholder="请输入社会信用代码" />
      </el-form-item>
      <el-form-item label="企业地址" prop="enterpriseAddress">
        <el-input v-model="SupplierqueryParams.enterpriseAddress" placeholder="请输入企业地址" />
      </el-form-item>
      <el-form-item label="企业电话" prop="enterprisePhone">
        <el-input v-model="SupplierqueryParams.enterprisePhone" placeholder="请输入企业电话" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="SupplierhandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="SupplierresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['supplier:add']" plain icon="plus" @click="SupplierhandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="Suppliersingle" v-hasPermi="['supplier:edit']" plain icon="edit"
          @click="SupplierhandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="Suppliermultiple" v-hasPermi="['supplier:delete']" plain icon="delete"
          @click="SupplierhandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['supplier:delete']" plain icon="delete" @click="SupplierhandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['supplier:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/Supplier/importTemplate" importUrl="/business/Supplier/importData"
                  @success="SupplierhandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="SupplierhandleExport" v-hasPermi="['supplier:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="SuppliershowSearch" @queryTable="SuppliergetList"
        :columns="Suppliercolumns"></right-toolbar>
    </el-row>

    <el-table :data="SupplierdataList" v-loading="Supplierloading" ref="Suppliertable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="SuppliersortChange"
      @selection-change="SupplierhandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="id" align="center" v-if="Suppliercolumns.showColumn('id')" />
      <el-table-column prop="supplierName" label="供应商名称" align="center" :show-overflow-tooltip="true"
        v-if="Suppliercolumns.showColumn('supplierName')" />
      <el-table-column prop="socialCreditCode" label="社会信用代码" align="center" :show-overflow-tooltip="true"
        v-if="Suppliercolumns.showColumn('socialCreditCode')" />
      <el-table-column prop="enterpriseAddress" label="企业地址" align="center" :show-overflow-tooltip="true"
        v-if="Suppliercolumns.showColumn('enterpriseAddress')" />
      <el-table-column prop="enterprisePhone" label="企业电话" align="center" :show-overflow-tooltip="true"
        v-if="Suppliercolumns.showColumn('enterprisePhone')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情"
            @click="SupplierhandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['supplier:edit']"
            @click="SupplierhandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['supplier:delete']"
            @click="SupplierhandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="Suppliertotal" v-model:page="SupplierqueryParams.pageNum"
      v-model:limit="SupplierqueryParams.pageSize" @pagination="SuppliergetList" />


    <el-dialog :title="Suppliertitle" :lock-scroll="false" v-model="Supplieropen">
      <el-form ref="SupplierformRef" :model="Supplierform" :rules="Supplierrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="id" prop="id">
              <el-input v-model.number="Supplierform.id" placeholder="请输入id" :disabled="Supplieropertype != 1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="Supplierform.supplierName" placeholder="请输入供应商名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="社会信用代码" prop="socialCreditCode">
              <el-input v-model="Supplierform.socialCreditCode" placeholder="请输入社会信用代码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="企业地址" prop="enterpriseAddress">
              <el-input v-model="Supplierform.enterpriseAddress" placeholder="请输入企业地址" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="企业电话" prop="enterprisePhone">
              <el-input v-model="Supplierform.enterprisePhone" placeholder="请输入企业电话" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="Supplieropertype != 3">
        <el-button text @click="Suppliercancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="SuppliersubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="supplier">
import {
  listSupplier,
  addSupplier, delSupplier,
  updateSupplier, getSupplier,
  clearSupplier,
}
  from '@/api/business/supplier.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const Supplierids = ref([])
const Supplierloading = ref(false)
const SuppliershowSearch = ref(true)
const SupplierqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  id: undefined,
  supplierName: undefined,
  socialCreditCode: undefined,
  enterpriseAddress: undefined,
  enterprisePhone: undefined,
})
const Suppliercolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'id' },
  { visible: true, align: 'center', type: '', prop: 'supplierName', label: '供应商名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'socialCreditCode', label: '社会信用代码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'enterpriseAddress', label: '企业地址', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'enterprisePhone', label: '企业电话', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const Suppliertotal = ref(0)
const SupplierdataList = ref([])
const SupplierqueryRef = ref()
const SupplierdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var SupplierdictParams = [
]


function SuppliergetList() {
  Supplierloading.value = true
  listSupplier(SupplierqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      SupplierdataList.value = data.result
      Suppliertotal.value = data.totalNum
      Supplierloading.value = false
    }
  })
}

// 查询
function SupplierhandleQuery() {
  SupplierqueryParams.pageNum = 1
  SuppliergetList()
}

// 重置查询操作
function SupplierresetQuery() {
  proxy.resetForm("SupplierqueryRef")
  SupplierhandleQuery()
}
// 多选框选中数据
function SupplierhandleSelectionChange(selection) {
  Supplierids.value = selection.map((item) => item.id);
  Suppliersingle.value = selection.length != 1
  Suppliermultiple.value = !selection.length;
}
// 自定义排序
function SuppliersortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  SupplierqueryParams.sort = sort
  SupplierqueryParams.sortType = sortType
  SupplierhandleQuery()
}

/*************** form操作 ***************/
const SupplierformRef = ref()
const Suppliertitle = ref('')
// 操作类型 1、add 2、edit 3、view
const Supplieropertype = ref(0)
const Supplieropen = ref(false)
const Supplierstate = reactive({
  Suppliersingle: true,
  Suppliermultiple: true,
  Supplierform: {},
  Supplierrules: {
    id: [{ required: true, message: "id不能为空", trigger: "blur", type: "number" }],
  },
  Supplieroptions: {
  }
})

const { Supplierform, Supplierrules, Supplieroptions, Suppliersingle, Suppliermultiple } = toRefs(Supplierstate)

// 关闭dialog
function Suppliercancel() {
  Supplieropen.value = false
  Supplierreset()
}

// 重置表单
function Supplierreset() {
  Supplierform.value = {
    id: null,
    supplierName: null,
    socialCreditCode: null,
    enterpriseAddress: null,
    enterprisePhone: null,
  };
  proxy.resetForm("SupplierformRef")
}

/**
 * 查看
 * @param {*} row
 */
function SupplierhandlePreview(row) {
  Supplierreset()
  const id = row.id
  getSupplier(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Supplieropen.value = true
      Suppliertitle.value = '查看'
      Supplieropertype.value = 3
      Supplierform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function SupplierhandleAdd() {
  Supplierreset();
  Supplieropen.value = true
  Suppliertitle.value = '添加供应商基础功能'
  Supplieropertype.value = 1
}
// 修改按钮操作
function SupplierhandleUpdate(row) {
  Supplierreset()
  const id = row.id || ids.value
  getSupplier(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      Supplieropen.value = true
      Suppliertitle.value = '修改供应商基础功能'
      Supplieropertype.value = 2

      Supplierform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function SuppliersubmitForm() {
  proxy.$refs["SupplierformRef"].validate((valid) => {
    if (valid) {

      if (Supplierform.value.id != undefined && Supplieropertype.value === 2) {
        updateSupplier(Supplierform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          Supplieropen.value = false
          SuppliergetList()
        })
      } else {
        addSupplier(Supplierform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          Supplieropen.value = false
          SuppliergetList()
        })
      }
    }
  })
}

// 删除按钮操作
function SupplierhandleDelete(row) {
  const Ids = row.id || Supplierids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delSupplier(Ids)
    })
    .then(() => {
      SuppliergetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function SupplierhandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return clearSupplier()
    })
    .then(() => {
      SupplierhandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const SupplierhandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  SuppliergetList()
}

// 导出按钮操作
function SupplierhandleExport() {
  proxy
    .$confirm("是否确认导出供应商基础功能数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/Supplier/export', { ...SupplierqueryParams })
    })
}

SupplierhandleQuery()
</script>