FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

RUN apk add --no-cache maven

COPY backend/pom.xml .
COPY backend/mvnw .
COPY backend/.mvn .mvn

RUN ./mvnw dependency:go-offline -B

# Copy API spec after dependencies — changes here only invalidate code generation, not dependency download
COPY api /api

# Run code generation as a separate layer so it's only re-run when the spec changes,
# not on every Java source change. Also surfaces generator errors explicitly.
RUN ./mvnw generate-sources -B

COPY backend/src src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
