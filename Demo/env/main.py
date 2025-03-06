from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Dict
import pandas as pd
from prophet import Prophet
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from io import BytesIO
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionResult(BaseModel):
    ds: str
    yhat: float
    Metric: str
    Model: str
    Group: Dict[str, str] = None

@app.post("/predict/")
async def predict(
    file: UploadFile = File(...),
    start_date: str = Form(...),
    end_date: str = Form(...),
    model_name: str = Form(...)
):
    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d")

        contents = await file.read()
        data = pd.read_csv(BytesIO(contents))

        datetime_columns = data.select_dtypes(include=['object', 'datetime64']).columns
        print(type(datetime_columns))
        time_column = None

        for col in datetime_columns:
            try:
                data[col] = pd.to_datetime(data[col])
                time_column = col
                break
            except:
                continue

        if not time_column:
            return {"error": "No datetime column detected"}

        grouping_columns = data.select_dtypes(include=['object']).columns.difference([time_column]).tolist()
        metric_columns = data.select_dtypes(include=['number']).columns.tolist()

        if not metric_columns:
            return {"error": "No metric columns detected"}

        results = []
        unique_group_data = {col: data[col].unique().tolist() for col in grouping_columns}

        for metric in metric_columns:
            group = data.groupby(grouping_columns) if grouping_columns else [(None, data)]
           
            for group_name, group_data in group:
                print(group_name,group_data)
                prophet_df = group_data[[time_column, metric]].rename(columns={time_column: 'ds', metric: 'y'})
                print(prophet_df)
               
                prophet_df = prophet_df.dropna()

                if prophet_df.empty:
                    continue

                future = pd.date_range(start=start_date, end=end_date, freq='W-MON')
                future = pd.DataFrame({'ds': future})

                if model_name == "Prophet":
                    model = Prophet()
                    model.fit(prophet_df)
                    forecast = model.predict(future)
                    predictions = forecast[['ds', 'yhat']]

                elif model_name == "ARIMA":
                    model = ARIMA(prophet_df['y'], order=(5, 1, 0))
                    model_fit = model.fit()
                    forecast = model_fit.forecast(steps=len(future))
                    predictions = pd.DataFrame({'yhat': forecast})
                    predictions['ds'] = future['ds'].values

                elif model_name == "SARIMA":
                    model = SARIMAX(prophet_df['y'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
                    model_fit = model.fit()
                    forecast = model_fit.forecast(steps=len(future))
                    predictions = pd.DataFrame({'yhat': forecast})
                    predictions['ds'] = future['ds'].values

                elif model_name == "ETS":
                    model = ExponentialSmoothing(prophet_df['y'], seasonal='add', seasonal_periods=12)
                    model_fit = model.fit()
                    forecast = model_fit.forecast(steps=len(future))
                    predictions = pd.DataFrame({'yhat': forecast})
                    predictions['ds'] = future['ds'].values

                else:
                    return {"error": "Invalid model name"}

                for _, row in predictions.iterrows():
                    group_dict = {col: group_name[idx] for idx, col in enumerate(grouping_columns)} if grouping_columns else None
                    result = {
                        "ds": row['ds'].strftime("%Y-%m-%d"),
                        "yhat": row['yhat'],
                        "Metric": metric,
                        "Model": model_name,
                        "Group": group_dict
                    }
                    results.append(result)

        return {"predictions": results, "unique_group_data": unique_group_data}

    except Exception as e:
        return {"error": str(e)}
