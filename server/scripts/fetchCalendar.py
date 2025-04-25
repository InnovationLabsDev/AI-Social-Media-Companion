#!/usr/bin/env python3
import datetime
import pathlib
from google.oauth2 import service_account
from googleapiclient.discovery import build

# ——— CONFIG ———
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
SERVICE_ACCOUNT_FILE = BASE_DIR / 'service-account.json'
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

# ← Replace this with your calendar's ID (e.g. your.email@gmail.com)
CALENDAR_ID = 'alinandrei2004@gmail.com'


def main():
    """
    Authenticate with the service account, fetch events for the next 24 hours,
    and print summary, location, and description for each event.
    """
    # 1. Authenticate with the service account
    creds = service_account.Credentials.from_service_account_file(
        str(SERVICE_ACCOUNT_FILE), scopes=SCOPES
    )
    service = build('calendar', 'v3', credentials=creds)

    # 2. Compute the time window (now → next 24 hours)
    now = datetime.datetime.utcnow()
    yesterday = now - datetime.timedelta(hours=24)
    time_min = yesterday.isoformat() + 'Z'  # 24 hours ago
    time_max = now.isoformat() + 'Z'        # now

    # 3. Fetch upcoming events
    events_result = (
        service.events()
               .list(
                   calendarId=CALENDAR_ID,
                   timeMin=time_min,
                   timeMax=time_max,
                   singleEvents=True,
                   orderBy='startTime'
               )
               .execute()
    )
    events = events_result.get('items', [])

    # 4. Print them out
    if not events:
        print("No upcoming events in the next 24 hours.")
    else:
        print(f"Upcoming events for calendar {CALENDAR_ID} (next 24 h):")
        for e in events:
            start = e['start'].get('dateTime', e['start'].get('date'))
            summary = e.get('summary', '(no title)')
            location = e.get('location', '(no location)')
            description = e.get('description', '(no description)')
            print(f" • {start} → {summary}")
            print(f"     Location   : {location}")
            print(f"     Description: {description}\n")


if __name__ == '__main__':
    main()
