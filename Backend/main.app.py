from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Lottery, Ticket
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lottery.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    user = User(username=data['username'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email}), 201

@app.route('/lotteries', methods=['POST'])
def create_lottery():
    data = request.get_json()
    lottery = Lottery(name=data['name'], description=data.get('description'), draw_date=datetime.fromisoformat(data['draw_date']))
    db.session.add(lottery)
    db.session.commit()
    return jsonify({'id': lottery.id, 'name': lottery.name, 'draw_date': lottery.draw_date.isoformat()}), 201

@app.route('/lotteries', methods=['GET'])
def get_lotteries():
    lotteries = Lottery.query.all()
    return jsonify([{
        'id': l.id,
        'name': l.name,
        'description': l.description,
        'draw_date': l.draw_date.isoformat(),
        'winner': l.winner.username if l.winner else None
    } for l in lotteries])

@app.route('/tickets', methods=['POST'])
def buy_ticket():
    data = request.get_json()
    user = User.query.get(data['user_id'])
    lottery = Lottery.query.get(data['lottery_id'])
    if not user or not lottery:
        return jsonify({'error': 'User or Lottery not found'}), 404
    ticket_number = f"{random.randint(100000, 999999)}"
    ticket = Ticket(number=ticket_number, user=user, lottery=lottery)
    db.session.add(ticket)
    db.session.commit()
    return jsonify({'id': ticket.id, 'number': ticket.number}), 201

@app.route('/lotteries/<int:lottery_id>/draw', methods=['POST'])
def draw_winner(lottery_id):
    lottery = Lottery.query.get(lottery_id)
    if not lottery:
        return jsonify({'error': 'Lottery not found'}), 404
    tickets = Ticket.query.filter_by(lottery_id=lottery_id).all()
    if not tickets:
        return jsonify({'error': 'No tickets sold'}), 400
    winner_ticket = random.choice(tickets)
    lottery.winner = winner_ticket.user
    db.session.commit()
    return jsonify({'winner': winner_ticket.user.username, 'ticket': winner_ticket.number})

if __name__ == '__main__':
    app.run(debug=True)