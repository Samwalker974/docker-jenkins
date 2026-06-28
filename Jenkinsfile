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
        stage('Checkout') {
            steps {
                checkout scm
                
            }
         } 
        stage('Tests') { 
            steps {
                sh '''
                ls -la 
                 docker run --rm \
                -v "$(pwd)/mon-appli-todo/backend:/app" \
                -w /app \
                node:18-alpine \
                sh -c \"npm install && npm test\"
                '''       
            }
        }      
        stage('Build') { 
            steps {
                sh '''
                    docker build -t $DOCKER_USER/todo-frontend:$IMAGE_TAG mon-appli-todo/frontend
                    docker build -t $DOCKER_USER/todo-backend:$IMAGE_TAG mon-appli-todo/backend
                '''
            }
        }      
        stage('Push') { 
            steps {
                sh '''
                    docker push $DOCKER_USER/todo-frontend:$IMAGE_TAG
                    docker push $DOCKER_USER/todo-backend:$IMAGE_TAG
                '''
            }
         }     
        stage('Deploy') {      
            steps {
                sh '''
                        FRONTEND_IMAGE=$DOCKER_USER/todo-frontend:$IMAGE_TAG \
                        BACKEND_IMAGE=$DOCKER_USER/todo-backend:$IMAGE_TAG \
                        docker compose -f docker-compose.yml up -d --build
                    ''' 
            }
        }     
        
    }
    post {
        always {
            sh 'docker logout'
        }
    }
}