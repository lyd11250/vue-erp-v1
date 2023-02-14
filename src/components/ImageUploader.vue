<template>
    <div class="uploader" @click="inputRef.click">
        <input type="file" name="file" ref="inputRef" accept="image/*" style="display:none">
        <el-image v-if="filename" :src="completeImagePath(filename)" />
        <el-icon v-else class="uploader-btn">
            <plus />
        </el-icon>
    </div>
</template>

<script lang="ts" setup>
import { completeImagePath } from '@/utils'
import { Plus } from '@element-plus/icons-vue'
import { defineProps, ref, onMounted } from 'vue'
import { rCode, uploadFile } from '@/api'

const inputRef = ref()
const props = defineProps<{
    default?: string
}>()
const filename = ref(props.default)
const emits = defineEmits(['success'])

const handleSelect = async (event: any) => {
    const selectFile = event.target!.files[0] as File
    if (!selectFile) {
        return
    }
    const res = await uploadFile(selectFile)
    if (res.code === rCode.success) {
        filename.value = res.data.filename
        emits('success', filename.value)
    }
}

onMounted(() => {
    inputRef.value.addEventListener('input', handleSelect)
})

</script>

<style lang="less" scoped>
.uploader {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--el-border-radius-base);
    border: 2px dashed var(--el-border-color);
    cursor: pointer;
    transition: all var(--el-transition-duration);

    &-btn {
        color: var(--el-border-color);
        font-size: 24px;
        transition: all var(--el-transition-duration);
    }

    &:hover {
        border-color: var(--el-color-primary);

        .uploader-btn {
            color: var(--el-color-primary);
        }
    }
}
</style>