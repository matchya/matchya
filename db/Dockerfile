FROM liquibase/liquibase

COPY ./changelog /liquibase/changelog
COPY ./config/liquibase.properties /liquibase/config/liquibase.properties
COPY *.xml /liquibase/

WORKDIR /liquibase

CMD ["placeholder"]
