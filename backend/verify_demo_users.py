import asyncio
import aiohttp

API_URL = "https://via-forum-api.fly.dev/api"

# Admin credentials (you need to create an admin user first)
# For now, let's use a workaround by updating the database directly

async def verify_all_demo_users():
    print("🔧 Verificerer demo brugere...")
    
    # Since we can't directly update the database from here,
    # let's create a special endpoint or use the verify endpoint
    
    # Get all users that need verification
    usernames = ["sofie_a", "mikkel_h", "emma_n", "jonas_p", "katrine_j", "frederik_l", "maria_s", "kasper_m"]
    
    print("\n⚠️  Problem: Brugerne skal verificeres før de kan logge ind.")
    print("\n📋 Løsninger:")
    print("1. Midlertidigt slå email verifikation check fra i login endpoint")
    print("2. Manuelt verificere brugerne i databasen")
    print("3. Bruge verify endpoint med de rigtige tokens")
    
    print("\n🔨 Anbefaling: Opdater login endpoint til at ignorere email verifikation når EMAIL_DEV_MODE=true")

if __name__ == "__main__":
    asyncio.run(verify_all_demo_users())