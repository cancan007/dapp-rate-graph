import requests
#from flask import Flask, request
#from flask_cors import CORS
import json 
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import os
from dotenv import load_dotenv
import datetime
from xgboost import XGBRegressor, plot_importance

load_dotenv() # variabes in .env are reflected to environment variables

FLAG = os.getenv("REACT_APP_DAPP_RATE_GRAPH")

# Setup flask server
#app = Flask(__name__) 

# this is a setting about which origin has right to access http://localhost:5000/eth-usd
"""
CORS(
    app,
    supports_credentials=True
)"""
# Setup url route which will calculate
# total sum of array.
#@app.route('/eth-usd-ex', methods = ['GET']) 
def get_data(): 
    if FLAG == "development":
        res = requests.get('http://localhost:9000/eth-usd')
    else: 
        res = requests.get('https://dapp-rate-graph.herokuapp.com/eth-usd')

    returned_data = res.json()

    lists = []

    d = {
    "times" : [],
    "dw": [],
    "highs" : [],
    "lows" : [],
    "opens" : [],
    "pre_opens": [],
    "closes" : []
    }
    

    for i in returned_data:
        d["times"].append(int(i["time"]))
        dt = datetime.datetime.fromtimestamp(int(i["time"]))
        d["dw"].append(dt.weekday())
        d["highs"].append(float(i["high"]))
        d["lows"].append(float(i["low"]))
        if(d["opens"]):
            d["pre_opens"].append(d["opens"][-1])
        d["opens"].append(float(i["open"]))
        d["closes"].append(float(i["close"]))
    
    d["pre_opens"].append(sum(d["opens"])/len(d["opens"])) # I can't use this, cause I don't have pre_opens for test

    p_d = pd.DataFrame(data=d)

    x_train = p_d[["times", "dw"]].values
    #y_train = p_d.drop(["times"], 1).values
    y_train = p_d["opens"].values.reshape(-1, 1)

    x_times = []
    x_dws = []
    for b in range(len(d["times"])):
        if not x_times:
            n = d["times"][-1] + 86400
            x_times.append(n)
            dt = datetime.datetime.fromtimestamp(n)
            x_dws.append(dt.weekday())
        else:
            n = x_times[b-1] + 86400
            x_times.append(n)
            dt = datetime.datetime.fromtimestamp(n)
            x_dws.append(dt.weekday())

    
    x_test = np.array([x_times, x_dws]).T
    
    """
    reg = LinearRegression()
    reg.fit(x_train, y_train)
    ex_value = reg.predict(x_test)
    """
    model = XGBRegressor()


    model.fit(
    x_train,
    y_train,
    eval_metric='rmse') 

    ex_value = model.predict(x_test)

    #x_times = x_times.reshape(1, -1).tolist()
    #ex_value = ex_value.reshape(1, -1).tolist()

    #x_times = x_times.tolist()
    ex_value = np.ravel(ex_value).tolist()  # 2 dimensions to 1 dimension, and covert to list
    
    ex_res = {
        "time": x_times,
        "dw": x_dws,
        "ex_val": ex_value
    }
    
    
    print(json.dumps({"result":ex_res}))
  
    # Return data in json format 
    #return json.dumps({"result":ex_res})
   
#if __name__ == "__main__": 
#def main():
    #app.run(port=9000)
get_data()



# No python server version
#import requests
#res = requests.get('http://localhost:9000/eth-usd')
#returned_data = res.json()

#for i in returned_data:
    #print(i)