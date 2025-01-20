<!--
 * @Descripttion: (药品/GuiDrug)
 * @Author: (admin)
 * @Date: (2024-11-27)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="药品术语编码" prop="drugTermId">
        <el-input v-model="queryParams.drugTermId" placeholder="请输入药品术语编码" />
      </el-form-item>
      <el-form-item label="英文名" prop="englishFormal">
        <el-input v-model="queryParams.englishFormal" placeholder="请输入英文名" />
      </el-form-item>
      <el-form-item label="通用名" prop="regularName">
        <el-input v-model="queryParams.regularName" placeholder="请输入通用名" />
      </el-form-item>
      <el-form-item label="通用名拼音码" prop="regularSpellCode">
        <el-input v-model="queryParams.regularSpellCode" placeholder="请输入通用名拼音码" />
      </el-form-item>
      <el-form-item label="通用名五笔码" prop="regularWbCode">
        <el-input v-model="queryParams.regularWbCode" placeholder="请输入通用名五笔码" />
      </el-form-item>
      <el-form-item label="商品名拼音码" prop="spellCode">
        <el-input v-model="queryParams.spellCode" placeholder="请输入商品名拼音码" />
      </el-form-item>
      <el-form-item label="商品名" prop="tradeName">
        <el-input v-model="queryParams.tradeName" placeholder="请输入商品名" />
      </el-form-item>
      <el-form-item label="商品名五笔码" prop="wbCode">
        <el-input v-model="queryParams.wbCode" placeholder="请输入商品名五笔码" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['phaout:add']" plain icon="plus" @click="GuiDrugTongbu">
          同步
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['guidrug:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['guidrug:edit']" plain icon="edit"
          @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['guidrug:delete']" plain icon="delete"
          @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['guidrug:delete']" plain icon="delete" @click="handleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['guidrug:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData templateUrl="business/GuiDrug/importTemplate" importUrl="/business/GuiDrug/importData"
                  @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
</el-dropdown>
</el-col>
<el-col :span="1.5">
  <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['guidrug:export']">
    {{ $t('btn.export') }}
  </el-button>
</el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table :data="dataList" v-loading="loading" ref="table" border header-cell-class-name="el-table-header-cell"
      highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="regularName" label="通用名" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('regularName')" />
      <el-table-column prop="regularSpellCode" label="通用名拼音码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('regularSpellCode')" />
      <el-table-column prop="regularWbCode" label="通用名五笔码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('regularWbCode')" />
      <el-table-column prop="additiveDays" label="累计天数" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('additiveDays')" />
      <el-table-column prop="additiveQty" label="累计数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('additiveQty')" />
      <el-table-column prop="antibioticsFlag" label="是否抗生素" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('antibioticsFlag')">
        <template v-slot="scope">
          {{ scope.row.antibioticsFlag == 1 ? '是' : '否' }}
        </template>
      </el-table-column>

      <el-table-column prop="antibioticsLv" label="抗生素等级" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('antibioticsLv')" />
      <el-table-column prop="bakBaseDose" label="备用基本剂量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('bakBaseDose')" />
      <el-table-column prop="bakDoseUnit" label="备用剂量单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('bakDoseUnit')" />
      <el-table-column prop="baseDose" label="基本剂量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('baseDose')" />
      <el-table-column prop="childFlag" label="儿童用药限制标志" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('childFlag')" />
      <el-table-column prop="dangerFlag" label="高危药标志" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('dangerFlag')" />
      <el-table-column prop="defFreqCode" label="默认频次编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('defFreqCode')" />
      <el-table-column prop="defOnceDose" label="默认每次计量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('defOnceDose')" />
      <el-table-column prop="defUsageCode" label="默认给药途径编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('defUsageCode')" />
      <el-table-column prop="defUsageName" label="默认给药途径名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('defUsageName')" />
      <el-table-column prop="doseModel" label="剂型" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('doseModel')" />
      <el-table-column prop="doseModelName" label="剂型名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('doseModelName')" />
      <el-table-column prop="doseUnit" label="剂量单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('doseUnit')" />
      <el-table-column prop="drugQuality" label="药品性质" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugQuality')" />
      <el-table-column prop="drugTermId" label="药品术语编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('drugTermId')" />
      <el-table-column prop="englishFormal" label="英文名" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('englishFormal')" />
      <el-table-column prop="englishName" label="英文品名" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('englishName')" />
      <el-table-column prop="englishRegular" label="英文通用名" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('englishRegular')" />
      <el-table-column prop="familyplanFlag" label="计划生育药品标志" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('familyplanFlag')" />
      <el-table-column prop="gbCode" label="国家编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('gbCode')" />
      <el-table-column prop="gmpFlag" label="GMP标志" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('gmpFlag')" />
      <el-table-column prop="herbProcCode" label="默认特殊煎制法编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('herbProcCode')" />
      <el-table-column prop="herbProcName" label="默认特殊煎制法名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('herbProcName')" />
      <el-table-column prop="hypoKindCode" label="皮试类别编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('hypoKindCode')" />
      <el-table-column prop="hypoKindName" label="皮试类别名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('hypoKindName')" />
      <el-table-column prop="hypoReagentFlag" label="是否皮试剂" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('hypoReagentFlag')">
        <template v-slot="scope">
          {{ scope.row.hypoReagentFlag == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="hypoTestFlag" label="是否需皮试" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('hypoTestFlag')">
        <template v-slot="scope">
          {{ scope.row.hypoTestFlag == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="importFlag" label="是否进口药" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('importFlag')">
        <template v-slot="scope">
          {{ scope.row.importFlag == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="inDrugUnitLv" label="住院默认取药单位等级" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('inDrugUnitLv')" />
      <el-table-column prop="internationalCode" label="国际编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('internationalCode')" />
      <el-table-column prop="liquidFlag" label="大输液标志" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('liquidFlag')" />
      <el-table-column prop="maxDayDose" label="每天最大用量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('maxDayDose')" />
      <el-table-column prop="maxDays" label="最大天数" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('maxDays')" />
      <el-table-column prop="maxFrequency" label="单日最大频次" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('maxFrequency')" />
      <el-table-column prop="maxOnceDose" label="最大每次量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('maxOnceDose')" />
      <el-table-column prop="midQty" label="中间数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('midQty')" />
      <el-table-column prop="midUnit" label="中间单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('midUnit')" />
      <el-table-column prop="minUnit" label="最小单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('minUnit')" />
      <el-table-column prop="nostrumFlag" label="是否协定处方" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('nostrumFlag')">
        <template v-slot="scope">
          {{ scope.row.nostrumFlag == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="otcFlag" label="OTC标志" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('otcFlag')" />
      <el-table-column prop="packQty" label="包装数量" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('packQty')" />
      <el-table-column prop="packUnit" label="包装单位" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('packUnit')" />
      <el-table-column prop="pefDoseUnitLv" label="默认每次量单位等级" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('pefDoseUnitLv')" />
      <el-table-column prop="phaFunCode" label="药理作用编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('phaFunCode')" />
      <el-table-column prop="phaFunPath" label="药理作用路径" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('phaFunPath')" />
      <el-table-column prop="preciousFlag" label="贵重药标志" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('preciousFlag')" />
      <el-table-column prop="priceRef" label="参考价格" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('priceRef')" />
      <el-table-column prop="producerName" label="生产厂家" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('producerName')" />
      <el-table-column prop="putDrugUnitLv" label="门诊默认取药单位等级" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('putDrugUnitLv')" />
      <el-table-column prop="reagentCode" label="皮试剂编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('reagentCode')" />

      <el-table-column prop="sexClass" label="性别限制用药标志" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('sexClass')" />
      <el-table-column prop="siGrade" label="医保等级" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('siGrade')" />
      <el-table-column prop="siMark" label="适应症" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('siMark')" />
      <el-table-column prop="specs" label="规格" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('specs')" />
      <el-table-column prop="spellCode" label="商品名拼音码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('spellCode')" />
      <el-table-column prop="splitType" label="拆分类型" align="center" v-if="columns.showColumn('splitType')">
        <template #default="scope">
          <dict-tag :options="options.splitTypeOptions" :value="scope.row.splitType" />
        </template>
      </el-table-column>
      <el-table-column prop="stimulantFlag" label="兴奋剂标志" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('stimulantFlag')" />
      <el-table-column prop="surfaceFactor" label="与每平米体表面积换算系数" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('surfaceFactor')" />
      <el-table-column prop="termClassId" label="术语类型编码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('termClassId')" />
      <el-table-column prop="termClassName" label="术语类型名称" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('termClassName')" />
      <el-table-column prop="tradeName" label="商品名" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('tradeName')" />
      <el-table-column prop="useTip" label="药品使用提示" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('useTip')" />
      <el-table-column prop="wbCode" label="商品名五笔码" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('wbCode')" />
      <el-table-column prop="weightFactor" label="与每千克体重换算系数" align="center" :show-overflow-tooltip="true"
        v-if="columns.showColumn('weightFactor')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <!-- <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['guidrug:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['guidrug:delete']"
            @click="handleDelete(scope.row)"></el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />


    <el-dialog :title="title" :lock-scroll="false" v-model="open">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="累计天数" prop="additiveDays">
              <el-input v-model="form.additiveDays" placeholder="请输入累计天数" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="累计数量" prop="additiveQty">
              <el-input v-model="form.additiveQty" placeholder="请输入累计数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="是否抗生素" prop="antibioticsFlag">
              <el-input v-model="form.antibioticsFlag" placeholder="请输入是否抗生素" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="抗生素等级" prop="antibioticsLv">
              <el-input v-model="form.antibioticsLv" placeholder="请输入抗生素等级" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备用基本剂量" prop="bakBaseDose">
              <el-input v-model="form.bakBaseDose" placeholder="请输入备用基本剂量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="备用剂量单位" prop="bakDoseUnit">
              <el-input v-model="form.bakDoseUnit" placeholder="请输入备用剂量单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="基本剂量" prop="baseDose">
              <el-input v-model="form.baseDose" placeholder="请输入基本剂量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="儿童用药限制标志" prop="childFlag">
              <el-input v-model="form.childFlag" placeholder="请输入儿童用药限制标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="高危药标志" prop="dangerFlag">
              <el-input v-model="form.dangerFlag" placeholder="请输入高危药标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="默认频次编码" prop="defFreqCode">
              <el-input v-model="form.defFreqCode" placeholder="请输入默认频次编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="默认每次计量" prop="defOnceDose">
              <el-input v-model="form.defOnceDose" placeholder="请输入默认每次计量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="默认给药途径编码" prop="defUsageCode">
              <el-input v-model="form.defUsageCode" placeholder="请输入默认给药途径编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="默认给药途径名称" prop="defUsageName">
              <el-input v-model="form.defUsageName" placeholder="请输入默认给药途径名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="剂型" prop="doseModel">
              <el-input v-model="form.doseModel" placeholder="请输入剂型" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="剂型名称" prop="doseModelName">
              <el-input v-model="form.doseModelName" placeholder="请输入剂型名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="剂量单位" prop="doseUnit">
              <el-input v-model="form.doseUnit" placeholder="请输入剂量单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品性质" prop="drugQuality">
              <el-input v-model="form.drugQuality" placeholder="请输入药品性质" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品术语编码" prop="drugTermId">
              <el-input v-model="form.drugTermId" placeholder="请输入药品术语编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="英文名" prop="englishFormal">
              <el-input v-model="form.englishFormal" placeholder="请输入英文名" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="英文品名" prop="englishName">
              <el-input v-model="form.englishName" placeholder="请输入英文品名" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="英文通用名" prop="englishRegular">
              <el-input v-model="form.englishRegular" placeholder="请输入英文通用名" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="计划生育药品标志" prop="familyplanFlag">
              <el-input v-model="form.familyplanFlag" placeholder="请输入计划生育药品标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="国家编码" prop="gbCode">
              <el-input v-model="form.gbCode" placeholder="请输入国家编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="GMP标志" prop="gmpFlag">
              <el-input v-model="form.gmpFlag" placeholder="请输入GMP标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="默认特殊煎制法编码" prop="herbProcCode">
              <el-input v-model="form.herbProcCode" placeholder="请输入默认特殊煎制法编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="默认特殊煎制法名称" prop="herbProcName">
              <el-input v-model="form.herbProcName" placeholder="请输入默认特殊煎制法名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="皮试类别编码" prop="hypoKindCode">
              <el-input v-model="form.hypoKindCode" placeholder="请输入皮试类别编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="皮试类别名称" prop="hypoKindName">
              <el-input v-model="form.hypoKindName" placeholder="请输入皮试类别名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="是否皮试剂" prop="hypoReagentFlag">
              <el-input v-model="form.hypoReagentFlag" placeholder="请输入是否皮试剂" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="是否需皮试" prop="hypoTestFlag">
              <el-input v-model="form.hypoTestFlag" placeholder="请输入是否需皮试" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="是否进口药" prop="importFlag">
              <el-input v-model="form.importFlag" placeholder="请输入是否进口药" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="住院默认取药单位等级" prop="inDrugUnitLv">
              <el-input v-model="form.inDrugUnitLv" placeholder="请输入住院默认取药单位等级" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="国际编码" prop="internationalCode">
              <el-input v-model="form.internationalCode" placeholder="请输入国际编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="大输液标志" prop="liquidFlag">
              <el-input v-model="form.liquidFlag" placeholder="请输入大输液标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="每天最大用量" prop="maxDayDose">
              <el-input v-model="form.maxDayDose" placeholder="请输入每天最大用量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最大天数" prop="maxDays">
              <el-input v-model="form.maxDays" placeholder="请输入最大天数" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="单日最大频次" prop="maxFrequency">
              <el-input v-model="form.maxFrequency" placeholder="请输入单日最大频次" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最大每次量" prop="maxOnceDose">
              <el-input v-model="form.maxOnceDose" placeholder="请输入最大每次量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="中间数量" prop="midQty">
              <el-input v-model="form.midQty" placeholder="请输入中间数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="中间单位" prop="midUnit">
              <el-input v-model="form.midUnit" placeholder="请输入中间单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="最小单位" prop="minUnit">
              <el-input v-model="form.minUnit" placeholder="请输入最小单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="是否协定处方" prop="nostrumFlag">
              <el-input v-model="form.nostrumFlag" placeholder="请输入是否协定处方" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="OTC标志" prop="otcFlag">
              <el-input v-model="form.otcFlag" placeholder="请输入OTC标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装数量" prop="packQty">
              <el-input v-model="form.packQty" placeholder="请输入包装数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="包装单位" prop="packUnit">
              <el-input v-model="form.packUnit" placeholder="请输入包装单位" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="默认每次量单位等级" prop="pefDoseUnitLv">
              <el-input v-model="form.pefDoseUnitLv" placeholder="请输入默认每次量单位等级" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药理作用编码" prop="phaFunCode">
              <el-input v-model="form.phaFunCode" placeholder="请输入药理作用编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药理作用路径" prop="phaFunPath">
              <el-input v-model="form.phaFunPath" placeholder="请输入药理作用路径" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="贵重药标志" prop="preciousFlag">
              <el-input v-model="form.preciousFlag" placeholder="请输入贵重药标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="参考价格" prop="priceRef">
              <el-input v-model="form.priceRef" placeholder="请输入参考价格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产厂家" prop="producerName">
              <el-input v-model="form.producerName" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="门诊默认取药单位等级" prop="putDrugUnitLv">
              <el-input v-model="form.putDrugUnitLv" placeholder="请输入门诊默认取药单位等级" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="皮试剂编码" prop="reagentCode">
              <el-input v-model="form.reagentCode" placeholder="请输入皮试剂编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="通用名" prop="regularName">
              <el-input v-model="form.regularName" placeholder="请输入通用名" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="通用名拼音码" prop="regularSpellCode">
              <el-input v-model="form.regularSpellCode" placeholder="请输入通用名拼音码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="通用名五笔码" prop="regularWbCode">
              <el-input v-model="form.regularWbCode" placeholder="请输入通用名五笔码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="性别限制用药标志" prop="sexClass">
              <el-input v-model="form.sexClass" placeholder="请输入性别限制用药标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="医保等级" prop="siGrade">
              <el-input v-model="form.siGrade" placeholder="请输入医保等级" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="适应症" prop="siMark">
              <el-input v-model="form.siMark" placeholder="请输入适应症" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="规格" prop="specs">
              <el-input v-model="form.specs" placeholder="请输入规格" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="商品名拼音码" prop="spellCode">
              <el-input v-model="form.spellCode" placeholder="请输入商品名拼音码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="拆分类型" prop="splitType">
              <el-select v-model="form.splitType" placeholder="请选择拆分类型">
                <el-option v-for="item in options.splitTypeOptions" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="兴奋剂标志" prop="stimulantFlag">
              <el-input v-model="form.stimulantFlag" placeholder="请输入兴奋剂标志" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="与每平米体表面积换算系数" prop="surfaceFactor">
              <el-input v-model="form.surfaceFactor" placeholder="请输入与每平米体表面积换算系数" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="术语类型编码" prop="termClassId">
              <el-input v-model="form.termClassId" placeholder="请输入术语类型编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="术语类型名称" prop="termClassName">
              <el-input v-model="form.termClassName" placeholder="请输入术语类型名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="商品名" prop="tradeName">
              <el-input v-model="form.tradeName" placeholder="请输入商品名" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="药品使用提示" prop="useTip">
              <el-input v-model="form.useTip" placeholder="请输入药品使用提示" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="商品名五笔码" prop="wbCode">
              <el-input v-model="form.wbCode" placeholder="请输入商品名五笔码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="与每千克体重换算系数" prop="weightFactor">
              <el-input v-model="form.weightFactor" placeholder="请输入与每千克体重换算系数" />
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

<script setup name="guidrug">
import {
  listGuiDrug,
  addGuiDrug, delGuiDrug,
  updateGuiDrug, getGuiDrug,
  clearGuiDrug, TongBu,
}
  from '@/api/business/guidrug.js'
import importData from '@/components/ImportData'
const { proxy } = getCurrentInstance()
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  drugTermId: undefined,
  englishFormal: undefined,
  regularName: undefined,
  regularSpellCode: undefined,
  regularWbCode: undefined,
  spellCode: undefined,
  tradeName: undefined,
  wbCode: undefined,
})
const columns = ref([
  { visible: false, align: 'center', type: '', prop: 'additiveDays', label: '累计天数', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'additiveQty', label: '累计数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'antibioticsFlag', label: '是否抗生素', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'antibioticsLv', label: '抗生素等级', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'bakBaseDose', label: '备用基本剂量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'bakDoseUnit', label: '备用剂量单位', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'baseDose', label: '基本剂量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'childFlag', label: '儿童用药限制标志', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'dangerFlag', label: '高危药标志', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'defFreqCode', label: '默认频次编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'defOnceDose', label: '默认每次计量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'defUsageCode', label: '默认给药途径编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'defUsageName', label: '默认给药途径名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'doseModel', label: '剂型', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'doseModelName', label: '剂型名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'doseUnit', label: '剂量单位', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugQuality', label: '药品性质', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'drugTermId', label: '药品术语编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'englishFormal', label: '英文名', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'englishName', label: '英文品名', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'englishRegular', label: '英文通用名', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'familyplanFlag', label: '计划生育药品标志', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'gbCode', label: '国家编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'gmpFlag', label: 'GMP标志', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'herbProcCode', label: '默认特殊煎制法编码', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'herbProcName', label: '默认特殊煎制法名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'hypoKindCode', label: '皮试类别编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'hypoKindName', label: '皮试类别名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'hypoReagentFlag', label: '是否皮试剂', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'hypoTestFlag', label: '是否需皮试', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'importFlag', label: '是否进口药', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'inDrugUnitLv', label: '住院默认取药单位等级', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'internationalCode', label: '国际编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'liquidFlag', label: '大输液标志', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'maxDayDose', label: '每天最大用量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'maxDays', label: '最大天数', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'maxFrequency', label: '单日最大频次', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'maxOnceDose', label: '最大每次量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'midQty', label: '中间数量', showOverflowTooltip: true },
  { visible: false, align: 'center', type: '', prop: 'midUnit', label: '中间单位', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'minUnit', label: '最小单位', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'nostrumFlag', label: '是否协定处方', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'otcFlag', label: 'OTC标志', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'packQty', label: '包装数量', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'packUnit', label: '包装单位', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'pefDoseUnitLv', label: '默认每次量单位等级', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'phaFunCode', label: '药理作用编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'phaFunPath', label: '药理作用路径', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'preciousFlag', label: '贵重药标志', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'priceRef', label: '参考价格', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'producerName', label: '生产厂家', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'putDrugUnitLv', label: '门诊默认取药单位等级', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'reagentCode', label: '皮试剂编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'regularName', label: '通用名', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'regularSpellCode', label: '通用名拼音码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'regularWbCode', label: '通用名五笔码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'sexClass', label: '性别限制用药标志', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'siGrade', label: '医保等级', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'siMark', label: '适应症', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'specs', label: '规格', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'spellCode', label: '商品名拼音码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: 'dict', prop: 'splitType', label: '拆分类型', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'stimulantFlag', label: '兴奋剂标志', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'surfaceFactor', label: '与每平米体表面积换算系数', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'termClassId', label: '术语类型编码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'termClassName', label: '术语类型名称', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'tradeName', label: '商品名', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'useTip', label: '药品使用提示', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'wbCode', label: '商品名五笔码', showOverflowTooltip: true },
  { visible: true, align: 'center', type: '', prop: 'weightFactor', label: '与每千克体重换算系数', showOverflowTooltip: true },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var dictParams = [
]


function getList() {
  loading.value = true
  listGuiDrug(queryParams).then(res => {
    const { code, data } = res
    console.log(data)
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
function resetQuery() {
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
  },
  options: {
    // 拆分类型 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    splitTypeOptions: [],
  }
})

const { form, rules, options, single, multiple } = toRefs(state)

// 关闭dialog
function cancel() {
  open.value = false
  reset()
}

// 重置表单
function reset() {
  form.value = {
    additiveDays: null,
    additiveQty: null,
    antibioticsFlag: null,
    antibioticsLv: null,
    bakBaseDose: null,
    bakDoseUnit: null,
    baseDose: null,
    childFlag: null,
    dangerFlag: null,
    defFreqCode: null,
    defOnceDose: null,
    defUsageCode: null,
    defUsageName: null,
    doseModel: null,
    doseModelName: null,
    doseUnit: null,
    drugQuality: null,
    drugTermId: null,
    englishFormal: null,
    englishName: null,
    englishRegular: null,
    familyplanFlag: null,
    gbCode: null,
    gmpFlag: null,
    herbProcCode: null,
    herbProcName: null,
    hypoKindCode: null,
    hypoKindName: null,
    hypoReagentFlag: null,
    hypoTestFlag: null,
    importFlag: null,
    inDrugUnitLv: null,
    internationalCode: null,
    liquidFlag: null,
    maxDayDose: null,
    maxDays: null,
    maxFrequency: null,
    maxOnceDose: null,
    midQty: null,
    midUnit: null,
    minUnit: null,
    nostrumFlag: null,
    otcFlag: null,
    packQty: null,
    packUnit: null,
    pefDoseUnitLv: null,
    phaFunCode: null,
    phaFunPath: null,
    preciousFlag: null,
    priceRef: null,
    producerName: null,
    putDrugUnitLv: null,
    reagentCode: null,
    regularName: null,
    regularSpellCode: null,
    regularWbCode: null,
    sexClass: null,
    siGrade: null,
    siMark: null,
    specs: null,
    spellCode: null,
    splitType: null,
    stimulantFlag: null,
    surfaceFactor: null,
    termClassId: null,
    termClassName: null,
    tradeName: null,
    useTip: null,
    wbCode: null,
    weightFactor: null,
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
  getGuiDrug(id).then((res) => {
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
  title.value = '添加药品'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getGuiDrug(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改药品'
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
        updateGuiDrug(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addGuiDrug(form.value).then((res) => {
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
      return delGuiDrug(Ids)
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
      return clearGuiDrug()
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
    .$confirm("是否确认导出药品数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/GuiDrug/export', { ...queryParams })
    })
}

handleQuery()

function GuiDrugTongbu() {
  proxy.$modal.loading("请稍等")
  TongBu().then((res) => {

    proxy.$modal.closeLoading()
    if (res.data == "true") {
      proxy.$modal.msgSuccess("同步成功")
      getList()
    } else {
      proxy.$modal.msgError("出现错误请联系开发人员")
    }
  })
}
</script>