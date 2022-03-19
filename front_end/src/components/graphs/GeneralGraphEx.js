import React, { useState, useEffect } from "react"
import CanvasJSReact from '../../assets/canvasjs.react';
import { useVariables } from "../../hooks/useVariables";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class GeneralGraphEx extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "",
            name: "",
            cusIsAllowed: false
        };
    }

    callAPI() {
        //fetch("http://127.0.0.1:5000/eth-usd")
        process.env.REACT_APP_DAPP_RATE_GRAPH === "development" ? fetch(`http://localhost:9000/${this.props.url}` + "-ex")
            .then(res => res.text())
            //.then(res => JSON.stringify(res))  // I don't know why, stingify and parse comb is not working
            //.then(res => res.json())
            .then(res => JSON.parse(res))
            .then(res => {
                console.log(res);
                //var ob = res["result"];
                var datas = [];

                for (var i = 0; i < res["result"]["time"].length; i++) {
                    var t = String(res["result"]["time"][i]) + "000";
                    const date = new Date(parseInt(t));
                    var value = res["result"]["ex_val"][i];
                    const d = { x: new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), y: value, lineColor: "red" }
                    console.log(d);
                    datas.push(d);
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

                const name = this.props.url.toUpperCase()

                const options = {
                    title: {
                        text: `${name} PredictedChart`
                    },
                    data: [{
                        type: "line",
                        dataPoints: datas2
                    }]
                };
                console.log(options);

                const { useCustomerIsAllowed } = useVariables()

                this.setState({ apiResponse: options })
                this.setState({ name: name })
                this.setState({ cusIsAllowed: useCustomerIsAllowed() })
            })
            : fetch(`https://dapp-rate-graph.herokuapp.com/${this.props.url}` + "-ex")
                .then(res => res.text())
                //.then(res => JSON.stringify(res))  // I don't know why, stingify and parse comb is not working
                //.then(res => res.json())
                .then(res => JSON.parse(res))
                .then(res => {
                    console.log(res);
                    //var ob = res["result"];
                    var datas = [];

                    for (var i = 0; i < res["result"]["time"].length; i++) {
                        var t = String(res["result"]["time"][i]) + "000";
                        const date = new Date(parseInt(t));
                        var value = res["result"]["ex_val"][i];
                        const d = { x: new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), y: value, lineColor: "red" }
                        console.log(d);
                        datas.push(d);
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

                    const name = this.props.url.toUpperCase()


                    const options = {
                        title: {
                            text: `${name} PredictedChart`
                        },
                        data: [{
                            type: "line",
                            dataPoints: datas2
                        }]
                    };
                    console.log(options);
                    const { useCustomerIsAllowed } = useVariables()

                    this.setState({ apiResponse: options })
                    this.setState({ name: name })
                    this.setState({ cusIsAllowed: useCustomerIsAllowed() })
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

        if (this.state.cusIsAllowed) {
            return (
                <CanvasJSChart options={this.state.apiResponse} />
            )
        }
        else {
            return (<div>Pay to see predieted {this.state.name} charts!</div>)
        }

    }
}

export { GeneralGraphEx };
