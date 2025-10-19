from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # User authentication
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_with_cart_merge, name='custom-login'),

    # Products
    path('products/', views.product_list, name='product-list'),
    path('product/<slug:slug>/', views.product_detail, name='product-detail'),
    path('related_products/<slug:slug>/', views.related_products, name='related-products'),
    path('delete_item/<str:cart_code>/<int:item_id>/', views.delete_item, name='delete-item'),

    # Cart
    path('add_item/', views.add_item, name='add-item'),
    path('cart_items/<str:cart_code>/', views.cart_items, name='cart-items'),
    path('get_cart_status/<str:cart_code>/', views.get_cart_status, name='get-cart-status'),
    path('save_cart_code/', views.save_cart_to_user, name='save-cart-to-user'),
    path('product_quantity/<str:cart_code>/', views.product_quantity, name='product-quantity'),
    path('cart/status/', views.get_cart_status, name='cart-status'),

    # Admin and JWT
    path('admin/', admin.site.urls),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]



