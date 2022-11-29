\echo 'Delete and recreate listmaker db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE listmaker;
CREATE DATABASE listmaker;
\connect listmaker

\i listmaker-schema.sql

\echo 'Delete and recreate listmaker_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE listmaker_test;
CREATE DATABASE listmaker_test;
\connect listmaker_test

\i listmaker-schema.sql
