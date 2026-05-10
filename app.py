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

@app.route('/reglas')
def reglas():
    init_state()
    if 'reglas' not in session['unlocked']:
        return redirect(url_for('index'))
    return render_template('reglas.html',
        unlocked=session['unlocked'],
        completed=session['completed'],
        xp=session['xp']
    )

if __name__ == '__main__':
    app.run(debug=True)