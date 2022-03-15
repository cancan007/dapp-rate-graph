import { Box, Tab, makeStyles } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import React, { useState } from "react"

//import ethUsdData from '../../rate_datas/eth-usd-his'
import CanvasJSReact from '../../assets/canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class EthUsdGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" }
    }

    callAPI() {
        fetch("http://localhost:9000/eth-usd" || window.location.href + "/eth-usd")
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(res => {
                console.log(res);
                var datas = [];

                for (var i = 0; i < res.length; i++) {
                    const ct = res[i]["time"] + "000";
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
                    const value = res[i]["open"];
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


                const options = {
                    title: {
                        text: "ETH-USD Chart"
                    },
                    data: [{
                        type: "line",
                        dataPoints: datas2
                    }]
                };
                console.log(options);

                this.setState({ apiResponse: options })
            })
    }

    // Before render, inside func is called 
    componentDidMount() {
        this.callAPI();
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error(errorInfo);
    }

    render() {
        return (
            <CanvasJSChart options={this.state.apiResponse} />
        )
    }
}

export { EthUsdGraph };

