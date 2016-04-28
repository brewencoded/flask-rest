"""Database models."""
import datetime
import bcrypt
from peewee import *

DATABASE = SqliteDatabase('app.db')

class BaseModel(Model):
    """Specifies database connection."""

    class Meta:
        database = DATABASE


class User(BaseModel):
    """A user of the app."""

    name = CharField()
    email = CharField(primary_key=True)
    password = CharField()
    created_at = DateTimeField(default=datetime.datetime.now)


class Article(BaseModel):
    """A single article written by a user."""

    title = CharField()
    body = CharField()
    user = ForeignKeyField(User, related_name='articles')
    created_at = DateTimeField(default=datetime.datetime.now)


def initialize():
    """Initialize database connection and create models."""
    DATABASE.connect()
    DATABASE.create_tables([User, Article], safe=True)
    DATABASE.close()
