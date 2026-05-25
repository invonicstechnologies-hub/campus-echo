import asyncio
import os
import sys
import random
import uuid
from datetime import datetime, timedelta

# Ensure the app module can be imported when running the script directly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import async_session_maker
from app.models.topic import Topic
from app.models.post import Post
from app.models.session_token import SessionToken

SEED_TOPICS = [
    {"name": "Politics & Governance", "description": "Campus and national politics, leadership, and policies."},
    {"name": "Academics & Finances", "description": "HELB, fees, exams, and surviving the academic hustle."},
    {"name": "Tech & Careers", "description": "Gigs, jobs, coding, and the hustle after graduation."},
    {"name": "Relationships & Social", "description": "Character development, dating, and campus social life."},
    {"name": "Sports & Entertainment", "description": "Derbies, tournaments, music, and pop culture."},
    {"name": "Lifestyle & Culture", "description": "Mental health, matatu culture, and everyday vibes."},
]

SEED_POSTS = [
    "Zakayo ashuke! The real impact of the new taxes on comrades. Tuta-survive aje hii economy? #Reject",
    "HELB imeweza au ni stori za jaba? Comrades are surviving on vibes, strong tea, and formatting laptops.",
    "AI inachukua kazi zetu au ni form ya kuomoka? Let's talk tech gigs and dev jobs in Nairobi.",
    "Wale wa siasa za shule, why do student leaders disappear after elections? Tunaibiwa mchana.",
    "Kutafuta waks Kenya: Degree ni harambee au kuna hope? What's the real ground out here?",
    "Character development pale campus. Share your worst premium tears moments. 😭 Huku nje ni kubaya.",
    "Mashemeji derby vs. Premier league weekends. Also, who's setting up the next FC 26 campus tournament?",
    "Arbanton vs Gengetone: Which wave is actually representing the youth right now?",
    "Men's mental health and surviving the pressure. It's okay to say umesota na umeburn out. Talk to someone.",
    "Nganya culture: Which route has the most insane custom mats right now? Mna-rate aje manyanga za juzi?"
]

SYSTEM_HMAC = "system_seed_token_" + str(uuid.uuid4())[:16]

async def seed_data():
    async with async_session_maker() as session:
        print("Starting seed process...")
        
        # 1. Create a System Identity bypassing JWT flow
        stmt = select(SessionToken).where(SessionToken.hmac_token == SYSTEM_HMAC)
        result = await session.execute(stmt)
        token = result.scalar_one_or_none()
        
        if not token:
            print("Creating system session token...")
            token = SessionToken(
                hmac_token=SYSTEM_HMAC,
                expires_at=datetime.utcnow() + timedelta(days=3650) # Valid for 10 years
            )
            session.add(token)
            await session.commit()
            await session.refresh(token)

        # 2. Seed Topics
        print("Seeding topics...")
        topic_objects = []
        for t_data in SEED_TOPICS:
            stmt = select(Topic).where(Topic.name == t_data["name"])
            result = await session.execute(stmt)
            topic = result.scalar_one_or_none()
            
            if not topic:
                topic = Topic(name=t_data["name"], description=t_data["description"])
                session.add(topic)
                await session.flush()
            
            topic_objects.append(topic)
            
        await session.commit()

        # 3. Seed Posts
        print("Seeding posts...")
        # Check if posts already exist to prevent duplication on re-runs
        for idx, content in enumerate(SEED_POSTS):
            stmt = select(Post).where(Post.content == content)
            result = await session.execute(stmt)
            if not result.scalar_one_or_none():
                # Randomize upvotes between 5 and 150
                upvotes = random.randint(5, 150)
                # Assign to one of the 6 categories randomly
                random_topic = random.choice(topic_objects)
                
                post = Post(
                    hmac_token=SYSTEM_HMAC,
                    topic_id=random_topic.id,
                    content=content,
                    upvote_count=upvotes,
                    status='published'
                )
                session.add(post)
                
        await session.commit()
        print("✅ Database successfully seeded with 10 Kenyan campus posts and 6 topics!")

if __name__ == "__main__":
    asyncio.run(seed_data())
