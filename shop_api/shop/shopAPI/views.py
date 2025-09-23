from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from venv import create

from api.models import CustomUser as User
from .models import Product, Cart, CartItem
from .serializers import ProductSerializer, CartSerializer, DetailProductSerializer, CartItemSerializer


# I lost the first backend, Which I completed 4 months back. Tired of re-writing this
# Use github next time to avoid this situatio

# Helper function for JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


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


# User-related views
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    full_name = request.data.get('full_name', '')

    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            full_name=full_name
        )
        tokens = get_tokens_for_user(user)
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
    print(user_cart)

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


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(username=email, password=password)

    if user is not None:
        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'Login successful',
            'user': {'email': user.email, 'full_name': user.full_name},
            'tokens': tokens
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Cart-related views
@api_view(['POST'])
def add_item(request):
    cart_code = request.data.get('cart_code')
    product_id = request.data.get('product_id')

    if not cart_code or not product_id:
        return Response({'error': 'Missing cart code or product ID'}, status=status.HTTP_400_BAD_REQUEST)

    print("cart_code add Items: ", cart_code)
    print("product Id saved: ", product_id)

    if not cart_code or not product_id:
        return Response({'error': 'Missing cart code or product ID'})

    cart, created = Cart.objects.get_or_create(cart_code=cart_code)
    product = Product.objects.get(id=product_id)

    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        cart_item.quantity += 1
        cart_item.save()

    return Response({'message': 'Item added to cart'}, status=status.HTTP_201_CREATED)


'''
@api_view(['GET'])
def get_cart_status(request, cart_code):
    cart_code = request.query_params.get('cart_code')
    if not cart_code:
        return Response({'error': 'Cart code not provided'}, status=status.HTTP_400_BAD_REQUEST)

    cart = get_object_or_404(Cart, cart_code=cart_code)
    items_count = cart.cart_items.count()

    return Response({'items_count': items_count}, status=status.HTTP_200_OK)
'''


@api_view(['GET'])
def get_cart_status(request, cart_code):  # <-- Add cart_code here
    if not cart_code:
        return Response({'error': 'Cart code not provided'}, status=status.HTTP_400_BAD_REQUEST)
    # The rest of the function stays the same
    print("Checking Cart Code: ", cart_code)
    cart = get_object_or_404(Cart, cart_code=cart_code)
    serializer = CartSerializer(cart)

    return Response(serializer.data, status=status.HTTP_200_OK)

'''
@api_view(['GET'])
def cart_items(request, cart_code):
    cart = get_object_or_404(Cart, cart_code=cart_code)
    serializer = CartSerializer(cart)
    print("In Cart: ", serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)
'''