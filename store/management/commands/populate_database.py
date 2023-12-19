from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from store.models import Product 

class Command(BaseCommand):
    help = 'Populates the database with users and products'

    @transaction.atomic
    def handle(self, *args, **options):
        # Empty the database
        User.objects.all().delete()
        Product.objects.all().delete()

        # Create users
        for i in range(1, 7):
            user = User.objects.create_user(
                username=f'testuser{i}',
                password=f'pass{i}',
                email=f'testuser{i}@shop.aa'
            )

            if i <= 3:
                for j in range(1, 11):
                    Product.objects.create(
                        title=f'Item {j} by {user.username}',
                        owner=user, 
                        price=10.00 
                    )

        self.stdout.write(self.style.SUCCESS('Database populated!'))


