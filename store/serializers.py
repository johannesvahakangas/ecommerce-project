from rest_framework import serializers
from .models import Product, Customer
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Product

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProductSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    buyers = serializers.SlugRelatedField(many=True, read_only=True, slug_field='username')
    status_for_user = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'image', 'date_created', 'owner_username', 'buyers', 'status_for_user']
        read_only_fields = ['date_created', 'status_for_user']

    def get_status_for_user(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if user.is_authenticated:
                # Owner sees sold if there are buyers
                if user == obj.owner:
                    return 'Sold' if obj.buyers.exists() else 'On Sale'
                #Purchased for the buyer
                elif obj.buyers.filter(id=user.id).exists():
                    return 'Purchased'
        return obj.status

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
