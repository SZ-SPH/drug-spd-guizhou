<!--
 * @Descripttion: (入库单/WarehouseReceipt)
 * @Author: (admin)
 * @Date: (2024-08-05)
-->
<template>
  <div>
    <el-form :model="ReceiptqueryParams" label-position="right" inline ref="ReceiptqueryRef" v-show="ReceiptshowSearch"
      @submit.prevent>
      <el-form-item label="入库单编号" prop="receiptCode">
        <el-input v-model="ReceiptqueryParams.receiptCode" placeholder="请输入入库单编号" />
      </el-form-item>
      <el-form-item label="State" prop="state">
        <el-input v-model="ReceiptqueryParams.state" placeholder="请输入State" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="ReceipthandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="ReceiptresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['warehousereceipt:add']" plain icon="plus" @click="ReceipthandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="ReceiptshowSearch" @queryTable="ReceiptgetList"
        :columns="Receiptcolumns"></right-toolbar>
    </el-row>
    <el-table :data="ReceiptdataList" v-loading="Receiptloading" ref="table" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="ReceiptsortChange">
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
      <el-table-column prop="state" label="State" align="center" :show-overflow-tooltip="true"
        v-if="Receiptcolumns.showColumn('state')" />
      <el-table-column label="操作" width="160">
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
    <el-dialog :title="Receipttitle" :lock-scroll="false" v-model="Receiptopen">
      <el-form ref="ReceiptformRef" :model="Receiptform" :rules="Receiptrules" label-width="100px">
        <el-row :gutter="20">
          <el-col :lg="12">
            <el-form-item label="入库单id" prop="receiptId">
              <el-input v-model.number="Receiptform.receiptId" placeholder="请输入入库单id" />
            </el-form-item>
          </el-col>

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
            <el-form-item label="State" prop="state">
              <el-input v-model="Receiptform.state" placeholder="请输入State" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="Receiptopertype != 3">
        <el-button text @click="Receiptcancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="ReceiptsubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="warehousereceipt">
import {
  listWarehouseReceipt,
  addWarehouseReceipt, delWarehouseReceipt,
  updateWarehouseReceipt, getWarehouseReceipt, sendOutWarehouseReceipt
}
  from '@/api/business/warehousereceipt.js'

const { proxy } = getCurrentInstance()
const Receiptids = ref([])
const Receiptloading = ref(false)
const ReceiptshowSearch = ref(true)
const ReceiptqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  receiptCode: undefined,
  storageTime: undefined,
  creationTime: undefined,
  creator: undefined,
  changeTime: undefined,
  modifiedBy: undefined,
  state: undefined,
})
const Receiptcolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'receiptId', label: '入库单id' },
  { visible: true, align: 'center', type: '', prop: 'receiptCode', label: '入库单编号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'storageTime', label: '入库时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'creationTime', label: '创建时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'creator', label: '创建人', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'changeTime', label: '修改时间', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'modifiedBy', label: '修改人', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'state', label: 'State', showOverflowTooltip: true },
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
    state: null,
    receiptId: null,
    receiptCode: null,
    storageTime: null,
    creationTime: null,
    creator: null,
    changeTime: null,
    modifiedBy: null,
  };
  proxy.resetForm("ReceiptformRef")
}


// 添加按钮操作
function ReceipthandleAdd() {
  Receiptreset();
  Receiptopen.value = true
  Receipttitle.value = '添加入库单'
  Receiptopertype.value = 1
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
</script>