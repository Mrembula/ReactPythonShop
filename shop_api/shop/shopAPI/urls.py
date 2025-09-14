from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # User authentication
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),

    # Products
    path('products/', views.product_list, name='product-list'),
    path('product/<slug:slug>/', views.product_detail, name='product-detail'),
    path('products/related/<slug:slug>/', views.related_products, name='related-products'),

    # Cart
    path('add_item/', views.add_item, name='add-item'),
    path('get_cart_status/<str:cart_code>', views.get_cart_status, name='get-cart-status'),
    path('get_cart/<str:cart_code>/', views.get_cart_items, name='get-cart-items'),
    path('save_cart_code/', views.save_cart_to_user, name='save-cart-to-user'),

    # Admin and JWT
    path('admin/', admin.site.urls),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]



