# This file will contain the business logic for
# affiliate marketing optimization and ads optimization.

# Example structure:

# class AffiliateOptimizer:
#     def identify_top_performers(self, data):
#         # Logic to identify top performing affiliates
#         pass
#
#     def suggest_new_partners(self, criteria):
#         # Logic to suggest new partners
#         pass

# class AdsOptimizer:
#     def ab_test_creatives(self, creative_variations_data):
#         # Logic for A/B testing
#         pass
#
#     def keyword_analysis(self, current_keywords_data):
#         # Logic for keyword analysis
#         pass

# For Phase 1: CSV Processing and Data Handling

import csv
import io
from datetime import datetime
from typing import List, Dict, Any, Tuple
from flask import current_app # To access app.affiliate_data_store, app.ad_campaign_data_store

from .models import AffiliatePerformanceData, AdCampaignPerformanceData

def parse_affiliate_csv(file_stream: io.StringIO) -> Tuple[List[AffiliatePerformanceData], List[str]]:
    """
    Parses a CSV file stream containing affiliate performance data.

    Args:
        file_stream: A StringIO object representing the CSV file content.

    Returns:
        A tuple containing:
            - A list of AffiliatePerformanceData objects.
            - A list of error messages encountered during parsing.
    """
    data_records: List[AffiliatePerformanceData] = []
    errors: List[str] = []
    reader = csv.DictReader(file_stream)

    required_headers = ['report_date', 'affiliate_name']
    optional_headers = ['impressions', 'clicks', 'conversions', 'commission_amount']
    all_expected_headers = required_headers + optional_headers

    if not reader.fieldnames:
        errors.append("CSV file is empty or has no headers.")
        return data_records, errors

    # Basic header validation
    missing_required_headers = [h for h in required_headers if h not in reader.fieldnames]
    if missing_required_headers:
        errors.append(f"Missing required CSV headers: {', '.join(missing_required_headers)}")
        # We might choose to stop processing or try to process with what's available
        # For now, let's be strict for required headers.
        return data_records, errors

    # Warn about unexpected headers, but proceed
    unexpected_headers = [h for h in reader.fieldnames if h not in all_expected_headers]
    if unexpected_headers:
        current_app.logger.warning(f"CSV contains unexpected headers (will be ignored): {', '.join(unexpected_headers)}")


    for row_num, row in enumerate(reader, start=2): # start=2 because 1 is header row
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

            # Helper to safely convert to int or float
            def safe_to_int(value_str: str, field_name: str) -> Optional[int]:
                if value_str is None or value_str.strip() == '':
                    return None
                try:
                    return int(value_str)
                except ValueError:
                    errors.append(f"Row {row_num}: Invalid integer value '{value_str}' for '{field_name}'.")
                    return None # Or raise an error to skip the row entirely

            def safe_to_float(value_str: str, field_name: str) -> Optional[float]:
                if value_str is None or value_str.strip() == '':
                    return None
                try:
                    return float(value_str)
                except ValueError:
                    errors.append(f"Row {row_num}: Invalid float value '{value_str}' for '{field_name}'.")
                    return None


            data = AffiliatePerformanceData(
                report_date=report_date,
                affiliate_name=affiliate_name.strip(),
                impressions=safe_to_int(row.get('impressions'), 'impressions'),
                clicks=safe_to_int(row.get('clicks'), 'clicks'),
                conversions=safe_to_int(row.get('conversions'), 'conversions'),
                commission_amount=safe_to_float(row.get('commission_amount'), 'commission_amount')
            )
            data_records.append(data)

        except ValueError as e: # Catch date parsing errors specifically
            errors.append(f"Row {row_num}: Error parsing data. Invalid date format for '{report_date_str}'? Expected YYYY-MM-DD. Details: {e}. Skipping row.")
        except Exception as e:
            errors.append(f"Row {row_num}: An unexpected error occurred processing this row: {e}. Skipping row.")

    return data_records, errors


def parse_ad_campaign_csv(file_stream: io.StringIO) -> Tuple[List[AdCampaignPerformanceData], List[str]]:
    """
    Parses a CSV file stream containing ad campaign performance data.

    Args:
        file_stream: A StringIO object representing the CSV file content.

    Returns:
        A tuple containing:
            - A list of AdCampaignPerformanceData objects.
            - A list of error messages encountered during parsing.
    """
    data_records: List[AdCampaignPerformanceData] = []
    errors: List[str] = []
    reader = csv.DictReader(file_stream)

    required_headers = ['report_date', 'campaign_name']
    optional_headers = ['platform', 'impressions', 'clicks', 'cost', 'conversions']
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

            campaign_name = row.get('campaign_name')
            if not campaign_name:
                errors.append(f"Row {row_num}: Missing 'campaign_name'. Skipping row.")
                continue

            platform = row.get('platform', None)
            if platform is not None:
                platform = platform.strip()


            def safe_to_int(value_str: str, field_name: str) -> Optional[int]:
                if value_str is None or value_str.strip() == '': return None
                try: return int(value_str)
                except ValueError:
                    errors.append(f"Row {row_num}: Invalid integer value '{value_str}' for '{field_name}'.")
                    return None

            def safe_to_float(value_str: str, field_name: str) -> Optional[float]:
                if value_str is None or value_str.strip() == '': return None
                try: return float(value_str)
                except ValueError:
                    errors.append(f"Row {row_num}: Invalid float value '{value_str}' for '{field_name}'.")
                    return None

            data = AdCampaignPerformanceData(
                report_date=report_date,
                campaign_name=campaign_name.strip(),
                platform=platform,
                impressions=safe_to_int(row.get('impressions'), 'impressions'),
                clicks=safe_to_int(row.get('clicks'), 'clicks'),
                cost=safe_to_float(row.get('cost'), 'cost'),
                conversions=safe_to_int(row.get('conversions'), 'conversions')
            )
            data_records.append(data)

        except ValueError as e: # Date parsing errors
            errors.append(f"Row {row_num}: Error parsing data. Invalid date format for '{report_date_str}'? Expected YYYY-MM-DD. Details: {e}. Skipping row.")
        except Exception as e:
            errors.append(f"Row {row_num}: An unexpected error occurred: {e}. Skipping row.")

    return data_records, errors
