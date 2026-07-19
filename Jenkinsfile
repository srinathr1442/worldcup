node {

    stage('SCM Checkout') {
        git 'https://github.com/srinathr1442/fifa-cup.git'
    }
 {

        stage('Maven Build') {
            def mvnHome = tool name: 'Maven-3.9.16', type: 'maven'
            sh "${mvnHome}/bin/mvn clean package"
            sh 'mv target/futbolkits-catalog*.war target/futbolkits-catalog.war'
        }

        stage('SonarQube Analysis') {
            def mvn = tool 'Maven-3.9.16'
            withSonarQubeEnv() {
                sh "${mvn}/bin/mvn clean verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar -Dsonar.projectKey=futbolkits-catalog -Dsonar.projectName='Futbolkits Catalog'"
            }
        }

        stage('build Docker Image') {
            sh 'docker build -t srinath1442/futbolkits-catalog .'
        }

        stage('Docker image push') {
            withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'dockerhubusername', passwordVariable: 'dockerhubpassword')]) {
                sh "docker login -u $dockerhubusername -p ${dockerhubpassword}"
                sh 'docker push /futbolkits-catalog'
            }
        }
    }

    stage('Remove Previous Container') {
        sh '''
            docker stop tomcattest || true
            docker rm -f tomcattest || true
        '''
    }

    stage('Docker Deployment') {
        sh '''
            docker pull srinath1442/futbolkits-catalog:latest
            docker run -d --name tomcattest -p 80:8080 srinath1442/futbolkits-catalog:latest
        '''
    }
}