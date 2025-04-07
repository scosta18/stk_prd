#services.py
import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler
import requests
from bs4 import BeautifulSoup
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

# Basic stock data retrieval
def get_stock_price(ticker: str):
    """Get the latest stock price for a given ticker"""
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="1d")
        
        if data.empty:
            return {"error": "Invalid ticker or no data available"}
        
        return {
            "ticker": ticker,
            "price": round(float(data["Close"].iloc[-1]), 2),
            "change": round(float(data["Close"].iloc[-1] - data["Open"].iloc[-1]), 2),
            "change_percent": round(float((data["Close"].iloc[-1] - data["Open"].iloc[-1]) / data["Open"].iloc[-1] * 100), 2),
            "volume": int(data["Volume"].iloc[-1]),
            "date": data.index[-1].strftime("%Y-%m-%d")
        }
    except Exception as e:
        return {"error": str(e)}

# Historical data retrieval
def get_stock_history(ticker: str, period: str = "1mo"):
    """Get historical stock data for a given ticker and period"""
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period=period)
        
        if data.empty:
            return {"error": "Invalid ticker or no data available"}
        
        # Format data for API response
        history = []
        for i in range(len(data)):
            history.append({
                "date": data.index[i].strftime("%Y-%m-%d"),
                "open": round(float(data["Open"].iloc[i]), 2),
                "high": round(float(data["High"].iloc[i]), 2),
                "low": round(float(data["Low"].iloc[i]), 2),
                "close": round(float(data["Close"].iloc[i]), 2),
                "volume": int(data["Volume"].iloc[i])
            })
        
        return {
            "ticker": ticker,
            "period": period,
            "history": history
        }
    except Exception as e:
        return {"error": str(e)}

# Technical indicators
def get_technical_indicators(ticker: str, period: str = "6mo"):
    """Calculate technical indicators for a given ticker"""
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period=period)
        
        if data.empty:
            return {"error": "Invalid ticker or no data available"}
        
        # Calculate moving averages
        data['MA20'] = data['Close'].rolling(window=20).mean()
        data['MA50'] = data['Close'].rolling(window=50).mean()
        data['MA200'] = data['Close'].rolling(window=200).mean()
        
        # Calculate RSI (Relative Strength Index)
        delta = data['Close'].diff()
        gain = delta.where(delta > 0, 0).rolling(window=14).mean()
        loss = -delta.where(delta < 0, 0).rolling(window=14).mean()
        rs = gain / loss
        data['RSI'] = 100 - (100 / (1 + rs))
        
        # Calculate MACD (Moving Average Convergence Divergence)
        data['EMA12'] = data['Close'].ewm(span=12, adjust=False).mean()
        data['EMA26'] = data['Close'].ewm(span=26, adjust=False).mean()
        data['MACD'] = data['EMA12'] - data['EMA26']
        data['Signal'] = data['MACD'].ewm(span=9, adjust=False).mean()
        
        # Format latest indicators
        latest = data.iloc[-1]
        return {
            "ticker": ticker,
            "date": latest.name.strftime("%Y-%m-%d"),
            "indicators": {
                "price": round(float(latest["Close"]), 2),
                "ma20": round(float(latest["MA20"]), 2) if not np.isnan(latest["MA20"]) else None,
                "ma50": round(float(latest["MA50"]), 2) if not np.isnan(latest["MA50"]) else None,
                "ma200": round(float(latest["MA200"]), 2) if not np.isnan(latest["MA200"]) else None,
                "rsi": round(float(latest["RSI"]), 2) if not np.isnan(latest["RSI"]) else None,
                "macd": round(float(latest["MACD"]), 2) if not np.isnan(latest["MACD"]) else None,
                "signal": round(float(latest["Signal"]), 2) if not np.isnan(latest["Signal"]) else None,
            }
        }
    except Exception as e:
        return {"error": str(e)}

# Linear regression prediction
# def predict_stock_price_linear(ticker: str, days: int = 7):
#     """Predict stock prices using linear regression"""
#     try:
#         stock = yf.Ticker(ticker)
#         data = stock.history(period="60d")
        
#         if data.empty or len(data) < 30:
#             return {"error": "Insufficient data for prediction"}
        
#         # Prepare data for prediction
#         X = np.array(range(len(data))).reshape(-1, 1)
#         y = data["Close"].values
        
#         # Create and train model
#         model = LinearRegression()
#         model.fit(X, y)
        
#         # Predict future values
#         future_days = np.array(range(len(data), len(data) + days)).reshape(-1, 1)
#         predictions = model.predict(future_days)
        
#         # Format prediction results
#         result = {
#             "ticker": ticker,
#             "method": "linear_regression",
#             "predictions": [],
#             "confidence": round(float(model.score(X, y) * 100), 2)
#         }
        
#         for i in range(days):
#             result["predictions"].append({
#                 "date": (datetime.now() + timedelta(days=i+1)).strftime("%Y-%m-%d"),
#                 "price": round(float(predictions[i]), 2)
#             })
        
#         return result
#     except Exception as e:
#         return {"error": str(e)}
def predict_stock_price_linear(ticker: str, days: int = 7):
    """Predict stock prices using enhanced linear regression with multiple features"""
    try:
        # Get more historical data
        stock = yf.Ticker(ticker)
        data = stock.history(period="180d")  # Use 6 months of data instead of 60 days
        
        if data.empty or len(data) < 30:
            return {"error": "Insufficient data for prediction"}
        
        # Create a copy of the dataframe for feature engineering
        df = data.copy()
        
        # Feature engineering - add more predictive signals
        # 1. Moving averages
        df['MA5'] = df['Close'].rolling(window=5).mean()
        df['MA20'] = df['Close'].rolling(window=20).mean()
        df['MA50'] = df['Close'].rolling(window=50).mean()
        
        # 2. Price differences (momentum indicators)
        df['Price_Change'] = df['Close'].diff()
        df['Price_Change_5d'] = df['Close'].diff(5)
        
        # 3. Volatility indicators
        df['Volatility'] = df['Close'].rolling(window=10).std()
        
        # 4. Volume indicators
        df['Volume_Change'] = df['Volume'].pct_change()
        df['Volume_MA5'] = df['Volume'].rolling(window=5).mean()
        
        # 5. Technical indicators
        # RSI
        delta = df['Close'].diff()
        gain = delta.where(delta > 0, 0).rolling(window=14).mean()
        loss = -delta.where(delta < 0, 0).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        
        # Drop NaN values created by rolling windows
        df = df.dropna()
        
        # Select features for model
        features = ['MA5', 'MA20', 'MA50', 'Price_Change', 'Price_Change_5d', 
                   'Volatility', 'Volume_Change', 'Volume_MA5', 'RSI']
        
        X = df[features]
        y = df['Close']
        
        # Split data for validation (this helps get a more realistic confidence score)
        train_size = int(len(df) * 0.8)
        X_train, X_test = X[:train_size], X[train_size:]
        y_train, y_test = y[:train_size], y[train_size:]
        
        # Create and train the model
        model = LinearRegression()
        model.fit(X_train, y_train)
        
        # Calculate confidence score
        confidence = model.score(X_test, y_test) * 100
        
        # Prepare the most recent data for future prediction
        last_data = df[features].iloc[-1:].values
        
        # Predict future values
        predictions = []
        current_prediction = last_data
        
        for i in range(days):
            # Simple update of features for next day prediction
            # This is a simplified approach - in a real scenario you'd model how features change
            # For this example, we're just using the last known features for all predictions
            pred_price = model.predict(current_prediction)[0]
            
            # Add the prediction to results
            pred_date = (df.index[-1] + timedelta(days=i+1))
            predictions.append({
                "date": pred_date.strftime("%Y-%m-%d"),
                "price": round(float(pred_price), 2)
            })
        print("Res Lin ticker: {}, method: enhanced_linear_regression, predictions: {}, confidence: {}, features_used: {}".format(ticker, predictions, round(float(confidence), 2), features))
        return {
            "ticker": ticker,
            "method": "enhanced_linear_regression",
            "predictions": predictions,
            "confidence": round(float(confidence), 2),
            "features_used": features
        }
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

# LSTM prediction (more advanced ML model)
# def predict_stock_price_lstm(ticker: str, days: int = 7):
#     """Predict stock prices using LSTM neural network"""
#     try:
#         # Get more historical data for LSTM
#         stock = yf.Ticker(ticker)
#         data = stock.history(period="1y")
        
#         if data.empty or len(data) < 60:
#             return {"error": "Insufficient data for LSTM prediction"}
        
#         # Extract closing prices and normalize
#         closing_prices = data['Close'].values.reshape(-1, 1)
#         scaler = MinMaxScaler(feature_range=(0, 1))
#         scaled_prices = scaler.fit_transform(closing_prices)
        
#         # Create sequences for LSTM
#         seq_length = 60
#         X = []
#         y = []
        
#         for i in range(seq_length, len(scaled_prices)):
#             X.append(scaled_prices[i-seq_length:i, 0])
#             y.append(scaled_prices[i, 0])
            
#         X, y = np.array(X), np.array(y)
#         X = np.reshape(X, (X.shape[0], X.shape[1], 1))
        
#         # Build LSTM model
#         model = Sequential()
#         model.add(LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], 1)))
#         model.add(Dropout(0.2))
#         model.add(LSTM(units=50, return_sequences=False))
#         model.add(Dropout(0.2))
#         model.add(Dense(units=1))
        
#         # Compile and fit model
#         model.compile(optimizer='adam', loss='mean_squared_error')
#         model.fit(X, y, epochs=20, batch_size=32, verbose=0)
        
#         # Generate predictions
#         inputs = scaled_prices[-seq_length:]
#         predicted_prices = []
        
#         for _ in range(days):
#             X_test = np.array([inputs[-seq_length:, 0]])
#             X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
            
#             pred_price = model.predict(X_test, verbose=0)
#             inputs = np.append(inputs, pred_price)
#             inputs = inputs.reshape(-1, 1)
            
#             # Inverse transform to get actual price
#             pred_actual = scaler.inverse_transform(np.array([[pred_price[0, 0]]]))
#             predicted_prices.append(pred_actual[0, 0])
        
#         # Format prediction results
#         result = {
#             "ticker": ticker,
#             "method": "lstm",
#             "predictions": []
#         }
        
#         for i in range(days):
#             result["predictions"].append({
#                 "date": (datetime.now() + timedelta(days=i+1)).strftime("%Y-%m-%d"),
#                 "price": round(float(predicted_prices[i]), 2)
#             })
        
#         return result
#     except Exception as e:
#         return {"error": str(e)}

def predict_stock_price_lstm(ticker: str, days: int = 7):
    """Predict stock prices using LSTM neural network"""
    try:
        # Get more historical data for LSTM
        stock = yf.Ticker(ticker)
        data = stock.history(period="1y")
        
        if data.empty or len(data) < 60:
            return {"error": "Insufficient data for LSTM prediction"}
        
        # Extract closing prices and normalize
        closing_prices = data['Close'].values.reshape(-1, 1)
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_prices = scaler.fit_transform(closing_prices)
        
        # Create sequences for LSTM
        seq_length = 60
        X = []
        y = []
        
        for i in range(seq_length, len(scaled_prices)):
            X.append(scaled_prices[i-seq_length:i, 0])
            y.append(scaled_prices[i, 0])
            
        X, y = np.array(X), np.array(y)
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))
        
        # Build LSTM model
        model = Sequential()
        model.add(LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], 1)))
        model.add(Dropout(0.2))
        model.add(LSTM(units=50, return_sequences=False))
        model.add(Dropout(0.2))
        model.add(Dense(units=1))
        
        # Compile and fit model
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(X, y, epochs=20, batch_size=32, verbose=0)
        
        # Generate predictions
        inputs = scaled_prices[-seq_length:]
        predicted_prices = []
        
        for _ in range(days):
            X_test = np.array([inputs[-seq_length:, 0]])
            X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
            
            pred_price = model.predict(X_test, verbose=0)
            inputs = np.append(inputs, pred_price)
            inputs = inputs.reshape(-1, 1)
            
            # Inverse transform to get actual price
            pred_actual = scaler.inverse_transform(np.array([[pred_price[0, 0]]]))
            predicted_prices.append(pred_actual[0, 0])
        
        # Format prediction results
        result = {
            "ticker": ticker,
            "method": "lstm",
            "predictions": []
        }
        
        for i in range(days):
            result["predictions"].append({
                "date": (datetime.now() + timedelta(days=i+1)).strftime("%Y-%m-%d"),
                "price": round(float(predicted_prices[i]), 2)
            })
        
        # Make sure we return the result!
        print("Res", result)
        return result
    except Exception as e:
        return {"error": str(e)}

# Web scraping for news
def get_stock_news(ticker: str, limit: int = 5):
    """Scrape financial news for a given ticker"""
    try:
        url = f"https://finviz.com/quote.ashx?t={ticker}"
        headers = {'User-Agent': 'Mozilla/5.0'}
        
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        news_table = soup.find(id='news-table')
        
        if not news_table:
            return {"error": "Could not retrieve news"}
        
        news_rows = news_table.findAll('tr')
        news_items = []
        
        for i, row in enumerate(news_rows):
            if i >= limit:
                break
                
            headline = row.a.text
            source = row.span.text
            
            news_items.append({
                "headline": headline,
                "source": source
            })
            
        return {"ticker": ticker, "news": news_items}
    except Exception as e:
        return {"error": f"Failed to scrape news: {str(e)}"}

# Get company information
def get_company_info(ticker: str):
    """Get company information for a given ticker"""
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        if not info:
            return {"error": "Could not retrieve company information"}
        
        # Extract relevant information
        company_info = {
            "name": info.get("shortName", ""),
            "sector": info.get("sector", ""),
            "industry": info.get("industry", ""),
            "website": info.get("website", ""),
            "description": info.get("longBusinessSummary", ""),
            "employees": info.get("fullTimeEmployees", 0),
            "country": info.get("country", ""),
            "marketCap": info.get("marketCap", 0),
            "pe_ratio": info.get("trailingPE", None),
            "dividend_yield": info.get("dividendYield", None) * 100 if info.get("dividendYield") else None,
            "52week_high": info.get("fiftyTwoWeekHigh", None),
            "52week_low": info.get("fiftyTwoWeekLow", None)
        }
        
        return {"ticker": ticker, "info": company_info}
    except Exception as e:
        return {"error": str(e)}

# Get trending stocks
def get_trending_stocks():
    """Get list of trending stocks from Yahoo Finance"""
    try:
        # Use Yahoo Finance trending tickers API
        url = "https://finance.yahoo.com/trending-tickers"
        headers = {'User-Agent': 'Mozilla/5.0'}
        
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        ticker_rows = soup.find('table').find('tbody').find_all('tr')
        trending = []
        
        for row in ticker_rows[:10]:  # Get top 10
            cells = row.find_all('td')
            if len(cells) >= 2:
                ticker = cells[0].text
                name = cells[1].text
                
                # Get basic info for this ticker
                price_info = get_stock_price(ticker)
                if "error" not in price_info:
                    trending.append({
                        "ticker": ticker,
                        "name": name,
                        "price": price_info.get("price"),
                        "change_percent": price_info.get("change_percent")
                    })
        
        return {"trending": trending}
    except Exception as e:
        # Fallback to a few popular stocks if scraping fails
        fallback = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]
        trending = []
        
        for ticker in fallback:
            price_info = get_stock_price(ticker)
            if "error" not in price_info:
                trending.append({
                    "ticker": ticker,
                    "name": "",
                    "price": price_info.get("price"),
                    "change_percent": price_info.get("change_percent")
                })
        
        return {"trending": trending}