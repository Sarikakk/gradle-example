gradle-version: 7.0

# Structuring Software Projects Sample

NOTE: You can open this sample inside an IDE using the [IntelliJ's Gradle import](https://www.jetbrains.com/help/idea/gradle.html#gradle_import_project_start) or [Eclipse Buildship](https://projects.eclipse.org/projects/tools.buildship).

This sample shows how to structure a software product that consists of multiple components as a set of connected Gradle builds.
As such, it shows how Gradle is used to model a project's architecture and reflect that in the physical structure of the files that make up the software.
This example is described as part of the [documentation on this topic](https://docs.gradle.org/7.0/userguide/structuring_software_products.html).

The product that is built in this sample is an application that displays link: [Gradle Build Tool releases](https://gradle.org/releases/).

There are different ways to work with the sample:

- You may build or import the umbrella build in the root.
  There you can, for example, run the Spring Boot web application via `./gradlew :services:app:bootRun` or build events domain using `./gradlew :domain:events:build`.
- You may only build or import one of the application builds directly.
  For example, `cd services` and run the app using  `../gradlew :app:bootRun`.
- You may only build or import a selected component (and its dependencies).
  For example, only import the `features/cat` in the IDE.

## Recommended Project Structure

```yml
- aggragegation
- build-logic
  - avro-liblary
  - commons(jacoco, sonarqube)
  - java-liblary
  - report-aggreagation
  - spring-boot-app
  - lambda-app
- domain
    - entity
    - dto
    - avro-event(generated)
    - event
    - mapper(depend on: entity, dto, event)
- platforms
  - plugin-platform
  - product-platform
  - test-platform
- features
  - [name]-feature-api(optional)
  - [name]-feature
- services
  - [name]-service
- lambdas
  - [name]-lambda
- commons(common modules, e.g. xray-common)
  - [name]-common
- tools(tools for project, e.g. arch-test-tool)
  - [name]-tool
- infrastucture(run apps)
  - local
  - aws
```

## Commands

### Run app
`./gradlew :services:app:run`

### Build app
`./gradlew :services:app:build`

### Test app
`./gradlew :features:cat:test --continuous`

### Clean all
`gradle clean`
