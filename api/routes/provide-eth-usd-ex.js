const express = require('express');
const router = express.Router();
global.fetch = require('node-fetch').default;  // you have to install node-fetch@^2.6.1
const cc = require('cryptocompare');
const fs = require('fs');
const { PythonShell } = require('python-shell');


router.get('/', (req, res, next) => {
    let options = {
        mode: 'json'
    }
    var pyshell = new PythonShell('./python-scripts/predict-eth-usd.py', options)
    pyshell.on("message", (data) => {
        console.log(data);
        //res.send(data.replace(/"/g, ''));
        res.send(data);
    })

    pyshell.end(function (err) {
        if (err) {
            console.error(err);
        }
    })
})

module.exports = router;