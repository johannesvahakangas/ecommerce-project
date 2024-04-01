# E-commerce store 
E-commerce site done with Django and React

- Done by Johannes Vähäkangas
- johannes.vahakangas@abo.fi

## In order to run:

0. Optional but recommended, create a virtual environment file (venv) in order to install the requirements!
1. Make an env file and run `pip install -r requirements.txt`
2. Make a database and run `python3 manage.py migrate`, then run the project with `python3 manage.py runserver`
3. Make an config file called .env file *in the frontend folder* and add the route from the backend like this `REACT_APP_API_URL=http://127.0.0.1:8000` (or whatever you have django running on, for example `http://localhost:8000/`)
4. Navigate to the frontend folder and do this:
5. `npm install`
6. `npm run build`
7. `npm start`

____________

All requirements except for the number 12. Pay, has been implemented. A bit of extra styling has been made because I followed a tutorial. For code formatting Prettier has been used.
