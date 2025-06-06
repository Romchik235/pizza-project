from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# --- Кастомна модель користувача ---
class CustomUser(AbstractUser):
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username
    
# --- Відгуки ---
class Review(models.Model):
    menu_item = models.ForeignKey('MenuItem', related_name='reviews', on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    user = models.ForeignKey('api.CustomUser', on_delete=models.SET_NULL, null=True, blank=True)
 
# --- Категорія піци ---
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# --- Меню ---
class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
# --- Замовлення ---
# class Order(models.Model):
#     DELIVERY_CHOICES = [
#         ('pickup', 'Самовивіз'),
#         ('delivery', 'Доставка'),
#     ]

#     STATUS_CHOICES = [
#         ('Очікує', 'Очікує'),
#         ('Виконано', 'Виконано'),
#     ]

#     user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
#     phone = models.CharField(max_length=20)
#     address = models.CharField(max_length=255, blank=True)
#     comment = models.TextField(blank=True)
#     delivery_type = models.CharField(max_length=20, choices=DELIVERY_CHOICES)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Очікує')
#     created_at = models.DateTimeField(auto_now_add=True)

#     @property
#     def total_sum(self):
#         return sum(item.menu_item.price * item.quantity for item in self.items.all())
    
#     def __str__(self):
#         return f"Замовлення #{self.pk} ({self.phone})"
    
#     estimated_time = models.PositiveIntegerField(default=30)  # в хвилинах
    

# --- Товари в замовленні ---
# class OrderItem(models.Model):
#     order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
#     menu_item = models.ForeignKey(MenuItem, related_name='order_items', on_delete=models.CASCADE)
#     quantity = models.IntegerField(default=1)

class Order(models.Model):
    DELIVERY_CHOICES = (
        ("delivery", "Доставка"),
        ("pickup",   "Самовивіз"),
    )

    user           = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="orders",
    )
    name           = models.CharField(max_length=120)
    phone          = models.CharField(max_length=20)
    address        = models.CharField(max_length=255, blank=True)
    description   = models.TextField(blank=True)
    total_sum     = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    delivery_type  = models.CharField(max_length=10, choices=DELIVERY_CHOICES)
    estimated_time = models.PositiveIntegerField()          # це передає час очікування приблизний в хвлиниха
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id} — {self.name} — {self.total_sum} грн"

class OrderItem(models.Model):
    order      = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    menu_item  = models.ForeignKey("MenuItem", on_delete=models.PROTECT)
    quantity   = models.PositiveIntegerField(default=1)
    price      = models.DecimalField(max_digits=8, decimal_places=2)  # ціна од., зExtras

    def __str__(self):
        return f"{self.menu_item.name} ×{self.quantity}"
