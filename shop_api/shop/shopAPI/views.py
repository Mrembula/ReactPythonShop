from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from .models import Product, Cart, CartItem
from django.contrib.auth import get_user_model
from .serializers import CustomTokenObtainPairSerializer
from .serializers import ProductSerializer, CartSerializer, DetailProductSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import F
import json

# I lost the first backend, Which I completed 4 months back. Tired of re-writing this
# Use github next time to avoid this situation
User = get_user_model()


def tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def get_auth_response_data(user, cart_code):
    tokens = tokens_for_user(user)
    data = {
        'token': tokens,
        'user': {
            'email': user.email,
            'full_name': getattr(user, 'full_name', f"{user.first_name} {user.last_name}".strip())
        }
    }
    # Determine the final cart code to return to the frontend
    final_cart_code = cart_code

    if hasattr(user, 'cart') and user.cart is not None:
        final_cart_code = user.cart.cart.cart_code


    data['cart_code'] = final_cart_code
    return data

# Product-related views
@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    serializer = DetailProductSerializer(product, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def related_products(request, slug):
    product = get_object_or_404(Product, slug=slug)
    related = Product.objects.filter(category=product.category).exclude(id=product.id)[:10]
    serializer = ProductSerializer(related, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_with_cart_merge(request):
    """
        Handles user login, token generation, and returns the cart code.
        Uses CustomTokenObtainPairSerializer to authenticate via email/password.
        """
    # Use your custom serializer to handle the authentication logic.
    # It takes the request data (containing email/password under 'username'/'password')
    # and validates credentials, generating tokens on success.
    serializer = CustomTokenObtainPairSerializer(data=request.data) # CustomTokenObtainPairSerializer(data={'email': 'tebogosekhula@gmail.com', 'password': '1234', 'cart_code': '1d110d2c-dbbd-43ce-97c7-1804fb08dafc'}):

    try:
        serializer.is_valid(raise_exception=True)
    except Exception as e:
        # If authentication fails, the serializer raises a validation error.
        return Response(
            {'detail': 'Invalid email or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # If valid, serializer.validated_data contains the access/refresh tokens,
    # user data, and the cart_code.
    return Response(serializer.validated_data, status=status.HTTP_200_OK)


# User-related view
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    username = request.data.get('username', '')
    print(request.data)
    print(email, password, username)

    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if User.objects.filter(email=email).exists():
            user = authenticate(username=email, password=password)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            full_name=username
        )

        tokens = tokens_for_user(user)

        return Response({
            'message': 'User created successfully',
            'user': {'email': user.email, 'full_name': user.full_name},
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response({'error': 'A user with this email already exists'}, status=status.HTTP_409_CONFLICT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def cart_items(request, cart_code):
    if not cart_code:
        return Response({'error': 'Cart code is required'}, status=status.HTTP_400_BAD_REQUEST)
    user_cart = Cart.objects.filter(cart_code=cart_code)
    if not user_cart.exists():
        return Response({'error': 'No items found in cart'}, status=status.HTTP_404_NOT_FOUND)
    serializer = CartSerializer(user_cart, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated]) # Make sure only logged-in users can do this
def save_cart_to_user(request):
    cart_code = request.data.get('cart_code')
    user = request.user
    try:
        cart = Cart.objects.get(cart_code)
        cart.user = user
        cart.save()
        return Response({'success': 'Cart associated with user'}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart does not exist'}, status=status.HTTP_404_NOT_FOUND)


# Cart-related views
@api_view(['POST'])
def add_item(request):
    cart_code = request.data.get('cart_code')
    product_id = request.data.get('product_id')

    if not cart_code or not product_id:
        return Response({'error': 'Missing cart code or product ID'}, status=status.HTTP_400_BAD_REQUEST)

    if not cart_code or not product_id:
        return Response({'error': 'Missing cart code or product ID'})

    cart, created = Cart.objects.get_or_create(cart_code=cart_code)
    product = Product.objects.get(id=product_id)

    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        cart_item.quantity += 1
        cart_item.save()

    return Response({'message': 'Item added to cart'}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def delete_item(request, item_id, cart_code):
    try:
        cart_item = CartItem.objects.get(id=item_id, cart__cart_code=cart_code)
    except CartItem.DoesNotExist:
        return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)

    cart_item.delete()
    cart = cart_item.cart

    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
def product_quantity(request, cart_code):
    try:
        cart = Cart.objects.get(cart_code=cart_code)
        product_id = request.data.get('product_id')
        new_quantity = request.data.get('quantity')
        print("Product Quantity: ", product_id, new_quantity)

        if not product_id or new_quantity is None:
            return Response({"error": "Missing product id or quantity"})
        new_quantity = int(new_quantity)
        if new_quantity >= 1:
            cart_item = CartItem.objects.get(cart=cart, product__id=product_id)

            cart_item.quantity = new_quantity
            print("Quantity: ", cart_item.quantity)
            cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    except CartItem.DoesNotExist:
        return Response({'error': 'Product not in cart'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)

# Get Item inside the user cart
@api_view(['GET'])
def get_cart_status(request, cart_code):  # <-- Add cart_code here

    try:
        # NOTE: This view currently does not enforce user authentication
        # allowing unauthenticated users to check their cart via cart_code.
        cart = Cart.objects.get(cart_code=cart_code)
    except Cart.DoesNotExist:
        return Response({'error': 'No items found in cart'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_200_OK)

'''
@api_view(['GET'])
@permission_classes([AllowAny])
def login(request):
    email = request.query_params.get('email')
    password = request.query_params.get('password')
    print("Checking request: ", email, password)
    user = authenticate(username=email, password=password)
    print("User: ", user)

    if user is not None:
        tokens = tokens_for_user(user)
        return Response({
            'message': 'Login successful',
            'user': {'email': user.email, 'full_name': user.full_name},
            'tokens': tokens,
            'password': password,
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

'''


'''
@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
login_with_cart_merge(request):
     try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        cart_code = data.get('cart_code')  # Anonymous cart ID from frontend

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    # 1. Authenticate User
    user = authenticate(request, username=email, password=password)
    print("user: ", user)

    if user is not None:
        print(user.is_active)
        if user.is_active:
            final_cart_code = None

            # 2. Handle Cart Merging/Linking
            print("Cart Code: ", cart_code)
            print("User: ", user)
            anonymous_cart = Cart.objects.all()
            print(anonymous_cart)

            if cart_code:
                try:
                    anonymous_cart = Cart.objects.get(cart_code=cart_code)
                    if not anonymous_cart:
                        return {
                            'message': 'User hasn\'t selected any items from our product'
                        }

                    # Using hasattr() to check for an existing permanent cart
                    if hasattr(user, 'cart') and user.cart is not None:
                        # User already has a permanent cart: Merge items
                        user_cart = user.cart

                        for item in anonymous_cart.cartitem_set.all():
                            existing_item = user_cart.cartitem_set.filter(
                                product=item.product
                            ).first()

                            if existing_item:
                                existing_item.quantity = F('quantity') + item.quantity
                                existing_item.save()
                                item.delete()
                            else:
                                item.cart = user_cart
                                item.save()

                        anonymous_cart.delete()
                        final_cart_code = user_cart.cart_code

                    else:
                        # User has no cart: Link the anonymous cart to the user
                        anonymous_cart.user = user
                        anonymous_cart.save()
                        final_cart_code = anonymous_cart.cart_code

                except Cart.DoesNotExist:
                    # If the anonymous code was invalid, rely on the user's permanent cart (if it exists)
                    pass

                    # 3. Get the cart code if merging didn't happen (e.g., no anonymous code was sent)
            if hasattr(user, 'cart') and user.cart is not None and final_cart_code is None:
                final_cart_code = user.cart.cart_code

            # 4. Generate & Return Response (Tokens, User Data, and final Cart ID)
            response_data = get_auth_response_data(user, final_cart_code)

            return JsonResponse(response_data, status=200)

        else:
            return JsonResponse({'error': 'Account is inactive.'}, status=403)

    else:
        # Authentication failed
        return JsonResponse({'error': 'Invalid credentials.'}, status=401)

'''