from flask import Flask, request, jsonify, render_template
import pandas as pd
import numpy as np

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/malaria')
def malaria():
    df = pd.read_csv('static/data/Malaria_data_file.csv')
    data = []
    for index, row in df.iterrows():
        data.append({x: row[x] for x in row.index})
    return jsonify(data)


@app.route('/top/<number>')
def top(number):
    cases = 'Malaria cases/100,000 pop.'
    df = pd.read_csv('static/data/Malaria_data_file.csv')
    top_ten = df[['Country', 'Year', cases]].groupby(
        'Country').mean().sort_values(cases, ascending=False).head(int(number)).index
    df = df.loc[df['Country'].isin(top_ten), :]
    data = []
    for i, row in df.iterrows():
        data.append({x: row[x] for x in row.index})
    return jsonify(data)


@app.route('/coordinates')
def coordinates():
    df = pd.read_csv('static/data/coordinates.csv')
    df = df.dropna()
    data = []
    for index, row in df.iterrows():
        data.append({x: row[x] for x in row.index})
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
