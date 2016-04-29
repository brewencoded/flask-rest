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
    email = CharField(unique=True)
    password = CharField()
    created_at = DateTimeField(default=datetime.datetime.now)

    @classmethod
    def create_user(cls, email, password, name):
        email = email.lower()
        try:
            cls.select().where(cls.email == email).get()
        except cls.DoesNotExist:
            user = cls(email=email, name=name)
            user.password = user.set_password(password)
            user.save()
            return user
        else:
            return None

    @staticmethod
    def set_password(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    def verify_password(self, password):
        return bcrypt.hashpw(password.encode('utf-8'), self.password) == self.password


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
