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
    
@app.route('/notas')
def notas():
    init_state()
    if 'notas' not in session['unlocked']:
        return redirect(url_for('reglas'))
    return render_template('notas.html',
        unlocked=session['unlocked'],
        completed=session['completed'],
        xp=session['xp']
    )


@app.route('/unlock/<seccion>', methods=['POST', 'GET'])
def unlock(seccion):
    init_state()
    if seccion in SECCIONES:
        if seccion not in session['completed']:
            completed = session['completed']
            completed.append(seccion)
            session['completed'] = completed
            session['xp'] = session['xp'] + 100

        idx = SECCIONES.index(seccion)
        if idx + 1 < len(SECCIONES):
            siguiente = SECCIONES[idx + 1]
            unlocked = session['unlocked']
            if siguiente not in unlocked:
                unlocked.append(siguiente)
                session['unlocked'] = unlocked
            return redirect(url_for(siguiente))

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)