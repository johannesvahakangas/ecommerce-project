# E-commerce store 
E-commerce site done with Django and React

- Done by Johannes Vähäkangas
- johannes.vahakangas@abo.fi

## In order to run:

0. 0ptional but recommended, create a virtual environment file (venv) in order to install the requirements!
1. Make an env file and run `pip install -r requirements.txt`
2. Make a database and run `python3 manage.py migrate`, then run the project with `python3 manage.py runserver` 
4. Navigate to the frontend folder and `run build` and after `npm start` 
5. Make an .env file in the frontend folder and add the route from the backend like this `REACT_APP_API_URL=http://127.0.0.1:8000` (or whatever you have, for example `http://localhost:8000/`)


All requirements except for the number 12. Pay, has been implemented. A bit of extra styling has been made because I followed a tutorial. For code formatting Prettier has been used.
