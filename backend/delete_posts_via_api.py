import asyncio
import aiohttp

API_URL = "https://via-forum-api.fly.dev/api"

async def delete_all_posts_simple():
    async with aiohttp.ClientSession() as session:
        print("🔍 Henter alle posts...")
        
        # Get all posts without authentication
        async with session.get(f"{API_URL}/posts/?limit=100") as resp:
            if resp.status == 200:
                posts = await resp.json()
                print(f"📊 Fundet {len(posts)} posts")
                
                if len(posts) == 0:
                    print("✨ Forummet er allerede tomt!")
                    return
                
                # Group posts by author
                posts_by_author = {}
                for post in posts:
                    author = post['author']['username']
                    if author not in posts_by_author:
                        posts_by_author[author] = []
                    posts_by_author[author].append(post)
                
                print(f"\n📝 Posts fordelt på {len(posts_by_author)} brugere:")
                for author, author_posts in posts_by_author.items():
                    print(f"   • {author}: {len(author_posts)} posts")
                
                print("\n⚠️  BEMÆRK: Dette script kan ikke slette posts automatisk")
                print("📋 For at slette posts skal du:")
                print("   1. Logge ind som hver bruger på https://via-paedagoger.vercel.app")
                print("   2. Gå til dine egne posts")
                print("   3. Slette dem manuelt")
                print("\n💡 Alternativt kan en admin slette posts direkte i databasen")
            else:
                print(f"❌ Kunne ikke hente posts: {resp.status}")

if __name__ == "__main__":
    print("""
📊 POSTS OVERSIGT
=================
Dette script viser alle posts i forummet.
""")
    
    asyncio.run(delete_all_posts_simple())