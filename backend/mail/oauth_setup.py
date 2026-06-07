"""
Obtiene GMAIL_REFRESH_TOKEN (ejecutar UNA VEZ en local).

  cd backend
  python -m mail.oauth_setup
"""
from __future__ import annotations

import os
import sys

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

try:
    from dotenv import load_dotenv

    load_dotenv(os.path.join(backend_dir, ".env"))
except ImportError:
    pass

from google_auth_oauthlib.flow import InstalledAppFlow  # noqa: E402

from mail.settings import GMAIL_SEND_SCOPE  # noqa: E402


def main() -> None:
    path = os.environ.get("GOOGLE_OAUTH_CREDENTIALS_FILE", "client_secret.json")
    if not os.path.isabs(path):
        path = os.path.join(backend_dir, path)
    if not os.path.isfile(path):
        print(f"No se encuentra el archivo de credenciales OAuth: {path}")
        sys.exit(1)

    flow = InstalledAppFlow.from_client_secrets_file(path, GMAIL_SEND_SCOPE)
    creds = flow.run_local_server(port=0, prompt="consent")

    print("\n=== Copia estos valores a backend/.env ===\n")
    if creds.refresh_token:
        print(f"GMAIL_REFRESH_TOKEN={creds.refresh_token}")
    print(f"GMAIL_CLIENT_ID={creds.client_id}")
    print(f"GMAIL_CLIENT_SECRET={creds.client_secret}")
    print("\nGMAIL_SENDER_EMAIL=tu_correo@gmail.com")
    print("MAIL_ENABLED=true\n")


if __name__ == "__main__":
    main()
