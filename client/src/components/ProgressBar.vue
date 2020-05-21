<template>
  <div class="progress-item">
    <div>Upload: {{ thread }}</div>
    <div class="progress-percentage">
      <div class="progress-percentage__bar">
        <div class="progress-percentage__bar--done" :style="{ width: item.percentage}"></div>
      </div>
      <div>{{ item.percentage }}</div>
    </div>
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
.progress-percentage {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.progress-percentage__bar {
  width: 200px;
  height: 14px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid gray;
}
.progress-percentage__bar--done {
  height: 100%;
  background: linear-gradient(to right, green, lightgreen);
}
</style>
