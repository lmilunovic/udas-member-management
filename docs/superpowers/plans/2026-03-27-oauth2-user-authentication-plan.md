# OAuth2 User Authentication - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure OAuth2 authentication to require pre-registration of users in DB, with admin bootstrapping via environment variable.

**Architecture:** Remove auto-create user logic from OAuth2 flow. Add admin bootstrap component that seeds initial admin from `ADMIN_EMAIL` env var when DB is empty.

**Tech Stack:** Spring Boot 3.2.2, Java 17, Spring Security OAuth2, JPA

---

## File Structure

| Action | File |
|--------|------|
| Modify | `backend/src/main/java/ba/rs/udas/udas_member_management/configuration/AppProperties.java` |
| Modify | `backend/src/main/java/ba/rs/udas/udas_member_management/service/CustomOAuth2UserService.java` |
| Modify | `backend/src/main/java/ba/rs/udas/udas_member_management/service/ApplicationUserService.java` |
| Create | `backend/src/main/java/ba/rs/udas/udas_member_management/configuration/AdminBootstrap.java` |
| Modify | `backend/src/main/resources/application.yaml` |
| Modify | `backend/src/main/java/ba/rs/udas/udas_member_management/configuration/SecurityConfig.java` |

---

## Task 1: Update AppProperties - Remove adminEmails

**Files:**
- Modify: `backend/src/main/java/ba/rs/udas/udas_member_management/configuration/AppProperties.java`

- [ ] **Step 1: Read current AppProperties.java**

- [ ] **Step 2: Remove adminEmails from Security record**

```java
public record Security(
    String allowedDomain
) {}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/java/ba/rs/udas/udas_member_management/configuration/AppProperties.java
git commit -m "refactor: remove adminEmails from AppProperties"
```

---

## Task 2: Update ApplicationUserService - Add createAdminUser method

**Files:**
- Modify: `backend/src/main/java/ba/rs/udas/udas_member_management/service/ApplicationUserService.java`

- [ ] **Step 1: Read current ApplicationUserService.java**

- [ ] **Step 2: Add createAdminUser method**

```java
public ApplicationUser createAdminUser(String email) {
    ApplicationUser admin = ApplicationUser.builder()
            .id(UUID.randomUUID())
            .email(email)
            .name(email.split("@")[0])
            .role(UserRole.ADMIN)
            .active(true)
            .createdAt(OffsetDateTime.now())
            .build();
    return userRepository.save(admin);
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/java/ba/rs/udas/udas_member_management/service/ApplicationUserService.java
git commit -m "feat: add createAdminUser method"
```

---

## Task 3: Create AdminBootstrap Component

**Files:**
- Create: `backend/src/main/java/ba/rs/udas/udas_member_management/configuration/AdminBootstrap.java`

- [ ] **Step 1: Create AdminBootstrap.java**

```java
package ba.rs.udas.udas_member_management.configuration;

import ba.rs.udas.udas_member_management.service.ApplicationUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrap {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    private final ApplicationUserService userService;

    public AdminBootstrap(ApplicationUserService userService) {
        this.userService = userService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void bootstrapAdminUser() {
        String adminEmail = System.getenv("ADMIN_EMAIL");
        
        if (adminEmail == null || adminEmail.isBlank()) {
            log.info("ADMIN_EMAIL environment variable not set, skipping admin bootstrap");
            return;
        }

        if (userService.existsByEmail(adminEmail)) {
            log.info("Admin user {} already exists, skipping bootstrap", adminEmail);
            return;
        }

        var admin = userService.createAdminUser(adminEmail);
        log.info("Bootstrap admin user created: {} with role {}", admin.getEmail(), admin.getRole());
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/main/java/ba/rs/udas/udas_member_management/configuration/AdminBootstrap.java
git commit -m "feat: add AdminBootstrap component for initial admin seeding"
```

---

## Task 4: Update CustomOAuth2UserService - Remove auto-create, add rejection

**Files:**
- Modify: `backend/src/main/java/ba/rs/udas/udas_member_management/service/CustomOAuth2UserService.java`

- [ ] **Step 1: Read current CustomOAuth2UserService.java**

- [ ] **Step 2: Update loadUser method - replace auto-create logic with rejection**

Replace this block (lines 45-52):
```java
ApplicationUser user = userService.findByEmail(email)
        .orElseGet(() -> createNewUser(email, name, googleId));

if (!user.getActive()) {
    throw new OAuth2AuthenticationException("User account is disabled");
}

userService.updateUserFromOAuth(email, name, googleId);
```

With:
```java
ApplicationUser user = userService.findByEmail(email)
        .orElseThrow(() -> new OAuth2AuthenticationException("Access denied. User not registered."));

if (!user.getActive()) {
    throw new OAuth2AuthenticationException("User account is disabled");
}

userService.updateUserFromOAuth(email, name, googleId);
```

- [ ] **Step 3: Remove createNewUser method entirely**

- [ ] **Step 4: Update validateDomain to read from config**

Change from `appProperties.security().adminEmails()` check to simply validate domain:

```java
private void validateDomain(String email) {
    if (appProperties.security() != null && appProperties.security().allowedDomain() != null) {
        String domain = appProperties.security().allowedDomain();
        if (!email.endsWith("@" + domain)) {
            throw new OAuth2AuthenticationException("Email domain not allowed: " + domain);
        }
    }
}
```

- [ ] **Step 5: Remove unused imports** (List, UserRole, UUID, etc. if no longer used)

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/ba/rs/udas/udas_member_management/service/CustomOAuth2UserService.java
git commit -m "refactor: remove auto-create user logic, require pre-registration"
```

---

## Task 5: Update application.yaml - Remove admin-emails

**Files:**
- Modify: `backend/src/main/resources/application.yaml`

- [ ] **Step 1: Read current application.yaml**

- [ ] **Step 2: Update app.security section**

Change from:
```yaml
app:
  security:
    allowed-domain: "your-org.com"
    admin-emails: ["admin@example.com"]
    default-role: "READ_ONLY"
```

To:
```yaml
app:
  security:
    allowed-domain: "your-org.com"
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/resources/application.yaml
git commit -m "refactor: remove admin-emails from application.yaml"
```

---

## Task 6: Verify tests compile and pass

**Files:**
- `backend/src/test/java/ba/rs/udas/udas_member_management/controller/MemberControllerTest.java`
- `backend/src/test/java/ba/rs/udas/udas_member_management/mapper/MemberMapperTest.java`

- [ ] **Step 1: Run tests**

```bash
cd backend && ./mvnw test
```

- [ ] **Step 2: Fix any test failures** (may need to update mock setup for new auth flow)

- [ ] **Step 3: Commit any test fixes**

---

## Task 7: Update application-dev.yaml with example config

**Files:**
- Modify: `backend/src/main/resources/application-dev.yaml`

- [ ] **Step 1: Read current application-dev.yaml**

- [ ] **Step 2: Add security config example**

```yaml
app:
  security:
    allowed-domain: "example.com"
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/resources/application-dev.yaml
git commit -m "docs: add allowed-domain example to dev config"
```

---

## Summary

After implementation:
1. Set `ADMIN_EMAIL=admin@example.com` env var before first startup
2. Admin user auto-creates on startup (if DB empty)
3. OAuth login only works for pre-registered users
4. Admins manage other users via `/api/v1/users` endpoint
