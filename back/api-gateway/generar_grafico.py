import sys
import json
from pymongo import MongoClient
from datetime import datetime
import matplotlib.pyplot as plt
import base64
import io

def generar_grafico():
    try:
        # Conexión a MongoDB (ajusta estos valores)
        client = MongoClient('mongodb+srv://a23albrobfon:1234@cluster0.tfcrv.mongodb.net')
        db = client['gameStats']
        collection = db['scores']

        # Obtener datos
        data = list(collection.find({}, {'score': 1, 'date': 1, '_id': 0}).sort('date', 1))
        
        if not data:
            return json.dumps({'error': 'No hay datos disponibles'})

        # Procesar datos
        dates = [item['date'].strftime('%Y-%m-%d') if isinstance(item['date'], datetime) else item['date'] for item in data]
        scores = [item['score'] for item in data]

        # Crear gráfico
        plt.figure(figsize=(10, 6))
        plt.bar(dates, scores, color='skyblue')
        plt.xlabel('Fecha')
        plt.ylabel('Puntuación')
        plt.title('Puntuaciones por Fecha')
        plt.xticks(rotation=45)
        plt.tight_layout()

        # Convertir a base64
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=100)
        buf.seek(0)
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()

        return json.dumps({
            'chartImage': f'data:image/png;base64,{image_base64}',
            'dates': dates,
            'scores': scores
        })

    except Exception as e:
        return json.dumps({'error': str(e)})

if __name__ == '__main__':
    result = generar_grafico()
    print(result)