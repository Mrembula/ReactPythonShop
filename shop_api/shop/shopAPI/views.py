from .models import Product
from django.shortcuts import render
from rest_framework.decorators import api_view
from .serializers import ProductSerializer
from rest_framework.generics import ListAPIView



from rest_framework.response import Response
# Create your views here.

class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_serializer_context(self):
        return {'request': self.request}


@api_view(['GET'])
def product_list(request ):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)



