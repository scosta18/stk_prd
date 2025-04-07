#routes.py
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from Backend.services import (
    get_stock_price,
    get_stock_history,
    get_technical_indicators,
    predict_stock_price_linear,
    predict_stock_price_lstm,
    get_stock_news,
    get_company_info,
    get_trending_stocks
)

router = APIRouter()

@router.get("/stock/{ticker}")
def stock_price(ticker: str):
    """Get current stock price information"""
    result = get_stock_price(ticker)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.get("/stock/{ticker}/history")
def stock_history(ticker: str, period: str = "1mo"):
    """Get historical stock data
    
    Available periods: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
    """
    result = get_stock_history(ticker, period)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.get("/stock/{ticker}/indicators")
def technical_indicators(ticker: str, period: str = "6mo"):
    """Get technical indicators for a stock"""
    result = get_technical_indicators(ticker, period)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

# @router.get("/stock/{ticker}/predict/linear")
# def predict_linear(ticker: str, days: int = Query(7, ge=1, le=30)):
#     """Predict stock prices using linear regression"""
#     result = predict_stock_price_linear(ticker, days)
#     if "error" in result:
#         raise HTTPException(status_code=404, detail=result["error"])
#     return result

# @router.get("/stock/{ticker}/predict/lstm")
# def predict_lstm(ticker: str, days: int = Query(7, ge=1, le=14)):
#     """Predict stock prices using LSTM neural network (more accurate but slower)"""
#     result = predict_stock_price_lstm(ticker, days)
    
#     # Add check for None result
#     if result is None:
#         raise HTTPException(status_code=500, detail="Prediction returned None")
        
#     if "error" in result:
#         raise HTTPException(status_code=404, detail=result["error"])
    
#     return result

# In routes.py
@router.get("/stock/{ticker}/predict/linear")
def predict_linear(ticker: str, days: int = Query(7, ge=1, le=30)):
    """Predict stock prices using linear regression"""
    # Get prediction result
    result = predict_stock_price_linear(ticker, days)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    
    # Add historical data to the response
    history_data = get_stock_history(ticker, "3mo")
    if "error" not in history_data:
        # Format history in the way the frontend expects
        historical = []
        for item in history_data["history"]:
            historical.append({
                "date": item["date"],
                "price": item["close"]
            })
        result["historical"] = historical
    
    return result

@router.get("/stock/{ticker}/predict/lstm")
def predict_lstm(ticker: str, days: int = Query(7, ge=1, le=14)):
    """Predict stock prices using LSTM neural network (more accurate but slower)"""
    # Get prediction result
    result = predict_stock_price_lstm(ticker, days)
    
    # Add check for None result
    if result is None:
        raise HTTPException(status_code=500, detail="Prediction returned None")
        
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    
    # Add historical data to the response
    history_data = get_stock_history(ticker, "3mo")
    if "error" not in history_data:
        # Format history in the way the frontend expects
        historical = []
        for item in history_data["history"]:
            historical.append({
                "date": item["date"],
                "price": item["close"]
            })
        result["historical"] = historical
    
    return result


@router.get("/stock/{ticker}/news")
def stock_news(ticker: str, limit: int = Query(5, ge=1, le=20)):
    """Get recent news for a stock"""
    result = get_stock_news(ticker, limit)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.get("/stock/{ticker}/info")
def company_info(ticker: str):
    """Get company information for a stock"""
    result = get_company_info(ticker)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.get("/stocks/trending")
def trending_stocks():
    """Get list of trending stocks"""
    result = get_trending_stocks()
    return result

@router.get("/health")
def health_check():
    """API health check endpoint"""
    return {"status": "ok", "message": "Stock Predictor API is running"}