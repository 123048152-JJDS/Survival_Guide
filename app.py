from flask import Flask, render_template, session, redirect, url_for
app = Flask(__name__)
app.secret_key = 'survival_guide_upq_2026'

SECCIONES = ['reglas', 'notas', 'skills', 'timeline']

def init_state():
    if 'unlocked' not in session:
        session['unlocked'] = ['reglas']
    if 'completed' not in session:
        session['completed'] = []
    if 'xp' not in session:
        session['xp'] = 0

@app.route('/')
def index():
    session.clear()
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)