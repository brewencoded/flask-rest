"""This module handles calls to the database based on URIs it recieves."""
from flask.ext.restful import Resource, Api
from flask import jsonify, Blueprint

import models


class ArticleList(Resource):
    """Returns a list of articles."""

    def get(self):
        """return a list of articles."""
        return jsonify({'articles': [
                        {'title': 'test', 'body': 'lorem ipsum'},
                        {'title': 'tes', 'body': 'et ipsum'}
                        ]})


class Article(Resource):
    """Handles article methods."""

    def get(self, id):
        """get a article."""
        return jsonify({'article':
                        {'title': 'test', 'body': 'lorem ipsum'}
                        })

    def put(self, id):
        """update a article."""
        return jsonify({'article':
                        {'title': 'test', 'body': 'lorem ipsum'}
                        })

    def delete(self, id):
        """delete a articles."""
        return jsonify({'article':
                        {'title': 'test', 'body': 'lorem ipsum'}
                        })

    def post(self, id):
        """create a articles."""
        return jsonify({'article':
                        {'title': 'test', 'body': 'lorem ipsum'}
                        })

"""
Proxy to Blueprint module

arg 1 -- the location of the resource resources/users
arg 2 -- the namespace of the resources
"""
articles_api = Blueprint('resources.articles', __name__)
api = Api(articles_api)

"""
Add resource logic to api routes

arg 1 -- resource to use
arg 2 -- the URI to use
arg 3 -- the name of the endpoint
"""

api.add_resource(
    ArticleList,
    '/articles',
    endpoint='articles'
)

api.add_resource(
    Article,
    '/article/<int:id>',
    endpoint='article'
)
