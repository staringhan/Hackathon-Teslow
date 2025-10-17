# save as server.py
from flask import Flask, request

app = Flask(__name__)
@app.route('/message', methods=['POST'])
def receive_message():
    try:
        data = request.get_json(force=True)
    except Exception:
        data = request.data.decode('utf-8')
    print(f"📩 Message reçue: {data}")
    return {'status': 'ok', 'received': data}, 200

#@app.route('/message', methods=['POST'])
#def receive_message():
#    data = request.get_json()
#    if not data or 'msg' not in data:
#        return {'status': 'error', 'message': 'No msg field'}, 400
#    message = data['msg']
#    print(f"📩 Message from ESP32: {message}")
#    return {'status': 'ok', 'received': message}, 200

if __name__ == '__main__':
    # Listen on all interfaces so ESP32 can reach it
    app.run(host='0.0.0.0', port=5000)

