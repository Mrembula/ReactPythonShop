from django.contrib import admin
from .models import Product, Cart, CartItem

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

# Register your models here.
admin.site.register(Product, ProductAdmin)
admin.site.register(Cart)
admin.site.register(CartItem)