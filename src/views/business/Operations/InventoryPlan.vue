<!--
 * @Descripttion: (入库计划/InventoryPlan)
 * @Author: (admin)
 * @Date: (2024-08-27)
-->
<template>
	<div>
		<div>
			<el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch"
				@submit.prevent>
				<el-form-item label="入库单编号" prop="inventoryPlanCode">
					<el-input v-model="queryParams.inventoryPlanCode" placeholder="请输入入库单编号" />
				</el-form-item>
				<el-form-item label="入库时间" prop="storageTime">
					<el-input v-model="queryParams.storageTime" placeholder="请输入入库时间" />
				</el-form-item>
				<el-form-item label="创建时间" prop="creationTime">
					<el-input v-model="queryParams.creationTime" placeholder="请输入创建时间" />
				</el-form-item>
				<el-form-item label="创建人" prop="creator">
					<el-input v-model="queryParams.creator" placeholder="请输入创建人" />
				</el-form-item>
				<el-form-item label="修改时间" prop="changeTime">
					<el-input v-model="queryParams.changeTime" placeholder="请输入修改时间" />
				</el-form-item>
				<el-form-item label="修改人" prop="modifiedBy">
					<el-input v-model="queryParams.modifiedBy" placeholder="请输入修改人" />
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
					<el-button type="primary" v-hasPermi="['inventoryplan:add']" plain icon="plus" @click="handleAdd">
						{{ $t('btn.add') }}
					</el-button>
				</el-col>
				<!-- <el-col :span="1.5">
				<el-button type="success" :disabled="single" v-hasPermi="['inventoryplan:edit']" plain icon="edit"
					@click="handleUpdate">
					{{ $t('btn.edit') }}
				</el-button>
			</el-col> -->
				<el-col :span="1.5">
					<el-button type="danger" :disabled="multiple" v-hasPermi="['inventoryplan:delete']" plain
						icon="delete" @click="handleDelete">
						{{ $t('btn.delete') }}
					</el-button>
				</el-col>
				<!-- <el-col :span="1.5">
				<el-button type="danger" v-hasPermi="['inventoryplan:delete']" plain icon="delete" @click="handleClear">
					{{ $t('btn.clean') }}
				</el-button>
			</el-col> -->
				<!-- <el-col :span="1.5">
				<el-dropdown trigger="click" v-hasPermi="['inventoryplan:import']">
					<el-button type="primary" plain icon="Upload">
						{{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="upload">
								<importData templateUrl="business/InventoryPlan/importTemplate"
									importUrl="/business/InventoryPlan/importData" @success="handleFileSuccess">
								</importData>
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
</el-dropdown>
</el-col>
<el-col :span="1.5">
	<el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['inventoryplan:export']">
		{{ $t('btn.export') }}
	</el-button>
</el-col> -->
				<el-col :span="1.5">
					<el-button type="primary" v-hasPermi="['inventoryplan:add']" plain icon="plus"
						@click="ToExaminehandleAdd">
						审核计划
					</el-button>
				</el-col>
				<el-col :span="1.5">
					<el-button type="primary" v-hasPermi="['inventoryplan:add']" plain icon="plus"
						@click="SendOuthandleAdd">
						发送计划
					</el-button>
				</el-col>
				<right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
			</el-row>

			<el-table @row-dblclick="PlanDrugdatalist" :data="dataList" v-loading="loading" ref="table" border
				header-cell-class-name="el-table-header-cell" highlight-current-row @sort-change="sortChange"
				@selection-change="handleSelectionChange">
				<el-table-column type="selection" width="50" align="center" />
				<el-table-column prop="id" label="Id" align="center" v-if="columns.showColumn('id')" />
				<el-table-column prop="inventoryPlanCode" label="备货单编号" align="center" :show-overflow-tooltip="true"
					v-if="columns.showColumn('inventoryPlanCode')" />
				<el-table-column prop="storageTime" label="备货时间" align="center" :show-overflow-tooltip="true"
					v-if="columns.showColumn('storageTime')" />
				<el-table-column prop="creationTime" label="创建时间" align="center" :show-overflow-tooltip="true"
					v-if="columns.showColumn('creationTime')" />
				<el-table-column prop="creator" label="创建人" align="center" :show-overflow-tooltip="true"
					v-if="columns.showColumn('creator')" />
				<el-table-column prop="changeTime" label="修改时间" align="center" :show-overflow-tooltip="true"
					v-if="columns.showColumn('changeTime')" />
				<el-table-column prop="modifiedBy" label="修改人" align="center" :show-overflow-tooltip="true"
					v-if="columns.showColumn('modifiedBy')" />
				<el-table-column prop="states" label="状态" align="center" :show-overflow-tooltip="true"
					v-if="columns.showColumn('states')" />
				<el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
					v-if="columns.showColumn('remarks')" />
				<el-table-column label="操作" width="160">
					<template #default="scope">
						<el-button type="primary" size="small" icon="view" title="详情"
							@click="handlePreview(scope.row)"></el-button>
						<el-button type="success" size="small" icon="edit" title="编辑"
							v-hasPermi="['inventoryplan:edit']" @click="handleUpdate(scope.row)"></el-button>
						<el-button type="danger" size="small" icon="delete" title="删除"
							v-hasPermi="['inventoryplan:delete']" @click="handleDelete(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
				@pagination="getList" />

			<el-dialog :title="title" :lock-scroll="false" v-model="open">
				<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
					<el-row :gutter="20">

						<!-- <el-col :lg="12">
						<el-form-item label="Id" prop="id">
							<el-input v-model.number="form.id" placeholder="请输入Id" :disabled="opertype != 1" />
						</el-form-item>
					</el-col> -->

						<el-col :lg="12">
							<el-form-item label="备货单编号" prop="inventoryPlanCode">
								<el-input v-model="form.inventoryPlanCode" placeholder="请输入备货单编号" />
							</el-form-item>
						</el-col>

						<el-col :lg="12">
							<el-form-item label="备货时间" prop="storageTime">
								<el-input v-model="form.storageTime" placeholder="请输入备货时间" />
							</el-form-item>
						</el-col>

						<el-col :lg="12">
							<el-form-item label="创建时间" prop="creationTime">
								<el-input v-model="form.creationTime" placeholder="请输入创建时间" />
							</el-form-item>
						</el-col>

						<el-col :lg="12">
							<el-form-item label="创建人" prop="creator">
								<el-input v-model="form.creator" placeholder="请输入创建人" />
							</el-form-item>
						</el-col>

						<el-col :lg="12">
							<el-form-item label="修改时间" prop="changeTime">
								<el-input v-model="form.changeTime" placeholder="请输入修改时间" />
							</el-form-item>
						</el-col>

						<el-col :lg="12">
							<el-form-item label="修改人" prop="modifiedBy">
								<el-input v-model="form.modifiedBy" placeholder="请输入修改人" />
							</el-form-item>
						</el-col>

						<el-col :lg="12">
							<el-form-item label="状态" prop="states">
								<el-input v-model="form.states" placeholder="请输入状态" />
							</el-form-item>
						</el-col>

						<el-col :lg="12">
							<el-form-item label="备注" prop="remarks">
								<el-input v-model="form.remarks" placeholder="请输入备注" />
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
		<div>
			<el-form :model="PlanDrugsqueryParams" label-position="right" inline ref="PlanDrugsqueryRef"
				v-show="PlanDrugsshowSearch" @submit.prevent>
				<!-- <el-form-item label="入库计划id" prop="planId">
				<el-input v-model="PlanDrugsqueryParams.planId" placeholder="请输入入库计划id" />
			</el-form-item> -->
				<el-form-item label="药品名称" prop="drugDetails">
					<el-input v-model="PlanDrugsqueryParams.drugDetails" placeholder="请输入药品名称" />
				</el-form-item>
				<el-form-item>
					<el-button :disabled="queryParams.receiptId == 0" type="primary" v-hasPermi="['inwarehousing:add']"
						plain icon="plus" @click="OpenDrughandleAdd">
						添加明细
					</el-button>
					<el-button icon="search" type="primary" @click="PlanDrugshandleQuery">{{ $t('btn.search')
						}}</el-button>
					<el-button icon="refresh" @click="PlanDrugsresetQuery">{{ $t('btn.reset') }}</el-button>
				</el-form-item>
			</el-form>
			<!-- 工具区域 -->
			<el-row :gutter="15" class="mb10">
				<!-- <el-col :span="1.5">
				<el-button type="primary" v-hasPermi="['inventoryplandrugs:add']" plain icon="plus"
					@click="PlanDrugshandleAdd">
					{{ $t('btn.add') }}
				</el-button>
			</el-col> -->
				<!-- <el-col :span="1.5">
				<el-button type="success" :disabled="single" v-hasPermi="['inventoryplandrugs:edit']" plain icon="edit"
					@click="PlanDrugshandleUpdate">
					{{ $t('btn.edit') }}
				</el-button>
			</el-col> -->
				<el-col :span="1.5">
					<el-button type="danger" :disabled="PlanDrugsmultiple" v-hasPermi="['inventoryplandrugs:delete']"
						plain icon="delete" @click="PlanDrugshandleDelete">
						{{ $t('btn.delete') }}
					</el-button>
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
					v-if="PlanDrugscolumns.showColumn('drugQuantity')">
					<template #default="{ row }">
						<el-input v-model="row.drugQuantity" size="small"
							@blur="PlanDrugshandleDrugQuantityChange(row)" />
					</template>
				</el-table-column>
				<el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true"
					v-if="PlanDrugscolumns.showColumn('remarks')">
					<template #default="{ row }">
						<el-input v-model="row.remarks" size="small" @blur="PlanDrugshandleDrugQuantityChange(row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="160">
					<template #default="scope">
						<el-button type="primary" size="small" icon="view" title="详情"
							@click="PlanDrugshandlePreview(scope.row)"></el-button>
						<el-button type="success" size="small" icon="edit" title="编辑"
							v-hasPermi="['inventoryplandrugs:edit']"
							@click="PlanDrugshandleUpdate(scope.row)"></el-button>
						<el-button type="danger" size="small" icon="delete" title="删除"
							v-hasPermi="['inventoryplandrugs:delete']"
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
								<el-input v-model.number="PlanDrugsform.id" placeholder="请输入Id"
									:disabled="PlanDrugsopertype != 1" />
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

		<!-- 药品选择 -->
		<el-dialog :title="title" :lock-scroll="false" v-model="Drugopen">
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
			<!-- <el-row :gutter="15" class="mb10">
        <el-col :span="1.5">
          <el-button type="primary" v-hasPermi="['drug:add']" plain icon="plus" @click="DrughandleAdd">
            {{ $t('btn.add') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" :disabled="single" v-hasPermi="['drug:edit']" plain icon="edit"
            @click="DrughandleUpdate">
            {{ $t('btn.edit') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" :disabled="multiple" v-hasPermi="['drug:delete']" plain icon="delete"
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
          </el-button>
        </el-col>

        <right-toolbar v-model:showSearch="DrugshowSearch" @queryTable="DruggetList"
          :columns="Drugcolumns"></right-toolbar>
      </el-row> -->

			<el-table :data="DrugdataList" v-loading="Drugloading" ref="Drugtable" border
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
					v-if="Drugcolumns.showColumn('drugClassification')" />
				<el-table-column prop="tracingSourceCode" label="溯源码" align="center" :show-overflow-tooltip="true"
					v-if="Drugcolumns.showColumn('tracingSourceCode')" />
				<el-table-column prop="drugBatchNumber" label="批号" align="center" :show-overflow-tooltip="true"
					v-if="Drugcolumns.showColumn('drugBatchNumber')" />

			</el-table>
			<pagination :total="Drugtotal" v-model:page="DrugqueryParams.pageNum"
				v-model:limit="DrugqueryParams.pageSize" @pagination="DruggetList" />
			<template #footer v-if="Drugopertype != 3">
				<el-button text @click="Drugcancel">{{ $t('btn.cancel') }}</el-button>
				<el-button type="primary" @click="DrugsubmitForm">{{ $t('btn.submit') }}</el-button>
			</template>

		</el-dialog>

	</div>

</template>

<script setup name="inventoryplan">
import {
	listInventoryPlan,
	addInventoryPlan, delInventoryPlan,
	updateInventoryPlan, getInventoryPlan,
	clearInventoryPlan,
}
	from '@/api/business/inventoryplan.js'
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
	inventoryPlanCode: undefined,
	storageTime: undefined,
	creationTime: undefined,
	creator: undefined,
	changeTime: undefined,
	modifiedBy: undefined,
	states: undefined,
})
const columns = ref([
	{ visible: false, align: 'center', type: '', prop: 'id', label: 'Id', },
	{ visible: true, align: 'center', type: '', prop: 'inventoryPlanCode', label: '备货单编号', showOverflowTooltip: true },
	{ visible: true, align: 'center', type: '', prop: 'storageTime', label: '备货时间', showOverflowTooltip: true },
	{ visible: true, align: 'center', type: '', prop: 'creationTime', label: '创建时间', showOverflowTooltip: true },
	{ visible: true, align: 'center', type: '', prop: 'creator', label: '创建人', showOverflowTooltip: true },
	{ visible: true, align: 'center', type: '', prop: 'changeTime', label: '修改时间', showOverflowTooltip: true },
	{ visible: true, align: 'center', type: '', prop: 'modifiedBy', label: '修改人', showOverflowTooltip: true },
	{ visible: true, align: 'center', type: '', prop: 'states', label: '状态', showOverflowTooltip: true },
	{ visible: true, align: 'center', type: '', prop: 'remarks', label: '备注', showOverflowTooltip: true },
	//{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])
var dictParams = [
]

function OpenDrughandleAdd() {
	if (ids.value.length == 1) {
		Drugreset();
		Drugopen.value = true
		Drugtitle.value = '添加入库信息'
		Drugopertype.value = 1
		console.log(ids.value[0])

	}
	else {
		alert("请选择一个入库单")
	}

}
function getList() {
	loading.value = true
	listInventoryPlan(queryParams).then(res => {
		const { code, data } = res
		if (code == 200) {
			dataList.value = data.result
			total.value = data.totalNum
			loading.value = false
		}
	})
}
const plandata = ref([])
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
	plandata.value = selection.map((item, index) => {
		return {
			Id: item.id,
			InventoryPlanCode: item.inventoryPlanCode,
			StorageTime: item.storageTime,
			CreationTime: item.creationTime,
			Creator: item.creator,
			ChangeTime: item.changeTime,
			ModifiedBy: item.modifiedBy,
			States: item.states,
			Remarks: item.remarks
		}
	})
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
		// id: [{ required: true, message: "Id不能为空", trigger: "blur", type: "number" }],
	},
	options: {
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
		id: null,
		inventoryPlanCode: null,
		storageTime: null,
		creationTime: null,
		creator: null,
		changeTime: null,
		modifiedBy: null,
		states: null,
		remarks: null,
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
	getInventoryPlan(id).then((res) => {
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
import useUserStore from "@/store/modules/user";
// import { id } from 'element-plus/es/locale';

var userId = useUserStore().userId;
var userInfo = useUserStore().userInfo;
//{"userId":1,"userName":"admin","nickName":"管理员","userType":"0","avatar":"","email":"","phonenumber":"","sex":0,"status":0,"delFlag":0,"loginIP":"127.0.0.1","loginDate":"2023-07-25 16:58:43","deptId":0,"deptName":null,"roleIds":[1],"postIds":null,"roles":[{"roleId":1,"roleName":"超级管理员","roleKey":"admin","roleSort":1,"status":0,"delFlag":0,"dataScope":1,"menuCheckStrictly":true,"deptCheckStrictly":false,"menuIds":null,"deptIds":null,"userNum":0,"createBy":"admin","createTime":"2023-07-12 18:19:06","updateTime":null,"remark":"超级管理员"}],"welcomeMessage":"早上好","welcomeContent":"忙碌了一周，停一停脚步！","createBy":"","createTime":"2023-07-26 09:59:39","updateTime":null,"remark":"管理员"}

// 昵称
var nickName = useUserStore().name;
// 添加按钮操作
function handleAdd() {
	reset();
	open.value = true
	title.value = '添加入库计划'
	opertype.value = 1
	form.value.storageTime = new Date().toLocaleString();
	form.value.changeTime = new Date().toLocaleString();
	form.value.creationTime = new Date().toLocaleString();
	form.value.creator = nickName;
	form.value.modifiedBy = nickName;

}
// 修改按钮操作
function handleUpdate(row) {
	reset()
	const id = row.id || ids.value
	getInventoryPlan(id).then((res) => {
		const { code, data } = res
		if (code == 200) {
			open.value = true
			title.value = '修改入库计划'
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
			form.value.id = 0;
			if (form.value.id != undefined && opertype.value === 2) {
				updateInventoryPlan(form.value).then((res) => {
					proxy.$modal.msgSuccess("修改成功")
					open.value = false
					getList()
				})
			} else {
				addInventoryPlan(form.value).then((res) => {
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
			return delInventoryPlan(Ids)
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
			return clearInventoryPlan()
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
		.$confirm("是否确认导出入库计划数据项?", "警告", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning",
		})
		.then(async () => {
			await proxy.downFile('/business/InventoryPlan/export', { ...queryParams })
		})
}

handleQuery()



import {
	listInventoryPlanDrugs,
	addInventoryPlanDrugs, delInventoryPlanDrugs,
	updateInventoryPlanDrugs, getInventoryPlanDrugs,
	clearInventoryPlanDrugs,
}
	from '@/api/business/inventoryplandrugs.js'
// import importData from '@/components/ImportData'
// const { proxy } = getCurrentInstance()
const PlanDrugsids = ref([])
const PlanDrugsloading = ref(false)
const PlanDrugsshowSearch = ref(true)
const PlanDrugsqueryParams = reactive({
	pageNum: 1,
	pageSize: 10,
	sort: '',
	sortType: 'asc',
	planId: 0,
	drugId: undefined,
	drugDetails: undefined,
})
const PlanDrugscolumns = ref([
	{ visible: false, align: 'center', type: '', prop: 'id', label: 'Id' },
	{ visible: false, align: 'center', type: '', prop: 'planId', label: '入库计划id', showOverflowTooltip: true },
	{ visible: false, align: 'center', type: '', prop: 'drugId', label: '药品id', showOverflowTooltip: true },
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
	console.log(PlanDrugsqueryParams)
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

function PlanDrugshandleDrugQuantityChange(row) {
	// console.log(row)
	//进行修改操作进行保存
	PlanDrugsform.value = row
	if (PlanDrugsform.value.id != undefined) {
		updateInventoryPlanDrugs(PlanDrugsform.value).then((res) => {
			proxy.$modal.msgSuccess("修改成功")
			PlanDrugsopen.value = false
			PlanDrugsgetList()
		})
	}

}

//审核
function ToExaminehandleAdd() {
	if (ids.value.length > 0) {
		proxy
			.$confirm('是否审核' + ids.value.length + '个入库计划？', "警告", {
				confirmButtonText: proxy.$t('common.ok'),
				cancelButtonText: proxy.$t('common.cancel'),
				type: "warning",
			})
			.then(function () {
				plandata.value.forEach(element => {
					element.States = '已审核'
				});
				console.log(plandata.value)
				updateInventoryPlan(plandata.value).then((res) => {
					proxy.$modal.msgSuccess("审核成功")
					// PlanDrugsopen.value = false
					getList()
				})
			})
	} else {
		alert("请选择最少一个入库计划")
	}


}
//发送
function SendOuthandleAdd() {
	if (ids.value.length > 0) {
		proxy
			.$confirm('是否发送' + ids.value.length + '个入库计划？', "警告", {
				confirmButtonText: proxy.$t('common.ok'),
				cancelButtonText: proxy.$t('common.cancel'),
				type: "warning",
			})
			.then(function () {
				// 修改状态 并且执行备货单新增加语句
				plandata.value.forEach(element => {
					element.States = '已发送'
				});
				updateInventoryPlan(plandata.value).then((res) => {
					proxy.$modal.msgSuccess("发送计划成功")
					getList()
					PlanDrugsgetList()
				})

			})
	} else {
		alert("请选择最少一个入库计划")
	}

}

PlanDrugshandleQuery()



import {
	listDrug,
	addDrug, delDrug,
	updateDrug, getDrug,
}
	from '@/api/business/drug.js'
// import Index from '../index.vue';
// import { id } from 'element-plus/es/locale';
// const { proxy } = getCurrentInstance()
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
	{ visible: true, align: 'center', type: '', prop: 'drugVarietyName', label: '药品品种名称', showOverflowTooltip: true },
	{ visible: true, align: 'center', type: '', prop: 'drugClassification', label: '药物分类', showOverflowTooltip: true },
	{ visible: false, align: 'center', type: '', prop: 'tracingSourceCode', label: '溯源码', showOverflowTooltip: true },
	{ visible: false, align: 'center', type: '', prop: 'drugBatchNumber', label: '批号', showOverflowTooltip: true },
	//{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const Drugtotal = ref(0)
const DrugdataList = ref([])
const DrugqueryRef = ref()
const DrugdefaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])
const Drugopen = ref(false)

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
	// FictitiousDrugData.value = selection
	// // 添加 redid 并更新 FictitiousDrugData.value
	PlanDrugsData.value = selection.map((item, index) => {
		return {
			// Id: index,
			DrugId: item.drugId,
			DrugDetails: item.drugName,
			DrugQuantity: 0,
			Remarks: "",
			PlanId: ids.value[0]
		};
	});
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
const FictitiousDrugData = ref([]);
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
const PlanDrugsData = ref([])
// 添加&修改 表单提交
function DrugsubmitForm() {

	addInventoryPlanDrugs(PlanDrugsData.value).then((res) => {
		proxy.$modal.msgSuccess("新增成功")
		Drugopen.value = false
		PlanDrugsgetList()
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




//双击更新数据
function PlanDrugdatalist(row) {
	console.log("双击行数据", row)
	PlanDrugsqueryParams.planId = row.id
	console.log(PlanDrugsqueryParams.planId)
	PlanDrugsgetList()
}
</script>