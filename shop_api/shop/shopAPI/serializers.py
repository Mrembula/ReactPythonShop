from decimal import Decimal as d
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, Cart, CartItem
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

User = get_user_model() #

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
        return subtotal * d(0.17)

    def get_grand_total(self, obj):
        # Use the subtotal and tax from the other serializer methods
        subtotal = self.get_total_price(obj)
        tax = self.get_tax(obj)
        return subtotal + tax

    class Meta:
        model = Cart
        fields = ['cart_code', 'user', 'cart_items', 'total_price', 'grand_total', 'tax']



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True) # Displays user attributes
    cart_code = serializers.CharField(write_only=True, required=True, allow_blank=True)

    final_cart_code = serializers.CharField(read_only=True)
    user_id = serializers.ImageField(read_only=True)

    def validate(self, attrs):
        print("attrs: ", attrs)
        email_candidate = attrs.get('email')
        password = attrs.get('password')

        # print("--- DEBUG: validate() entered ---")
        # print("email & password: ", email_candidate, password)
        try:
            user = User.objects.get(email__iexact=email_candidate)
        except User.DoesNotExist:
            user = None

        # print("User found: ", user)
        if user is None or not user.check_password(password) or not user.is_active:
            # print("--- DEBUG: Authentication Failed ---")
            raise serializers.ValidationError(
                'Invalid email or password.',
                code='no_active_account'
            )

        refresh = RefreshToken.for_user(user)
        data = {
            'user': {'email': user.email, 'full_name': user.full_name},
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        self.user = user
        anonymous_cart_code = attrs.get('cart_code')
        final_cart = None


        if anonymous_cart_code:
            try:
                anonymous_cart = Cart.objects.get(cart_code=anonymous_cart_code)
                user_cart_query = Cart.objects.filter(user=user)

                if user_cart_query.exists():
                    final_cart = user_cart_query.first()

                    for item in anonymous_cart.cart_items.all():
                        item.cart = final_cart
                        item.save()

                    anonymous_cart.delete()

                else:
                    anonymous_cart.user = user
                    anonymous_cart.save()
                    final_cart = anonymous_cart

            except Cart.DoesNotExist:
                pass

        if not final_cart:
            final_cart, created = Cart.objects.get_or_create(user=user)

        final_cart_code = final_cart.cart_code

        data.update({
            'user_id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'final_cart_code': final_cart_code,  # <-- The cart code the frontend now needs to save
            'message': "Login successful and cart merged.",
        })
        return data


    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token


        if user is None or not user.check_password(password) or not user.is_active:
            raise serializers.ValidationError(
                'No active account found with the given credentials.',
                code='no_active_account'
            )
        # 4. Store the authenticated user on the serializer instance
        self.user = user
        refresh = self.get_token(self.user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'full_name': getattr(user, 'full_name', f"{user.first_name} {user.last_name}".strip())
            },
            'cart_code': getattr(user.cart, 'cart_code', None) if hasattr(user, 'cart') else None
        }
        return data
