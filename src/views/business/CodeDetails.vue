<!--
 * @Descripttion: (码信息/CodeDetails)
 * @Author: (admin)
 * @Date: (2024-08-06)
-->
<template>
  <div>
    <el-form :model="CodequeryParams" label-position="right" inline ref="CodequeryRef" v-show="CodeshowSearch"
      @submit.prevent>
      <el-form-item label="入库单id" prop="receiptid">
        <el-input v-model.number="CodequeryParams.receiptid" placeholder="请输入入库单id" />
      </el-form-item>
      <el-form-item label="药品id" prop="drugId">
        <el-input v-model.number="CodequeryParams.drugId" placeholder="请输入药品id" />
      </el-form-item>
      <el-form-item label="追溯码" prop="code">
        <el-input v-model="CodequeryParams.code" placeholder="请输入追溯码" />
      </el-form-item>
      <el-form-item label="企业id" prop="refEntId">
        <el-input v-model="CodequeryParams.refEntId" placeholder="请输入企业id" />
      </el-form-item>
      <el-form-item label="企业名称" prop="entName">
        <el-input v-model="CodequeryParams.entName" placeholder="请输入企业名称" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="CodehandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="CoderesetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['codedetails:add']" plain icon="plus" @click="CodehandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="Codesingle" v-hasPermi="['codedetails:edit']" plain icon="edit"
          @click="CodehandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="Codemultiple" v-hasPermi="['codedetails:delete']" plain icon="delete"
          @click="CodehandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['codedetails:delete']" plain icon="delete" @click="CodehandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['codedetails:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/CodeDetails/importTemplate"
                  importUrl="/business/CodeDetails/importData" @success="CodehandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="CodehandleExport" v-hasPermi="['codedetails:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="CodeshowSearch" @queryTable="CodegetList"
        :columns="Codecolumns"></right-toolbar>
    </el-row>

    <el-table :data="CodedataList" v-loading="Codeloading" ref="table" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="CodesortChange"
      @selection-change="CodehandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="Id" align="center" v-if="Codecolumns.showColumn('id')" />
      <el-table-column prop="receiptid" label="入库单id" align="center" v-if="Codecolumns.showColumn('receiptid')" />
      <el-table-column prop="drugId" label="药品id" align="center" v-if="Codecolumns.showColumn('drugId')" />
      <el-table-column prop="code" label="追溯码" align="center" :show-overflow-tooltip="true"
        v-if="Codecolumns.showColumn('code')" />
      <el-table-column prop="physicTypeDesc" label="药品类型描述" align="center" :show-overflow-tooltip="true"
        v-if="Codecolumns.showColumn('physicTypeDesc')" />
      <el-table-column prop="refEntId" label="企业id" align="center" :show-overflow-tooltip="true"
        v-if="Codecolumns.showColumn('refEntId')" />
      <el-table-column prop="entName" label="企业名称" align="center" :show-overflow-tooltip="true"
        v-if="Codecolumns.showColumn('entName')" />
      <el-table-column prop="packageLevel" label="码等级" align="center" :show-overflow-tooltip="true"
        v-if="Codecolumns.showColumn('packageLevel')">
        <template v-slot="scope">
          <span>{{ levelMap[scope.row.packageLevel] || '未知等级' }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情"
            @click="CodehandlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['codedetails:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['codedetails:delete']"
            @click="CodehandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="Codetotal" v-model:page="CodequeryParams.pageNum" v-model:limit="CodequeryParams.pageSize"
      @pagination="CodegetList" />

    <el-dialog :title="Codetitle" :lock-scroll="false" v-model="Codeopen">
      <el-form ref="CodeformRef" :model="Codeform" :rules="Coderules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="Id" prop="id">
              <el-input v-model.number="Codeform.id" placeholder="请输入Id" :disabled="Codeopertype != 1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="入库单id" prop="receiptid">
              <el-input v-model.number="Codeform.receiptid" placeholder="请输入入库单id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品id" prop="drugId">
              <el-input v-model.number="Codeform.drugId" placeholder="请输入药品id" />
            </el-form-item>
          </el-col>

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

  </div>

</template>

<script setup name="codedetails">
import {
  listCodeDetails,
  addCodeDetails, delCodeDetails,
  updateCodeDetails, getCodeDetails,
  clearCodeDetails,
}
  from '@/api/business/codedetails.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const Codeids = ref([])
const Codeloading = ref(false)
const CodeshowSearch = ref(true)
const CodequeryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  receiptid: undefined,
  drugId: undefined,
  code: undefined,
  refEntId: undefined,
  entName: undefined,
})
const Codecolumns = ref([
  { visible: false, align: 'center', type: '', prop: 'id', label: 'Id' },
  { visible: false, align: 'center', type: '', prop: 'receiptid', label: '入库单id' },
  { visible: false, align: 'center', type: '', prop: 'drugId', label: '药品id' },
  { visible: true, align: 'center', type: '', prop: 'code', label: '追溯码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'physicTypeDesc', label: '药品类型描述', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'refEntId', label: '企业id', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'entName', label: '企业名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'packageLevel', label: '码等级', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'physicName', label: '药品名称', showOverflowTooltip: true },
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
const levelMap = {
  1: '小码',
  2: '中码',
  3: '大码',
};

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
    id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
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
  CodegetCodeDetails(id).then((res) => {
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

// 添加按钮操作
function CodehandleAdd() {
  Codereset();
  Codeopen.value = true
  Codetitle.value = '添加码信息'
  Codeopertype.value = 1
}
// 修改按钮操作
function CodehandleUpdate(row) {
  Codereset()
  const id = row.id || ids.value
  CodegetCodeDetails(id).then((res) => {
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
</script>