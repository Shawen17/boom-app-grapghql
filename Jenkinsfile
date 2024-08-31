def BackendImage
def FrontendImage
import groovy.json.*


pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('github-token') 
        GITHUB_USERNAME = 'shawen17'
        IMAGE_NAME = "ghcr.io/${GITHUB_USERNAME}"
        DOCKER_BUILDKIT = '1'
        DB_USER=credentials('DB_USER')
        PASSWORD=credentials('PASSWORD')
        CLUSTERNAME=credentials('CLUSTERNAME')

        TOKEN_SECRET=credentials('TOKEN_SECRET')
        MYSQL_USER=credentials('MYSQL_USER')
        MYSQL_PASSWORD=credentials('MYSQL_PASSWORD')
        MYSQL_ROOT_PASSWORD=credentials('MYSQL_ROOT_PASSWORD')


        
        REACT_APP_LENDSQR_API_URL=''
        REACT_APP_MEDIA_URL=credentials('REACT_APP_MEDIA_URL')
       
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }


        stage('Build Docker Images in Parallel') {
            parallel {
                stage('Build backend Image') {
                    steps {
                        script {
                           bat 'docker compose -f docker-compose.build.yml build backend'
                        }
                    }
                }
                stage('Build frontend Image') {
                    steps {
                        script {
                           bat 'docker compose -f docker-compose.build.yml build frontend'
                        }
                    }
                }
                
            }
        }

        stage('Login to GHCR') {
            steps {
                script {
                    
                    bat 'echo %DOCKERHUB_CREDENTIALS% | docker login ghcr.io -u %GITHUB_USERNAME% --password-stdin'
                }
            }
        }

        stage('Tag and Push Images in Parallel') {
            steps {
                script {
                    
                    def services = ['backend', 'frontend']
                    
                    def parallelStages = [:]

                    services.each { service ->
                        parallelStages["Tag and Push ${service}"] = {
                            script {
                                // Create a temporary file to store the image ID
                                def imageIdFile = "imageId_${service}.txt"
                                
                                // Capture the image ID to the file
                                bat "docker images -q boom-app-graphql-${service} > ${imageIdFile}"

                                // Read the image ID from the file
                                def imageId = readFile(imageIdFile).trim()
                                
                                if (imageId) {
                                    def fullImageName = "${IMAGE_NAME}/boom-app-graphql-${service}:${env.BUILD_ID}"
                                    
                                    // Tag the image
                                    bat "docker tag ${imageId} ${fullImageName}"

                                    // Push the image
                                    bat "docker push ${fullImageName}"

                                    if(service=='backend'){
                                       BackendImage = fullImageName
                                    }else{
                                       FrontendImage = fullImageName
                                    }

                                } else {
                                    error "Failed to retrieve image ID for ${service}"
                                }
                                // Clean up the temporary file
                                bat "del ${imageIdFile}"
                            }
                        }
                    }
                    parallel parallelStages
                }
            }
        }
        // stage('Test Backend Image') {
        //      environment{
        //         BACKEND_IMAGE = "${BackendImage}" 
        //         FRONTEND_IMAGE = "${FrontendImage}"
        //     }
        //     steps {
        //         script{
                    
        //             withEnv([
        //                 "BACKEND_IMAGE=$BACKEND_IMAGE",
        //             ])
                    
        //             {
        //                 bat '''
        //                 docker run -p 6379:6379 -d --name redis-test redis
        //                 echo Testing...
        //                 docker run --rm -e REDIS=localhost  -e DB_USER=%DB_USER% -e PASSWORD=%PASSWORD% -e CLUSTERNAME=%CLUSTERNAME% --network host %LENDSQR_BACKEND_IMAGE% pytest
        //                 '''
        //             }
        //         }
        //     }
        // }
        
        
        stage('Check and Stop Containers') {
            steps {
                bat '''
                    powershell -Command "docker container ls -q | ForEach-Object { docker stop $_ }"
                '''
            }
        }
        stage('Remove All Containers') {
            steps {
                bat '''
                    powershell -Command "docker rm $(docker ps -q -a) -f"
                '''
            }
        }
        
        
        stage('Run Containers') {
            environment{
                BACKEND_IMAGE = "${BackendImage}" 
                FRONTEND_IMAGE = "${FrontendImage}"
                TAG = "${env.BUILD_ID}"
            }
            steps {
                
                script {
                    withEnv([
                        "DB_USER=$DB_USER",
                        "PASSWORD=$PASSWORD",
                        "CLUSTERNAME=$CLUSTERNAME",
                        "TOKEN_SECRET=$TOKEN_SECRET"
                        "MYSQL_USER=$MYSQL_USER"
                        "MYSQL_PASSWORD=$MYSQL_PASSWORD"
                        "MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD"
                        "REACT_APP_MEDIA_URL=$REACT_APP_MEDIA_URL",
                        "BACKEND_IMAGE=$BACKEND_IMAGE",
                        "FRONTEND_IMAGE=$FRONTEND_IMAGE",
                        "TAG=$TAG"
                    ]) {
                        bat '''
                            docker compose -f docker-compose.run.yml up -d
                        '''
                    }
                }
            }
        }
    }

    post {
        
        cleanup {
            script {
              deleteDir()
            }
        }
    }
}
