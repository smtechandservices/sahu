import os
import django
import random
from django.utils import timezone

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import User, Event, EventRegistration

def seed_registrations():
    print("Seeding Event Registrations...")
    users = list(User.objects.all())
    events = list(Event.objects.all())
    
    if not users or not events:
        print("Error: Need users and events to seed registrations.")
        return

    count = 0
    for event in events:
        # Register 3-7 random users for each event
        num_to_register = min(len(users), random.randint(3, 7))
        selected_users = random.sample(users, num_to_register)
        
        for user in selected_users:
            registration, created = EventRegistration.objects.get_or_create(
                event=event,
                user=user
            )
            if created:
                count += 1
    
    print(f"Successfully created {count} new event registrations!")

if __name__ == "__main__":
    seed_registrations()
