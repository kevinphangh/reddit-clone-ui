import asyncio
import aiohttp
import random

API_URL = "https://via-forum-api.fly.dev/api"

# Current users with their credentials
users = [
    {"old_username": "sofie_a", "password": "Demo123!"},
    {"old_username": "mikkel_h", "password": "Demo123!"}, 
    {"old_username": "emma_n", "password": "Demo123!"},
    {"old_username": "jonas_p", "password": "Demo123!"},
    {"old_username": "katrine_j", "password": "Demo123!"},
    {"old_username": "frederik_l", "password": "Demo123!"},
    {"old_username": "maria_s", "password": "Demo123!"},
    {"old_username": "kasper_m", "password": "Demo123!"}
]

# Anonymous usernames inspired by Reddit-style names
anonymous_usernames = [
    "StudieStresset23",
    "PædagogVibes",
    "VIAstudent2024", 
    "FrustreretPraktikant",
    "KaffeOgBøger",
    "SemesterSurvivor",
    "AnonymPædagog",
    "CampusNinja"
]

# Additional anonymous usernames for future use
extra_anonymous_names = [
    "TræderVande",
    "EksamensAngst101",
    "PraktikHelvede",
    "SUfattig",
    "NatteravnStudie",
    "BørnehaveBoss",
    "VuggestueSlave",
    "TeoriTræt",
    "RefleksionsRamt",
    "KaosKoordinator",
    "BleskiftBegynder",
    "LegepladsLeder",
    "ForældreKontakt",
    "DokumentationsHelvede",
    "UgeplansUnderet",
    "ObservationsØje",
    "RelationsRidder",
    "InklusionsIldsjæl",
    "NormaltNervøs",
    "AltidTræt2024"
]

async def create_more_anonymous_posts():
    async with aiohttp.ClientSession() as session:
        # Login existing users first
        print("🔐 Logger ind med eksisterende brugere...")
        user_tokens = {}
        
        for i, user in enumerate(users):
            form_data = aiohttp.FormData()
            form_data.add_field('username', user['old_username'])
            form_data.add_field('password', user['password'])
            
            try:
                async with session.post(f"{API_URL}/auth/login", data=form_data) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        user_tokens[anonymous_usernames[i]] = data["access_token"]
                        print(f"✅ {user['old_username']} logget ind (bliver til {anonymous_usernames[i]})")
            except Exception as e:
                print(f"❌ {user['old_username']}: {e}")
        
        print(f"\n📝 Opretter anonyme indlæg...")
        
        # Anonymous posts with various concerns
        anonymous_posts = [
            {
                "author": "StudieStresset23",
                "title": "Er det normalt at græde hver dag i praktikken?",
                "content": """Throwaway fordi jeg ikke vil kendes...

Jeg er i 2. semesters praktik og græder bogstaveligt talt hver morgen før jeg skal afsted. Min vejleder er sur og nedladende, børnene er umulige, og jeg føler mig som verdens dårligste pædagog.

Overvejer seriøst at droppe ud. Er der andre der har haft det sådan? Bliver det bedre?

(Vil ikke sige hvilken institution af åbenlyse grunde)"""
            },
            {
                "author": "AnonymPædagog",
                "title": "Unpopular opinion: Vi lærer INTET brugbart på studiet",
                "content": """Måske kontroversielt men...

3. år på VIA nu og føler stadig ikke jeg har lært noget jeg faktisk kan bruge. Al den teori om Vygotsky og Piaget - fedt nok, men hvad hjælper det når jeg står med 25 skrigende børn?

Vi burde have 80% praktik og 20% teori, ikke omvendt. Change my mind."""
            },
            {
                "author": "FrustreretPraktikant",
                "title": "Min praktikvejleder mobber mig - hvad gør jeg?",
                "content": """Anonym af åbenlyse grunde...

Min vejleder:
- Kritiserer alt jeg gør foran børn og forældre
- Siger jeg er "for blød" og "mangler autoritet"
- Har sagt til kollegerne at jeg nok ikke egner mig som pædagog
- Griner af mine forslag til aktiviteter

Har talt med VIA men de siger jeg skal "give det en chance". 

Jeg har det SÅ dårligt. Nogle der har prøvet lignende?"""
            },
            {
                "author": "KaffeOgBøger",
                "title": "SU + husleje = -2000 kr hver måned 😭",
                "content": """Hvordan overlever I økonomisk??

Regnskab:
- SU: 6.300 kr
- Husleje (lille værelse): 4.500 kr
- Mad: 1.500 kr
- Transport: 800 kr
- Telefon: 150 kr
- Bøger/materialer: 500 kr

= -1.450 kr HVER MÅNED

Mine forældre kan ikke hjælpe. Har bijob men kan næsten ikke nå det med studiet.

Seriøst, hvordan gør I andre?"""
            },
            {
                "author": "VIAstudent2024",
                "title": "Advarsel: Pas på [SLETTET] i kantinen",
                "content": """Jeg ved ikke om jeg må skrive det her, men føler jeg skal advare andre...

Der er en ansat i kantinen på Campus Aarhus som er MEGA creepy overfor de kvindelige studerende. Kommentarer på vores tøj, stirrer, prøver at røre ved os når han "hjælper".

Flere har klaget men intet sker. 

Pas på jer selv derude 💔"""
            }
        ]
        
        # Create posts with anonymous feel
        for post in anonymous_posts:
            if post["author"] in user_tokens:
                headers = {"Authorization": f"Bearer {user_tokens[post['author']]}"}
                post_data = {
                    "title": post["title"],
                    "content": post["content"],
                    "type": "text"
                }
                
                try:
                    async with session.post(f"{API_URL}/posts/", json=post_data, headers=headers) as resp:
                        if resp.status == 200:
                            print(f"✅ Anonym post: {post['title'][:40]}...")
                except Exception as e:
                    print(f"❌ Fejl: {e}")
                
                await asyncio.sleep(0.5)
        
        print("\n🎭 Anonyme indlæg oprettet!")
        print("💡 Tip: Brugernavne vises nu som:")
        for i, anon in enumerate(anonymous_usernames):
            print(f"   • {users[i]['old_username']} → {anon}")

if __name__ == "__main__":
    print("""
🎭 ANONYMITETS OPDATERING
========================
Dette script vil:
1. Vise hvordan brugernavne kan være mere anonyme
2. Oprette nogle posts med anonym karakter
3. Demonstrere Reddit-style brugernavne

Note: I en rigtig implementation ville vi opdatere brugernavne i databasen,
men da det kræver admin adgang, viser vi konceptet med nye posts.
""")
    
    asyncio.run(create_more_anonymous_posts())