# Flask-rest
### An simple rest api built in python
**Prequisites:**

1.  Install python 3 [Get it here](https://www.python.org/downloads/). Check if it installed correctly by typing (cmd/terminal): `python3` you should get a python repl. type `exit()` to leave the repl.
2.   Install pip:
     * Mac: comes with python3. should be able to check by typing `pip3 --version` from terminal
     * Linux: both python 2 and 3 come by default on newer linux. pip may need to be installed via `sudo apt-get install python3-pip` and additional libraries may also be needed `sudo apt-get install python3-dev`s
     * Windows:
     * Pip may need to be upgraded `pip3 install --upgrade pip` (Can be done once you are in a virtual environment)
3.  Install any text editor:
    * [Pycharm Community Edition](https://www.jetbrains.com/pycharm/), [Sublime Text](https://dbader.org/blog/setting-up-sublime-text-for-python-development), and [Atom](http://www.marinamele.com/install-and-configure-atom-editor-for-python) are all great for this. **I highly recommend Atom or PyCharm for people who don't like configuring an editor.**
    * If you use atom, all of the extensions are optional. It supports python and autocompletions out of the box. If you follow the installation instructions for linter and flake8, make sure you are not in an virtual environment, and use the location for your flake8 installation (find with `which flake8` for Linux/Mac) rather than for the author's. If on Windows, use the atom installer ctrl+shift+p and type install packages. From that interface you can install all of your packages.

**Install Project**

1.  from the command line or git gui, clone the repository: https://github.com/full-stakk/flask-rest.git
2.  cd into the directory from command line
3.  Create a virtual environment: `python3 -m venv env`
4.  Use venv:
    * Mac/Linux: `source env/bin/activate` (to leave a virtual environment type `deactivate`)
5.  Install dependencies into virtual environment:
    * Mac/Linux: `pip install -r requirements.txt`
    * `pip freeze` should show a list of dependencies installed
6.  Run the program:
    * from command line (after you activate env) type `python3 app.py`
    * from the browser go to localhost:8000

Enjoy...
