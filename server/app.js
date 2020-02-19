const express = require('express');
const csvFilePath='log.csv';
const csv = require('csvtojson');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
        {id: 'agent', title: 'Agent'},
        {id: 'time', title: 'Time'},
        {id: 'method', title: 'Method'},
        {id: 'resource', title: 'Resource'},
        {id: 'version', title: 'Version'},
        {id: 'status', title: 'Status'}
    ]
})

const app = express();

const logData = [];

app.use((req, res, next) => {
    let log = [{
        agent: req.headers['user-agent'],
        time: new Date().toISOString(),
        method: req.method,
        resource: req.path,
        version: `HTTP/${req.httpVersion}`,
        status: res.statusCode
    }];
    console.log(req);
    csvWriter
        .writeRecords(log)
        .then( () => logData.push(log))

    next()
});

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

app.get('/logs', (req, res) => {
    res.status(200)
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            res.send(jsonObj);
        });
});

module.exports = app;
