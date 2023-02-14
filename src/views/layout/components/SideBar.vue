<template>
	<div class="side-bar">
		<el-menu router :default-active="activeMenu">
			<el-menu-item index="/index">
				<template #title>
					<el-icon>
						<home-filled />
					</el-icon>
					<span>首页</span>
				</template>
			</el-menu-item>
			<el-sub-menu v-for="r in menuList" :key="r.path" :index="r.path">
				<template #title>
					<el-icon>
						<component :is="r.meta!.icon" />
					</el-icon>
					<span>{{ r.meta!.title }}</span>
				</template>
				<el-menu-item v-for="i in r.children" :key="i.path" :index="i.path">
					{{ i.meta!.title }}
				</el-menu-item>
			</el-sub-menu>
		</el-menu>
	</div>
</template>

<script lang="ts" setup>
import routes from '@/router/routes'
import { HomeFilled } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const menuList = ref(routes[0].children!.splice(1))
const activeMenu = computed(() => route.path)


</script>

<style lang="less" scoped>
.side-bar {
	height: 100%;
	overflow-y: auto;
	border-right: 1px solid var(--el-menu-border-color);


	.el-menu {
		height: 100%;
		border: none;

		&-item.is-active {
			border-right: 2px solid var(--el-color-primary);
		}

		.el-sub-menu.is-active {
			background-color: var(--el-menu-hover-bg-color) !important;
		}
	}
}
</style>