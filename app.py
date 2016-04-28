"""simple flask rest api."""
from flask import Flask
from flask import render_template

import models
import config
from resources.users import users_api
from resources.articles import articles_api

app = Flask(__name__)
app.register_blueprint(users_api, url_prefix='/api/v1')
app.register_blueprint(articles_api, url_prefix='/api/v1')


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """Route definition for the index page."""
    return render_template('index.html')

"""Start server if app.py is run directly"""
if __name__ == '__main__':
    models.initialize()
    app.run(debug=config.DEBUG, port=config.PORT, host=config.HOST)
