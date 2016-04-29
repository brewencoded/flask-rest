"""Database models."""
import datetime
import bcrypt
import config
from peewee import *
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer,
                          BadSignature, SignatureExpired)

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
    def verify_auth_token(token):
        serializer = Serializer(config.SECRET)
        try:
            data = serializer.loads(token)
        except (SignatureExpired, BadSignature):
            return None
        else:
            user = User.get(User.id == data['id'])
            return user

    @staticmethod
    def set_password(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    def verify_password(self, password):
        hashed = bcrypt.hashpw(password.encode('utf-8'), self.password.encode('utf-8'))
        return hashed == self.password.encode('utf-8')

    def generate_auth_token(self, expires=3600):
        serializer = Serializer(config.SECRET, expires_in=expires)
        return serializer.dumps({'id': self.id})


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
