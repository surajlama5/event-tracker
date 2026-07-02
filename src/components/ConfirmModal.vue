<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click="close">
        <div class="relative w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800" @click.stop>
          <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h2>
          <p class="mb-6 text-gray-600 dark:text-gray-300">
            {{ message }}
          </p>

          <div class="flex gap-3">
            <button
              @click="cancel"
              class="flex-1 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {{ cancelText }}
            </button>
            <button
              @click="confirm"
              :class="[
                'flex-1 rounded-md px-4 py-2 font-medium text-white',
                dangerousAction
                  ? 'bg-red-600 hover:bg-red-700 dark:hover:bg-red-800'
                  : 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800',
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  dangerousAction?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

function close() {
  emit('update:modelValue', false)
}

function confirm() {
  emit('confirm')
  close()
}

function cancel() {
  emit('cancel')
  close()
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
