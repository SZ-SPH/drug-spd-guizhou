<!--
 * @Descripttion: (入库计划药品/InventoryPlanDrugs)
 * @Author: (admin)
 * @Date: (2024-08-27)
-->
<template>
  <div>
    <el-form :model="PlanDrugsqueryParams" label-position="right" inline ref="PlanDrugsqueryRef"
      v-show="PlanDrugsshowSearch" @submit.prevent>
      <el-form-item label="入库计划id" prop="planId">
        <el-input v-model="PlanDrugsqueryParams.planId" placeholder="请输入入库计划id" />
      </el-form-item>
      <el-form-item label="药品id" prop="drugId">
        <el-input v-model="PlanDrugsqueryParams.drugId" placeholder="请输入药品id" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="PlanDrugshandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="PlanDrugsresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['inventoryplandrugs:add']" plain icon="plus" @click="PlanDrugshandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="PlanDrugssingle" v-hasPermi="['inventoryplandrugs:edit']" plain icon="edit"
          @click="PlanDrugshandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="PlanDrugsmultiple" v-hasPermi="['inventoryplandrugs:delete']" plain
          icon="delete" @click="PlanDrugshandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['inventoryplandrugs:delete']" plain icon="delete"
          @click="PlanDrugshandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['inventoryplandrugs:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/InventoryPlanDrugs/importTemplate"
                  importUrl="/business/InventoryPlanDrugs/importData" @success="PlanDrugshandleFileSuccess">
                </importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="PlanDrugshandleExport"
          v-hasPermi="['inventoryplandrugs:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="PlanDrugsshowSearch" @queryTable="PlanDrugsgetList"
        :columns="PlanDrugscolumns"></right-toolbar>
    </el-row>

    <el-table :data="PlanDrugsdataList" v-loading="PlanDrugsloading" ref="PlanDrugstable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="PlanDrugssortChange"
      @selection-change="PlanDrugshandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="Id" align="center" v-if="PlanDrugscolumns.showColumn('id')" />
      <el-table-column prop="planId" label="入库计划id" align="center" :show-overflow-tooltip="true"
        v-if="PlanDrugscolumns.showColumn('planId')" />
      <el-table-column prop="drugId" label="药品id" align="center" :show-overflow-tooltip="true"
        v-if="PlanDrugscolumns.showColumn('drugId')" />
      <el-table-column prop="drugDetails" label="药品信息" align="center" :show-overflow-tooltip="true"
        v-if="PlanDrugscolumns.showColumn('drugDetails')" />
      <el-table-column prop="drugQuantity" label="数量" align="center" :show-overflow-tooltip="true"
        v-if="PlanDrugscolumns.showColumn('drugQuantity')" />
      <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="PlanDrugscolumns.showColumn('remarks')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情"
            @click="PlanDrugshandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['inventoryplandrugs:edit']"
            @click="PlanDrugshandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['inventoryplandrugs:delete']"
            @click="PlanDrugshandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="PlanDrugstotal" v-model:page="PlanDrugsqueryParams.pageNum"
      v-model:limit="PlanDrugsqueryParams.pageSize" @pagination="PlanDrugsgetList" />


    <el-dialog :title="PlanDrugstitle" :lock-scroll="false" v-model="PlanDrugsopen">
      <el-form ref="PlanDrugsformRef" :model="PlanDrugsform" :rules="PlanDrugsrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="Id" prop="id">
              <el-input v-model.number="PlanDrugsform.id" placeholder="请输入Id" :disabled="PlanDrugsopertype != 1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库计划id" prop="planId">
              <el-input v-model="PlanDrugsform.planId" placeholder="请输入入库计划id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品id" prop="drugId">
              <el-input v-model="PlanDrugsform.drugId" placeholder="请输入药品id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品信息" prop="drugDetails">
              <el-input v-model="PlanDrugsform.drugDetails" placeholder="请输入药品信息" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="数量" prop="drugQuantity">
              <el-input v-model="PlanDrugsform.drugQuantity" placeholder="请输入数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="PlanDrugsform.remarks" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="PlanDrugsopertype != 3">
        <el-button text @click="PlanDrugscancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="PlanDrugssubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="inventoryplandrugs">
import {
  listInventoryPlanDrugs,
  addInventoryPlanDrugs, delInventoryPlanDrugs,
  updateInventoryPlanDrugs, getInventoryPlanDrugs,
  clearInventoryPlanDrugs,
}
  from '@/api/business/inventoryplandrugs.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const PlanDrugsids = ref([])
const PlanDrugsloading = ref(false)
const PlanDrugsshowSearch = ref(true)
const PlanDrugsqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  planId: undefined,
  drugId: undefined,
})
const PlanDrugscolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'planId', label: '入库计划id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugDetails', label: '药品信息', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugQuantity', label: '数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'remarks', label: '备注', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const PlanDrugstotal = ref(0)
const PlanDrugsdataList = ref([])
const PlanDrugsqueryRef = ref()
const PlanDrugsdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var PlanDrugsdictParams = [
]


function PlanDrugsgetList() {
  PlanDrugsloading.value = true
  listInventoryPlanDrugs(PlanDrugsqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      PlanDrugsdataList.value = data.result
      PlanDrugstotal.value = data.totalNum
      PlanDrugsloading.value = false
    }
  })
}

// 查询
function PlanDrugshandleQuery() {
  PlanDrugsqueryParams.pageNum = 1
  PlanDrugsgetList()
}

// 重置查询操作
function PlanDrugsresetQuery() {
  proxy.resetForm("queryRef")
  PlanDrugshandleQuery()
}
// 多选框选中数据
function PlanDrugshandleSelectionChange(selection) {
  PlanDrugsids.value = selection.map((item) => item.id);
  PlanDrugssingle.value = selection.length != 1
  PlanDrugsmultiple.value = !selection.length;
}
// 自定义排序
function PlanDrugssortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  PlanDrugsqueryParams.sort = sort
  PlanDrugsqueryParams.sortType = sortType
  PlanDrugshandleQuery()
}

/*************** form操作 ***************/
const PlanDrugsformRef = ref()
const PlanDrugstitle = ref('')
// 操作类型 1、add 2、edit 3、view
const PlanDrugsopertype = ref(0)
const PlanDrugsopen = ref(false)
const PlanDrugsstate = reactive({
  PlanDrugssingle: true,
  PlanDrugsmultiple: true,
  PlanDrugsform: {},
  PlanDrugsrules: {
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
  },
  PlanDrugsoptions: {
  }
})

const { PlanDrugsform, PlanDrugsrules, PlanDrugsoptions, PlanDrugssingle, PlanDrugsmultiple } = toRefs(PlanDrugsstate)

// 关闭dialog
function PlanDrugscancel() {
  PlanDrugsopen.value = false
  PlanDrugsreset()
}

// 重置表单
function PlanDrugsreset() {
  PlanDrugsform.value = {
    id: null,
    planId: null,
    drugId: null,
    drugDetails: null,
    drugQuantity: null,
    remarks: null,
  };
  proxy.resetForm("PlanDrugsformRef")
}

/**
 * 查看
 * @param {*} row
 */
function PlanDrugshandlePreview(row) {
  PlanDrugsreset()
  const id = row.id
  getInventoryPlanDrugs(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      PlanDrugsopen.value = true
      PlanDrugstitle.value = '查看'
      PlanDrugsopertype.value = 3
      PlanDrugsform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function PlanDrugshandleAdd() {
  PlanDrugsreset();
  PlanDrugsopen.value = true
  PlanDrugstitle.value = '添加入库计划药品'
  PlanDrugsopertype.value = 1
}
// 修改按钮操作
function PlanDrugshandleUpdate(row) {
  PlanDrugsreset()
  const id = row.id || PlanDrugsids.value
  getInventoryPlanDrugs(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      PlanDrugsopen.value = true
      PlanDrugstitle.value = '修改入库计划药品'
      PlanDrugsopertype.value = 2

      PlanDrugsform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function PlanDrugssubmitForm() {
  proxy.$refs["PlanDrugsformRef"].validate((valid) => {
    if (valid) {
      if (PlanDrugsform.value.id != undefined && PlanDrugsopertype.value === 2) {
        updateInventoryPlanDrugs(PlanDrugsform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          PlanDrugsopen.value = false
          PlanDrugsgetList()
        })
      } else {
        addInventoryPlanDrugs(PlanDrugsform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          PlanDrugsopen.value = false
          PlanDrugsgetList()
        })
      }
    }
  })
}

// 删除按钮操作
function PlanDrugshandleDelete(row) {
  const Ids = row.id || PlanDrugsids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delInventoryPlanDrugs(Ids)
    })
    .then(() => {
      PlanDrugsgetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function PlanDrugshandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return clearInventoryPlanDrugs()
    })
    .then(() => {
      PlanDrugshandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const PlanDrugshandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  PlanDrugsgetList()
}

// 导出按钮操作
function PlanDrugshandleExport() {
  proxy
    .$confirm("是否确认导出入库计划药品数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/InventoryPlanDrugs/export', { ...PlanDrugsqueryParams })
    })
}

PlanDrugshandleQuery()
</script>