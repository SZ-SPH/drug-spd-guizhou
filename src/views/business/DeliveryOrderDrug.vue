<!--
 * @Descripttion: (送货单药品/DeliveryOrderDrug)
 * @Author: (admin)
 * @Date: (2024-08-27)
-->
<template>
  <div>
    <el-form :model="DeliveryDrugqueryParams" label-position="right" inline ref="DeliveryDrugqueryRef"
      v-show="DeliveryDrugshowSearch" @submit.prevent>
      <el-form-item label="DeliveryId" prop="deliveryId">
        <el-input v-model="DeliveryDrugqueryParams.deliveryId" placeholder="请输入DeliveryId" />
      </el-form-item>
      <el-form-item label="药品id" prop="drugId">
        <el-input v-model="DeliveryDrugqueryParams.drugId" placeholder="请输入药品id" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="DeliveryDrughandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="DeliveryDrugresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['deliveryorderdrug:add']" plain icon="plus"
          @click="DeliveryDrughandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="DeliveryDrugsingle" v-hasPermi="['deliveryorderdrug:edit']" plain
          icon="edit" @click="DeliveryDrughandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="DeliveryDrugmultiple" v-hasPermi="['deliveryorderdrug:delete']" plain
          icon="delete" @click="DeliveryDrughandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['deliveryorderdrug:delete']" plain icon="delete"
          @click="DeliveryDrughandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['deliveryorderdrug:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/DeliveryOrderDrug/importTemplate"
                  importUrl="/business/DeliveryOrderDrug/importData" @success="DeliveryDrughandleFileSuccess">
                </importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="DeliveryDrughandleExport"
          v-hasPermi="['deliveryorderdrug:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="DeliveryDrugshowSearch" @queryTable="DeliveryDruggetList"
        :columns="DeliveryDrugcolumns"></right-toolbar>
    </el-row>

    <el-table :data="DeliveryDrugdataList" v-loading="DeliveryDrugloading" ref="DeliveryDrugtable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="DeliveryDrugsortChange"
      @selection-change="DeliveryDrughandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="Id" align="center" v-if="DeliveryDrugcolumns.showColumn('id')" />
      <el-table-column prop="deliveryId" label="DeliveryId" align="center" :show-overflow-tooltip="true"
        v-if="DeliveryDrugcolumns.showColumn('deliveryId')" />
      <el-table-column prop="drugId" label="药品id" align="center" :show-overflow-tooltip="true"
        v-if="DeliveryDrugcolumns.showColumn('drugId')" />
      <el-table-column prop="drugDetails" label="药品信息" align="center" :show-overflow-tooltip="true"
        v-if="DeliveryDrugcolumns.showColumn('drugDetails')" />
      <el-table-column prop="drugQuantity" label="数量" align="center" :show-overflow-tooltip="true"
        v-if="DeliveryDrugcolumns.showColumn('drugQuantity')" />
      <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="DeliveryDrugcolumns.showColumn('remarks')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情"
            @click="DeliveryDrughandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['deliveryorderdrug:edit']"
            @click="DeliveryDrughandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['deliveryorderdrug:delete']"
            @click="DeliveryDrughandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="DeliveryDrugtotal" v-model:page="DeliveryDrugqueryParams.pageNum"
      v-model:limit="DeliveryDrugqueryParams.pageSize" @pagination="DeliveryDruggetList" />


    <el-dialog :title="DeliveryDrugtitle" :lock-scroll="false" v-model="DeliveryDrugopen">
      <el-form ref="DeliveryDrugformRef" :model="DeliveryDrugform" :rules="DeliveryDrugrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="Id" prop="id">
              <el-input v-model.number="DeliveryDrugform.id" placeholder="请输入Id"
                :disabled="DeliveryDrugopertype != 1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="DeliveryId" prop="deliveryId">
              <el-input v-model="DeliveryDrugform.deliveryId" placeholder="请输入DeliveryId" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品id" prop="drugId">
              <el-input v-model="DeliveryDrugform.drugId" placeholder="请输入药品id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品信息" prop="drugDetails">
              <el-input v-model="DeliveryDrugform.drugDetails" placeholder="请输入药品信息" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="数量" prop="drugQuantity">
              <el-input v-model="DeliveryDrugform.drugQuantity" placeholder="请输入数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="DeliveryDrugform.remarks" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="DeliveryDrugopertype != 3">
        <el-button text @click="DeliveryDrugcancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="DeliveryDrugsubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="deliveryorderdrug">
import {
  listDeliveryOrderDrug,
  addDeliveryOrderDrug, delDeliveryOrderDrug,
  updateDeliveryOrderDrug, getDeliveryOrderDrug,
  clearDeliveryOrderDrug,
}
  from '@/api/business/deliveryorderdrug.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const DeliveryDrugids = ref([])
const DeliveryDrugloading = ref(false)
const DeliveryDrugshowSearch = ref(true)
const DeliveryDrugqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  deliveryId: undefined,
  drugId: undefined,
})
const DeliveryDrugcolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'deliveryId', label: 'DeliveryId', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugDetails', label: '药品信息', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugQuantity', label: '数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'remarks', label: '备注', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const DeliveryDrugtotal = ref(0)
const DeliveryDrugdataList = ref([])
const DeliveryDrugqueryRef = ref()
const DeliveryDrugdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var DeliveryDrugdictParams = [
]


function DeliveryDruggetList() {
  DeliveryDrugloading.value = true
  listDeliveryOrderDrug(DeliveryDrugqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      DeliveryDrugdataList.value = data.result
      DeliveryDrugtotal.value = data.totalNum
      DeliveryDrugloading.value = false
    }
  })
}

// 查询
function DeliveryDrughandleQuery() {
  DeliveryDrugqueryParams.pageNum = 1
  DeliveryDruggetList()
}

// 重置查询操作
function DeliveryDrugresetQuery() {
  proxy.resetForm("DeliveryDrugqueryRef")
  DeliveryDrughandleQuery()
}
// 多选框选中数据
function DeliveryDrughandleSelectionChange(selection) {
  DeliveryDrugids.value = selection.map((item) => item.id);
  DeliveryDrugsingle.value = selection.length != 1
  DeliveryDrugmultiple.value = !selection.length;
}
// 自定义排序
function DeliveryDrugsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  DeliveryDrugqueryParams.sort = sort
  DeliveryDrugqueryParams.sortType = sortType
  DeliveryDrughandleQuery()
}

/*************** form操作 ***************/
const DeliveryDrugformRef = ref()
const DeliveryDrugtitle = ref('')
// 操作类型 1、add 2、edit 3、view
const DeliveryDrugopertype = ref(0)
const DeliveryDrugopen = ref(false)
const DeliveryDrugstate = reactive({
  DeliveryDrugsingle: true,
  DeliveryDrugmultiple: true,
  DeliveryDrugform: {},
  DeliveryDrugrules: {
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
  },
  DeliveryDrugoptions: {
  }
})

const { DeliveryDrugform, DeliveryDrugrules, DeliveryDrugoptions, DeliveryDrugsingle, DeliveryDrugmultiple } = toRefs(DeliveryDrugstate)

// 关闭dialog
function DeliveryDrugcancel() {
  DeliveryDrugopen.value = false
  DeliveryDrugreset()
}

// 重置表单
function DeliveryDrugreset() {
  DeliveryDrugform.value = {
    id: null,
    deliveryId: null,
    drugId: null,
    drugDetails: null,
    drugQuantity: null,
    remarks: null,
  };
  proxy.resetForm("DeliveryDrugformRef")
}

/**
 * 查看
 * @param {*} row
 */
function DeliveryDrughandlePreview(row) {
  DeliveryDrugreset()
  const id = row.id
  getDeliveryOrderDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      DeliveryDrugopen.value = true
      DeliveryDrugtitle.value = '查看'
      DeliveryDrugopertype.value = 3
      DeliveryDrugform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function DeliveryDrughandleAdd() {
  DeliveryDrugreset();
  DeliveryDrugopen.value = true
  DeliveryDrugtitle.value = '添加送货单药品'
  DeliveryDrugopertype.value = 1
}
// 修改按钮操作
function DeliveryDrughandleUpdate(row) {
  DeliveryDrugreset()
  const id = row.id || DeliveryDrugids.value
  getDeliveryOrderDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      DeliveryDrugopen.value = true
      DeliveryDrugtitle.value = '修改送货单药品'
      DeliveryDrugopertype.value = 2

      DeliveryDrugform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function DeliveryDrugsubmitForm() {
  proxy.$refs["DeliveryDrugformRef"].validate((valid) => {
    if (valid) {

      if (DeliveryDrugform.value.id != undefined && DeliveryDrugopertype.value === 2) {
        updateDeliveryOrderDrug(DeliveryDrugform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          DeliveryDrugopen.value = false
          DeliveryDruggetList()
        })
      } else {
        addDeliveryOrderDrug(DeliveryDrugform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          DeliveryDrugopen.value = false
          DeliveryDruggetList()
        })
      }
    }
  })
}

// 删除按钮操作
function DeliveryDrughandleDelete(row) {
  const Ids = row.id || DeliveryDrugids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delDeliveryOrderDrug(Ids)
    })
    .then(() => {
      DeliveryDruggetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function DeliveryDrughandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return clearDeliveryOrderDrug()
    })
    .then(() => {
      DeliveryDrughandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const DeliveryDrughandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  DeliveryDruggetList()
}

// 导出按钮操作
function DeliveryDrughandleExport() {
  proxy
    .$confirm("是否确认导出送货单药品数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/DeliveryOrderDrug/export', { ...DeliveryDrugqueryParams })
    })
}

DeliveryDrughandleQuery()
</script>