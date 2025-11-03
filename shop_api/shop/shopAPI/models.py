from django.db import models
from django.utils.text import slugify
from django.conf import settings
from email.policy import default


class Cart(models.Model):
    cart_code = models.CharField(max_length=50, unique=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE,
                                null=True, blank=True,
                                related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True, null=True)


class Product(models.Model):
    CATEGORY = (
        ("Electronics", "Electronics"),
        ("Groceries", "Groceries"),
        ("Clothing", "Clothing"),
        ("Books", "Books"),
        ("Furniture", "Furniture"),
        ("Toys", "Toys"),
        ("Sports", "Sports"),
        ("Beauty", "Beauty"),
        ("Automotive", "Automotive"),
        ("Health", "Health"),
        ("Other", "Other"),
        ("Accessories", "Accessories"),
    )

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    image_url = models.URLField(blank=True, null=True, unique=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=15, choices=CATEGORY, blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):

        if not self.name:
            self.category = "Other"

        if not self.slug:
            self.slug = slugify(self.name)
            initial_slug = self.slug
            counter = 1
            while Product.objects.filter(slug=self.slug).exists():
                self.slug = f'{initial_slug}-{counter}'
                counter += 1
        super().save(*args, **kwargs)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.product.name} in cart {self.cart.cart_code}"