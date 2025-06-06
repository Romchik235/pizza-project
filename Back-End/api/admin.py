from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Category, MenuItem, Order, OrderItem, Review

class CustomUserAdmin(UserAdmin):
    model = CustomUser

    # Додаємо поле phone у форму редагування
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone',)}),
    )

    # Додаємо відображення в таблиці
    list_display = ['username', 'email', 'phone', 'is_staff']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'rating', 'comment', 'menu_item')
    search_fields = ('user__username', 'comment')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Category)
admin.site.register(MenuItem)
admin.site.register(Order)
admin.site.register(OrderItem)
# admin.site.register(Review)

