FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
ADD target/*.jar .
EXPOSE 8761
ENTRYPOINT [ "java" ]
CMD [ "-jar","user-profile.jar" ]