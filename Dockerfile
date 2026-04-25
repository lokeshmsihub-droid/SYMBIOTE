# ── Stage 1: Build ──────────────────────────────
FROM eclipse-temurin:17-jdk-focal AS builder
WORKDIR /app

# Optimize Gradle Memory for Cloud Build (Limit to 384MB)
ENV GRADLE_OPTS="-Dorg.gradle.daemon=false -Dorg.gradle.jvmargs='-Xmx384m'"

# Copy full environment for build safety
COPY . .
RUN chmod +x gradlew && ./gradlew bootJar -x test --no-daemon

# ── Stage 2: Runtime ────────────────────────────
FROM eclipse-temurin:17-jre-focal
WORKDIR /app

# Non-root user
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

COPY --from=builder /app/build/libs/*.jar app.jar

USER appuser
EXPOSE 8080

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
