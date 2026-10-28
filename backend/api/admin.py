from django.contrib import admin
from .models import (
    User, OTPRecord, Accommodation, Booking,
    JobListing, Advertisement, MatrimonialProfile, MatrimonialInterest, MembershipApplication,
    Article, Event, EventRegistration,
    HeroCarouselImage, Media, SiteSettings, UserSession, Donation
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('phone', 'name', 'email', 'is_member', 'is_admin', 'is_staff', 'date_joined')
    list_filter = ('is_member', 'is_admin', 'is_staff', 'is_active')
    search_fields = ('phone', 'name', 'email')

@admin.register(OTPRecord)
class OTPRecordAdmin(admin.ModelAdmin):
    list_display = ('phone', 'code', 'created_at', 'is_used')
    list_filter = ('is_used',)
    search_fields = ('phone',)

@admin.register(Accommodation)
class AccommodationAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'location', 'price', 'is_active')
    list_filter = ('type', 'is_active')
    search_fields = ('title', 'location')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'accommodation', 'check_in', 'check_out', 'status')
    list_filter = ('status',)
    search_fields = ('user__name', 'user__phone', 'accommodation__title')

@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'type', 'is_active')
    list_filter = ('type', 'is_active')
    search_fields = ('title', 'company')

@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'company')

@admin.register(MatrimonialProfile)
class MatrimonialProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'age', 'city', 'marital_status', 'gotra', 'manglik', 'is_active', 'amount_paid', 'created_at')
    list_filter = ('gender', 'is_active', 'marital_status', 'manglik', 'complexion')
    search_fields = ('user__name', 'user__phone', 'city', 'gotra')

@admin.register(MembershipApplication)
class MembershipApplicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'amount', 'status', 'user', 'created_at', 'paid_at')
    list_filter = ('status', 'amount')
    search_fields = ('name', 'phone', 'aadhaar_number', 'razorpay_order_id', 'razorpay_payment_id')
    readonly_fields = ('razorpay_order_id', 'razorpay_payment_id', 'created_at', 'paid_at')

@admin.register(MatrimonialInterest)
class MatrimonialInterestAdmin(admin.ModelAdmin):
    list_display = ('from_profile', 'to_profile', 'created_at')
    search_fields = ('from_profile__user__name', 'to_profile__user__name')

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'published_at', 'is_published')
    list_filter = ('category', 'is_published')
    search_fields = ('title',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_date', 'location', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'location')

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'registered_at')
    search_fields = ('user__name', 'user__phone', 'event__title')

@admin.register(HeroCarouselImage)
class HeroCarouselImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'is_active', 'created_at')
    list_filter = ('is_active',)

@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ('title', 'media_type', 'year', 'is_active', 'created_at')
    list_filter = ('media_type', 'year', 'is_active')
    search_fields = ('title',)

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('hero_text', 'contact_email', 'contact_phone')

@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'device_name', 'ip_address', 'is_active', 'created_at', 'last_activity')
    list_filter = ('is_active',)
    search_fields = ('user__name', 'user__phone', 'device_name', 'ip_address')

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'amount', 'purpose', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'purpose', 'payment_method')
    search_fields = ('name', 'phone', 'email', 'transaction_ref')
