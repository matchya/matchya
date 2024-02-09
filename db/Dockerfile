FROM liquibase/liquibase

COPY ./changelog /liquibase/changelog
COPY ./sql /liquibase/sql
COPY ./config/liquibase.properties /liquibase/config/liquibase.properties
COPY *.xml /liquibase/

WORKDIR /liquibase

CMD ["placeholder"]
