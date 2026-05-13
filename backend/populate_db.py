import os
import django
import random
from datetime import datetime, timedelta
from django.utils import timezone
from django.core.files.base import ContentFile

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import (
    User, Accommodation, AccommodationType, Booking, 
    JobListing, Advertisement, MatrimonialProfile, 
    Article, Event, EventRegistration, SiteSettings
)

def create_dummy_image():
    # Returns a small dummy image as bytes
    return b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

def populate():
    print("Starting population...")

    # 1. Users
    names = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ishaan", "Aaryan", "Shaurya", "Anaya", "Diya", "Saanvi", "Ira", "Myra", "Aadhya", "Kiara", "Zoya", "Riya", "Aavya"]
    cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"]
    
    users = []
    for i in range(20):
        phone = f"98765432{i:02d}"
        name = random.choice(names) + f" {i}"
        user, created = User.objects.get_or_create(
            phone=phone,
            defaults={
                'name': name,
                'email': f"user{i}@example.com",
                'is_active': True,
            }
        )
        if created:
            user.set_password('pass123')
            user.save()
        users.append(user)
    print(f"Created/found {len(users)} users.")

    # 2. Accommodations
    acc_titles = ["Grand Sahu Hostel", "Community Heritage Hall", "Sahu Guest Residency", "Modern Scholars Hostel", "Traditional Community Center"]
    locations = ["Civil Lines", "Main Market", "Near Temple", "Sector 15", "Old City"]
    
    accommodations = []
    for i in range(10):
        acc = Accommodation.objects.create(
            title=f"{random.choice(acc_titles)} {i}",
            description="A comfortable and affordable stay for community members with all basic amenities provided.",
            type=random.choice(AccommodationType.choices)[0],
            badge=random.choice(["Popular", "Highly Rated", "New", "Budget Friendly", None]),
            image=create_dummy_image(),
            image_mimetype="image/png",
            price=random.randint(500, 5000),
            location=f"{random.choice(locations)}, {random.choice(cities)}",
            is_active=True
        )
        accommodations.append(acc)
    print(f"Created {len(accommodations)} accommodations.")

    # 3. Bookings
    for i in range(15):
        user = random.choice(users)
        acc = random.choice(accommodations)
        check_in = timezone.now().date() + timedelta(days=random.randint(1, 30))
        check_out = check_in + timedelta(days=random.randint(1, 5))
        Booking.objects.create(
            accommodation=acc,
            user=user,
            check_in=check_in,
            check_out=check_out,
            guests=random.randint(1, 4),
            status=random.choice(['Pending', 'Confirmed', 'Completed']),
            total_price=acc.price * (check_out - check_in).days
        )
    print("Created 15 bookings.")

    # 4. Job Listings
    job_titles = ["Software Engineer", "Accountant", "Project Manager", "Sales Executive", "Teacher", "Nurse", "Marketing Head"]
    companies = ["Tech Sahu", "Sahu Finance", "Global Solutions", "Education First", "Health Care Plus"]
    
    for i in range(12):
        JobListing.objects.create(
            title=random.choice(job_titles),
            company=random.choice(companies),
            location=random.choice(cities),
            type=random.choice(['Full-time', 'Part-time', 'Remote', 'Contract']),
            description="We are looking for a dedicated professional to join our growing team. Competitive salary and great benefits.",
            apply_link="https://example.com/apply",
            is_active=True
        )
    print("Created 12 job listings.")

    # 5. Advertisements
    for i in range(5):
        Advertisement.objects.create(
            title=f"Special Offer {i}",
            company=random.choice(companies),
            image=create_dummy_image(),
            image_mimetype="image/png",
            description="Don't miss out on this exclusive offer for our community members.",
            link="https://example.com/offer",
            is_active=True
        )
    print("Created 5 advertisements.")

    # 6. Matrimonial Profiles
    occupations = ["Engineer", "Doctor", "Teacher", "Business Owner", "Banker", "Artist", "Software Developer", "Civil Servant"]
    educations = ["B.Tech", "MBBS", "MBA", "M.Com", "PhD", "B.A.", "BCA", "M.Tech"]
    gotras = ['Kashyap', 'Bharadwaj', 'Vashisht', 'Gautam', 'Atri', 'Vishwamitra', 'Jamadagni', 'Shandilya']
    mother_tongues = ["Hindi", "Chhattisgarhi", "Marathi", "Gujarati", "Bengali"]
    income_ranges = ["2-5 LPA", "5-10 LPA", "10-15 LPA", "15-25 LPA", "25+ LPA"]
    
    for user in random.sample(users, 10):
        if not hasattr(user, 'matrimonial_profile'):
            MatrimonialProfile.objects.create(
                user=user,
                age=random.randint(22, 35),
                gender=random.choice(['Male', 'Female']),
                city=random.choice(cities),
                education=random.choice(educations),
                occupation=random.choice(occupations),
                family_type=random.choice(["Nuclear", "Joint"]),
                # New fields
                gotra=random.choice(gotras),
                marital_status=random.choice(['Never Married', 'Divorced', 'Widowed']),
                manglik=random.choice(['Yes', 'No', 'Partial']),
                complexion=random.choice(['Fair', 'Wheatish', 'Dark']),
                height_cm=random.randint(150, 190),
                annual_income=random.choice(income_ranges),
                mother_tongue=random.choice(mother_tongues),
                photo=create_dummy_image(),
                photo_mimetype="image/png",
                bio="Looking for a compatible partner who values family traditions and has a modern outlook on life.",
                is_approved=True
            )
    print("Created 10 matrimonial profiles.")

    # 7. Articles
    categories = ["Magazine", "News", "Announcement"]
    for i in range(8):
        Article.objects.create(
            title=f"Sahu Sabha Monthly Update: {i}",
            content="Detailed information about the latest happenings in our community and upcoming plans for the future.",
            image=create_dummy_image(),
            image_mimetype="image/png",
            category=random.choice(categories),
            is_published=True
        )
    print("Created 8 articles.")

    # 8. Events
    for i in range(6):
        event = Event.objects.create(
            title=f"Community Meetup {i}",
            description="Join us for an evening of networking, cultural activities, and dinner with fellow community members.",
            image=create_dummy_image(),
            image_mimetype="image/png",
            event_date=timezone.now() + timedelta(days=random.randint(5, 60)),
            location=f"Sahu Hall, {random.choice(cities)}",
            registration_link="https://example.com/register-event",
            is_active=True
        )
        # Register some users for each event
        for user in random.sample(users, random.randint(3, 8)):
            EventRegistration.objects.get_or_create(event=event, user=user)
    print("Created 6 events and registrations.")

    # 9. Site Settings
    settings = SiteSettings.load()
    settings.hero_text = "Connecting the Sahu Community Globally"
    settings.hero_subtext = "Your one-stop platform for accommodations, careers, and community bonding."
    settings.save()
    print("Updated site settings.")

    print("Population complete!")

if __name__ == '__main__':
    populate()
