import asyncio
import aiohttp

API_URL = "https://via-forum-api.fly.dev/api"

# Admin user credentials - you'll need to create an admin user first
# For now, let's use a regular user and delete their own posts
users = [
    {"username": "sofie_a", "password": "Demo123!"},
    {"username": "mikkel_h", "password": "Demo123!"}, 
    {"username": "emma_n", "password": "Demo123!"},
    {"username": "jonas_p", "password": "Demo123!"},
    {"username": "katrine_j", "password": "Demo123!"},
    {"username": "frederik_l", "password": "Demo123!"},
    {"username": "maria_s", "password": "Demo123!"},
    {"username": "kasper_m", "password": "Demo123!"}
]

async def delete_all_posts():
    async with aiohttp.ClientSession() as session:
        print("🔐 Logger ind som brugere...")
        
        deleted_count = 0
        
        for user in users:
            # Login
            form_data = aiohttp.FormData()
            form_data.add_field('username', user['username'])
            form_data.add_field('password', user['password'])
            
            try:
                async with session.post(f"{API_URL}/auth/login", data=form_data) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        token = data["access_token"]
                        headers = {"Authorization": f"Bearer {token}"}
                        
                        # Get user's posts
                        async with session.get(f"{API_URL}/users/{user['username']}/posts", headers=headers) as resp:
                            if resp.status == 200:
                                posts = await resp.json()
                                
                                # Delete each post
                                for post in posts:
                                    try:
                                        async with session.delete(f"{API_URL}/posts/{post['id']}/", headers=headers) as del_resp:
                                            if del_resp.status == 200:
                                                deleted_count += 1
                                                print(f"❌ Slettet post: {post['title'][:50]}...")
                                            else:
                                                print(f"⚠️  Kunne ikke slette post {post['id']}")
                                    except Exception as e:
                                        print(f"⚠️  Fejl ved sletning: {e}")
                                    
                                    await asyncio.sleep(0.2)  # Be nice to the server
                                
                                print(f"✅ {user['username']}: {len(posts)} posts behandlet")
                    else:
                        print(f"❌ Kunne ikke logge ind som {user['username']}")
            except Exception as e:
                print(f"❌ Fejl for {user['username']}: {e}")
        
        print(f"\n🧹 Rydningsproces færdig!")
        print(f"📊 Slettet i alt: {deleted_count} posts")
        print(f"\n✨ Forummet er nu tomt og klar til nye posts!")

if __name__ == "__main__":
    print("""
🗑️  SLET ALLE POSTS
==================
Dette script vil:
1. Logge ind som hver demo bruger
2. Hente deres posts
3. Slette alle posts én efter én

⚠️  Starter sletning...
""")
    
    asyncio.run(delete_all_posts())