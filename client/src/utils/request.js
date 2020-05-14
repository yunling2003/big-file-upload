
export default (type = 'POST', url, data) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4) {
        if(xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(Error('Network Error'));
        }
      }
    };

    xhr.onerror = (evt) => {
      console.log(evt);
      reject(Error('Something wrong occurs!'));
    };

    xhr.open(type, url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');  
    xhr.send(data);
  });      
};