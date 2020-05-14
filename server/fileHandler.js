const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');


exports.checkFolder = (fileName) => {
    const destFolder = path.resolve(__dirname, `./dest/${fileName}`);
    if(!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder);          
    }      
};

exports.saveFileChunk = async (fileName, index, chunk) => {
    const destFilePath = path.resolve(__dirname, `./dest/${fileName}/${index}`);   
    if(fs.existsSync(destFilePath)) {
        rimraf.sync(destFilePath);
    }   
    await fse.move(chunk.path, destFilePath);
};

exports.combineFile = async (fileFullName) => {
    const ext = path.extname(fileFullName);
    const fileName = path.basename(fileFullName, ext);   
    const tmpFolder = path.resolve(__dirname, `./dest/${fileName}`);
    const tmpFiles = fs.readdirSync(tmpFolder);
    const destFile = path.resolve(__dirname, `./dest/${fileFullName}`);
        
    let rStream = null,
        wStream = fs.createWriteStream(destFile);
    for(let i = 0; i < tmpFiles.length; i++) {           
        try {
            await combineFileChunk(path.resolve(tmpFolder, `./${tmpFiles[i]}`), rStream, wStream);            
        } catch(ex) {
            console.error('Combine file error, ' + ex);
        }        
    }    
    deleteFolder(tmpFolder);
};

combineFileChunk = (filePath, rStream, wStream) => {
    return new Promise((resolve, reject) => {        
        rStream = fs.createReadStream(filePath);              
        rStream.pipe(wStream, {end: false});

        rStream.on('end', () => {                        
            resolve(true);
        });

        rStream.on('error', (err) => {
            console.log(err.stack);
            reject(err.stack);
        });
    });
};

deleteFolder = (folder) => {    
    rimraf.sync(folder);
};