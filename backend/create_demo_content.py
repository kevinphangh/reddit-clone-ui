import asyncio
import aiohttp
import json
from datetime import datetime, timezone, timedelta
import random

API_URL = "https://via-forum-api.fly.dev/api"

# Demo users that don't require email verification
users = [
    {"username": "demo_sofie", "email": "sofie@demo.test", "password": "Demo123!", "display_name": "Sofie A. (Demo)"},
    {"username": "demo_mikkel", "email": "mikkel@demo.test", "password": "Demo123!", "display_name": "Mikkel H. (Demo)"},
    {"username": "demo_emma", "email": "emma@demo.test", "password": "Demo123!", "display_name": "Emma N. (Demo)"},
    {"username": "demo_jonas", "email": "jonas@demo.test", "password": "Demo123!", "display_name": "Jonas P. (Demo)"},
    {"username": "demo_katrine", "email": "katrine@demo.test", "password": "Demo123!", "display_name": "Katrine J. (Demo)"},
]

# Simplified posts for demo
posts = [
    {
        "author": "demo_sofie",
        "title": "Føler mig overvældet i min første praktik - er det normalt?",
        "content": "Jeg er på 2. semester og lige startet praktik. Børnene græder konstant, og jeg føler mig utilstrækkelig. Er det normalt at føle sig så overvældet i starten?",
    },
    {
        "author": "demo_mikkel",
        "title": "Som mandlig pædagogstuderende møder jeg mange fordomme",
        "content": "Vi er kun 3 mænd ud af 45 på holdet. Får ofte kommentarer om at det ikke er et 'rigtigt mandefag'. Det er frustrerende når samfundet skriger efter mandlige pædagoger, men vi mødes med skepsis.",
    },
    {
        "author": "demo_emma",
        "title": "Er pædagoguddannelsen akademisk nok?",
        "content": "Kontroversiel mening: Jeg synes niveauet er for lavt. Vi bruger for meget tid på refleksion og for lidt på reel faglighed. Mine venner på uni griner af hvor lidt jeg læser. Burde vi ikke stille højere krav?",
    },
    {
        "author": "demo_jonas",
        "title": "Startløn 28.000 kr - kan man leve af det?",
        "content": "Har lige regnet på økonomien efter uddannelsen. Mine venner der blev håndværkere tjener 40.000+. Elsker at arbejde med børn, men overvejer at droppe ud pga lønnen. Er jeg den eneste?",
    },
    {
        "author": "demo_katrine",
        "title": "Min praktikplads bruger forældet pædagogik - hvad gør jeg?",
        "content": "De kører gammeldags 'voksenstyret' pædagogik. Alt det vi lærer om børneperspektiv og medbestemmelse? Glem det! Føler jeg svigter min faglighed. Hjælp!",
    }
]

async def test_api():
    """Test if API is accessible"""
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{API_URL}/health") as resp:
                if resp.status == 200:
                    print("✅ API is healthy")
                    return True
                else:
                    print(f"❌ API returned status {resp.status}")
                    return False
        except Exception as e:
            print(f"❌ Could not connect to API: {e}")
            return False

async def create_content():
    # First test API
    if not await test_api():
        print("Cannot proceed without working API")
        return
        
    async with aiohttp.ClientSession() as session:
        print("\nAttempting to create demo content...")
        print("Note: This may fail if email verification is required")
        print("Consider using the admin panel or database directly instead\n")
        
        # Try to create one test user
        test_user = users[0]
        try:
            async with session.post(f"{API_URL}/auth/register", json=test_user) as resp:
                if resp.status == 200:
                    print(f"✅ Successfully created user: {test_user['username']}")
                    print("Email verification might be disabled - continuing...")
                else:
                    text = await resp.text()
                    print(f"❌ Registration failed: {text}")
                    print("\nEmail verification is likely required.")
                    print("To add demo content, you can:")
                    print("1. Temporarily disable email verification")
                    print("2. Use the database directly")
                    print("3. Create accounts manually with real emails")
                    return
        except Exception as e:
            print(f"❌ Error creating user: {e}")
            return

if __name__ == "__main__":
    asyncio.run(create_content())