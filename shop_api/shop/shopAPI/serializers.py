import decimal

from rest_framework import serializers
from .models import Product, Cart, CartItem


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'image_url', 'description',
                  'category', 'price']

class DetailProductSerializer(serializers.ModelSerializer):
    similar_product = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'image_url', 'description', 'similar_products']

    def get_similar_products(self, obj):
        similar = Product.objects.filter(category=obj.category).exclude(id=obj.id)[:4]
        return ProductSerializer(similar, many=True, context=self.context).data

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.quantity * obj.product.price

def get_total_price(self, obj):
    return sum(item.quantity * item.product.price for item in obj.cart_items.all())

class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    tax = serializers.SerializerMethodField()
    grand_total = serializers.SerializerMethodField()

    def get_total_price(self, obj):
        return get_total_price(self, obj)

    def get_tax(self, obj):
        # Use the subtotal from the `get_total_price` method
        subtotal = self.get_total_price(obj)
        return subtotal * decimal.Decimal(0.17)

    def get_grand_total(self, obj):
        # Use the subtotal and tax from the other serializer methods
        subtotal = self.get_total_price(obj)
        tax = self.get_tax(obj)
        return subtotal + tax

    class Meta:
        model = Cart
        fields = ['cart_code', 'user', 'cart_items', 'total_price', 'grand_total', 'tax']



'''
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image_url and hasattr(obj.image_url, 'url'):
            return request.build_absolute_uri(obj.image_url.url)
        return None


class DetailSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    similar_products = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'image', 'description', 'category', 'price', 'similar_products']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None
'''