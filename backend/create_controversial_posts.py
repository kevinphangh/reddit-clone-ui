import asyncio
import aiohttp
import random
from datetime import datetime, timedelta

API_URL = "https://via-forum-api.fly.dev/api"

# Use existing users
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

# Controversial posts
controversial_posts = [
    {
        "author": "katrine_j",
        "title": "Diagnose-inflation: Gør vi børn til patienter i stedet for at fikse systemet?",
        "content": """Jeg er i praktik i en børnehave hvor HALVDELEN af børnene enten har eller er ved at blive udredt for ADHD, autisme eller andet.

Er det virkelig realistisk? Eller er det bare nemmere at give børn en diagnose end at erkende at vi har:
- Alt for få voksne pr barn
- Alt for lidt plads
- Alt for meget larm og kaos
- Alt for lidt tid til det enkelte barn

Jeg ser børn der bliver "problematiseret" fordi de ikke kan sidde stille i 45 minutter til samling. HELLO? De er 4 år gamle!

Gør vi børn til patienter fordi systemet fejler? Diskuter!""",
        "comments": [
            {
                "author": "maria_s",
                "content": "ENDELIG siger nogen det højt! Vi har 28 børn til 3 voksne. Selvfølgelig er der uro. Men nej, det må være børnenes fejl 🙄"
            },
            {
                "author": "jonas_p",
                "content": "Hold nu op. Diagnoser redder liv! Jeg fik selv ADHD diagnose som 20-årig og ønsker jeg havde fået den tidligere. Stop med at stigmatisere!"
            },
            {
                "author": "emma_n",
                "content": "Både og! Nogle børn har brug for diagnose og hjælp. Men Katrine har ret i at normeringerne er en joke. Vi kan ikke fikse samfundsproblemer med diagnoser."
            }
        ]
    },
    {
        "author": "mikkel_h",
        "title": "\"Curling-forældre\" eller bare engagerede? Hvor går grænsen?",
        "content": """Okay, jeg må bare få det ud: Nogle forældre er HELT umulige!

Eksempel fra i går:
- Mor skriver 15 beskeder i Aula fordi Lille-Magnus havde fået mudder på bukserne
- Far kræver daglig rapport om hvad hans datter har spist (ned til antal gulerødder)
- Forældre der ringer og klager over at deres barn ikke får nok "udfordringer" (barnet er 3 år!)

Men når jeg lufter min frustration, får jeg at vide at "det er bare engagerede forældre" og at jeg skal "møde dem hvor de er".

Hvornår er nok nok? Er det curling eller er jeg bare utålmodig?""",
        "comments": [
            {
                "author": "sofie_a",
                "content": "Jeg har en mor der vil have billeder HVER DAG af hendes barn. Hvis jeg glemmer det, ringer hun til lederen. Det er vanvid!"
            },
            {
                "author": "frederik_l",
                "content": "Måske forstår I ikke presset moderne forældre er under? De skal præstere på job OG være perfekte forældre. Cut them some slack."
            },
            {
                "author": "katrine_j",
                "content": "Der er forskel på engagerede og kontrolfreaks. Nogle forældre behandler os som servicepersonale, ikke professionelle."
            }
        ]
    },
    {
        "author": "emma_n",
        "title": "Berøringsangst: Må man overhovedet kramme et grædende barn mere?",
        "content": """Seriøst spørgsmål: Er I også blevet bange for at trøste børn fysisk?

Min praktik har "no touch policy" medmindre barnet selv beder om det. Et 3-årigt barn stod og græd i går efter mor var gået. Jeg ville instinktivt tage hende op og kramme, men...

Jeg stod bare der. Bange for at blive misforstået. Bange for anklager. Bange for at gøre noget forkert.

Er det kun mig der føler at frygtkulturen ødelægger vores fag? Børn har BRUG for fysisk tryghed og omsorg!

Hvor pokker er vi på vej hen?""",
        "comments": [
            {
                "author": "kasper_m",
                "content": "Som mand i faget er det 100x værre. Jeg rører ALDRIG ved børnene medmindre det er absolut nødvendigt. Det er trist men sådan er virkeligheden."
            },
            {
                "author": "maria_s",
                "content": "Jeg krammer altid! Hvis et barn har brug for trøst, får de det. Lad folk anklage mig - min faglighed står jeg ved."
            },
            {
                "author": "jonas_p",
                "content": "Vi skal beskytte både børn OG os selv. Find en balance - trøst verbalt først, fysisk hvis nødvendigt, og altid synligt for kolleger."
            }
        ]
    },
    {
        "author": "sofie_a",
        "title": "Er vi blevet \"skolelærere light\"? Hvor blev legen og magien af?",
        "content": """Jeg er SÅ frustreret!

Min dag består af:
- Sprogvurderinger
- Læreplaner
- Dokumentation
- "Skoleparathed"
- Test af motorik
- Ugeplaner der skal overholdes

Hvor blev den frie leg af? Hvor blev fordybelsen af? Hvor blev BARNDOMMEN af?

Vi er blevet små-skoler der skal gøre børn "klar" til noget andet, i stedet for at lade dem være børn HER OG NU.

Jeg blev ikke pædagog for at være discount-skolelærer. Jeg blev pædagog for at skabe magi, leg og udvikling gennem RELATIONER, ikke gennem tjeklister.

Er jeg den eneste der savner det "rigtige" pædagogarbejde?""",
        "comments": [
            {
                "author": "frederik_l",
                "content": "PREACH! 🙌 Vi bruger mere tid på iPad'en til dokumentation end på gulvet med børnene. Det er fuldstændig absurd."
            },
            {
                "author": "emma_n",
                "content": "Men dokumentation er også vigtigt? Hvordan skal vi ellers vise at det vi gør virker? Vi skal være professionelle."
            },
            {
                "author": "katrine_j",
                "content": "Man kan godt dokumentere OG lege. Problemet er at kommunerne kun måler på det der kan tælles, ikke det der tæller."
            }
        ]
    },
    {
        "author": "jonas_p",
        "title": "\"Robusthed\" - opdrager vi børn til at overleve i et sygt system?",
        "content": """Trigger warning: Kontroversiel holdning incoming!

Alle snakker om at gøre børn "robuste". Men robust overfor HVAD? 

- Robust overfor at deres forældre arbejder 50 timer om ugen?
- Robust overfor at være i institution 45 timer om ugen?
- Robust overfor konstant støj og for mange mennesker?
- Robust overfor at deres behov ikke bliver mødt pga normeringer?

Måske - MÅSKE - skulle vi fikse samfundet i stedet for at "hærde" børnene til at overleve i det?

Vi lærer 4-årige at "regulere sig selv" fordi vi ikke har tid til at hjælpe dem. Det er fandme ikke pædagogik, det er overlevelse.

Thoughts?""",
        "comments": [
            {
                "author": "mikkel_h",
                "content": "Du rammer hovedet på sømmet! Vi gør børn ansvarlige for voksnes fejl. 'Robust' er blevet undskyldning for ikke at ændre noget."
            },
            {
                "author": "maria_s",
                "content": "Men vi lever i den virkelige verden? Børn SKAL lære at håndtere modgang. Ellers bliver de jo curlingbørn."
            },
            {
                "author": "sofie_a",
                "content": "Der er forskel på sund modstandskraft og systematisk omsorgssvigt. Guess which one vi laver..."
            }
        ]
    },
    {
        "author": "frederik_l",
        "title": "Tavshedspligt vs underretningspligt: Min kollega er en katastrofe - hvad gør jeg?",
        "content": """Jeg har brug for råd. Seriøst.

Min kollega (fast ansat, 20+ års erfaring) er... problematisk:
- Råber af børnene dagligt
- Kalder dem "irriterende" og "dumme" (til deres ansigt!)
- Sidder på sin telefon det meste af dagen
- Har favoritter og mobber nærmest nogle børn

Jeg har prøvet at tale med hende - hun siger jeg er "for blød" og skal "lære hvordan det virkelig fungerer".

Lederen? "Jamen hun har jo så meget erfaring, du misforstår nok."

Hvad fanden gør jeg? Børnene lider. Men jeg er "bare" en studerende. Og hvis jeg går videre med det, bliver jeg nok blacklistet i hele kommunen.

Help?""",
        "comments": [
            {
                "author": "katrine_j",
                "content": "DOKUMENTÉR ALT! Skriv ned hvad du ser og hører med dato og tid. Så har du noget konkret at gå til uddannelsesvejleder med."
            },
            {
                "author": "emma_n",
                "content": "Gå til din praktikvejleder på VIA. De har pligt til at handle. Du kan ikke redde børnene alene, men du kan sætte noget i gang."
            },
            {
                "author": "kasper_m",
                "content": "Been there. Gik til fagforeningen til sidst. Det kostede mig praktikken men jeg kunne ikke leve med at tie."
            },
            {
                "author": "jonas_p",
                "content": "Husk du har underretningspligt hvis børnene mistrives. Det gælder også pga personalets adfærd. Du er juridisk forpligtet."
            }
        ]
    }
]

async def create_controversial_content():
    async with aiohttp.ClientSession() as session:
        # Login all users
        print("🔐 Logger ind som brugere...")
        user_tokens = {}
        
        for user in users:
            form_data = aiohttp.FormData()
            form_data.add_field('username', user['username'])
            form_data.add_field('password', user['password'])
            
            try:
                async with session.post(f"{API_URL}/auth/login", data=form_data) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        user_tokens[user["username"]] = data["access_token"]
                        print(f"✅ Logget ind: {user['username']}")
            except Exception as e:
                print(f"❌ Login fejl {user['username']}: {e}")
        
        print(f"\n✅ {len(user_tokens)} brugere logget ind")
        
        # Create controversial posts
        print("\n🔥 Opretter kontroversielle debatopslag...")
        post_ids = {}
        
        for i, post in enumerate(controversial_posts):
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
                            data = await resp.json()
                            post_ids[i] = data["id"]
                            print(f"✅ Oprettet: {post['title'][:60]}...")
                            
                            # Add varied upvotes/downvotes for controversial topics
                            all_users = list(user_tokens.keys())
                            all_users.remove(post["author"])
                            
                            # Some posts get mixed reactions
                            num_votes = random.randint(4, 7)
                            voters = random.sample(all_users, min(len(all_users), num_votes))
                            
                            for voter in voters:
                                # Controversial = mixed votes
                                vote_value = 1 if random.random() > 0.3 else -1
                                vote_headers = {"Authorization": f"Bearer {user_tokens[voter]}"}
                                await session.post(
                                    f"{API_URL}/posts/{data['id']}/vote?vote_value={vote_value}", 
                                    headers=vote_headers
                                )
                        else:
                            print(f"❌ Fejl: {await resp.text()}")
                except Exception as e:
                    print(f"❌ Exception: {e}")
                
                await asyncio.sleep(0.5)
        
        # Create heated comment discussions
        print("\n💬 Tilføjer debat-kommentarer...")
        for i, post in enumerate(controversial_posts):
            if i in post_ids and "comments" in post:
                for comment in post["comments"]:
                    if comment["author"] in user_tokens:
                        headers = {"Authorization": f"Bearer {user_tokens[comment['author']]}"}
                        comment_data = {"body": comment["content"]}
                        
                        try:
                            async with session.post(
                                f"{API_URL}/comments/post/{post_ids[i]}", 
                                json=comment_data, 
                                headers=headers
                            ) as resp:
                                if resp.status == 200:
                                    data = await resp.json()
                                    print(f"✅ Kommentar fra {comment['author']}")
                                    
                                    # Comments also get mixed votes
                                    voters = random.sample(
                                        [u for u in user_tokens.keys() if u != comment["author"]], 
                                        min(len(user_tokens)-1, random.randint(2, 5))
                                    )
                                    for voter in voters:
                                        vote_value = 1 if random.random() > 0.4 else -1
                                        vote_headers = {"Authorization": f"Bearer {user_tokens[voter]}"}
                                        await session.post(
                                            f"{API_URL}/comments/{data['id']}/vote?vote_value={vote_value}", 
                                            headers=vote_headers
                                        )
                        except Exception as e:
                            print(f"❌ Kommentar fejl: {e}")
                        
                        await asyncio.sleep(0.3)
        
        print("\n🎯 Kontroversielle debatter oprettet!")
        print("📊 Forummet har nu:")
        print("   - Diagnose-inflation debat")
        print("   - Curling-forældre diskussion")
        print("   - Berøringsangst dilemmaer")
        print("   - Pædagogfagets identitetskrise")
        print("   - Robusthed vs omsorg")
        print("   - Etiske dilemmaer med kolleger")
        print("\n🌐 Se debatten på: https://via-paedagoger.vercel.app")

if __name__ == "__main__":
    asyncio.run(create_controversial_content())