<!--
 * @Descripttion: (医嘱药品/MADrug)
 * @Author: (admin)
 * @Date: (2024-08-28)
-->
<template>
  <div>
    <el-form :model="MADrugqueryParams" label-position="right" inline ref="MADrugqueryRef" v-show="MADrugshowSearch"
      @submit.prevent>
      <el-form-item label="医嘱id" prop="medicalAdviceId">
        <el-input v-model="MADrugqueryParams.medicalAdviceId" placeholder="请输入医嘱id" />
      </el-form-item>
      <el-form-item label="药品id" prop="drugId">
        <el-input v-model="MADrugqueryParams.drugId" placeholder="请输入药品id" />
      </el-form-item>
      <el-form-item label="药品信息" prop="drugDetails">
        <el-input v-model="MADrugqueryParams.drugDetails" placeholder="请输入药品信息" />
      </el-form-item>
      <el-form-item label="药品码" prop="codeId">
        <el-input v-model="MADrugqueryParams.codeId" placeholder="请输入药品码" />
      </el-form-item>
      <el-form-item label="药品码详情" prop="codeDetails">
        <el-input v-model="MADrugqueryParams.codeDetails" placeholder="请输入药品码详情" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="MADrughandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="MADrugresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['madrug:add']" plain icon="plus" @click="MADrughandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="MADrugsingle" v-hasPermi="['madrug:edit']" plain icon="edit"
          @click="MADrughandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="MADrugmultiple" v-hasPermi="['madrug:delete']" plain icon="delete"
          @click="MADrughandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['madrug:delete']" plain icon="delete" @click="MADrughandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['madrug:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/MADrug/importTemplate" importUrl="/business/MADrug/importData"
                  @success="MADrughandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="MADrughandleExport" v-hasPermi="['madrug:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="MADrugshowSearch" @queryTable="MADruggetList"
        :MADrugcolumns="MADrugcolumns"></right-toolbar>
    </el-row>

    <el-table :data="MADrugdataList" v-loading="MADrugloading" ref="MADrugtable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="MADrugsortChange"
      @selection-change="MADrughandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="Id" align="center" v-if="MADrugcolumns.showColumn('id')" />
      <el-table-column prop="medicalAdviceId" label="医嘱id" align="center" :show-overflow-tooltip="true"
        v-if="MADrugcolumns.showColumn('medicalAdviceId')" />
      <el-table-column prop="drugId" label="药品id" align="center" :show-overflow-tooltip="true"
        v-if="MADrugcolumns.showColumn('drugId')" />
      <el-table-column prop="drugDetails" label="药品信息" align="center" :show-overflow-tooltip="true"
        v-if="MADrugcolumns.showColumn('drugDetails')" />
      <el-table-column prop="drugQuantity" label="药品数量" align="center" :show-overflow-tooltip="true"
        v-if="MADrugcolumns.showColumn('drugQuantity')" />
      <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
        v-if="MADrugcolumns.showColumn('remarks')" />
      <el-table-column prop="codeId" label="药品码" align="center" :show-overflow-tooltip="true"
        v-if="MADrugcolumns.showColumn('codeId')" />
      <el-table-column prop="codeDetails" label="药品码详情" align="center" :show-overflow-tooltip="true"
        v-if="MADrugcolumns.showColumn('codeDetails')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情"
            @click="MADrughandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['madrug:edit']"
            @click="MADrughandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['madrug:delete']"
            @click="MADrughandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="MADrugtotal" v-model:page="MADrugqueryParams.pageNum" v-model:limit="MADrugqueryParams.pageSize"
      @pagination="MADruggetList" />


    <el-dialog :title="MADrugtitle" :lock-scroll="false" v-model="MADrugopen">
      <el-form ref="MADrugformRef" :model="MADrugform" :rules="MADrugrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="Id" prop="id">
              <el-input v-model.number="MADrugform.id" placeholder="请输入Id" :disabled="MADrugopertype != 1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="医嘱id" prop="medicalAdviceId">
              <el-input v-model="MADrugform.medicalAdviceId" placeholder="请输入医嘱id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品id" prop="drugId">
              <el-input v-model="MADrugMADrugform.drugId" placeholder="请输入药品id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品信息" prop="drugDetails">
              <el-input v-model="MADrugform.drugDetails" placeholder="请输入药品信息" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品数量" prop="drugQuantity">
              <el-input v-model="MADrugform.drugQuantity" placeholder="请输入药品数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="MADrugform.remarks" placeholder="请输入备注" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品码" prop="codeId">
              <el-input v-model="MADrugform.codeId" placeholder="请输入药品码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品码详情" prop="codeDetails">
              <el-input v-model="MADrugform.codeDetails" placeholder="请输入药品码详情" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="MADrugopertype != 3">
        <el-button text @click="MADrugcancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="MADrugsubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="madrug">
import {
  listMADrug,
  addMADrug, delMADrug,
  updateMADrug, getMADrug,
  clearMADrug,
}
  from '@/api/business/madrug.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const MADrugids = ref([])
const MADrugloading = ref(false)
const MADrugshowSearch = ref(true)
const MADrugqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  medicalAdviceId: undefined,
  drugId: undefined,
  drugDetails: undefined,
  codeId: undefined,
  codeDetails: undefined,
})
const MADrugcolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: true, align: 'center', type: '', prop: 'medicalAdviceId', label: '医嘱id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '药品id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugDetails', label: '药品信息', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugQuantity', label: '药品数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'remarks', label: '备注', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'codeId', label: '药品码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'codeDetails', label: '药品码详情', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const MADrugtotal = ref(0)
const MADrugdataList = ref([])
const MADrugqueryRef = ref()
const MADrugdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var MADrugdictParams = [
]


function MADruggetList() {
  MADrugloading.value = true
  listMADrug(MADrugqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      MADrugdataList.value = data.result
      MADrugtotal.value = data.totalNum
      MADrugloading.value = false
    }
  })
}

// 查询
function MADrughandleQuery() {
  MADrugqueryParams.pageNum = 1
  MADruggetList()
}

// 重置查询操作
function MADrugresetQuery() {
  proxy.resetForm("queryRef")
  MADrughandleQuery()
}
// 多选框选中数据
function MADrughandleSelectionChange(selection) {
  MADrugids.value = selection.map((item) => item.id);
  MADrugsingle.value = selection.length != 1
  MADrugmultiple.value = !selection.length;
}
// 自定义排序
function MADrugsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  MADrugqueryParams.sort = sort
  MADrugqueryParams.sortType = sortType
  MADrughandleQuery()
}

/*************** form操作 ***************/
const MADrugformRef = ref()
const MADrugtitle = ref('')
// 操作类型 1、add 2、edit 3、view
const MADrugopertype = ref(0)
const MADrugopen = ref(false)
const MADrugstate = reactive({
  MADrugsingle: true,
  MADrugmultiple: true,
  MADrugform: {},
  MADrugrules: {
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
  },
  MADrugoptions: {
  }
})

const { MADrugform, MADrugrules, MADrugoptions, MADrugsingle, MADrugmultiple } = toRefs(MADrugstate)

// 关闭dialog
function MADrugcancel() {
  MADrugopen.value = false
  MADrugreset()
}

// 重置表单
function MADrugreset() {
  MADrugform.value = {
    id: null,
    medicalAdviceId: null,
    drugId: null,
    drugDetails: null,
    drugQuantity: null,
    remarks: null,
    codeId: null,
    codeDetails: null,
  };
  proxy.resetForm("formRef")
}

/**
 * 查看
 * @param {*} row
 */
function MADrughandlePreview(row) {
  MADrugreset()
  const id = row.id
  getMADrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      MADrugopen.value = true
      MADrugtitle.value = '查看'
      MADrugopertype.value = 3
      MADrugform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function MADrughandleAdd() {
  MADrugreset();
  MADrugopen.value = true
  MADrugtitle.value = '添加医嘱药品'
  MADrugopertype.value = 1
}
// 修改按钮操作
function MADrughandleUpdate(row) {
  MADrugreset()
  const id = row.id || ids.value
  getMADrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      MADrugopen.value = true
      MADrugtitle.value = '修改医嘱药品'
      MADrugopertype.value = 2

      MADrugform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function MADrugsubmitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {

      if (MADrugform.value.id != undefined && MADrugopertype.value === 2) {
        updateMADrug(MADrugform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          MADrugopen.value = false
          MADruggetList()
        })
      } else {
        addMADrug(MADrugform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          MADrugopen.value = false
          MADruggetList()
        })
      }
    }
  })
}

// 删除按钮操作
function MADrughandleDelete(row) {
  const Ids = row.id || MADrugids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delMADrug(Ids)
    })
    .then(() => {
      MADruggetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function MADrughandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return clearMADrug()
    })
    .then(() => {
      MADrughandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const MADrughandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  MADruggetList()
}

// 导出按钮操作
function MADrughandleExport() {
  proxy
    .$confirm("是否确认导出医嘱药品数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/MADrug/export', { ...MADrugqueryParams })
    })
}

MADrughandleQuery()
</script>