
# firstAssignment19956

# IMPORTANT TERMINAL CODES

            ||||||||||||||||||||||||
            vvvvvvvvvvvvvvvvvvvvvvvv

python3 manage.py makemigrations 
python3 manage.py makemigrations catalog \
python3 manage.py migrate \
python3 manage.py migrate catalog \

python manage.py collectstatic --no-input

python3 manage.py runserver \
python3 populate_catalog.py 

python3 manage.py test catalog.test.test_first_week --verbosity 2 \
python3 manage.py createsuperuser \

