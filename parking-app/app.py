from flask import Flask, jsonify, render_template, send_from_directory
import json
import os

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/lots")
def api_lots():
    data_file = os.path.join(app.root_path, "data", "lots.json")
    with open(data_file, "r", encoding="utf-8") as f:
        lots = json.load(f)
    return jsonify(lots)

if __name__ == "__main__":
    app.run(debug=True)
