#!/usr/bin/env python3
import os
import datetime
import pathlib
import argparse
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from pymongo import MongoClient
from bson.objectid import ObjectId

# ——— CONFIG ———
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
DOTENV_PATH = BASE_DIR / '.env'
# Load environment variables from .env file
load_dotenv(dotenv_path=DOTENV_PATH)

SERVICE_ACCOUNT_FILE = BASE_DIR / 'service-account.json'
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

# MongoDB Atlas config (loaded from .env)
MONGO_URI = os.getenv('MONGO_URI')                # Atlas connection string
MONGODB_DB = os.getenv('MONGODB_DB')               # Database name
MONGODB_COLLECTION = os.getenv('MONGODB_COLLECTION', 'events')

# Calendar ID (loaded from .env)
CALENDAR_ID = os.getenv('CALENDAR_ID')

# CLI arg for application user ID
parser = argparse.ArgumentParser(
    description="Fetch and store Google Calendar events for a given user."
)
parser.add_argument(
    '--user-id', dest='user_id', required=True,
    help='MongoDB ObjectId of the application user'
)
args = parser.parse_args()
USER_ID = args.user_id


def main():
    """
    Authenticate with the service account, fetch events from the last 24 hours,
    and store each event's timestamp, title, location, description, and user
    into a MongoDB Atlas collection, avoiding duplicates.
    """
    # Validate configuration
    missing = []
    for var, val in [
        ('MONGO_URI', MONGO_URI),
        ('MONGODB_DB', MONGODB_DB),
        ('CALENDAR_ID', CALENDAR_ID),
        ('USER_ID', USER_ID)
    ]:
        if not val:
            missing.append(var)
    if missing:
        raise RuntimeError(f"Missing required configuration: {', '.join(missing)}")

    # Connect to MongoDB
    client = MongoClient(MONGO_URI)
    db = client[MONGODB_DB]
    collection = db[MONGODB_COLLECTION]

    # Authenticate Google Calendar API
    creds = service_account.Credentials.from_service_account_file(
        str(SERVICE_ACCOUNT_FILE), scopes=SCOPES
    )
    service = build('calendar', 'v3', credentials=creds)

    # Time window: last 24 hours
    now = datetime.datetime.utcnow()
    yesterday = now - datetime.timedelta(hours=24)
    time_min = yesterday.isoformat() + 'Z'
    time_max = now.isoformat() + 'Z'

    # Fetch events
    events = service.events().list(
        calendarId=CALENDAR_ID,
        timeMin=time_min,
        timeMax=time_max,
        singleEvents=True,
        orderBy='startTime'
    ).execute().get('items', [])

    # Store events, skipping duplicates
    if not events:
        print("No events in the last 24 hours.")
        return

    print(f"Processing {len(events)} events for user {USER_ID}...")
    for e in events:
        start = e['start'].get('dateTime', e['start'].get('date'))
        summary = e.get('summary', '(no title)')
        location = e.get('location', '(no location)')
        description = e.get('description', '(no description)')

        # Build the document
        doc = {
            'timestamp': start,
            'title': summary,
            'location': location,
            'description': description,
            'user': ObjectId(USER_ID)
        }

        # Check for existing event with same timestamp and user
        exists = collection.find_one({
            'timestamp': start,
            'user': ObjectId(USER_ID)
        })
        if exists:
            print(f" - Skipping duplicate: {summary} at {start}")
            continue

        # Insert new event
        result = collection.insert_one(doc)
        print(f" - Inserted {result.inserted_id} -> {summary}")

    print("Done storing events.")


if __name__ == '__main__':
    main()