from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Backend.routes import router
import uvicorn

# Create FastAPI application
app = FastAPI(
    title="Stock Predictor API",
    description="API for stock market data analysis and predictions",
    version="1.0.0"
)

# Allow CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

# Add a root route
@app.get("/")
def read_root():
    return {
        "message": "Welcome to Stock Predictor API",
        "docs": "/docs",
        "endpoints": {
            "stock_price": "/api/stock/{ticker}",
            "stock_history": "/api/stock/{ticker}/history",
            "technical_indicators": "/api/stock/{ticker}/indicators",
            "linear_prediction": "/api/stock/{ticker}/predict/linear",
            "lstm_prediction": "/api/stock/{ticker}/predict/lstm",
            "stock_news": "/api/stock/{ticker}/news",
            "company_info": "/api/stock/{ticker}/info",
            "trending_stocks": "/api/stocks/trending"
        }
    }

if __name__ == "__main__":
    # Run with: uvicorn main:app --reload
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)