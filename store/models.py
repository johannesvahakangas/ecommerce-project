from django.db import models
from django.contrib.auth.models import User

class Customer(models.Model):
    # one to one relationship, means one user can have only one customer
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)

    # null = True, if the user is deleted, customer will be deleted
    name = models.CharField(max_length=200, null=True)
    email = models.CharField(max_length=200, null=True)
    def __str__(self):
        return self.name

class Product(models.Model):

    ON_SALE = 'on_sale'
    SOLD = 'sold'
    PURCHASED = 'purchased'
    STATUS_CHOICES = [
        (ON_SALE, 'On Sale'),
        (SOLD, 'Sold'),
        (PURCHASED, 'Purchased'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.FloatField()

    image = models.ImageField(upload_to='', null=True, blank=True) 
    date_created = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    buyers = models.ManyToManyField(User, related_name='purchased_products', blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=ON_SALE)

    def is_purchased_by_user(self, user):
        """Check if the product was purchased by the given user."""
        return self.buyers.filter(id=user.id).exists()

    def get_status_for_user(self, user):
        """Get the product's status for a specific user."""
        if self.owner == user:
            return self.status
        elif self.is_purchased_by_user(user):
            return 'Purchased'
        else:
            return 'On Sale'

    def __str__(self):
        return self.title

    