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


class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)
    grand_total = serializers.SerializerMethodField()
    tax = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['cart_code', 'user', 'cart_items', 'subtotal', 'grand_total', 'tax']

    def get_subtotal(self, obj):
        return sum(item.quantity * item.product.price for item in obj.cart_items.all())

    def get_grand_total(self, obj):
        subtotal = self.get_subtotal(obj)
        return subtotal * 1.1

    def get_tax(self, obj):
        subtotal = self.get_subtotal(obj)
        return subtotal * 0.1


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