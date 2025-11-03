import firebase_admin
from firebase_admin import credentials, auth
import os
import sys

# IMPORTANT: REPLACE THE PLACEHOLDER BELOW
# This path must point to your Firebase Service Account JSON file.
# Assuming your project structure is 'project_root/shopAPI/firebase_admin_utils.py', 
# you might want the service account file in the project root or the shopAPI folder.
# Example: SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'service_account.json')
SERVICE_ACCOUNT_FILENAME = 'ecommerce-996db-firebase-adminsdk-fbsvc-38e4178748.json' 
SERVICE_ACCOUNT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
    SERVICE_ACCOUNT_FILENAME
)

# Initialize Firebase Admin SDK
try:
    # Ensure it's initialized only once
    if not firebase_admin._apps:
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK initialized successfully.")
except FileNotFoundError:
    # This will prevent the app from starting successfully if the key is missing
    print(f"CRITICAL ERROR: Firebase service account file not found at {SERVICE_ACCOUNT_PATH}", file=sys.stderr)
    # Re-raising or exiting here might be safer in production
except ValueError as e:
    # Handles "The default Firebase app already exists" error during Django's multiple loads
    if "The default Firebase app already exists" not in str(e):
        print(f"Firebase initialization error: {e}", file=sys.stderr)

def verify_firebase_token(id_token):
    """
    Verifies the ID token received from the frontend client using Firebase Admin SDK.
    Returns the decoded token payload if valid.
    Raises firebase_admin.auth.InvalidIdTokenError if invalid.
    """
    # NOTE: This function requires the Firebase Admin SDK to be successfully initialized.
    # If initialization failed above, this call will likely fail as well.
    return auth.verify_id_token(id_token)