import requests
from flask import Flask, request
from flask_cors import CORS
import json 
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# Setup flask server
app = Flask(__name__) 

# this is a setting about which origin has right to access http://localhost:5000/eth-usd
CORS(
    app,
    supports_credentials=True
)
# Setup url route which will calculate
# total sum of array.
@app.route('/eth-usd', methods = ['GET']) 
def get_data(): 
    res = requests.get('http://localhost:9000/eth-usd')

    returned_data = res.json()

    lists = []

    d = {
    "times" : [],
    "highs" : [],
    "lows" : [],
    "opens" : [],
    "closes" : []
    }
    

    for i in returned_data:
        d["times"].append(int(i["time"]))
        d["highs"].append(float(i["high"]))
        d["lows"].append(float(i["low"]))
        d["opens"].append(float(i["open"]))
        d["closes"].append(float(i["close"]))

    p_d = pd.DataFrame(data=d)

    x_train = p_d["times"].values.reshape(-1, 1)
    #y_train = p_d.drop(["times"], 1).values
    y_train = p_d["opens"].values.reshape(-1, 1)

    x_times = []
    for b in range(len(x_train)):
        if not x_times:
            x_times.append(d["times"][-1] + 86400)
        else:
            x_times.append(x_times[b-1] + 86400)

    x_times_np = np.array(x_times).reshape(-1,1)
    
    reg = LinearRegression()
    reg.fit(x_train, y_train)
    ex_value = reg.predict(x_times_np)

    #x_times = x_times.reshape(1, -1).tolist()
    #ex_value = ex_value.reshape(1, -1).tolist()

    #x_times = x_times.tolist()
    ex_value = np.ravel(ex_value).tolist()  # 2 dimensions to 1 dimension, and covert to list
    
    ex_res = {
        "time": x_times,
        "ex_val": ex_value
    }

  
    # Return data in json format 
    return json.dumps({"result":ex_res})
   
if __name__ == "__main__": 
    app.run(port=5000)



# No python server version
#import requests
#res = requests.get('http://localhost:9000/eth-usd')
#returned_data = res.json()

#for i in returned_data:
    #print(i)