# Generated by Django 5.0 on 2024-03-29 08:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0010_product_buyers'),
    ]

    operations = [
        migrations.DeleteModel(
            name='OrderItem',
        ),
    ]