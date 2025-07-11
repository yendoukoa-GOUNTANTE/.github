# AI Marketer Agent

This project is an AI-powered agent designed to help companies optimize their affiliate marketing and advertising campaigns for improved visibility and performance.

## Features (Planned)

*   **Affiliate Marketing Optimization:**
    *   Identifying top-performing affiliates.
    *   Suggesting new affiliate partners based on criteria.
    *   Tracking conversion rates per affiliate.
    *   Optimizing commission structures.
*   **Ads Optimization:**
    *   A/B testing ad creatives.
    *   Keyword analysis and suggestion for PPC campaigns.
    *   Bid management for ad platforms.
    *   Audience segmentation and targeting recommendations.

## Tech Stack

*   Backend: Python (Flask)
*   Frontend: HTML5, CSS (basic styling)

## Current Features

### Phase 1: Core Data Aggregation & Basic Reporting
*   **CSV Data Upload:**
    *   Upload affiliate performance data via CSV.
    *   Upload ad campaign performance data via CSV.
*   **Basic Dashboards:**
    *   View summary statistics for uploaded affiliate data (total clicks, conversions, commission, EPC).
    *   View top-performing affiliates.
    *   View all uploaded affiliate data in a table.
    *   View summary statistics for uploaded ad campaign data (total impressions, clicks, cost, conversions, CTR, CPC, CPA).
    *   View top-performing ad campaigns.
    *   View all uploaded ad campaign data in a table.

### PWA Phase 1: Basic Installability & Offline Static Assets
*   **Installable:** The application can be installed on compatible devices (desktops and mobiles).
*   **Offline Access:** Core application pages and static assets are cached, allowing for basic offline browsing. An offline fallback page is provided if a non-cached page is accessed while offline.
*   **Web App Manifest:** Includes `manifest.json` for PWA metadata.
*   **Service Worker:** Uses `sw.js` for caching and offline capabilities.

## Setup and Running

1.  **Clone the repository (if applicable).**
2.  **Create and activate a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run the application:**
    ```bash
    python run.py
    ```
    The application will be accessible at `http://127.0.0.1:5000/`.

**Note on PWA Testing:**
*   For PWA features (like installation and service worker caching) to work correctly, it's often best to serve the application over HTTPS, even in development if possible (e.g., using a self-signed certificate or a tool like `mkcert`). However, `http://localhost` is typically treated as a secure context by browsers for PWA development.
*   Use browser developer tools (Application tab -> Manifest, Service Workers, Cache Storage) to inspect PWA components.
*   Lighthouse audits can help identify PWA compliance issues.

## CSV File Formats

For the CSV upload functionality, please ensure your files adhere to the following formats. The first row must be a header row with the exact column names as specified.

### Affiliate Performance CSV Format

*   **Required Columns:**
    *   `report_date`: Date of the report (YYYY-MM-DD).
    *   `affiliate_name`: Name of the affiliate (Text).
*   **Optional Columns:**
    *   `impressions`: Number of impressions (Integer).
    *   `clicks`: Number of clicks (Integer).
    *   `conversions`: Number of conversions (Integer).
    *   `commission_amount`: Total commission amount (Float, e.g., 123.45).

**Example `affiliate_data.csv`:**
```csv
report_date,affiliate_name,impressions,clicks,conversions,commission_amount
2023-10-01,Affiliate A,1000,100,10,50.00
2023-10-01,Affiliate B,2000,150,12,65.50
2023-10-02,Affiliate A,,,5,25.00
```

### Ad Campaign Performance CSV Format

*   **Required Columns:**
    *   `report_date`: Date of the report (YYYY-MM-DD).
    *   `campaign_name`: Name of the ad campaign (Text).
*   **Optional Columns:**
    *   `platform`: Advertising platform, e.g., "Google Ads", "Facebook Ads" (Text).
    *   `impressions`: Number of impressions (Integer).
    *   `clicks`: Number of clicks (Integer).
    *   `cost`: Total cost of the campaign for that period (Float, e.g., 200.75).
    *   `conversions`: Number of conversions (Integer).

**Example `ad_campaign_data.csv`:**
```csv
report_date,campaign_name,platform,impressions,clicks,cost,conversions
2023-10-01,Fall Sale Campaign,Google Ads,10000,500,250.00,50
2023-10-01,Brand Awareness Q4,Facebook Ads,50000,1000,300.50,10
2023-10-02,Fall Sale Campaign,Google Ads,12000,600,280.00,65
```
