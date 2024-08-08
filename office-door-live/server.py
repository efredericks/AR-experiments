# https://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

global num_users

app = Flask(__name__)
app.config['SECRET_KEY'] = 's3cr3t!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('my event')
def test_message(message):
    emit('my response', {'data': message['data']})

@socketio.on('my broadcast event')
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)

@socketio.on('connect')
def test_connect():
    global num_users
    num_users += 1
    emit('connection success', {'data': 'Connected', 'num_users': num_users})
    print(f"User count: {num_users}")

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    num_users = 0
    socketio.run(app)