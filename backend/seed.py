import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sahu_backend.settings')
django.setup()

from auth_app.models import User
from accommodation.models import Accommodation, AccommodationType
from career.models import JobListing, Advertisement
from magazine.models import Article
from core.models import SiteSettings

def seed_data():
    print("Seeding database...")

    # Create Superuser
    if not User.objects.filter(phone='admin').exists():
        User.objects.create_superuser('admin', 'Admin User', 'admin123', email='admin@sahusabha.com')
        print("Created superuser admin")

    # Seed Accommodations
    if Accommodation.objects.count() == 0:
        Accommodation.objects.create(
            title="Sahu Vidyarthi Bhavan",
            description="Safe, disciplined, and affordable accommodation for students pursuing higher education.",
            type=AccommodationType.HOSTEL,
            badge="Hostel Facility",
            image="accommodations/event1.png",
            price_label="Starting from",
            price=2500.00,
            unit="/ month",
            location="New Delhi Central"
        )
        Accommodation.objects.create(
            title="Heritage Grand Hall",
            description="A spacious, fully air-conditioned venue perfect for weddings, community gatherings, and large meetings.",
            type=AccommodationType.COMMUNITY_HALL,
            badge="Event Space",
            image="accommodations/event2.png",
            price_label="Member Rate",
            price=15000.00,
            unit="/ day",
            location="Jaipur Heritage"
        )
        Accommodation.objects.create(
            title="Sabha Atithi Griha",
            description="Clean and comfortable short-stay rooms for community members visiting the city.",
            type=AccommodationType.GUEST_ROOMS,
            badge="Accommodation",
            image="accommodations/event3.png",
            price_label="Starting from",
            price=800.00,
            unit="/ night",
            location="Mumbai Suburban"
        )
        print("Seeded Accommodations")

    # Seed Jobs
    if JobListing.objects.count() == 0:
        JobListing.objects.create(
            title="Senior Software Engineer",
            company="TechSahu Solutions",
            location="Bangalore",
            type="Full-time",
            description="Looking for an experienced React/Node.js developer.",
            apply_link="https://example.com/apply"
        )
        JobListing.objects.create(
            title="Marketing Manager",
            company="Sahu Enterprises",
            location="Remote",
            type="Remote",
            description="Drive our digital marketing initiatives.",
            apply_link="https://example.com/apply2"
        )
        print("Seeded Jobs")

    # Seed Articles
    if Article.objects.count() == 0:
        Article.objects.create(
            title="Community Meetup 2024",
            content="Join us for the annual gathering...",
            category="Events"
        )
        Article.objects.create(
            title="Educational Scholarship Program",
            content="Apply for the upcoming scholarships...",
            category="Education"
        )
        print("Seeded Articles")
        
    print("Database seeding completed.")

if __name__ == "__main__":
    seed_data()
