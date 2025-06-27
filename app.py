from flask import Flask, render_template
from routes.experiment import experiment_bp

app = Flask(__name__)
app.register_blueprint(experiment_bp)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)