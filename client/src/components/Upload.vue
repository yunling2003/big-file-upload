<template>
  <div>
    <h1>{{ msg }}</h1>
    <div class="upload-area">
      <div class="upload-panel">
        <input 
          type="file" 
          class="upload-input"
          :placeholder="placeholder"
          ref="uploader" />      
        <button
          :disabled="disableBtn"
          @click="uploadFile">
          <span>Upload</span>
        </button>
      </div>
      <div class="progress-panel">
        <progress-bar v-for="ind in fileChunks.length" :key="ind" :item="progresses[ind - 1]"></progress-bar>
      </div>      
    </div>    
  </div>
</template>

<script>
import ProgressBar from './ProgressBar'
import request from '../utils/request'

export default {
  name: 'BigFileUpload',
  components: {
    ProgressBar
  },
  data() {
    return {
      placeholder: "Select File to Upload",
      disableBtn: false,
      file: null,
      fileChunks: [],
      progresses: []
    }    
  },
  props: {
    msg: String
  },
  methods: {
    uploadFile() {
      //reset progress
      this.progresses = [];
      
      this.disableBtn = true;
      this.file = this.$refs.uploader.files[0];
      if(!this.file) {
        alert('Please choose a file to upload!');
        return;
      }
      this.fileChunks = this.getChunkedFile(this.file);
      for(let i = 0; i < this.fileChunks.length; i++) {
        this.progresses.push({
          index: i,
          percentage: 0
        });
      }
      this.uploadByChunks();      
    },

    uploadByChunks() {      
      let formData = null,     
          reqs = [];
      for (let index in this.fileChunks) {
        formData = new FormData();
        formData.append("hash", this.file.name + ";" + index);
        formData.append("chunk", this.fileChunks[index]);
        reqs.push(request('POST', process.env.VUE_APP_BASE_URL + '/uploadChunk', formData, index, this.updateProgress));        
      }

      Promise.all(reqs).then(res => {
        console.log(res);
        return this.sendFinCode();
      }).then(res => {
        console.log(res);
        this.disableBtn = false;
      }).catch(error => {
        console.error(error);
        this.disableBtn = false;
      })
    },

    sendFinCode() {
      let formData = new FormData();
      formData.append("fileName", this.file.name)
      return request('POST', process.env.VUE_APP_BASE_URL + '/setFinish', formData);
    },

    getChunkedFile(file) {
      let fileChunks = [],
        n = file.size / process.env.VUE_APP_CHUNK_SIZE,
        start = 0,
        end = process.env.VUE_APP_CHUNK_SIZE;
      for(let i = 0; i <= n; i++) {
        let tmpChunk = i === n ? file.slice(start) : file.slice(start, end);
        fileChunks.push(tmpChunk);
        start = end;
        end += process.env.VUE_APP_CHUNK_SIZE;
      }
      return fileChunks;
    },

    updateProgress(index, evt) {
      let progress = this.progresses.find(x => x.index === parseInt(index));
      if(progress) {
        progress.percentage = Math.round(evt.loaded /evt.total * 100) + "%";
      }
    }
  }
}
</script>

<style scoped>
h1 {
  margin: 40px 0;
}
.upload-area {
  width: 360px;
  margin: auto;
}
.upload-panel {
  display: flex;
  justify-content: space-between;
}
.upload-input {
  border: 1px solid;
}
.progress-panel {
  margin-top: 30px;
}
</style>
