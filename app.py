from flask import Flask, render_template, session
# import index
# import controllers
# import api

# Initialize Flask app with the template folder address
app = Flask(__name__)

API_KEY = open('api_key').readline()

@app.route('/')
def index_route():
	return render_template('index.html', api_key=API_KEY)

# Listen on external IPs
# For us, listen to port 3000 so you can just run 'python app.py' to start the server
if __name__ == '__main__':
    # listen on external IPs
    app.run(host='0.0.0.0', port=4000, debug=True)
