pipeline {
    agent any

    environment {
        DOCKER_USER  = credentials('DOCKER_USER')
        DOCKER_TOKEN = credentials('DOCKER_TOKEN')
        IMAGE_TAG    = "${BUILD_NUMBER}-${GIT_COMMIT[0..6]}"
    }

    stages {
        stage('Login') { 
            steps {
                sh 'echo $DOCKER_TOKEN | docker login -u $DOCKER_USER --password-stdin'
            }
        }      
        stage('Checkout') { ... }   // récupérer le code GitHub
        stage('Tests') { ... }      // lancer les tests backend
        stage('Build') { ... }      // construire les images
        stage('Push') { ... }       // pousser sur Docker Hub
        stage('Deploy') { ... }     // lancer docker compose
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}