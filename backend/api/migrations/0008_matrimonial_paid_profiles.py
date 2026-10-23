from django.db import migrations, models


def activate_existing_profiles(apps, schema_editor):
    # Admin approval is gone: every profile that existed before paid creation stays live, approved or not
    apps.get_model('api', 'MatrimonialProfile').objects.update(is_active=True)


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_membership_application'),
    ]

    operations = [
        migrations.RenameField(
            model_name='matrimonialprofile',
            old_name='is_approved',
            new_name='is_active',
        ),
        migrations.AddField(
            model_name='matrimonialprofile',
            name='amount_paid',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True),
        ),
        migrations.AddField(
            model_name='matrimonialprofile',
            name='razorpay_order_id',
            field=models.CharField(blank=True, db_index=True, default='', max_length=64),
        ),
        migrations.AddField(
            model_name='matrimonialprofile',
            name='razorpay_payment_id',
            field=models.CharField(blank=True, default='', max_length=64),
        ),
        migrations.AddField(
            model_name='matrimonialprofile',
            name='paid_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.RunPython(activate_existing_profiles, migrations.RunPython.noop),
    ]
