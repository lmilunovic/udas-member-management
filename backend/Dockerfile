FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

COPY backend/pom.xml .
COPY backend/mvnw .
COPY backend/.mvn .mvn
COPY api /api

RUN apk add --no-cache maven
RUN ./mvnw dependency:go-offline -B

# Run code generation as a separate layer so it's only re-run when the spec changes,
# not on every Java source change. Also surfaces generator errors explicitly.
RUN ./mvnw generate-sources -B

COPY backend/src src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
