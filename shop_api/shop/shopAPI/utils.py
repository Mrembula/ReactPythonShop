from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model


User = get_user_model()

# Helper function for JWT tokens
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
