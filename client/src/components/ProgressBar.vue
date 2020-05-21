<template>
  <div class="progress-item">
    <div>Upload: {{ thread }}</div>
    <div>{{ item.percentage }}</div>
  </div>
</template>

<script>
export default {  
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          index: 0,
          percentage: 0
        }        
      }
    }
  },
  computed: {
    thread() {
      return this.item.index + 1;
    }
  }
}
</script>

<style scoped>
.progress-item {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
