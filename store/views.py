from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, update_session_auth_hash
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product
from .serializers import ProductSerializer, UserSerializer, User
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods
from django.core.management import call_command
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
from django.urls import reverse

@csrf_exempt
@require_http_methods(["POST"])
def populate_database(request):
    call_command('populate_database')
    return HttpResponseRedirect(reverse('api-store') + '?populated=true')

class ProductSearchView(APIView):
    def get(self, request):
        search_term = request.query_params.get('search', None)
        if search_term:
            products = Product.objects.filter(title__icontains=search_term)
        else:
            products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
class YourSoldProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(owner=user, buyers__isnull=False).distinct()

class YourBoughtProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.purchased_products.all()
class UpdateProductStatus(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        product = get_object_or_404(Product, pk=pk)

        #if the current user is the owner
        if product.owner == request.user:
            return Response({'detail': 'Owners cannot purchase their own products.'}, status=status.HTTP_403_FORBIDDEN)

        #if the product is already sold
        if product.status == Product.SOLD:
            return Response({'detail': 'This product is already sold.'}, status=status.HTTP_400_BAD_REQUEST)
        
        product.status = Product.SOLD
        product.buyers.add(request.user) 
        product.save()

        return Response(ProductSerializer(product, context={'request': request}).data)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        if product.owner == request.user:
            return Response({'error': 'This is your own product. You cannot add your own product to the cart...'}, status=status.HTTP_403_FORBIDDEN)
        if product.status != Product.ON_SALE:
            return Response({'error': 'This product is not for sale...'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'message': 'Product added to cart!'})
    
class ProductEditView(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        product = serializer.instance
        if product.owner != self.request.user:
            raise PermissionDenied("You do not have permission to edit products that you dont own.")
        serializer.save()

class UserInventoryView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(owner=user)

    def get_serializer_context(self):
        return {'request': self.request}

class AddProductView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            "name": user.username,
            "email": user.email,
        })
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]  # only authenticated

    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response({"error": "Wrong password."}, status=403)
        
        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)  # users cannot be logged out
        
        return Response({"success": "Password changed successfully."}, status=200)

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        #Only username and password
        user = authenticate(request, username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid Username or Password'
            }, status=status.HTTP_400_BAD_REQUEST)

class SignupView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class StoreView(APIView):
    permission_classes = [AllowAny]  #Access to everyone
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            customer = request.user.customer
        except AttributeError:
            return Response({'error': 'Customer not found'}, status=404)

        order = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.items.all()
        return Response({
            'order': OrderSerializer(order).data,
            'items': OrderItemSerializer(items, many=True).data
        })
    