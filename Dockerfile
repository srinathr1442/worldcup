FROM tomcat:11-jdk25
COPY target/futbolkits-catalog.war /usr/local/tomcat/webapps/
CMD ["catalina.sh", "run"]
