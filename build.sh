#!/usr/bin/env bash

set -o errexit  # exit on error

pip install -r requirements.txt


python manage.py collectstatic --no-input
python manage.py migrate

echo "from django.contrib.auth.models import User; User.objects.create_superuser('alumnodb', '', 'alumnodb')" | python3 manage.py shell




#python3 manage.py test catalog.tests --verbosity 2      


#sudo -u postgres createuser -s alumnodb
#sudo -u postgres psql -c "ALTER USER alumnodb WITH PASSWORD 'alumnodb';"


