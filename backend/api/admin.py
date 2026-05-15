from django.contrib import admin
from .models import (
    User, OTPRecord, Accommodation, Booking, 
    JobListing, Advertisement, MatrimonialProfile, 
    Article, SiteSettings
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('phone', 'name', 'is_member', 'is_admin', 'is_staff')
    search_fields = ('phone', 'name')

@admin.register(OTPRecord)
class OTPRecordAdmin(admin.ModelAdmin):
    list_display = ('phone', 'code', 'created_at', 'is_used')

@admin.register(Accommodation)
class AccommodationAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'location', 'price', 'is_active')
    list_filter = ('type', 'is_active')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'accommodation', 'check_in', 'check_out', 'status')
    list_filter = ('status',)

@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'type', 'is_active')
    list_filter = ('type', 'is_active')

@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'is_active')

@admin.register(MatrimonialProfile)
class MatrimonialProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'age', 'city', 'marital_status', 'gotra', 'is_approved')
    list_filter = ('gender', 'is_approved', 'marital_status', 'manglik')
    search_fields = ('user__name', 'user__phone', 'city', 'gotra')

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'published_at', 'is_published')
    list_filter = ('category', 'is_published')

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('hero_text', 'contact_email')
