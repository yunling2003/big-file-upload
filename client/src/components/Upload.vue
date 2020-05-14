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
        <button @click="uploadFile">
          <span>{{ buttonLabel }}</span>
        </button>
      </div>      
    </div>    
  </div>
</template>

<script>
const CHUNK_SIZE = 1000000;
const BASE_URL = 'http://localhost:3000';
const UPLOAD_URL = '/uploadChunk';
const FINCODE_URL = '/setFinish';

import request from '../utils/request'

export default {
  name: 'BigFileUpload',
  data() {
    return {
      placeholder: "Select File to Upload",
      buttonLabel: "Upload",
      file: null
    }    
  },
  props: {
    msg: String
  },
  methods: {
    uploadFile() {      
      this.file = this.$refs.uploader.files[0];
      if(!this.file) {
        alert('Please choose a file to upload!');
        return;
      }
      let fileChunks = this.getChunkedFile(this.file);
      this.uploadByChunks(fileChunks);      
    },

    uploadByChunks(fileChunks) {      
      let formData = null;
      let ind = 1;
      let reqs = [];
      for (let index in fileChunks) {
        formData = new FormData();
        formData.append("hash", this.file.name + ";" + ind);
        formData.append("chunk", fileChunks[index]);
        reqs.push(request('POST', BASE_URL + UPLOAD_URL, formData));        
        ind++;
      }

      Promise.all(reqs).then(res => {
        console.log(res);
        return this.sendFinCode();
      }).then(res => {
        console.log(res);
      }).catch(error => {
        console.error(error);
      })
    },

    sendFinCode() {
      let formData = new FormData();
      formData.append("fileName", this.file.name)
      return request('POST', BASE_URL + FINCODE_URL, formData);
    },

    getChunkedFile(file) {
      let fileChunks = [],
        n = file.size / CHUNK_SIZE,
        start = 0,
        end = CHUNK_SIZE;
      for(let i = 0; i <= n; i++) {
        let tmpChunk = i === n ? file.slice(start) : file.slice(start, end);
        fileChunks.push(tmpChunk);
        start = end;
        end += CHUNK_SIZE;
      }
      return fileChunks;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
</style>
