const express = require('express');
const router = express.Router();
global.fetch = require('node-fetch').default;  // you have to install node-fetch@^2.6.1
const cc = require('cryptocompare');
const fs = require('fs');

function provideCryptRate(token1, token2) {
    router.get('/', (req, res, next) => {
        cc.histoDay(token1, token2, limit = "none", timestamp = 1577804400)
            .then(data => {
                console.log(data);
                res.send(data);
            })
            .catch(console.err);
    })

    return router;
}

module.exports = provideCryptRate;
