<!--
 * @Descripttion: (合同管理/SupplyContract)
 * @Author: (admin)
 * @Date: (2024-08-27)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="合同编号" prop="contractCode">
        <el-input v-model="queryParams.contractCode" placeholder="请输入合同编号" />
      </el-form-item>
      <el-form-item label="合同日期" prop="contractDate">
        <el-input v-model="queryParams.contractDate" placeholder="请输入合同日期" />
      </el-form-item>
      <el-form-item label="合同药品" prop="drugId">
        <el-input v-model="queryParams.drugId" placeholder="请输入合同药品" />
      </el-form-item>
      <el-form-item label="合同供应商" prop="supplierId">
        <el-input v-model="queryParams.supplierId" placeholder="请输入合同供应商" />
      </el-form-item>
      <el-form-item label="状态" prop="states">
        <el-input v-model="queryParams.states" placeholder="请输入状态" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['supplycontract:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['supplycontract:edit']" plain icon="edit" @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['supplycontract:delete']" plain icon="delete" @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['supplycontract:delete']" plain icon="delete" @click="handleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['supplycontract:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData
                  templateUrl="business/SupplyContract/importTemplate"
                  importUrl="/business/SupplyContract/importData"
                  @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['supplycontract:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table
      :data="dataList"
      v-loading="loading"
      ref="table"
      border
      header-cell-class-name="el-table-header-cell"
      highlight-current-row
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column prop="id" label="Id" align="center" v-if="columns.showColumn('id')"/>
      <el-table-column prop="contractCode" label="合同编号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('contractCode')"/>
      <el-table-column prop="contractContent" label="合同内容" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('contractContent')"/>
      <el-table-column prop="contractDate" label="合同日期" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('contractDate')"/>
      <el-table-column prop="drugId" label="合同药品" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('drugId')"/>
      <el-table-column prop="hospitalId" label="合同医院" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('hospitalId')"/>
      <el-table-column prop="supplierId" label="合同供应商" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('supplierId')"/>
      <el-table-column prop="states" label="状态" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('states')"/>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['supplycontract:edit']" @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['supplycontract:delete']" @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />


    <el-dialog :title="title" :lock-scroll="false" v-model="open" >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
            
          <el-col :lg="12">
            <el-form-item label="Id" prop="id">
              <el-input v-model.number="form.id" placeholder="请输入Id" :disabled="opertype != 1"/>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input v-model="form.contractCode" placeholder="请输入合同编号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="合同内容" prop="contractContent">
              <el-input v-model="form.contractContent" placeholder="请输入合同内容" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="合同日期" prop="contractDate">
              <el-input v-model="form.contractDate" placeholder="请输入合同日期" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="合同药品" prop="drugId">
              <el-input v-model="form.drugId" placeholder="请输入合同药品" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="合同医院" prop="hospitalId">
              <el-input v-model="form.hospitalId" placeholder="请输入合同医院" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="合同供应商" prop="supplierId">
              <el-input v-model="form.supplierId" placeholder="请输入合同供应商" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="状态" prop="states">
              <el-input v-model="form.states" placeholder="请输入状态" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="opertype != 3">
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="supplycontract">
import { listSupplyContract,
 addSupplyContract, delSupplyContract, 
 updateSupplyContract,getSupplyContract, 
 clearSupplyContract,  } 
from '@/api/business/supplycontract.js'
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
  contractCode: undefined,
  contractDate: undefined,
  drugId: undefined,
  supplierId: undefined,
  states: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'id', label: 'Id'   },
  { visible: true, align: 'center', type: '', prop: 'contractCode', label: '合同编号'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'contractContent', label: '合同内容'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'contractDate', label: '合同日期'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'drugId', label: '合同药品'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'hospitalId', label: '合同医院'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'supplierId', label: '合同供应商'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'states', label: '状态'  ,showOverflowTooltip: true  },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var dictParams = [
]


function getList(){
  loading.value = true
  listSupplyContract(queryParams).then(res => {
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
function resetQuery(){
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
    id: [{ required: true, message: "Id不能为空", trigger: "blur"    , type: "number"  }],
  },
  options: {
  }
})

const { form, rules, options, single, multiple } = toRefs(state)

// 关闭dialog
function cancel(){
  open.value = false
  reset()
}

// 重置表单
function reset() {
  form.value = {
    id: null,
    contractCode: null,
    contractContent: null,
    contractDate: null,
    drugId: null,
    hospitalId: null,
    supplierId: null,
    states: null,
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
    getSupplyContract(id).then((res) => {
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
  title.value = '添加合同管理'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getSupplyContract(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改合同管理'
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
        updateSupplyContract(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSupplyContract(form.value).then((res) => {
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
      return delSupplyContract(Ids)
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
      return clearSupplyContract()
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
    .$confirm("是否确认导出合同管理数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/SupplyContract/export', { ...queryParams })
    })
}

handleQuery()
</script>