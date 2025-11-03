from django.core.management.base import BaseCommand
from shopAPI.models import Product  # Import your Product model
import requests

API_BASE_URL = "https://fakestoreapi.com"

class Command(BaseCommand):
    help = 'Fetch products from external API and save to database'

    def handle(self, *args, **kwargs):
        endpoint = f"{API_BASE_URL}/products"
        try:
            response = requests.get(endpoint)
            response.raise_for_status()
            products = response.json()
            for item in products:
                Product.objects.create(
                    name=item.get('title', ''),
                    description=item.get('description', ''),
                    price=item.get('price', 0),
                    category=item.get('category', ''),
                    image_url=item.get('image', '')
                )
            self.stdout.write(self.style.SUCCESS('Products fetched and saved!'))
        except requests.exceptions.RequestException as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {e}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"General error: {e}"))
        