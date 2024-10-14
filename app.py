from flask import Flask, render_template, request, jsonify
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')

app = Flask(__name__)


# TODO: Fetch dataset, initialize vectorizer and LSA here
# dataset requirement:
newsgroups = fetch_20newsgroups(subset='all')
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(newsgroups.data)

# Apply SVD to the matrix to reduce the dimensionality
svd = TruncatedSVD(n_components=100)
X_reduced_dimensions = svd.fit_transform(X)


def search_engine(query):
    """
    Function to search for top 5 similar documents given a query
    Input: query (str)
    Output: documents (list), similarities (list), indices (list)
    """
    # TODO: Implement search engine here
    query_vector = vectorizer.transform([query])
    query_vector_reduced_dimensions = svd.transform(query_vector)

    similarities = cosine_similarity(query_vector_reduced_dimensions, X_reduced_dimensions)
    indices = np.argsort(similarities[0])[::-1][:5]

    documents = []
    for index in indices:
        documents.append({
            'text': newsgroups.data[index],
            'similarity': float(similarities[0][index])
        })

    # return documents, similarities, indices 
    return documents, similarities[0][indices], indices

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    # query = request.form['query']
    # documents, similarities, indices = search_engine(query)
    # return jsonify({'documents': documents, 'similarities': similarities, 'indices': indices}) 

    data = request.json  # Get the query from the request
    query = data.get('query', '')

    # Perform the search using LSA (Assume your search logic is correct)
    documents, similarities, indices = search_engine(query)

    # Ensure all NumPy arrays are converted to lists
    return jsonify({
        'documents': documents,  # Assuming documents are already serializable
        'similarities': similarities.tolist(),  # Convert NumPy array to list
        'indices': indices.tolist()  # Convert NumPy array to list
    })

if __name__ == '__main__':
    app.run(debug=True)
