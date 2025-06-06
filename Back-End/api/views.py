import re
import json, decimal
import requests
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Sum, F, Q
from rest_framework import viewsets
from django.core.paginator import Paginator
from django.contrib.auth import logout as django_logout

from django.http import HttpResponse, JsonResponse
from .models import Category, MenuItem, Order, OrderItem, Review
from .serializers import CategorySerializer, MenuItemSerializer, OrderSerializer, ReviewSerializer



# --- Регулярки ---
NAME_REGEX = r'^[A-Za-zА-Яа-яЇїІіЄєҐґ]{2,}$'
PHONE_REGEX = r'^\+380\d{9}$'

User = get_user_model()

# --- Вхід ---
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        customer_phone = request.POST.get('customer_phone')

        context = {
            'prev_username': username,
            'prev_phone': customer_phone,
        }

        if not re.match(NAME_REGEX, username):
            context['name_error'] = True
            return render(request, 'login.html', context)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # return redirect('home')
            return redirect('/?just_logged_in=1')
        else:
            context['error'] = True
            return render(request, 'login.html', context)

    return render(request, 'login.html')

def custom_logout(request):
    """
    Вихід з системи й перенаправлення на головну страницу ("/").
    Можна підкоригувати redirect куди завгодно.
    """
    django_logout(request)
    return redirect('/')

# --- Реєстрація ---
def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        customer_phone = request.POST.get('customer_phone')

        context = {
            'prev_username': username,
            'prev_phone': customer_phone,
        }

        if not re.match(NAME_REGEX, username):
            context['name_error'] = True
            return render(request, 'register.html', context)

        if not re.match(PHONE_REGEX, customer_phone):
            context['phone_error'] = 'Телефон має бути у форматі +380XXXXXXXXX'
            return render(request, 'register.html', context)

        if User.objects.filter(username=username).exists():
            context['error'] = 'Користувач з таким ім’ям вже існує.'
            return render(request, 'register.html', context)

        user = User.objects.create_user(username=username, password=password)
        user.phone = customer_phone
        user.save()

        login(request, user)
        # return redirect('home')
        return redirect('/?just_logged_in=1')

    return render(request, 'register.html')

# --- Відновлення пароля ---
def password_reset_view(request):
    if request.method == 'POST':
        phone = request.POST.get('reset_phone')
        name = request.POST.get('reset_name')

        if not re.match(PHONE_REGEX, phone) or not re.match(NAME_REGEX, name):
            return render(request, 'password_reset.html', {
                'phone_error': 'Введено неправильні дані.',
                'prev_phone': phone,
                'prev_name': name
            })

        try:
            user = User.objects.get(phone=phone, username=name)
            login(request, user)
            return redirect('login')  # або 'home'
        except User.DoesNotExist:
            return render(request, 'password_reset.html', {
                'phone_error': 'Користувача з такими даними не знайдено.',
                'prev_phone': phone,
                'prev_name': name
            })

    return render(request, 'password_reset.html')

def index(request):
    # 1) готуємо ім’я
    username = request.user.first_name if request.user.is_authenticated else ""

    # 2) пагінуємо MenuItem
    items = MenuItem.objects.all()
    paginator = Paginator(items, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # 3) будуємо загальний контекст і повертаємо одним викликом render
    context = {
        'username': username,
        'page_obj': page_obj,
    }
    return render(request, 'index.html', context)

# --- Головна сторінка ---
def home_view(request):
    # Зайві рядки, які логують користувача, видаляємо:
    # if request.user.is_authenticated and not request.GET.get("just_logged_in"):
    #     logout(request)

    latest_review = Review.objects.order_by('-id').first()
    all_reviews   = Review.objects.all().order_by('-id')[:30]

    # Якщо користувач залогінений, передаємо його username, інакше — порожній рядок
    username = request.user.username if request.user.is_authenticated else ""

    return render(request, 'index.html', {
        "latest_review": latest_review,
        "all_reviews":   all_reviews,
        "user":          request.user,
        # … можливо, ще якісь змінні …
    })

# @csrf_exempt
# @require_POST
# def submit_order(request):
#     try:
#         data = json.loads(request.body)
 
#         name = data.get('name')
#         phone = data.get('phone')
#         address = data.get('address')
#         comment = data.get('comment')
#         delivery_type = data.get('delivery_type')
#         items = data.get('items', [])
#         if not items:
#             return JsonResponse({'error': 'Кошик порожній'}, status=400)
        
#         if not name or not phone or (delivery_type == 'delivery' and not address):
#             return JsonResponse({'error': 'Заповніть усі поля'}, status=400)
        
#         if request.method == 'POST':
#             name = request.POST.get('name')
#             phone = request.POST.get('phone')
#             address = request.POST.get('address') if request.POST.get('delivery_type') == 'delivery' else 'Самовивіз'
#             comment = request.POST.get('comment')
#             delivery_type = request.POST.get('delivery_type')
        
#             return redirect('index')

#         user = request.user if request.user.is_authenticated else None
#         discount = 0.9 if user else 1.0
#         estimated_time = 45 if delivery_type == 'delivery' else 40

#         order = Order.objects.create(
#             user=user,
#             phone=phone,
#             address=address if delivery_type == 'delivery' else '',
#             comment=comment,
#             delivery_type=delivery_type,
#             estimated_time=estimated_time
#         )
        
#         try:
#             text = (
#                 f"Нове замовлення!\n"
#                 f"Ім'я: {name}\n"
#                 f"Телефон: {phone}\n"
#                 f"Адреса: {address}\n"
#                 f"Коментар: {comment}\n"
#                 "Замовлення: " + ", ".join([item['name'] for item in items])
#             )
#             requests.post(
#                 # "https://api.telegram.org/bot<TOKEN>/sendMessage",
#                 # data={"chat_id": "<CHAT_ID>", "text": text}
#             )
#         except Exception as e:
#             pass 

#         for item in items:
#             item_name = item['name']
#             item_price = float(item['price']) * discount
#             menu_item, _ = MenuItem.objects.get_or_create(
#                 name=item_name, 
#                 defaults={'price': item_price, 'description': 'Автоматично'}
#             )
#             OrderItem.objects.create(order=order, menu_item=menu_item, quantity=1)

#         return JsonResponse({'message': 'Замовлення збережено'})
    
#     except Exception as e:
#         return JsonResponse({'error': f'Помилка: {str(e)}'}, status=500)

@csrf_exempt
def submit_order(request):
    """
    Очікує JSON:
    {
      "name": "Петро", "phone": "+380…", "address": "…",
      "delivery_type": "delivery" | "pickup",
      "items":[{"name":"Піца BBQ","price":250}, … ]
    }
    """
    if request.method != "POST":
         return JsonResponse({"error": "POST only"}, status=405)

    try:
        data = json.loads(request.body)
    except ValueError:
        return JsonResponse({"error": "Bad JSON"}, status=400)

    # --- валідація мінімуму ---
    if not all([data.get("name"), data.get("phone"), data.get("items")]):
         return JsonResponse({"error": "Не заповнені обов’язкові поля"}, status=400)

    name           = data["name"]
    phone          = data["phone"]
    address        = data.get("address", "")
    delivery_type  = data.get("delivery_type", "pickup")
    comment        = data.get("comment", "")
    items          = data["items"]
    
    user           = request.user if request.user.is_authenticated else None
    discount       = decimal.Decimal("0.9") if user else decimal.Decimal("1")
    estimated_time = 45 if delivery_type == "delivery" else 40

    from collections import Counter
    counts = Counter(i["name"] for i in items)       # {'Піца BBQ':2, 'Pepsi':1}

    description = ", ".join(
           [f"{n} ×{q}" if q > 1 else n for n, q in counts.items()]
    )
    
    raw_sum    = sum(decimal.Decimal(str(i["price"])) for i in items)
    total_sum  = (raw_sum * discount).quantize(decimal.Decimal("0.01"))

    order = Order.objects.create(
        user    = user,
        name    = (user.username if user else "Гість"),
        phone   = phone,
        address = address,
        delivery_type = delivery_type,
        estimated_time = estimated_time,
        total_sum  = total_sum,
        description = description
    )
       
    for itm in items:
        menu_item, _ = MenuItem.objects.get_or_create(
            name = itm["name"],
            defaults = {"price": itm["price"], "description": "Авто"}
        )
        OrderItem.objects.create(
            order     = order,
            menu_item = menu_item,
            quantity  = 1,
            price     = itm["price"],
        )

    return JsonResponse({"ok": True, "order_id": order.id})

# --- API-контролери ---
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
    

@login_required
def staff_panel(request):
    if not request.user.is_staff:
        return redirect('home')  # не даємо доступ не-персоналу

    orders = Order.objects.all().order_by('-created_at')

    query = request.GET.get('q')
    if query:
        orders = orders.filter(
            Q(user__username__icontains=query) |
            Q(phone__icontains=query) |
            Q(delivery_type__icontains=query)
        )

    return render(request, 'staff_panel.html', {'orders': orders})

def submit_review(request):
    if request.method == 'POST':
        rating = int(request.POST.get('rating', 0))
        comment = request.POST.get('comment', '').strip()

        if not rating or not comment:
            return redirect('/')  # або перенаправити десь ще

        # Якщо ви в моделі Review, Category, MenuItem — усе під’єднано, як було раніше:
        menu_item_name = request.POST.get('menu_item') or "Інше"
        category, _ = Category.objects.get_or_create(name="Інше")

        menu_item, _ = MenuItem.objects.get_or_create(
            name=menu_item_name,
            defaults={'price': 0, 'description': 'Автостворено', 'category': category}
        )

        Review.objects.create(
            menu_item=menu_item,
            rating=rating,
            comment=comment,
            user=request.user if request.user.is_authenticated else None
        )

        messages.success(request, "Дякуємо! Ваш відгук збережено ❤️")
        return redirect('home')
    return redirect('home')

@require_POST
@login_required
def update_order_status(request, order_id):
    if not request.user.is_staff:
        return redirect('home')

    order = Order.objects.get(id=order_id)
    order.status = request.POST.get('status')
    order.save()
    return redirect('staff_panel')

@login_required
@staff_member_required
def all_orders_view(request):
    orders = Order.objects.select_related('user').prefetch_related('items__menu_item').order_by('-created_at')
    return render(request, 'all_orders.html', {'orders': orders})

@login_required
def admin_custom_orders(request):
    if not request.user.is_superuser:
        return redirect('home')

    orders = Order.objects.select_related('user').prefetch_related('items__menu_item__reviews').order_by('-created_at')
    return render(request, 'custom_admin_orders.html', {'orders': orders})

@user_passes_test(lambda u: u.is_superuser)
def admin_orders_view(request):
    orders = Order.objects.all().select_related('user')
    return render(request, 'custom_admin_orders.html', {'orders': orders})





