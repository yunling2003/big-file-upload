const express = require("express");
const app = express();
const multiparty = require("multiparty");
const fileHandler = require("./fileHandler.js");
const path = require('path');



app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");    
    next();
});

app.post("/uploadChunk", async (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        const [hash] = fields.hash;
        const fileFullName = hash.split(';')[0];
        const extName = path.extname(fileFullName);
        const fileName = path.basename(fileFullName, extName);
        const index = hash.split(';')[1];
        const [chunk] = files.chunk;
        fileHandler.checkFolder(fileName);
        await fileHandler.saveFileChunk(fileName, index, chunk);
        res.end(`chunk ${index} upload done!`);
    });

    form.on("error", (err) => {
        console.log('chunk upload fail: ' + err.stack);
        res.end('chunk upload fail!');        
    });
});

app.post("/setFinish", async (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, async (err, fields) => {
        const [fileFullName] = fields.fileName;            

        try {
            await fileHandler.combineFile(fileFullName);            
            res.end('file upload done!');
        } catch(e) {
            res.end('file upload fail!');
        }        
    });

    form.on("error", (err) => {
        console.log('file upload fail: ' + err.stack);
        res.end('file upload fail!');
    })
});

app.listen(3000, () => {
    console.log("server is listening on port 3000!");
});