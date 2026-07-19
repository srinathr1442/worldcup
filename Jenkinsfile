Github and jenkins integration and deployment 
node{
 stage ('SCM Checkout') {
    git 'https://github.com/srinathr1442/fifa-cup.git'
 }
}

//Maven (For packing and building the project)
stage ('Maven Build') {
     def mavenBuild = tool name: 'Maven-3.9.16', type: 'maven'    
     sh "${mvnHome}/bin/mvn clean package"
      sh 'mv target/mady-1.0.0*.war target/The-web.war'
 }

 //sonar stage
  stage('SonarQube Analysis') {
    def mvn = tool 'Default Maven';
    withSonarQubeEnv() {
      sh "${mvn}/bin/mvn clean verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar -Dsonar.projectKey=Website -Dsonar.projectName='Website'"
    }
  }

 //Docker build
stage ('build Docker Image') {
    sh 'docker build -t dockerhub:new-imagename .'
 }

 //Docker push to dockerhub
 stage ('Docker image push') {
    withCredentials([string(credentialsId: 'dockerhub',variable: 'dockerhubpassword')]) {
        sh "docker login -u $dockerhubusername -p ${dockerhubpassword}"
    }
 sh 'docker push dockerhub:new-imagename'
 }
 

 //Docker deployment and remove previous container
 stage ('docker deployment') {
    sh 'docker run -d -p 8090:8080 --name tomcattest dockerhub/new-imagename'
 }
stage ('remove previous container') {
   try {
sh 'docker rm -f tomcattest'
   } catch (error) { 

   }
 }