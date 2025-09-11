import io
import csv
from datetime import datetime
from typing import List, Dict, Any, Tuple, Optional
from flask import current_app, session # Added session for Facebook token access
import random # For mock data for Facebook

# App-specific models
from .models import AffiliatePerformanceData, AdCampaignPerformanceData

# Facebook Business SDK imports
from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.application import Application
from facebook_business.exceptions import FacebookRequestError

# Google Ads SDK imports
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

# --- CSV Parsing Functions ---

def parse_affiliate_csv(file_stream: io.StringIO) -> Tuple[List[AffiliatePerformanceData], List[str]]:
    # ... (content as before) ...
    data_records: List[AffiliatePerformanceData] = []
    errors: List[str] = []
    reader = csv.DictReader(file_stream)
    required_headers = ['report_date', 'affiliate_name']
    optional_headers = ['impressions', 'clicks', 'conversions', 'commission_amount']
    all_expected_headers = required_headers + optional_headers
    if not reader.fieldnames:
        errors.append("CSV file is empty or has no headers.")
        return data_records, errors
    missing_required_headers = [h for h in required_headers if h not in reader.fieldnames]
    if missing_required_headers:
        errors.append(f"Missing required CSV headers: {', '.join(missing_required_headers)}")
        return data_records, errors
    unexpected_headers = [h for h in reader.fieldnames if h not in all_expected_headers]
    if unexpected_headers:
        current_app.logger.warning(f"CSV contains unexpected headers (will be ignored): {', '.join(unexpected_headers)}")
    for row_num, row in enumerate(reader, start=2):
        try:
            report_date_str = row.get('report_date')
            if not report_date_str:
                errors.append(f"Row {row_num}: Missing 'report_date'. Skipping row.")
                continue
            report_date = datetime.strptime(report_date_str, '%Y-%m-%d').date()
            affiliate_name = row.get('affiliate_name')
            if not affiliate_name:
                errors.append(f"Row {row_num}: Missing 'affiliate_name'. Skipping row.")
                continue
            def safe_to_int(value_str: str, field_name: str) -> Optional[int]:
                if value_str is None or value_str.strip() == '': return None
                try: return int(value_str)
                except ValueError: errors.append(f"Row {row_num}: Invalid integer value '{value_str}' for '{field_name}'."); return None
            def safe_to_float(value_str: str, field_name: str) -> Optional[float]:
                if value_str is None or value_str.strip() == '': return None
                try: return float(value_str)
                except ValueError: errors.append(f"Row {row_num}: Invalid float value '{value_str}' for '{field_name}'."); return None
            data = AffiliatePerformanceData(
                report_date=report_date, affiliate_name=affiliate_name.strip(),
                impressions=safe_to_int(row.get('impressions'), 'impressions'),
                clicks=safe_to_int(row.get('clicks'), 'clicks'),
                conversions=safe_to_int(row.get('conversions'), 'conversions'),
                commission_amount=safe_to_float(row.get('commission_amount'), 'commission_amount')
            )
            data_records.append(data)
        except ValueError as e: errors.append(f"Row {row_num}: Error parsing data. Invalid date format for '{report_date_str}'? Expected YYYY-MM-DD. Details: {e}. Skipping row.")
        except Exception as e: errors.append(f"Row {row_num}: An unexpected error occurred processing this row: {e}. Skipping row.")
    return data_records, errors

def parse_ad_campaign_csv(file_stream: io.StringIO) -> Tuple[List[AdCampaignPerformanceData], List[str]]:
    # ... (content as before) ...
    data_records: List[AdCampaignPerformanceData] = []
    errors: List[str] = []
    reader = csv.DictReader(file_stream)
    required_headers = ['report_date', 'campaign_name']
    optional_headers = ['platform', 'impressions', 'clicks', 'cost', 'conversions']
    all_expected_headers = required_headers + optional_headers
    if not reader.fieldnames: errors.append("CSV file is empty or has no headers."); return data_records, errors
    missing_required_headers = [h for h in required_headers if h not in reader.fieldnames]
    if missing_required_headers: errors.append(f"Missing required CSV headers: {', '.join(missing_required_headers)}"); return data_records, errors
    unexpected_headers = [h for h in reader.fieldnames if h not in all_expected_headers]
    if unexpected_headers: current_app.logger.warning(f"CSV contains unexpected headers (will be ignored): {', '.join(unexpected_headers)}")
    for row_num, row in enumerate(reader, start=2):
        try:
            report_date_str = row.get('report_date')
            if not report_date_str: errors.append(f"Row {row_num}: Missing 'report_date'. Skipping row."); continue
            report_date = datetime.strptime(report_date_str, '%Y-%m-%d').date()
            campaign_name = row.get('campaign_name')
            if not campaign_name: errors.append(f"Row {row_num}: Missing 'campaign_name'. Skipping row."); continue
            platform = row.get('platform', None); platform = platform.strip() if platform is not None else None
            def safe_to_int(value_str: str, field_name: str) -> Optional[int]:
                if value_str is None or value_str.strip() == '': return None
                try: return int(value_str)
                except ValueError: errors.append(f"Row {row_num}: Invalid integer value '{value_str}' for '{field_name}'."); return None
            def safe_to_float(value_str: str, field_name: str) -> Optional[float]:
                if value_str is None or value_str.strip() == '': return None
                try: return float(value_str)
                except ValueError: errors.append(f"Row {row_num}: Invalid float value '{value_str}' for '{field_name}'."); return None
            data = AdCampaignPerformanceData(
                report_date=report_date, campaign_name=campaign_name.strip(), platform=platform,
                impressions=safe_to_int(row.get('impressions'), 'impressions'),
                clicks=safe_to_int(row.get('clicks'), 'clicks'),
                cost=safe_to_float(row.get('cost'), 'cost'),
                conversions=safe_to_int(row.get('conversions'), 'conversions')
            )
            data_records.append(data)
        except ValueError as e: errors.append(f"Row {row_num}: Error parsing data. Invalid date format for '{report_date_str}'? Expected YYYY-MM-DD. Details: {e}. Skipping row.")
        except Exception as e: errors.append(f"Row {row_num}: An unexpected error occurred: {e}. Skipping row.")
    return data_records, errors

# --- Facebook Audience Network (FAN) Service Functions ---
_fb_api_initialized_this_request = False # Simple flag for current request context

def initialize_fb_api(access_token: str = None) -> bool:
    global _fb_api_initialized_this_request
    if not access_token: access_token = session.get('fb_access_token')
    if not access_token:
        current_app.logger.warning("No Facebook access token for API initialization.")
        _fb_api_initialized_this_request = False
        return False
    try:
        app_id = current_app.config.get('FACEBOOK_APP_ID')
        app_secret = current_app.config.get('FACEBOOK_APP_SECRET')
        if not app_id or 'YOUR_FACEBOOK_APP_ID' in app_id:
            current_app.logger.error("Facebook App ID not configured for API init.")
            _fb_api_initialized_this_request = False
            return False
        FacebookAdsApi.init(app_id=app_id, app_secret=app_secret, access_token=access_token, crash_log=False)
        _fb_api_initialized_this_request = True
        current_app.logger.info("FacebookAdsApi initialized successfully for this request.")
        return True
    except Exception as e:
        current_app.logger.error(f"Failed to initialize FacebookAdsApi: {e}")
        _fb_api_initialized_this_request = False
        return False

def get_fan_ad_placements():
    """
    Fetches real ad placements from the Facebook Audience Network API.
    NOTE: The Audience Network API does not have a direct endpoint to list all placements
    by name via the business SDK in a simple "get_placements" call. Performance data is
    fetched with placements as a breakdown. This function will return a list of
    placements derived from the performance data.
    """
    if not _fb_api_initialized_this_request and not initialize_fb_api():
        raise Exception("Facebook API not initialized. Please connect to Facebook first.")

    try:
        app_id = current_app.config.get('FACEBOOK_APP_ID')
        current_app.logger.info(f"Fetching FAN performance data to derive placements for app_id: {app_id}")

        app = Application(app_id)
        # Fetching performance data with 'placement' breakdown is how we get placement info.
        params = {
            'metric': 'fb_ad_network_revenue,fb_ad_network_impressions',
            'breakdowns': ['placement'],
            'date_preset': 'last_30d', # Use a reasonable default to find active placements
        }
        insights = app.get_ad_network_analytics_results(params=params)

        placements = []
        seen_placement_ids = set()
        if insights and insights['data']:
            for result in insights['data']:
                placement_id = result.get('placement')
                if placement_id and placement_id not in seen_placement_ids:
                    # The API doesn't provide placement *names* in this result, only IDs.
                    # This is a limitation of the Audience Network reporting API.
                    # We will use the ID as the name for display purposes.
                    placements.append({"id": placement_id, "name": f"Placement ID: {placement_id}"})
                    seen_placement_ids.add(placement_id)

        if not placements:
            current_app.logger.warning(f"No active ad placements found for app {app_id} in the last 30 days.")
            return []

        return placements

    except FacebookRequestError as e:
        current_app.logger.error(f"Facebook API Error fetching placements: {e.api_error_message()}")
        raise Exception(f"Facebook API Error: {e.api_error_message()}") from e
    except Exception as e:
        current_app.logger.error(f"An unexpected error occurred fetching FAN placements: {e}")
        raise Exception("An unexpected error occurred while fetching ad placements.") from e


def get_fan_performance_data(placement_ids: List[str] = None, date_preset: str = 'last_7d'):
    """
    Fetches real performance data for given placement IDs from Facebook Audience Network API.
    """
    if not _fb_api_initialized_this_request and not initialize_fb_api():
        raise Exception("Facebook API not initialized. Please connect to Facebook first.")

    try:
        app_id = current_app.config.get('FACEBOOK_APP_ID')
        current_app.logger.info(f"Fetching real FAN performance data for app_id: {app_id}")
        app = Application(app_id)

        # Define the metrics you want to fetch
        metrics = [
            'fb_ad_network_revenue',
            'fb_ad_network_impressions',
            'fb_ad_network_clicks',
            'fb_ad_network_fill_rate',
            'fb_ad_network_ecpm',
        ]
        params = {
            'metric': ','.join(metrics),
            'breakdowns': ['placement'], # We need this to get per-placement data
            'date_preset': date_preset,
        }

        # If specific placement_ids are provided, filter by them
        if placement_ids:
            params['placement_ids'] = placement_ids

        insights = app.get_ad_network_analytics_results(params=params)

        performance_data = []
        if insights and insights['data']:
            for result in insights['data']:
                # The API returns numeric values as strings, so we need to convert them.
                revenue = float(result.get('fb_ad_network_revenue', 0))
                impressions = int(result.get('fb_ad_network_impressions', 0))
                clicks = int(result.get('fb_ad_network_clicks', 0))
                fill_rate = float(result.get('fb_ad_network_fill_rate', 0))
                ecpm = float(result.get('fb_ad_network_ecpm', 0))

                performance_data.append({
                    "placement_id": result['placement'],
                    # As noted before, name is not provided, so we construct it.
                    "placement_name": f"Placement ID: {result['placement']}",
                    "date_preset_info": date_preset,
                    "revenue": revenue,
                    "impressions": impressions,
                    "clicks": clicks,
                    "ecpm": ecpm,
                    "fill_rate": fill_rate
                })

        return performance_data

    except FacebookRequestError as e:
        current_app.logger.error(f"Facebook API Error fetching performance data: {e.api_error_message()}")
        raise Exception(f"Facebook API Error: {e.api_error_message()}") from e
    except Exception as e:
        current_app.logger.error(f"An unexpected error occurred fetching FAN performance data: {e}")
        raise Exception("An unexpected error occurred while fetching performance data.") from e

# --- Google Ads Service Functions ---

def get_google_ads_client(refresh_token: str = None) -> Optional[GoogleAdsClient]:
    """
    Initializes and returns a GoogleAdsClient using the refresh token.
    If no refresh_token is provided, attempts to get it from the session.
    """
    if not refresh_token:
        refresh_token = session.get('google_ads_refresh_token')

    if not refresh_token:
        current_app.logger.warning("No Google Ads refresh token provided or in session.")
        return None

    try:
        client_id = current_app.config['GOOGLE_ADS_CLIENT_ID']
        client_secret = current_app.config['GOOGLE_ADS_CLIENT_SECRET']
        developer_token = current_app.config['GOOGLE_ADS_DEVELOPER_TOKEN']
        # login_customer_id is optional here; might be needed if operating under an MCC
        # and want to set it globally for the client.
        # login_customer_id = current_app.config.get('GOOGLE_ADS_LOGIN_CUSTOMER_ID')

        if 'YOUR_GOOGLE_ADS_CLIENT_ID' in client_id: # Basic check
            current_app.logger.error("Google Ads client_id is not configured.")
            return None
        if 'YOUR_GOOGLE_ADS_DEVELOPER_TOKEN' in developer_token:
             current_app.logger.error("Google Ads developer_token is not configured.")
             return None


        credentials = {
            "developer_token": developer_token,
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
            "use_proto_plus": True # Recommended by Google
            # "login_customer_id": login_customer_id # If using MCC globally
        }

        # Initialize client from dictionary.
        google_ads_client = GoogleAdsClient.load_from_dict(credentials)
        current_app.logger.info("GoogleAdsClient initialized successfully.")
        return google_ads_client

    except KeyError as e:
        current_app.logger.error(f"Missing Google Ads configuration key: {e}")
        return None
    except Exception as e:
        current_app.logger.error(f"Failed to initialize GoogleAdsClient: {e}")
        return None

def list_accessible_google_ads_customers(client: GoogleAdsClient) -> List[Dict[str, str]]:
    """
    Lists all Google Ads customers accessible by the authenticated user.
    """
    if not client:
        current_app.logger.error("GoogleAdsClient not provided to list_accessible_google_ads_customers.")
        return []

    customer_details_list = []
    try:
        customer_service = client.get_service("CustomerService")
        accessible_customers_response = customer_service.list_accessible_customers()

        if not accessible_customers_response.resource_names:
            current_app.logger.info("No accessible Google Ads customers found.")
            return []

        current_app.logger.info(f"Found {len(accessible_customers_response.resource_names)} accessible customer resource names.")

        # For each resource name, get customer details
        ga_service = client.get_service("GoogleAdsService")
        for customer_resource_name in accessible_customers_response.resource_names:
            # customer_resource_name is like "customers/1234567890"
            customer_id = customer_resource_name.split('/')[-1]
            query = f"""
                SELECT customer.id, customer.descriptive_name, customer.manager, customer.test_account
                FROM customer
                WHERE customer.id = '{customer_id}'
            """
            try:
                # Note: Each query to GoogleAdsService needs a customer_id in the client
                # if login_customer_id is not set, or if it's different from the target customer.
                # For listing customers, we typically don't need to set login_customer_id on the client itself,
                # but for querying a specific customer, the client needs to know which customer's context to use.
                # However, the ListAccessibleCustomers call doesn't require a login_customer_id.
                # And when querying "FROM customer WHERE customer.id = X", X is the context.

                # If client was initialized with a login_customer_id (MCC), that's used by default.
                # If not, the API call itself for a specific customer_id sets the context for that call.

                stream = ga_service.search_stream(customer_id=customer_id, query=query)
                for batch in stream:
                    for row in batch.results:
                        customer = row.customer
                        customer_details_list.append({
                            "customer_id": str(customer.id),
                            "descriptive_name": customer.descriptive_name,
                            "is_manager_account": customer.manager,
                            "is_test_account": customer.test_account,
                            "resource_name": customer_resource_name
                        })
                        current_app.logger.info(f"Fetched details for customer: {customer.descriptive_name} ({customer.id})")
            except GoogleAdsException as ex:
                current_app.logger.error(
                    f"Google Ads API request failed for customer {customer_id}: {ex.failure.errors[0].message}"
                )
                # Optionally add error info to a list to show user
            except Exception as e:
                current_app.logger.error(f"Unexpected error fetching details for customer {customer_id}: {e}")


    except GoogleAdsException as ex:
        current_app.logger.error(
            f"Google Ads API request failed: {ex.failure.errors[0].message}"
            f"\nFailure: {ex.failure}\nRequest ID: {ex.request_id}"
        )
        # Re-raise or handle appropriately for the route
        raise
    except Exception as e:
        current_app.logger.error(f"Unexpected error listing accessible Google Ads customers: {e}")
        raise

    return customer_details_list


# --- End of Google Ads Service Functions ---
