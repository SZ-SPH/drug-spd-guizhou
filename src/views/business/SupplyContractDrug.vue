<!--
 * @Descripttion: (合同药品/SupplyContractDrug)
 * @Author: (admin)
 * @Date: (2024-12-05)
-->
<template>
  <div>
    <el-form :model="ContractDrugqueryParams" label-position="right" inline ref="ContractDrugqueryRef"
      v-show="ContractDrugshowSearch" @submit.prevent>
      <el-form-item label="合同编号" prop="contractCode">
        <el-input v-model="ContractDrugqueryParams.contractCode" placeholder="请输入合同编号" />
      </el-form-item>
      <el-form-item label="合同药品的唯一标识符" prop="drugCode">
        <el-input v-model="ContractDrugqueryParams.drugCode" placeholder="请输入合同药品的唯一标识符" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="ContractDrughandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="ContractDrugresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['supplycontractdrug:add']" plain icon="plus"
          @click="ContractDrughandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="ContractDrugsingle" v-hasPermi="['supplycontractdrug:edit']" plain
          icon="edit" @click="ContractDrughandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="ContractDrugmultiple" v-hasPermi="['supplycontractdrug:delete']" plain
          icon="delete" @click="ContractDrughandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['supplycontractdrug:delete']" plain icon="delete"
          @click="ContractDrughandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['supplycontractdrug:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/SupplyContractDrug/importTemplate"
                  importUrl="/business/SupplyContractDrug/importData" @success="ContractDrughandleFileSuccess">
                </importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="ContractDrughandleExport"
          v-hasPermi="['supplycontractdrug:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="ContractDrugshowSearch" @queryTable="ContractDruggetList"
        :columns="ContractDrugcolumns"></right-toolbar>
    </el-row>

    <el-table :data="ContractDrugdataList" v-loading="ContractDrugloading" ref="ContractDrugtable" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="ContractDrugsortChange"
      @selection-change="ContractDrughandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="合同药品的唯一标识符" align="center" v-if="ContractDrugcolumns.showColumn('id')" />
      <el-table-column prop="contractCode" label="合同编号" align="center" :show-overflow-tooltip="true"
        v-if="ContractDrugcolumns.showColumn('contractCode')" />
      <el-table-column prop="drugCode" label="合同药品的唯一标识符" align="center" :show-overflow-tooltip="true"
        v-if="ContractDrugcolumns.showColumn('drugCode')" />
      <el-table-column prop="states" label="启用状态" align="center" v-if="ContractDrugcolumns.showColumn('states')">
        <template #default="scope">
          <dict-tag :options="ContractDrugoptions.statesOptions" :value="scope.row.states" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" ContractDrugtitle="详情"
            @click="ContractDrughandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" ContractDrugtitle="编辑"
            v-hasPermi="['supplycontractdrug:edit']" @click="ContractDrughandleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" ContractDrugtitle="删除"
            v-hasPermi="['supplycontractdrug:delete']" @click="ContractDrughandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="ContractDrugtotal" v-model:page="ContractDrugqueryParams.pageNum"
      v-model:limit="ContractDrugqueryParams.pageSize" @pagination="ContractDruggetList" />


    <el-dialog :ContractDrugtitle="ContractDrugtitle" :lock-scroll="false" v-model="ContractDrugopen">
      <el-form ref="ContractDrugformRef" :model="ContractDrugform" :ContractDrugrules="ContractDrugrules"
        label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12" v-if="ContractDrugopertype != 1">
            <el-form-item label="合同药品的唯一标识符" prop="id">
              <el-input-number v-model.number="ContractDrugform.id" controls-position="right"
                placeholder="请输入合同药品的唯一标识符" :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input v-model="ContractDrugform.contractCode" placeholder="请输入合同编号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="合同药品的唯一标识符" prop="drugCode">
              <el-input v-model="ContractDrugform.drugCode" placeholder="请输入合同药品的唯一标识符" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="启用状态" prop="states">
              <el-radio-group v-model="ContractDrugform.states">
                <el-radio v-for="item in ContractDrugoptions.statesOptions" :key="item.dictValue"
                  :value="item.dictValue">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="ContractDrugopertype != 3">
        <el-button text @click="ContractDrugcancel">{{ $t('btn.ContractDrugcancel') }}</el-button>
        <el-button type="primary" @click="ContractDrugsubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="supplycontractdrug">
import {
  listSupplyContractDrug,
  addSupplyContractDrug, delSupplyContractDrug,
  updateSupplyContractDrug, getSupplyContractDrug,
  clearSupplyContractDrug,
}
  from '@/api/business/supplycontractdrug.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const ContractDrugids = ref([])
const ContractDrugloading = ref(false)
const ContractDrugshowSearch = ref(true)
const ContractDrugqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  contractCode: undefined,
  drugCode: undefined,
})
const ContractDrugcolumns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: '合同药品的唯一标识符' },
  { visible: true, align: 'center', type: '', prop: 'contractCode', label: '合同编号', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugCode', label: '合同药品的唯一标识符', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'states', label: '启用状态', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const ContractDrugtotal = ref(0)
const ContractDrugdataList = ref([])
const ContractDrugqueryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var dictParams = [
]


function ContractDruggetList() {
  ContractDrugloading.value = true
  listSupplyContractDrug(ContractDrugqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      ContractDrugdataList.value = data.result
      ContractDrugtotal.value = data.totalNum
      ContractDrugloading.value = false
    }
  })
}

// 查询
function ContractDrughandleQuery() {
  ContractDrugqueryParams.pageNum = 1
  ContractDruggetList()
}

// 重置查询操作
function ContractDrugresetQuery() {
  proxy.resetForm("ContractDrugqueryRef")
  ContractDrughandleQuery()
}
// 多选框选中数据
function ContractDrughandleSelectionChange(selection) {
  ContractDrugids.value = selection.map((item) => item.id);
  ContractDrugsingle.value = selection.length != 1
  ContractDrugmultiple.value = !selection.length;
}
// 自定义排序
function ContractDrugsortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  ContractDrugqueryParams.sort = sort
  ContractDrugqueryParams.sortType = sortType
  ContractDrughandleQuery()
}

/*************** form操作 ***************/
const ContractDrugformRef = ref()
const ContractDrugtitle = ref('')
// 操作类型 1、add 2、edit 3、view
const ContractDrugopertype = ref(0)
const ContractDrugopen = ref(false)
const ContractDrugstate = reactive({
  ContractDrugsingle: true,
  ContractDrugmultiple: true,
  ContractDrugform: {},
  ContractDrugrules: {
    // contractCode: [{ required: true, message: "合同编号不能为空", trigger: "blur" }],
    // drugCode: [{ required: true, message: "合同药品的唯一标识符不能为空", trigger: "blur" }],
  },
  ContractDrugoptions: {
    // 启用状态 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    statesOptions: [],
  }
})

const { ContractDrugform, ContractDrugrules, ContractDrugoptions, ContractDrugsingle, ContractDrugmultiple } = toRefs(ContractDrugstate)

// 关闭dialog
function ContractDrugcancel() {
  ContractDrugopen.value = false
  ContractDrugreset()
}

// 重置表单
function ContractDrugreset() {
  ContractDrugform.value = {
    id: null,
    contractCode: null,
    drugCode: null,
    states: null,
  };
  proxy.resetForm("ContractDrugformRef")
}

/**
 * 查看
 * @param {*} row
 */
function ContractDrughandlePreview(row) {
  ContractDrugreset()
  const id = row.id
  getSupplyContractDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      ContractDrugopen.value = true
      ContractDrugtitle.value = '查看'
      ContractDrugopertype.value = 3
      ContractDrugform.value = {
        ...data,
      }
    }
  })
}

// 添加按钮操作
function ContractDrughandleAdd() {
  ContractDrugreset();
  ContractDrugopen.value = true
  ContractDrugtitle.value = '添加合同药品'
  ContractDrugopertype.value = 1
}
// 修改按钮操作
function ContractDrughandleUpdate(row) {
  ContractDrugreset()
  const id = row.id || ContractDrugids.value
  getSupplyContractDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      ContractDrugopen.value = true
      ContractDrugtitle.value = '修改合同药品'
      ContractDrugopertype.value = 2

      ContractDrugform.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function ContractDrugsubmitForm() {
  proxy.$refs["ContractDrugformRef"].validate((valid) => {
    if (valid) {

      if (ContractDrugform.value.id != undefined && ContractDrugopertype.value === 2) {
        updateSupplyContractDrug(ContractDrugform.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          ContractDrugopen.value = false
          ContractDruggetList()
        })
      } else {
        addSupplyContractDrug(ContractDrugform.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          ContractDrugopen.value = false
          ContractDruggetList()
        })
      }
    }
  })
}

// 删除按钮操作
function ContractDrughandleDelete(row) {
  const Ids = row.id || ContractDrugids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      ContractDrugcancelButtonText: proxy.$t('common.ContractDrugcancel'),
      type: "warning",
    })
    .then(function () {
      return delSupplyContractDrug(Ids)
    })
    .then(() => {
      ContractDruggetList()
      proxy.$modal.msgSuccess("删除成功")
    })
}

// 清空
function ContractDrughandleClear() {
  proxy
    .$confirm("是否确认清空所有数据项?", "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      ContractDrugcancelButtonText: proxy.$t('common.ContractDrugcancel'),
      type: "warning",
    })
    .then(function () {
      return clearSupplyContractDrug()
    })
    .then(() => {
      ContractDrughandleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

// 导入数据成功处理
const ContractDrughandleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  ContractDruggetList()
}

// 导出按钮操作
function ContractDrughandleExport() {
  proxy
    .$confirm("是否确认导出合同药品数据项?", "警告", {
      confirmButtonText: "确定",
      ContractDrugcancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/SupplyContractDrug/export', { ...ContractDrugqueryParams })
    })
}

ContractDrughandleQuery()
</script>