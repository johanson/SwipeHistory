from __future__ import print_function

import os

from fabric.api import local
from fabric.colors import red
from fabric.api import settings


def build():
    if cmd_exists('zip'):
        with settings(warn_only=True):
            local('mkdir dist; rm dist/package.zip')
        local('zip -r "dist/package.zip" . -x \*.git\* fabfile.py dist/')
    else:
        print(red("Install zip!"), "apt install zip")


def cmd_exists(x):
    return any(os.access(os.path.join(path, x), os.X_OK)
               for path in os.environ["PATH"].split(os.pathsep))
