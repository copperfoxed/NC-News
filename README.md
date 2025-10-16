# NC News Seeding

# create databases
- run "npm run setup-dbs"

# Setup environment variables
- Create two .env files called .env.test and .env.development and link them to their databases with PGDATABASE=database

# Verify Setup
run both:
- npm run test-seed
- npm run seed-dev
