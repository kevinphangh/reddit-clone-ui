import asyncio
import sys
sys.path.insert(0, '.')
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.vote import Vote, VoteType
from app.core.security import get_password_hash
from datetime import datetime, timezone, timedelta
import random
import os

# Production database URL from fly.io
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://postgres:6B2AFdfc33ebF3beAbBeECEBCCBAABdE@via-forum-api-db.flycast:5432/via_forum_api?sslmode=disable')

# Fix URL for asyncpg
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
if not DATABASE_URL.startswith('postgresql+asyncpg'):
    DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://', 1)

# Test users data
users_data = [
    {"username": "sofie_a", "email": "sofie@test.dk", "display_name": "Sofie Andersen"},
    {"username": "mikkel_h", "email": "mikkel@test.dk", "display_name": "Mikkel Hansen"},
    {"username": "emma_n", "email": "emma@test.dk", "display_name": "Emma Nielsen"},
    {"username": "jonas_p", "email": "jonas@test.dk", "display_name": "Jonas Pedersen"},
    {"username": "katrine_j", "email": "katrine@test.dk", "display_name": "Katrine Jensen"},
    {"username": "frederik_l", "email": "frederik@test.dk", "display_name": "Frederik Larsen"},
    {"username": "maria_s", "email": "maria@test.dk", "display_name": "Maria Sørensen"},
    {"username": "kasper_m", "email": "kasper@test.dk", "display_name": "Kasper Madsen"}
]

# Forum posts
posts_data = [
    {
        "author": "sofie_a",
        "title": "Er jeg den eneste der føler sig overvældet af praktikken?",
        "content": """Jeg er på 2. semester og har lige startet min første praktik i en vuggestue. Alle siger at pædagog er et "nemt" studie, men jeg synes virkelig det er hårdt! 

Børnene græder konstant, forældrene er krævende, og jeg føler ikke jeg har lært nok på studiet til at håndtere det. Min vejleder siger jeg gør det fint, men jeg føler mig helt utilstrækkelig.

Er det normalt at føle sig så overvældet i starten? Bliver det bedre?""",
        "comments": [
            {
                "author": "emma_n",
                "content": "Du er IKKE alene! Jeg husker min første praktik som et mareridt. Men tro mig, det bliver bedre. Efter et par uger begynder du at finde din rytme. Hæng i! 💪"
            },
            {
                "author": "jonas_p",
                "content": "Praktikchokket er reelt! Teorien fra studiet og virkeligheden er to forskellige verdener. Giv dig selv tid til at vænne dig til det."
            }
        ]
    },
    {
        "author": "mikkel_h",
        "title": "Hvorfor er pædagog-uddannelsen så upopulær blandt mænd?",
        "content": """Som en af de få fyre på holdet føler jeg mig ofte ret alene. Vi er 3 mænd ud af 45 studerende!

Det værste er kommentarerne jeg får:
- "Er du ikke bange for at blive mistænkt for noget?"
- "Det er da ikke et rigtigt mandefag"
- "Du kunne da tjene mere som håndværker"

Jeg ELSKER at arbejde med børn og unge, men det er frustrerende at skulle forsvare mit valg hele tiden. Samfundet skriger efter mandlige rollemodeller i institutionerne, men samtidig bliver vi set skævt til.

Nogen andre fyre der kan genkende det?""",
        "comments": [
            {
                "author": "kasper_m",
                "content": "100% genkendelig! Jeg har fået at vide af forældre at de 'foretrækker kvindelige pædagoger til bleskift'. Det er så diskriminerende."
            },
            {
                "author": "katrine_j",
                "content": "Som kvinde på studiet synes jeg det er SÅ ærgerligt! Vi har brug for jer. Børnene har godt af både mandlige og kvindelige pædagoger. Bliv ved med at kæmpe!"
            },
            {
                "author": "frederik_l",
                "content": "Jeg droppede faktisk ud efter 1. semester pga det. Kunne ikke holde til fordomme + den lave løn. Respekt for at du bliver ved!"
            }
        ]
    },
    {
        "author": "emma_n",
        "title": "Unpopular opinion: Pædagoguddannelsen er for nem",
        "content": """Okay, jeg ved godt det her bliver kontroversielt, men...

Jeg synes faktisk niveauet er for lavt. Vi bruger alt for meget tid på "refleksion" og "følelser" og alt for lidt på reel faglighed. Hvor er den hårde videnskab? Hvor er de krævende eksamener?

Mine venner på uni griner af hvor lidt jeg læser. Og ærligt? De har ret. Jeg kan sagtens klare mig med et par dages forberedelse til eksamen.

Resultatet? Folk ser ned på vores profession. "Alle kan da være pædagog". Og når uddannelsen er så nem, så forstår jeg dem faktisk godt.

Burde vi ikke stille højere krav?""",
        "comments": [
            {
                "author": "maria_s",
                "content": "WOW det er modigt sagt! Jeg er faktisk enig. Vi kunne sagtens have mere neuropsykologi, udviklingsteori osv på skemaet."
            },
            {
                "author": "sofie_a",
                "content": "Nem?? Prøv at stå med 20 børn der skriger samtidig og se om din 'refleksion' ikke er vigtig der! Uddannelsen handler om mere end bøger."
            },
            {
                "author": "jonas_p",
                "content": "Både og. Ja, vi kunne have mere teori. Men pædagogik handler også om relations-arbejde, og det kan du ikke læse dig til."
            }
        ]
    },
    {
        "author": "katrine_j",
        "title": "SOS: Praktikstedets pædagogik er HELT forkert!",
        "content": """Jeg er i praktik i en børnehave hvor de stadig kører gammeldags "voksenstyret" pædagogik. Børnene skal sidde stille, spise op, sove til faste tider osv.

Alt det vi lærer om børneperspektiv, medbestemmelse og anerkendende pædagogik? Glem det! Her handler det om kontrol og disciplin.

Da jeg foreslog at børnene selv kunne vælge aktiviteter, fik jeg at vide at "sådan gør vi ikke her" og at jeg skulle "lære hvordan det fungerer i virkeligheden".

Jeg føler jeg svigter min faglighed ved at følge deres metoder. Men jeg tør heller ikke sige dem imod hele tiden. Hvad gør jeg??""",
        "comments": [
            {
                "author": "mikkel_h",
                "content": "Åh gud, jeg havde PRÆCIS samme oplevelse! Min vejleder sagde børn havde 'brug for faste rammer' når jeg foreslog mere fri leg."
            },
            {
                "author": "frederik_l",
                "content": "Velkomment til virkeligheden. Der er stor forskel på teori og praksis. Men prøv at tage det med til vejledning på studiet!"
            }
        ]
    },
    {
        "author": "jonas_p",
        "title": "Pædagog-lønnen er en joke - jeg overvejer at droppe ud",
        "content": """3. semester her. Jeg har lige regnet på økonomien efter endt uddannelse og jeg er i chok.

Startløn: ca 28.000 kr/md (før skat)
Efter 10 år: ca 32.000 kr/md

Mine venner der blev tømrere efter 9. klasse tjener allerede 40.000+. Min kæreste læser til ingeniør og starter på 45.000.

Jeg elsker virkelig at arbejde med børn, men kan jeg leve med at være fattig resten af livet? Kan ikke købe hus, kan ikke rejse, kan dårligt få det til at løbe rundt.

Samfundet siger pædagoger er vigtige, men lønnen siger noget andet. Overvejer seriøst at droppe ud og læse noget andet.

Er jeg den eneste?""",
        "comments": [
            {
                "author": "maria_s",
                "content": "Du er ikke alene! Jeg arbejder deltid som vikar ved siden af studiet og tænker allerede på at skulle have bijob som færdiguddannet. Det er fucked."
            },
            {
                "author": "emma_n",
                "content": "Jeg har accepteret at jeg nok aldrig får råd til at bo i København. Men for mig er jobglæden det værd. Men forstår dig 100%!"
            },
            {
                "author": "kasper_m",
                "content": "Derfor mange fyre dropper ud. Samfundet forventer vi er familiens hovedforsørgere, men lønnen gør det umuligt."
            }
        ]
    },
    {
        "author": "maria_s",
        "title": "Dagens positive historie: Derfor ELSKER jeg at studere pædagogik! ❤️",
        "content": """Okay, der er meget negativt herinde for tiden, så her kommer lidt positivitet!

I dag i praktikken sad jeg med Oliver (4 år) som har autisme og har svært ved at lege med andre børn. Vi har arbejdet med ham i 2 måneder nu.

Og i dag!! I dag gik han selv hen til nogle andre børn og spurgte om han måtte være med! De legede sammen i 20 minutter!

Hans mor græd da jeg fortalte det ved afhentning. Jeg græd også. Det er DERFOR jeg vil være pædagog!

Ja, lønnen er lav. Ja, uddannelsen har mangler. Ja, vi får ikke nok anerkendelse.

Men når du ser et barn blomstre, når du gør en forskel, når du er med til at forme fremtidens mennesker - så er det det hele værd!

Del jeres positive historier! Vi har brug for at huske hvorfor vi valgte det her fag! ❤️""",
        "comments": [
            {
                "author": "sofie_a",
                "content": "TAK! Jeg havde virkelig brug for at læse det her i dag! ❤️ Det minder mig om hvorfor jeg startede."
            },
            {
                "author": "katrine_j",
                "content": "Åh det er så smukt! De små sejre er alt! I fredags fik jeg et kram af et barn der plejer at slå. Små skridt, store sejre!"
            }
        ]
    },
    {
        "author": "frederik_l",
        "title": "Eksamensstress: Nogen der har styr på Vygotsky vs Piaget?",
        "content": """Eksamen om 3 dage og jeg fatter stadig ikke forskellen ordentligt!

Kan nogen forklare det MEGET simpelt? Hver gang jeg læser om det, bliver jeg mere forvirret. Zone for nærmeste udvikling, skemaer, assimilation... HJÆLP!

PS: Hvorfor skal vi kunne teori fra 1900-tallet? Er det ikke lidt outdated?""",
        "comments": [
            {
                "author": "emma_n",
                "content": "Super simpelt: Piaget = børn lærer selv gennem stadier. Vygotsky = børn lærer gennem sociale relationer. DM hvis du vil have mine noter!"
            },
            {
                "author": "jonas_p",
                "content": "Bro, jeg havde samme problem! YouTube 'Piaget vs Vygotsky explained' - der er nogle gode videoer der!"
            }
        ]
    },
    {
        "author": "kasper_m",
        "title": "Mobning på studiet - er VIA ligeglade?",
        "content": """Der er en gruppe på vores hold der systematisk udelukker andre. De laver studie-grupper hvor kun "de seje" må være med, de hvisker og griner af andre, og generelt er der bare en virkelig dårlig stemning.

Flere har klaget til studievejlederen, men svaret er bare "I er voksne mennesker, find ud af det".

Er det ikke ironisk at vi lærer om inklusion og anti-mobning, men på vores eget studie er der toxic mean girls kultur?

Oplever andre det samme?""",
        "comments": [
            {
                "author": "mikkel_h",
                "content": "Vi havde samme problem på 1. semester! Det blev faktisk bedre efter nogle droppede ud. Hold ud!"
            },
            {
                "author": "katrine_j",
                "content": "Det er SÅ paradoksalt! Vi skal lære børn om fællesskab mens vi selv opfører os som i folkeskolen. VIA burde tage det seriøst!"
            }
        ]
    }
]

async def main():
    # Create async engine
    engine = create_async_engine(DATABASE_URL)
    AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with AsyncSessionLocal() as session:
        # Create users
        print("Creating users...")
        users = {}
        for user_data in users_data:
            # Check if user already exists
            result = await session.execute(
                select(User).where(User.username == user_data['username'])
            )
            existing_user = result.scalar_one_or_none()
            
            if not existing_user:
                user = User(
                    username=user_data['username'],
                    email=user_data['email'],
                    display_name=user_data['display_name'],
                    hashed_password=get_password_hash('Test123!'),
                    is_active=True,
                    is_verified=True,
                    created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(30, 180))
                )
                session.add(user)
                users[user_data['username']] = user
                print(f"Created user: {user_data['username']}")
            else:
                users[user_data['username']] = existing_user
                print(f"User already exists: {user_data['username']}")
        
        await session.commit()
        
        # Refresh all users to get IDs
        for username, user in users.items():
            await session.refresh(user)
        
        # Create posts
        print("\nCreating posts...")
        for i, post_data in enumerate(posts_data):
            if post_data['author'] in users:
                # Create post with varying timestamps
                created_at = datetime.now(timezone.utc) - timedelta(
                    days=random.randint(0, 7),
                    hours=random.randint(0, 23),
                    minutes=random.randint(0, 59)
                )
                
                post = Post(
                    title=post_data['title'],
                    content=post_data['content'],
                    author_id=users[post_data['author']].id,
                    created_at=created_at,
                    updated_at=created_at,
                    score=random.randint(5, 25),
                    comment_count=len(post_data.get('comments', [])),
                    type='text'
                )
                session.add(post)
                await session.flush()  # Get post ID
                
                print(f"Created post: {post_data['title'][:50]}...")
                
                # Add author's upvote
                vote = Vote(
                    user_id=users[post_data['author']].id,
                    target_id=post.id,
                    target_type=VoteType.POST,
                    value=1
                )
                session.add(vote)
                
                # Add random upvotes from other users
                other_users = [u for u in users.values() if u.id != users[post_data['author']].id]
                for voter in random.sample(other_users, min(len(other_users), random.randint(2, 6))):
                    vote = Vote(
                        user_id=voter.id,
                        target_id=post.id,
                        target_type=VoteType.POST,
                        value=1
                    )
                    session.add(vote)
                
                # Create comments
                for j, comment_data in enumerate(post_data.get('comments', [])):
                    if comment_data['author'] in users:
                        comment_created_at = created_at + timedelta(
                            hours=random.randint(1, 48),
                            minutes=random.randint(0, 59)
                        )
                        
                        comment = Comment(
                            content=comment_data['content'],
                            author_id=users[comment_data['author']].id,
                            post_id=post.id,
                            parent_id=None,
                            created_at=comment_created_at,
                            updated_at=comment_created_at,
                            score=random.randint(1, 10)
                        )
                        session.add(comment)
                        await session.flush()
                        
                        # Add author's upvote
                        vote = Vote(
                            user_id=users[comment_data['author']].id,
                            target_id=comment.id,
                            target_type=VoteType.COMMENT,
                            value=1
                        )
                        session.add(vote)
                        
                        print(f"  Created comment by {comment_data['author']}")
        
        # Commit all changes
        await session.commit()
        print("\nAll content created successfully!")

if __name__ == "__main__":
    asyncio.run(main())