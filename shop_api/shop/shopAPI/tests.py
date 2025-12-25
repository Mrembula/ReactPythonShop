from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Product, Cart

class ShopAPITests(APITestCase):
    def setUp(self):
        # Create a sample product for testing
        self.product = Product.objects.create(
            name="Test Product",
            price=99.99,
            category="Electronics",
            slug="test-product"
        )

    def test_get_all_products(self):
        """Test that the products endpoint returns a 200 OK"""
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_product_slug_creation(self):
        """Verify that the slug is automatically generated on save"""
        new_product = Product.objects.create(
            name="Unique Item",
            price=10.00
        )
        self.assertEqual(new_product.slug, "unique-item")

    def test_cart_status_not_found(self):
        """Test the response when a non-existent cart_code is provided"""
        url = reverse('get-cart-status', kwargs={'cart_code': 'non-existent-code'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
