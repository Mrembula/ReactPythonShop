from decimal import Decimal as d
from rest_framework import serializers
# from rest_framework_simplejwt.tokens import Token
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
        # 1. MANUAL AUTHENTICATION AND TOKEN GENERATION
        print("attrs: ", attrs)
        email_candidate = attrs.get('email')
        password = attrs.get('password')

        # Add a print statement here to confirm the function is reached
        print("--- DEBUG: validate() entered ---")
        print("email & password: ", email_candidate, password)
        try:
            # Manually look up user by email
            user = User.objects.get(email__iexact=email_candidate)
        except User.DoesNotExist:
            user = None

        # Check if the user exists and the password is correct
        # user.check_password(password) uses Django's built-in hashing check
        print("User found: ", user)
        if user is None or not user.check_password(password) or not user.is_active:
            print("--- DEBUG: Authentication Failed ---")
            raise serializers.ValidationError(
                'Invalid email or password.',
                code='no_active_account'
            )

        # Manually generate tokens after successful authentication
        refresh = RefreshToken.for_user(user)
        data = {
            'user': {'email': user.email, 'full_name': user.full_name},
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        # The authenticated user object
        self.user = user

        # 2. Retrieve the temporary cart code sent from the frontend
        anonymous_cart_code = attrs.get('cart_code')
        final_cart = None

        # WARNING: Removed transaction.atomic(). Data inconsistencies may occur
        # if errors happen during cart item merging.
        if anonymous_cart_code:
            try:
                # 3. Find the anonymous cart using the code
                anonymous_cart = Cart.objects.get(cart_code=anonymous_cart_code)

                # Check if the user already has a permanent cart
                user_cart_query = Cart.objects.filter(user=user)

                if user_cart_query.exists():

                    # Case A: User has an existing permanent cart. Merge items.
                    final_cart = user_cart_query.first()

                    # Merge logic: move all items from the anonymous cart to the permanent cart
                    for item in anonymous_cart.cart_items.all():
                        item.cart = final_cart
                        item.save()

                    # Once merged, delete the old anonymous cart
                    anonymous_cart.delete()

                else:
                    # Case B: User has no permanent cart. Link the anonymous cart directly.
                    anonymous_cart.user = user
                    anonymous_cart.save()
                    final_cart = anonymous_cart

            except Cart.DoesNotExist:
                # Code was provided but no cart exists (e.g., stale code). Fall through.
                pass

                # 4. Ensure the user has a permanent cart (if no anonymous cart was linked)
        if not final_cart:
            # If the user logged in without a cart, create a new one for them or get existing.
            final_cart, created = Cart.objects.get_or_create(user=user)

        # 5. Inject the final, permanent cart code into the response payload
        final_cart_code = final_cart.cart_code

        # 6. Inject custom data into the response dictionary
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


'''

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True) # Displays user attributes
    cart_code = serializers.CharField(write_only=True)

    def validate(self, attrs):
        # 2. Retrieve raw data sent by the client.
        email = attrs.get('email')
        password = attrs.get('password')
        print("Attributes: ", attrs)

        # data = super().validate(attrs)
        # print("Checking super data attris: ", data)
        anonymous_user = attrs.get('cart_code')
        print("Anonymous user: ", anonymous_user)

        user = authenticate(request=self.context.get('request'),email=email, password=password)
        print("This is user data!!: ", user)
        print("User before authenticate")
        # user = authenticate(email=email, password=password)
        print("Hello, World!!")
        print("Authenticated user: ", user)
        if not user:
            raise serializers.ValidationError('Invalid email or password')
        refresh = self.get_token(user)
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
        
        
        
        
        
        
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Overrides the default serializer to handle the cart_code merge
    during login.
    """

    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    # Declare the custom input field for the temporary cart code
    cart_code = serializers.CharField(write_only=True, required=False, allow_blank=True)
    print("01")
    # Declare the custom output fields
    final_cart_code = serializers.CharField(read_only=True)
    user_id = serializers.IntegerField(read_only=True)
    print('02')
    def validate(self, attrs):
        # 1. Call the parent class's validate method to authenticate and generate tokens.
        print(1)
        try:
            data = super().validate(attrs)
        except serializers.ValidationError as e:
            # Re-raise the 401 error with a generic message for security
            raise serializers.ValidationError(
                'Invalid email or password.',
                code='no_active_account'
            )

        # The authenticated user object
        user = self.user

        # 2. Retrieve the temporary cart code sent from the frontend
        anonymous_cart_code = attrs.get('cart_code')
        final_cart = None

        # WARNING: Removed transaction.atomic(). Data inconsistencies may occur
        # if errors happen during cart item merging.
        if anonymous_cart_code:
            try:
                # 3. Find the anonymous cart using the code
                anonymous_cart = Cart.objects.get(cart_code=anonymous_cart_code)

                # Check if the user already has a permanent cart
                user_cart_query = Cart.objects.filter(user=user)

                if user_cart_query.exists():

                    # Case A: User has an existing permanent cart. Merge items.
                    final_cart = user_cart_query.first()

                    # Merge logic: move all items from the anonymous cart to the permanent cart
                    for item in anonymous_cart.cart_items.all():
                        item.cart = final_cart
                        item.save()

                    # Once merged, delete the old anonymous cart
                    anonymous_cart.delete()

                else:
                    # Case B: User has no permanent cart. Link the anonymous cart directly.
                    anonymous_cart.user = user
                    anonymous_cart.save()
                    final_cart = anonymous_cart

            except Cart.DoesNotExist:
                # Code was provided but no cart exists (e.g., stale code). Fall through.
                pass

                # 4. Ensure the user has a permanent cart (if no anonymous cart was linked)
        if not final_cart:
            # If the user logged in without a cart, create a new one for them or get existing.
            final_cart, created = Cart.objects.get_or_create(user=user)

        # 5. Inject the final, permanent cart code into the response payload
        final_cart_code = final_cart.cart_code

        # 6. Inject custom data into the response dictionary
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
        # Adds user details (like email) to the JWT payload
        token = super().get_token(user)
        token['email'] = user.email
        return token

'''