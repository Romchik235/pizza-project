from django.urls import path, include
from .views import (
    admin_custom_orders, login_view, password_reset_view, register_view, home_view,
    submit_review, submit_order,
    staff_panel, update_order_status,
    CategoryViewSet, MenuItemViewSet, OrderViewSet, ReviewViewSet,
    all_orders_view,
)

from rest_framework.routers import DefaultRouter
from .views import all_orders_view
from . import views

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'menu-items', MenuItemViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', home_view, name='home'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('reset/', password_reset_view, name='password_reset'),
    # path('review/', review_form_view, name='review_form'),
    path('submit-review/', submit_review, name='submit_review'),
    # path('submit-order/', submit_order, name='submit_order'),
    path('panel/', staff_panel, name='staff_panel'),
    path('panel/update-order-status/<int:order_id>/', update_order_status, name='update_order_status'),
    path('api/', include(router.urls)),
    path('all-orders/', all_orders_view, name='all_orders'),
    path('custom-orders/', admin_custom_orders, name='admin_custom_orders'),
    path('lav_orders/', views.admin_orders_view, name='admin_orders'),
    path("submit_order/", views.submit_order, name="submit_order")
]
