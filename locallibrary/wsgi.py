"""
WSGI config for locallibrary project.

It exposes the WSGI callable as a module-level variable named ``application``.

WSGI is a Python standard described in detail in PEP 3333 that describes how a web server 
communicates with web applications. It is a low-level interface that defines the 
contract between web servers and Python web frameworks or applications. WSGI is used to 
create web applications in Python.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'locallibrary.settings')

application = get_wsgi_application()
