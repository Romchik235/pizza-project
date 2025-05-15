from django.shortcuts import render
from rest_framework import viewsets
from .models import Category, MenuItem, Order, Review
from .serializers import CategorySerializer, MenuItemSerializer, OrderSerializer, ReviewSerializer

# Функція для відображення index.html як шаблону
def index(request):
    return render(request, 'index.html')

# API-контролери
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer





