import { Box, Tab, makeStyles } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import React, { useState } from "react"
import jsonData from '../../rate_datas/btc-eur'
import ethUsdData from '../../rate_datas/eth-usd-his'
import CanvasJSReact from '../../assets/canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var intervals = jsonData["marketUpdate"]["intervalsUpdate"]["intervals"]
var datas = [];

for (var i = 0; i < intervals.length; i++) {
    const ct = intervals[i]["opentime"] + "000";
    console.log(ct);
    const date = new Date(parseInt(ct));
    var str = date.getUTCFullYear()
        + '/' + ('0' + (date.getUTCMonth() + 1)).slice(-2)
        + '/' + ('0' + date.getUTCDate()).slice(-2)
        + ' ' + ('0' + date.getUTCHours()).slice(-2)
        + ':' + ('0' + date.getUTCMinutes()).slice(-2)
        + ':' + ('0' + date.getUTCSeconds()).slice(-2)
        + '(UTC)';
    console.log(str);
    const value = intervals[i]["ohlc"]["openStr"];
    const v = parseFloat(value)
    console.log(v);
    const d = { x: new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), y: v }
    datas.push(d)
}

const datas2 = datas.sort(function (first, second) {
    if (first.x > second.x) {
        return 1;
    } else if (first.x < second.x) {
        return -1;
    } else {
        return 0;
    }
})

console.log(datas2);

const options = {
    title: {
        text: "BTC-EUR Chart"
    },
    data: [{
        type: "line",
        dataPoints: datas2
    }]
}

export const BtcEurGraph = () => {

    return (
        <CanvasJSChart options={options} />
    )
}