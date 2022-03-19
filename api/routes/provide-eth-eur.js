const express = require('express');
const router = express.Router();
global.fetch = require('node-fetch').default;  // you have to install node-fetch@^2.6.1
const cc = require('cryptocompare');
const fs = require('fs');

router.get('/', (req, res, next) => {
    cc.histoDay("ETH", "EUR", limit = 300, timestamp = 1577804400)
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(console.error);
    //res.send("API Test");
});

module.exports = router;