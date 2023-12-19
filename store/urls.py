from django.urls import path
from .views import StoreView, CartView, SignupView, LoginView, ChangePasswordView, UserProfileView, AddProductView, UserInventoryView, ProductEditView,AddToCartView, UpdateProductStatus, YourSoldProductsView, YourBoughtProductsView, ProductSearchView, populate_database

urlpatterns = [
    path('api/store/', StoreView.as_view(), name='api-store'),
    path('api/cart/', CartView.as_view(), name='api-cart'),
    path('api/signup/', SignupView.as_view(), name='api-signup'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('api/user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/add-product/', AddProductView.as_view(), name='add-product'),
    path('api/user-inventory/', UserInventoryView.as_view(), name='user-inventory'),
    path('api/edit-product/<int:pk>/', ProductEditView.as_view(), name='edit-product'),
    path('api/add-to-cart/<int:pk>/', AddToCartView.as_view(), name='add-to-cart'),
    path('api/update-status/<int:pk>/', UpdateProductStatus.as_view(), name='update-status'),
    path('api/user-bought-products/', YourBoughtProductsView.as_view(), name='user-bought-products'),
    path('api/user-sold-products/', YourSoldProductsView.as_view(), name='user-sold-products'),
    path('api/store/search/', ProductSearchView.as_view(), name='store-search'),
    path('populate_database/', populate_database, name='populate_database'),
]