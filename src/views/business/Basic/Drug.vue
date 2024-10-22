<!--
 * @Descripttion: (药品基础信息/DRUG)
 * @Author: (admin)
 * @Date: (2024-08-06)
-->
<template>
  <div>
    <el-form :model="DrugqueryParams" label-position="right" inline ref="DrugqueryRef" v-show="DrugshowSearch"
      @submit.prevent>
      <el-form-item label="药品名称" prop="drugName">
        <el-input v-model="DrugqueryParams.drugName" placeholder="请输入药品名称" />
      </el-form-item>
      <el-form-item label="药品编号" prop="drugCode">
        <el-input v-model="DrugqueryParams.drugCode" placeholder="请输入药品编号" />
      </el-form-item>
      <el-form-item label="药品助记码" prop="drugMnemonicCode">
        <el-input v-model="DrugqueryParams.drugMnemonicCode" placeholder="请输入药品助记码" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="DrughandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="DrugresetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <!-- <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['drug:add']" plain icon="plus" @click="DrughandleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="Drugsingle" v-hasPermi="['drug:edit']" plain icon="edit"
          @click="DrughandleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="Drugmultiple" v-hasPermi="['drug:delete']" plain icon="delete"
          @click="DrughandleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['drug:delete']" plain icon="delete" @click="DrughandleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['drug:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/Drug/importTemplate" importUrl="/business/Drug/importData"
                  @success="DrughandleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
</el-dropdown>
</el-col>
<el-col :span="1.5">
  <el-button type="warning" plain icon="download" @click="DrughandleExport" v-hasPermi="['drug:export']">
    {{ $t('btn.export') }}
  </el-button> -->
      <!-- </el-col> -->

      <right-toolbar v-model:showSearch="DrugshowSearch" @queryTable="DruggetList"
        :columns="Drugcolumns"></right-toolbar>
    </el-row>

    <el-table :data="DrugdataList" v-loading="Drugloading" ref="table" border
      header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="DrugsortChange"
      @selection-change="DrughandleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="drugId" label="drugId" align="center" v-if="Drugcolumns.showColumn('drugId')" />
      <el-table-column prop="drugName" label="药品名称" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('drugName')" />
      <el-table-column prop="drugCode" label="药品编号" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('drugCode')" />
      <el-table-column prop="drugMnemonicCode" label="药品助记码" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('drugMnemonicCode')" />
      <el-table-column prop="drugSpecifications" label="药品规格" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('drugSpecifications')" />
      <el-table-column prop="drugCategory" label="药品类别" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('drugCategory')" />
      <el-table-column prop="drugVarietyName" label="药品品种名称" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('drugVarietyName')" />
      <el-table-column prop="drugClassification" label="药物分类" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('drugClassification')"
        :formatter="(row) => getDrugClassificationName(row.drugClassification)" />
      <el-table-column prop="tracingSourceCode" label="溯源码" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('tracingSourceCode')" />
      <el-table-column prop="drugBatchNumber" label="批号" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('drugBatchNumber')" />
      <el-table-column prop="minunit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('minunit')" />
      <el-table-column prop="produceName" label="生产厂家" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('produceName')" />
      <el-table-column prop="packageRatio" label="转换系数" align="center" v-if="Drugcolumns.showColumn('packageRatio')" />
      <el-table-column prop="packageUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="Drugcolumns.showColumn('packageUnit')" />

      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" small icon="view" title="详情" @click="DrughandlePreview(scope.row)"></el-button>
          <el-button type="success" small icon="edit" title="编辑" v-hasPermi="['drug:edit']"
            @click="DrughandleUpdate(scope.row)"></el-button>
          <el-button type="danger" small icon="delete" title="删除" v-hasPermi="['drug:delete']"
            @click="DrughandleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="Drugtotal" v-model:page="DrugqueryParams.pageNum" v-model:limit="DrugqueryParams.pageSize"
      @pagination="DruggetList" />


    <el-dialog :title="Drugtitle" :lock-scroll="false" v-model="Drugopen">
      <el-form ref="DrugformRef" :model="Drugform" :rules="Drugrules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="drugId" prop="drugId">
              <el-input v-model.number="Drugform.drugId" placeholder="请输入id" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品名称" prop="drugName">
              <el-input v-model="Drugform.drugName" placeholder="请输入药品名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品编号" prop="drugCode">
              <el-input v-model="Drugform.drugCode" placeholder="请输入药品编号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品助记码" prop="drugMnemonicCode">
              <el-input v-model="Drugform.drugMnemonicCode" placeholder="请输入药品助记码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品规格" prop="drugSpecifications">
              <el-input v-model="Drugform.drugSpecifications" placeholder="请输入药品规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品类别" prop="drugCategory">
              <el-input v-model="Drugform.drugCategory" placeholder="请输入药品类别" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品品种名称" prop="drugVarietyName">
              <el-input v-model="Drugform.drugVarietyName" placeholder="请输入药品品种名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药物分类" prop="drugClassification">
              <el-input v-model="Drugform.drugClassification" placeholder="请输入药物分类" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="溯源码" prop="tracingSourceCode">
              <el-input v-model="Drugform.tracingSourceCode" placeholder="请输入溯源码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批号" prop="drugBatchNumber">
              <el-input v-model="Drugform.drugBatchNumber" placeholder="请输入批号" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="最小单位" prop="minunit">
              <el-input v-model="Drugform.minunit" placeholder="请输入最小单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产厂家" prop="produceName">
              <el-input v-model="Drugform.produceName" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="最小单位" prop="minunit">
              <el-input v-model="Drugform.minunit" placeholder="请输入最小单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产厂家" prop="produceName">
              <el-input v-model="Drugform.produceName" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="转换系数" prop="packageRatio">
              <el-input v-model.number="Drugform.packageRatio" placeholder="请输入转换系数" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装单位" prop="packageUnit">
              <el-input v-model="Drugform.packageUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="Drugopertype != 3">
        <el-button text @click="Drugcancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="DrugsubmitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

  <script setup name="drug">
  import {
    listDrug,
    addDrug, delDrug,
    updateDrug, getDrug,
    clearDrug
  }
    from '@/api/business/drug.js'
  const { proxy } = getCurrentInstance()
  const Drugids = ref([])
  const Drugloading = ref(false)
  const DrugshowSearch = ref(true)
  const DrugqueryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    sort: '',
    sortType: 'asc',
    drugName: undefined,
    drugCode: undefined,
    drugMnemonicCode: undefined,
  })
  const Drugcolumns = ref([
    { visible: false, align: 'center', type: '', prop: 'drugId', label: 'drugId' },
    { visible: true, align: 'center', type: '', prop: 'drugName', label: '药品名称', showOverflowTooltip: true },
    { visible: true, align: 'center', type: '', prop: 'drugCode', label: '药品编号', showOverflowTooltip: true },
    { visible: true, align: 'center', type: '', prop: 'drugMnemonicCode', label: '药品助记码', showOverflowTooltip: true },
    { visible: true, align: 'center', type: '', prop: 'drugSpecifications', label: '药品规格', showOverflowTooltip: true },
    { visible: true, align: 'center', type: '', prop: 'drugCategory', label: '药品类别', showOverflowTooltip: true },
    { visible: false, align: 'center', type: '', prop: 'drugVarietyName', label: '药品品种名称', showOverflowTooltip: true },
    { visible: true, align: 'center', type: '', prop: 'drugClassification', label: '药物分类', showOverflowTooltip: true },
    { visible: false, align: 'center', type: '', prop: 'tracingSourceCode', label: '溯源码', showOverflowTooltip: true },
    { visible: false, align: 'center', type: '', prop: 'drugBatchNumber', label: '批号', showOverflowTooltip: true },
    { visible: true, align: 'center', type: '', prop: 'minunit', label: '最小单位', showOverflowTooltip: true },
    { visible: true, align: 'center', type: '', prop: 'produceName', label: '生产厂家', showOverflowTooltip: true },
    { visible: true, align: 'center', type: '', prop: 'packageRatio', label: '转换系数' },
    { visible: true, align: 'center', type: '', prop: 'packageUnit', label: '包装单位', showOverflowTooltip: true },
    //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
  ])
  const Drugtotal = ref(0)
  const DrugdataList = ref([])
  const DrugqueryRef = ref()
  const DrugdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])
  const drugClassificationMap = {
    1: '普通',
    2: '麻醉药品',
    3: '精神一类',
    4: '精神二类',
    5: '毒性药品',
    6: '贵重'
  };
  const getDrugClassificationName = (value) => {
    return drugClassificationMap[value] || '未知分类';
  };
  var DrugdictParams = [
  ]


  function DruggetList() {
    Drugloading.value = true
    listDrug(DrugqueryParams).then(res => {
      const { code, data } = res
      if (code == 200) {
        DrugdataList.value = data.result
        Drugtotal.value = data.totalNum
        Drugloading.value = false
      }
    })
  }

  // 查询
  function DrughandleQuery() {
    DrugqueryParams.pageNum = 1
    DruggetList()
  }

  // 重置查询操作
  function DrugresetQuery() {
    proxy.resetForm("DrugqueryRef")
    DrughandleQuery()
  }
  // 多选框选中数据
  function DrughandleSelectionChange(selection) {
    Drugids.value = selection.map((item) => item.drugId);
    Drugsingle.value = selection.length != 1
    Drugmultiple.value = !selection.length;
  }
  // 自定义排序
  function DrugsortChange(column) {
    var sort = undefined
    var sortType = undefined

    if (Drugcolumn.prop != null && Drugcolumn.order != null) {
      sort = column.prop
      sortType = column.order

    }
    DrugqueryParams.sort = sort
    DrugqueryParams.sortType = sortType
    DrughandleQuery()
  }

  /*************** form操作 ***************/
  const DrugformRef = ref()
  const Drugtitle = ref('')
  // 操作类型 1、add 2、edit 3、view
  const Drugopertype = ref(0)
  const Drugopen = ref(false)
  const Drugstate = reactive({
    Drugsingle: true,
    Drugmultiple: true,
    Drugform: {},
    Drugrules: {
    },
    Drugoptions: {
    }
  })

  const { Drugform, Drugrules, Drugoptions, Drugsingle, Drugmultiple } = toRefs(Drugstate)

  // 关闭dialog
  function Drugcancel() {
    Drugopen.value = false
    Drugreset()
  }

  // 重置表单
  function Drugreset() {
    Drugform.value = {
      drugId: null,
      drugName: null,
      drugCode: null,
      drugMnemonicCode: null,
      drugSpecifications: null,
      drugCategory: null,
      drugVarietyName: null,
      drugClassification: null,
      tracingSourceCode: null,
      drugBatchNumber: null,
      minunit: null,
      produceName: null,
      packageRatio: null,
      packageUnit: null,
    };
    proxy.resetForm("DrugformRef")
  }

  /**
   * 查看
   * @param {*} row
   */
  function DrughandlePreview(row) {
    // debugger

    Drugreset()
    const id = row.drugId
    getDrug(id).then((res) => {
      const { code, data } = res
      if (code == 200) {
        Drugopen.value = true
        Drugtitle.value = '查看'
        Drugopertype.value = 3
        Drugform.value = {
          ...data,
        }
      }
    })
  }

  // 添加按钮操作
  function DrughandleAdd() {
    Drugreset();
    Drugopen.value = true
    Drugtitle.value = '添加药品基础信息'
    Drugopertype.value = 1
  }
  // 修改按钮操作
  function DrughandleUpdate(row) {
    Drugreset()
    const id = row.drugId || Drugids.value
    getDrug(id).then((res) => {
      const { code, data } = res
      if (code == 200) {
        Drugopen.value = true
        Drugtitle.value = '修改药品基础信息'
        Drugopertype.value = 2

        Drugform.value = {
          ...data,
        }
      }
    })
  }

  // 添加&修改 表单提交
  function DrugsubmitForm() {
    proxy.$refs["DrugformRef"].validate((valid) => {
      if (valid) {

        if (Drugform.value.drugId != undefined && Drugopertype.value === 2) {
          updateDrug(Drugform.value).then((res) => {
            proxy.$modal.msgSuccess("修改成功")
            Drugopen.value = false
            DruggetList()
          })
        } else {
          addDrug(Drugform.value).then((res) => {
            proxy.$modal.msgSuccess("新增成功")
            Drugopen.value = false
            DruggetList()
          })
        }
      }
    })
  }

  // 删除按钮操作
  function DrughandleDelete(row) {
    const Ids = row.drugId || Drugids.value

    proxy
      .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
        confirmButtonText: proxy.$t('common.ok'),
        cancelButtonText: proxy.$t('common.cancel'),
        type: "warning",
      })
      .then(function () {
        return delDrug(Ids)
      })
      .then(() => {
        DruggetList()
        proxy.$modal.msgSuccess("删除成功")
      })
  }

  // 清空
  function DrughandleClear() {
    proxy
      .$confirm("是否确认清空所有数据项?", "警告", {
        confirmButtonText: proxy.$t('common.ok'),
        cancelButtonText: proxy.$t('common.cancel'),
        type: "warning",
      })
      .then(function () {
        return clearDrug()
      })
      .then(() => {
        DrughandleQuery()
        proxy.$modal.msgSuccess('清空成功')
      })
  }

  // 导入数据成功处理
  const DrughandleFileSuccess = (response) => {
    const { item1, item2 } = response.data
    var error = ''
    item2.forEach((item) => {
      error += item.storageMessage + ','
    })
    proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
      dangerouslyUseHTMLString: true
    })
    DruggetList()
  }


  // 导出按钮操作
  function DrughandleExport() {
    proxy
      .$confirm("是否确认导出药品基础信息数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(async () => {
        await proxy.downFile('/business/Drug/export', { ...queryParams })
      })
  }

  DrughandleQuery()
</script>